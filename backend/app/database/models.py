from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database.session import Base

class PredictionLog(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_class = Column(String, index=True)
    confidence = Column(Float)
    probability_distribution = Column(JSON)
    calibration_status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Note: Images are not stored in SQLite directly for V1, 
    # but we could store a path if saved to disk.
