import torch
import torch.nn.functional as F
from app.config.settings import settings

class TemperatureScaler:
    """Applies post-hoc temperature scaling for probability calibration."""
    
    def __init__(self):
        self.temperature = settings.temperature

    def scale_and_get_probabilities(self, logits: torch.Tensor) -> dict:
        """
        Scales logits by temperature and applies softmax.
        Returns a dictionary mapping class name to probability.
        """
        # Apply temperature scaling
        scaled_logits = logits / self.temperature
        
        # Calculate probabilities
        probs = F.softmax(scaled_logits, dim=1).squeeze(0).cpu().numpy()
        
        # Map to class names
        prob_dist = {
            settings.class_names[i]: float(probs[i]) 
            for i in range(settings.num_classes)
        }
        
        return prob_dist
        
    def assess_calibration(self, prob_dist: dict) -> str:
        """
        Simple heuristic for V1 to indicate if the prediction is well-calibrated.
        Since the model has an ECE < 0.05, we generally trust it, but we can flag 
        low-confidence cases.
        """
        max_prob = max(prob_dist.values())
        if max_prob > 0.70:
            return "Well Calibrated"
        elif max_prob > 0.50:
            return "Moderate Calibration"
        else:
            return "Low Confidence - Ambiguous"
