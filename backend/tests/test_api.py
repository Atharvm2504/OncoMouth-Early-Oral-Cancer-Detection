import pytest
from fastapi.testclient import TestClient
from app.main import create_app
import io

app = create_app()
client = TestClient(app)

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "model_loaded" in data

def test_predict_invalid_file_type():
    # Attempt to upload a text file instead of an image
    file_content = b"This is not an image."
    response = client.post(
        "/api/v1/predict/",
        files={"file": ("test.txt", io.BytesIO(file_content), "text/plain")}
    )
    assert response.status_code == 400
    assert response.json()["code"] == "INVALID_IMAGE"

def test_predict_invalid_magic_number():
    # Attempt to upload a fake image (wrong MIME magic number)
    file_content = b"Fake image content"
    response = client.post(
        "/api/v1/predict/",
        files={"file": ("fake.jpg", io.BytesIO(file_content), "image/jpeg")}
    )
    assert response.status_code == 400
    assert "INVALID_IMAGE" in response.json()["code"]
