from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    # Depending on if we have a root endpoint, we test specific routes
    # We don't have a root "/", but we have "/api/auth" etc.
    # Let's assume dashboard or docs endpoint.
    # Actually, main.py doesn't have a root decorator?
    # Let's test non-auth endpoint or 404
    response = client.get("/api/dashboard")
    assert response.status_code in [401, 200]

def test_create_user(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "testuser@example.com",
            "password": "password123",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id" in data

def test_login_user(client: TestClient):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "email": "login@example.com",
            "password": "password123",
            "full_name": "Login User"
        }
    )
    # Login
    response = client.post(
        "/api/auth/login",
        data={
            "username": "login@example.com",
            "password": "password123",
            "grant_type": "password"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
