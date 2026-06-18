import torch
import os
import time
from app.config.settings import settings
from app.logs.logger import logger
from app.ml.models.efficientnet import OralCancerModel

class ModelManager:
    """Singleton responsible for loading and managing the PyTorch model."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self.device = torch.device(settings.device if torch.cuda.is_available() else "cpu")
        logger.info(f"ModelManager: Initializing on device {self.device}")
        
        self.model = OralCancerModel(num_classes=settings.num_classes, pretrained=False)
        self._load_weights()
        self.model.to(self.device)
        self.model.eval()
        
        self.metadata = settings.metadata
        self.is_loaded = True
        
        # Warmup
        self._warmup()

    def _load_weights(self):
        weights_path = settings.model_weights_path
        if not os.path.exists(weights_path):
            logger.error(f"Model weights not found at {weights_path}")
            raise FileNotFoundError(f"Missing model weights: {weights_path}. System cannot start.")
            
        logger.info(f"Loading weights from {weights_path}")
        try:
            start_time = time.time()
            checkpoint = torch.load(weights_path, map_location=self.device)
            
            # 1. Detect checkpoint format
            state_dict = None
            version = "Unknown"
            if isinstance(checkpoint, dict):
                if "state_dict" in checkpoint:
                    state_dict = checkpoint["state_dict"]
                elif "model_state_dict" in checkpoint:
                    state_dict = checkpoint["model_state_dict"]
                else:
                    # Raw state_dict or wrapped in OrderedDict
                    state_dict = checkpoint
            else:
                state_dict = checkpoint
                
            # 2. Normalize Keys (Remove 'model.' or 'module.' prefixes)
            normalized_state_dict = {}
            for key, value in state_dict.items():
                if key == "temperature": # Ignore top-level temperature if present in raw dict
                    continue
                new_key = key
                if new_key.startswith("model."):
                    new_key = new_key[6:]
                if new_key.startswith("module."):
                    new_key = new_key[7:]
                normalized_state_dict[new_key] = value

            # 3. Load
            self.model.load_state_dict(normalized_state_dict)
            
            total_params = sum(p.numel() for p in self.model.parameters())
            loading_time = time.time() - start_time
            
            logger.info("[OK] Model loaded successfully")
            logger.info(f"[OK] Checkpoint version: {settings.metadata.version}")
            logger.info(f"[OK] Number of parameters loaded: {total_params:,}")
            logger.info(f"[OK] Device: {str(self.device).upper()}")
            logger.info(f"[OK] Loading time: {loading_time:.2f}s")
            
        except Exception as e:
            logger.error(f"Failed to load weights: {e}")
            raise RuntimeError(f"Failed to initialize model: {e}")

    def _warmup(self):
        """Run a dummy tensor to warm up the model."""
        if not self.is_loaded:
            return
        logger.info("Running model warmup...")
        start_time = time.time()
        dummy_input = torch.randn(1, 3, settings.img_size, settings.img_size).to(self.device)
        with torch.no_grad():
            _ = self.model(dummy_input)
        logger.info(f"Warmup completed in {time.time() - start_time:.2f}s")

    def get_model(self):
        return self.model
