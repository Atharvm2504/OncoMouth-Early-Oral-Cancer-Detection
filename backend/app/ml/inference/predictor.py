import torch
import torch.nn.functional as F
from app.config.settings import settings
from app.ml.model_manager import ModelManager

class Predictor:
    def __init__(self):
        self.manager = ModelManager()
        self.device = self.manager.device
        self.model = self.manager.get_model()

    def predict(self, input_tensor: torch.Tensor):
        input_tensor = input_tensor.to(self.device)
        with torch.no_grad():
            logits, features = self.model(input_tensor)
            
        return logits, features
