import requests

# Assuming backend is running on localhost:8000
url = "http://localhost:8000/api/reviews/import"
file_path = "test_reviews.csv"

# Need authentication? 
# The endpoint depends on get_current_user... so yes.
# We need to login first.

login_url = "http://localhost:8000/api/auth/login"
# Use default credentials if you know them? Or create a user?
# I'll assume I can use a test user. Or just register one.

def reproduce():
    # 1. Register/Login
    session = requests.Session()
    email = "test_import@example.com"
    password = "password123"
    
    # Try register
    requests.post("http://localhost:8000/api/auth/register", json={"email": email, "password": password})
    
    # Login
    resp = session.post(login_url, data={"username": email, "password": password, "grant_type": "password"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return

    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Upload File
    with open(file_path, "rb") as f:
        files = {"file": ("test_reviews.csv", f, "text/csv")}
        resp = requests.post(url, headers=headers, files=files)
        
    print(f"Status Code: {resp.status_code}")
    print(f"Response Body: {resp.text}")

if __name__ == "__main__":
    reproduce()
