from fastapi import Request
from fastapi.responses import JSONResponse
from app.logs.logger import logger

class InferenceError(Exception):
    def __init__(self, code: str, detail: str):
        self.code = code
        self.detail = detail

async def inference_exception_handler(request: Request, exc: InferenceError):
    logger.error(f"Inference Error [{exc.code}]: {exc.detail}")
    return JSONResponse(
        status_code=400,
        content={"message": "AI Processing Failed", "code": exc.code, "detail": exc.detail},
    )

async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled Exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "code": "INTERNAL_ERROR", "detail": str(exc)},
    )
