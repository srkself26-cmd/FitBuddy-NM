import os

os.environ["DATABASE_URL"] = "sqlite:///./test_fitbuddy.db"
os.environ["ADMIN_PASSWORD"] = "test-password"

from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app

init_db()
client = TestClient(app)


def test_home_page():
    response = client.get("/")
    assert response.status_code == 200
    assert "FitBuddy" in response.text


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_admin_requires_password():
    response = client.get("/view-all-users")
    assert response.status_code == 401


def test_admin_with_password():
    response = client.get("/view-all-users?admin_password=test-password")
    assert response.status_code == 200
    assert "User and Plan Dashboard" in response.text
