import os
import yaml
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import BaseModel
from typing import List, Dict, Any

CONFIG_PATH = Path(__file__).parent / "config.yaml"
METADATA_PATH = Path(__file__).parent / "metadata.yaml"

class ModelMetadata(BaseModel):
    version: str
    dataset: str
    training_date: str
    input_size: int
    accuracy: float
    macro_f1: float
    ece: float
    temperature: float
    git_commit: str

class Settings(BaseSettings):
    app_name: str
    version: str
    api_v1_str: str
    debug: bool

    model_name: str
    model_weights_path: str
    num_classes: int
    class_names: List[str]
    device: str

    img_size: int
    target_stains: List[List[float]]
    target_concentrations: List[List[float]]
    imagenet_mean: List[float]
    imagenet_std: List[float]

    temperature: float
    confidence_threshold: float
    enable_gradcam: bool

    database_url: str
    cors_origins: str = '["http://localhost:3000"]'
    
    metadata: ModelMetadata

    @classmethod
    def load_from_yaml(cls, path: Path = CONFIG_PATH, meta_path: Path = METADATA_PATH) -> "Settings":
        with open(path, "r") as f:
            yaml_data = yaml.safe_load(f)
            
        with open(meta_path, "r") as f:
            meta_yaml = yaml.safe_load(f)
            
        metadata = ModelMetadata(
            version=meta_yaml["version"],
            dataset=meta_yaml["dataset"],
            training_date=meta_yaml["training_date"],
            input_size=meta_yaml["input_size"],
            accuracy=meta_yaml["performance"]["accuracy"],
            macro_f1=meta_yaml["performance"]["macro_f1"],
            ece=meta_yaml["performance"]["ece"],
            temperature=meta_yaml["temperature"],
            git_commit=meta_yaml["git_commit"]
        )
            
        return cls(
            app_name=yaml_data["app"]["name"],
            version=yaml_data["app"]["version"],
            api_v1_str=yaml_data["app"]["api_v1_str"],
            debug=yaml_data["app"]["debug"],
            
            model_name=yaml_data["model"]["name"],
            model_weights_path=os.getenv(
                "MODEL_WEIGHTS_PATH", 
                yaml_data["model"].get("weights_path") or "../Project Details/Models_NDB_UFES/calibrated_model.pth"
            ),
            num_classes=yaml_data["model"]["num_classes"],
            class_names=yaml_data["model"]["class_names"],
            device=os.getenv("DEVICE", yaml_data["model"]["device"]),
            
            img_size=yaml_data["preprocessing"]["img_size"],
            target_stains=yaml_data["preprocessing"]["target_stains"],
            target_concentrations=yaml_data["preprocessing"]["target_concentrations"],
            imagenet_mean=yaml_data["preprocessing"]["imagenet_mean"],
            imagenet_std=yaml_data["preprocessing"]["imagenet_std"],
            
            temperature=yaml_data["inference"]["temperature"],
            confidence_threshold=yaml_data["inference"]["confidence_threshold"],
            enable_gradcam=yaml_data["inference"]["enable_gradcam"],
            
            database_url=yaml_data["database"]["url"],
            
            metadata=metadata
        )

# Global settings instance
settings = Settings.load_from_yaml()
