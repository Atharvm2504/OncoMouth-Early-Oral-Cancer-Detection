from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.v1.router import api_router
from app.exceptions.handlers import InferenceError, inference_exception_handler, generic_exception_handler
from app.logs.logger import logger
from app.ml.model_manager import ModelManager

def create_app() -> FastAPI:
    logger.info(f"Starting {settings.app_name} v{settings.version}")
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        debug=settings.debug
    )

    import json
    try:
        origins = json.loads(settings.cors_origins)
    except Exception:
        origins = ["http://localhost:3000"]

    # CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception Handlers
    app.add_exception_handler(InferenceError, inference_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)

    # Routers
    app.include_router(api_router, prefix=settings.api_v1_str)

    @app.get("/api/v1/health", tags=["System"])
    def health_check():
        manager = ModelManager()
        return {
            "status": "healthy", 
            "model_loaded": manager.is_loaded,
            "gpu_available": str(manager.device) != "cpu",
            "model_version": settings.metadata.version if manager.is_loaded else None,
            "database_status": "connected" # Stub for V1
        }

    return app
app = create_app()
