from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import Response
from app.schemas.predict import PredictionResponse
from app.ml.pipeline import InferencePipeline
from app.exceptions.handlers import InferenceError
from app.logs.logger import logger
from app.services.pdf_generator import generate_pdf_report
import magic

router = APIRouter()

# Initialize ML Pipeline globally so it stays in memory
# In a true prod environment, this might be injected via Depends, 
# but loading EfficientNet once on startup is better for memory.
try:
    ml_pipeline = InferencePipeline()
except Exception as e:
    logger.error(f"Failed to load ML pipeline: {e}")
    ml_pipeline = None

@router.post("/", response_model=PredictionResponse, summary="Run AI Prediction")
async def predict_image(file: UploadFile = File(...)):
    """
    Accepts a histopathology image patch, runs Macenko normalization, 
    EfficientNet-B3 inference, Temperature Scaling, and GradCAM++ generation.
    """
    if ml_pipeline is None:
        raise HTTPException(status_code=503, detail="AI Service is currently unavailable.")
        
    if not file.content_type.startswith("image/"):
        raise InferenceError("INVALID_IMAGE", "Invalid file type. Please upload an image.")
        
    try:
        contents = await file.read()
        if not contents:
            raise InferenceError("INVALID_IMAGE", "Empty file uploaded.")
            
        if len(contents) > 10 * 1024 * 1024: # 10MB limit
            raise InferenceError("INVALID_IMAGE", "File size exceeds 10MB limit.")
            
        # Strict Magic Number validation
        mime = magic.from_buffer(contents, mime=True)
        if mime not in ["image/jpeg", "image/png"]:
            raise InferenceError("INVALID_IMAGE", f"Invalid file signature detected: {mime}. Only JPEG and PNG are allowed.")
            
        logger.info(f"Received prediction request for {file.filename} ({len(contents)} bytes, {mime})")
        
        # In a high-traffic setting, we'd run this in a ThreadPoolExecutor 
        # to avoid blocking the event loop.
        import asyncio
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, ml_pipeline.run, contents)
        
        return PredictionResponse(**result)
        
    except ValueError as e:
        raise InferenceError(str(e))
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="An error occurred during AI processing.")

@router.post("/report", tags=["Prediction"])
async def create_report(prediction_data: PredictionResponse):
    """
    Generate a PDF report from a prediction result.
    """
    try:
        pdf_bytes = generate_pdf_report(prediction_data.model_dump())
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=oncomouth_report_{prediction_data.request_id}.pdf"}
        )
    except Exception as e:
        logger.error(f"Report generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate report.")
