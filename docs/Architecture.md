# OncoMouth Architecture

## System Diagram
```mermaid
graph TD
    Client[Next.js 14 Client] -->|POST /api/v1/predict| FastAPI[FastAPI Backend]
    
    subgraph FastAPI Backend
        Router[predict.py Router] --> Orchestrator[pipeline.py Orchestrator]
        Orchestrator --> Macenko[Macenko Normalization]
        Orchestrator --> Predictor[EfficientNet-B3 Predictor]
        Orchestrator --> Calibrator[Temperature Scaling]
        Orchestrator --> Explainer[GradCAM++ Generator]
        Orchestrator --> PDF[Report Generator]
    end
    
    subgraph PyTorch Engine
        Predictor --> Model[(EfficientNet Weights)]
    end
    
    FastAPI -->|JSON Response| Client
```

## Folder Structure
- `backend/app`: Contains the strict Domain-Driven Design layout (`api`, `config`, `ml`, `services`).
- `backend/app/ml`: Separates models, preprocessing, calibration, and explainability.
- `frontend/src`: Next.js App Router, grouped by `features`, `hooks`, and `services`.
