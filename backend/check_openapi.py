import requests

try:
    response = requests.get("http://localhost:8000/openapi.json")
    openapi = response.json()
    paths = openapi.get("paths", {})
    print("Found Paths:")
    for path in paths:
        print(path)
except Exception as e:
    print("Error:", e)
