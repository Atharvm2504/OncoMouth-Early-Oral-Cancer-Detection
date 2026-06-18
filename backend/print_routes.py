from app.main import app

for route in app.routes:
    print(getattr(route, 'methods', None), getattr(route, 'path', None), type(route))
