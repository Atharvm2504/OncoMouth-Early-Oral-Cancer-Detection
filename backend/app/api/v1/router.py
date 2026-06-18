from fastapi import APIRouter
from app.api.v1 import predict

api_router = APIRouter()
api_router.include_router(predict.router, prefix="/predict", tags=["AI Prediction"])
# We can add /analytics and /report here later
