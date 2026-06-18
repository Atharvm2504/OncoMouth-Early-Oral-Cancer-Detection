import axios from "axios";
import { PredictionResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post<PredictionResponse>("/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) throw new Error("Invalid image format.");
      if (status === 404) throw new Error("Prediction endpoint unavailable.");
      if (status === 422) throw new Error("Uploaded file is invalid.");
      if (status === 500) throw new Error("AI inference failed.");
      if (status === 503) throw new Error("Model unavailable.");
    }
    throw new Error("Unable to reach AI backend.");
  }
};

export const generateReport = async (prediction: PredictionResponse): Promise<Blob> => {
  const response = await apiClient.post("/predict/report", prediction, {
    responseType: "blob",
  });
  return response.data;
};
