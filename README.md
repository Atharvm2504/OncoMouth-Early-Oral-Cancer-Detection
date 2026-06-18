# OncoMouth: AI-Powered Oral Cancer Detection

OncoMouth is a production-grade AI platform for the detection and classification of Oral Squamous Cell Carcinoma (OSCC) and dysplasia from histopathology patches (H&E). It is designed with a strict focus on **clinical trustworthiness, domain-aware explainability, and calibrated uncertainty**.

## Architecture Overview

The system is designed with a modern, decoupled architecture:
*   **Backend (FastAPI & PyTorch):** Manages inference, preprocessing, and temperature scaling.
*   **Frontend (Next.js 14):** Provides a premium, interactive "Prediction Session" experience.
*   **ML Pipeline:** `Runtime Macenko Normalization -> EfficientNet-B3 Inference -> Temperature Scaling Calibration -> GradCAM++ Generation`

## Why OncoMouth Exists: Solving the Domain Shortcut Problem
Most medical AI models trained on multi-source datasets inadvertently learn "domain shortcuts" (e.g., scanner color profiles, slide background artifacts) rather than true cellular biology. This leads to artificial 100% accuracy during validation but catastrophic failure in real clinics.

**Our Solution:** 
OncoMouth was trained strictly on a single-source dataset (NDB-UFES) with rigorous offline Macenko normalization. By combining this with Class-Balanced Focal Loss, the model is forced to learn true morphological dysplasia rather than taking domain shortcuts.

## Features
*   **Calibrated Confidence:** Expected Calibration Error (ECE) of `0.0346` using Temperature Scaling.
*   **Signature Explainability:** Interactive GradCAM++ viewer (Overlay, Split, Tabbed).
*   **Clinical Guardrails:** Strict file validation (MIME, headers, resolution) and automated PDF reports.

## Installation & Setup (Docker)

The fastest way to spin up the entire OncoMouth stack is via Docker.

```bash
# Clone the repository
git clone https://github.com/your-org/oncomouth.git
cd oncomouth

# Ensure you have your model weights downloaded
# Place efficientnet_b3.pth inside backend/app/ml/models/weights/

# Start the stack
docker compose up --build
```

The application will be available at:
*   Frontend: `http://localhost:3000`
*   Backend API: `http://localhost:8000/api/v1`
*   Swagger Docs: `http://localhost:8000/docs`

## Local Development (Without Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Configure your environment
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
See `backend/.env` and `frontend/.env.local` for the default required variables.

## Future Roadmap
*   **v2.0:** Multi-patch Whole Slide Image (WSI) inference integration.
*   **v3.0:** Federated Learning capabilities for multi-institution fine-tuning.
*   **v4.0:** FDA/CE Mark regulatory compliance pipeline.
