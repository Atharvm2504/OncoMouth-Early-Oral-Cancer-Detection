export interface PredictionResponse {
  request_id: string;
  timestamp: string;
  model_version: string;
  inference_time_ms: number;
  prediction: "Cancer" | "PreCancer" | "Normal";
  confidence: number;
  probability_distribution: {
    Cancer: number;
    PreCancer: number;
    Normal: number;
  };
  calibration_status: string;
  interpretation: string;
  images: {
    original: string;
    normalized: string;
    gradcam: string | null;
  };
  disclaimer: string;
}
