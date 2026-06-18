from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ImageSet(BaseModel):
    original: str = Field(..., description="Base64 encoded original image")
    normalized: str = Field(..., description="Base64 encoded Macenko normalized image")
    gradcam: Optional[str] = Field(None, description="Base64 encoded GradCAM overlay")

class PredictionResponse(BaseModel):
    request_id: str = Field(..., description="Unique request identifier")
    timestamp: str = Field(..., description="ISO 8601 timestamp")
    model_version: str = Field(..., description="Model version from metadata")
    inference_time_ms: float = Field(..., description="Inference time in milliseconds")
    
    prediction: str = Field(..., description="AI predicted class")
    confidence: float = Field(..., description="Confidence score of the prediction (0-1)")
    probability_distribution: Dict[str, float] = Field(..., description="Probabilities for all classes")
    calibration_status: str = Field(..., description="Reliability of the confidence score")
    interpretation: str = Field(..., description="Textual AI interpretation")
    images: ImageSet
    
    # Required Clinical Disclaimer
    disclaimer: str = Field(
        "This AI prediction is intended to assist qualified healthcare professionals "
        "and is not a replacement for clinical judgment or formal histopathological diagnosis.",
        description="Clinical use disclaimer"
    )
