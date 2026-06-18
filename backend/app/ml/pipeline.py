import cv2
import numpy as np
import base64
import time
import uuid
from datetime import datetime, timezone
from app.logs.logger import logger
from app.exceptions.handlers import InferenceError
from app.ml.model_manager import ModelManager
from app.ml.preprocessing.macenko import MacenkoNormalizer
from app.ml.preprocessing.transforms import ImageTransforms
from app.ml.inference.predictor import Predictor
from app.ml.calibration.temperature import TemperatureScaler
from app.ml.explainability.gradcam import GradCAMGenerator
from app.config.settings import settings

class InferencePipeline:
    def __init__(self):
        logger.info("Initializing ML Pipeline Orchestrator...")
        self.manager = ModelManager()
        if not self.manager.is_loaded:
             raise InferenceError("MODEL_NOT_LOADED", "AI Model failed to load at startup.")
             
        self.macenko = MacenkoNormalizer()
        self.transforms = ImageTransforms()
        self.predictor = Predictor()
        self.scaler = TemperatureScaler()
        self.gradcam = GradCAMGenerator(self.manager.get_model())
        logger.info("ML Pipeline Orchestrator Initialized.")

    def _encode_image(self, img_array: np.ndarray) -> str:
        """Helper to encode image to base64 for API response."""
        _, buffer = cv2.imencode('.jpg', cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR))
        return base64.b64encode(buffer).decode('utf-8')
        
    def _validate_image(self, img_bgr: np.ndarray):
        """Perform security and quality checks on the image."""
        if img_bgr is None:
            raise InferenceError("INVALID_IMAGE", "Image decoding failed or file is corrupted.")
            
        h, w = img_bgr.shape[:2]
        if h < 50 or w < 50:
            raise InferenceError("INVALID_IMAGE", f"Image resolution ({w}x{h}) is too small. Minimum is 50x50.")
            
        if len(img_bgr.shape) != 3 or img_bgr.shape[2] != 3:
            raise InferenceError("INVALID_IMAGE", "Image must be in RGB format.")

    def run(self, image_bytes: bytes) -> dict:
        """
        Executes the full inference pipeline.
        """
        request_id = str(uuid.uuid4())
        start_time = time.time()
        logger.info(f"[{request_id}] Starting inference pipeline.")
        
        # 1. Decode & Validate Image
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img_bgr = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        self._validate_image(img_bgr)
        
        img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
        
        # 2. Runtime Macenko Normalization
        try:
            normalized_rgb = self.macenko.normalize(img_rgb)
        except Exception as e:
            logger.error(f"[{request_id}] Macenko failed: {e}")
            raise InferenceError("MACENKO_FAILED", "Failed to normalize tissue staining.")
        
        # 3. Preprocessing (Resize & Tensor Conversion)
        try:
            input_tensor = self.transforms.preprocess(normalized_rgb)
        except Exception as e:
            logger.error(f"[{request_id}] Preprocessing failed: {e}")
            raise InferenceError("PREPROCESSING_FAILED", "Failed to preprocess image for model.")
        
        # 4. Model Inference
        try:
            logits, _ = self.predictor.predict(input_tensor)
        except Exception as e:
            logger.error(f"[{request_id}] Inference failed: {e}")
            raise InferenceError("INFERENCE_FAILED", "AI model evaluation failed.")
        
        # 5. Temperature Scaling & Probabilities
        prob_dist = self.scaler.scale_and_get_probabilities(logits)
        
        # 6. Prediction
        predicted_class = max(prob_dist, key=prob_dist.get)
        primary_confidence = prob_dist[predicted_class]
        
        # 7. Calibration Status
        calibration_status = self.scaler.assess_calibration(prob_dist)
        
        # 8. GradCAM++
        gradcam_img_b64 = None
        if settings.enable_gradcam:
            try:
                # Use the ORIGINAL image (img_rgb) for the overlay, NOT the normalized image.
                resized_orig = cv2.resize(img_rgb, (settings.img_size, settings.img_size))
                float_orig = np.float32(resized_orig) / 255.0
                target_idx = settings.class_names.index(predicted_class)
                
                from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
                        
                gradcam_overlay = self.gradcam.generate(input_tensor, float_orig, targets=[ClassifierOutputTarget(target_idx)])
                if gradcam_overlay is not None:
                    gradcam_img_b64 = self._encode_image(gradcam_overlay)
                    logger.info(f"[{request_id}] GradCAM encoding successful. Base64 length: {len(gradcam_img_b64)}")
                else:
                    logger.warning(f"[{request_id}] GradCAM generated None overlay.")
            except Exception as e:
                logger.error(f"[{request_id}] GradCAM pipeline failed: {e}")
                gradcam_img_b64 = None

        # 9. Format AI Interpretation
        interpretation = (
            f"AI Prediction indicates {predicted_class} with {primary_confidence:.1%} confidence."
        )
        
        inference_time_ms = (time.time() - start_time) * 1000
        logger.info(f"[{request_id}] Complete: {predicted_class} ({primary_confidence:.1%}) in {inference_time_ms:.1f}ms")

        return {
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "model_version": settings.metadata.version,
            "inference_time_ms": round(inference_time_ms, 2),
            "prediction": predicted_class,
            "confidence": primary_confidence,
            "probability_distribution": prob_dist,
            "calibration_status": calibration_status,
            "interpretation": interpretation,
            "images": {
                "original": self._encode_image(img_rgb),
                "normalized": self._encode_image(normalized_rgb),
                "gradcam": gradcam_img_b64
            }
        }
