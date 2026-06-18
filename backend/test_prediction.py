import requests
import cv2
import numpy as np
import io

# Create a dummy image
img = np.zeros((224, 224, 3), dtype=np.uint8)
img[:] = (200, 100, 150) # Light purple (H&E-like)

is_success, buffer = cv2.imencode(".png", img)
io_buf = io.BytesIO(buffer)

print("Sending prediction request...")
response = requests.post(
    "http://localhost:8080/api/v1/predict/",
    files={"file": ("test_patch.png", io_buf, "image/png")}
)

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print("Prediction:", data["prediction"])
    print("Confidence:", data["confidence"])
    print("Keys:", data.keys())
    if "calibration_status" in data:
        print("Calibration Status:", data["calibration_status"])
    else:
        print("Full data:", data)
    print("Error:", response.text)
