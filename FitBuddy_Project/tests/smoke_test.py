from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_home_loads():
    response = client.get('/')
    assert response.status_code == 200
    assert 'FitBuddy' in response.text

def test_docs_loads():
    response = client.get('/docs')
    assert response.status_code == 200
