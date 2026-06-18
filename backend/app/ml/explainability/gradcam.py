import cv2
import numpy as np
import torch
import time
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.image import show_cam_on_image
from app.logs.logger import logger

class GradCAMModelWrapper(torch.nn.Module):
    """
    Wraps the OralCancerModel which returns (logits, features).
    GradCAM expects the forward pass to return only a single logits tensor.
    """
    def __init__(self, model):
        super().__init__()
        self.model = model
        
    def forward(self, x):
        logits, _ = self.model(x)
        return logits

class GradCAMGenerator:
    def __init__(self, model):
        self.model = model
        self.wrapper = GradCAMModelWrapper(model)
        # Target the last convolutional layer of EfficientNet-B3
        try:
            self.target_layers = [self.model.backbone.conv_head]
            logger.info(f"GradCAM initialized with target layer: {self.target_layers[0].__class__.__name__}")
            self.cam = GradCAMPlusPlus(model=self.wrapper, target_layers=self.target_layers)
        except Exception as e:
            logger.error(f"Failed to initialize GradCAM++: {e}")
            self.cam = None

    def generate(self, input_tensor: torch.Tensor, original_rgb: np.ndarray, targets: list = None) -> np.ndarray:
        """
        Generates a GradCAM++ overlay.
        original_rgb should be the float32 representation in range [0, 1].
        """
        if self.cam is None:
            logger.warning("GradCAM generator is not initialized.")
            return None
            
        try:
            start_time = time.time()
            logger.info(f"Generating GradCAM. Input tensor shape: {input_tensor.shape}")
            
            # GradCAM generates a heatmap (1, H, W)
            grayscale_cam = self.cam(input_tensor=input_tensor, targets=targets)
            grayscale_cam = grayscale_cam[0, :]
            
            # Resize the original_rgb to match the tensor size if needed (224x224)
            h, w = grayscale_cam.shape
            if original_rgb.shape[:2] != (h, w):
                original_rgb = cv2.resize(original_rgb, (w, h))
                
            # Blend heatmap and original image
            visualization = show_cam_on_image(original_rgb, grayscale_cam, use_rgb=True)
            
            gen_time = (time.time() - start_time) * 1000
            logger.info(f"GradCAM generated successfully in {gen_time:.1f}ms. Heatmap size: {h}x{w}. Overlay size: {visualization.shape}")
            
            return visualization
        except Exception as e:
            logger.error(f"GradCAM generation failed: {e}")
            return None
