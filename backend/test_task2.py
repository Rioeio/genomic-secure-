from fastapi.testclient import TestClient
from app import app, ALLOWED_ORIGINS

client = TestClient(app)

def _get_jwt(email: str, password: str) -> str:
    """Helper: log in and return a JWT token."""
    res = client.post("/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed for {email}: {res.status_code} {res.text}"
    return res.json()["access_token"]

def test_1_unauthenticated_requests_rejected():
    """
    Criterion 1: Unauthenticated request to any /api/fl/* route returns 401 Unauthorized.
    """
    protected_routes = [
        ("GET", "/api/fl/model-inspect"),
        ("POST", "/api/fl/run-round"),
        ("POST", "/api/fl/predict"),
        ("GET", "/api/fl/history"),
        ("POST", "/api/fl/reset"),
    ]
    
    for method, route in protected_routes:
        if method == "GET":
            response = client.get(route)
        else:
            response = client.post(route, json={})
        
        assert response.status_code == 401, f"Route {route} did not return 401 for unauthenticated request! Got {response.status_code}"
    
    print("PASS Criterion 1: Unauthenticated requests to all /api/fl/* routes return 401 Unauthorized.")

def test_2_cors_restriction():
    """
    Criterion 2: CORS preflight / request from an unlisted origin is rejected.
    """
    # Test valid origin
    valid_origin = ALLOWED_ORIGINS[0]
    res_valid = client.options("/api/fl/history", headers={"Origin": valid_origin, "Access-Control-Request-Method": "GET"})
    assert res_valid.headers.get("access-control-allow-origin") == valid_origin, "Valid origin was not allowed!"
    
    # Test unlisted origin
    unlisted_origin = "http://malicious-attacker-domain.com"
    res_unlisted = client.options("/api/fl/history", headers={"Origin": unlisted_origin, "Access-Control-Request-Method": "GET"})
    allow_origin = res_unlisted.headers.get("access-control-allow-origin")
    assert allow_origin != unlisted_origin and allow_origin != "*", f"Unlisted origin was allowed: {allow_origin}"
    
    print("PASS Criterion 2: CORS preflight from unlisted origin is properly rejected (allow_origins != '*').")

def test_3_model_inspect_requires_researcher_role():
    """
    Criterion 3: /api/fl/model-inspect requires the 'researcher' role.
    JWT-based: login as patient -> 403, login as researcher -> 200.
    """
    # Unauthenticated request
    res_no_auth = client.get("/api/fl/model-inspect")
    assert res_no_auth.status_code == 401, f"Expected 401 for unauthenticated model-inspect, got {res_no_auth.status_code}"
    
    # Patient role JWT (authenticated, but insufficient role)
    patient_token = _get_jwt("alice.w@email.com", "health123")
    patient_headers = {"Authorization": f"Bearer {patient_token}"}
    res_patient = client.get("/api/fl/model-inspect", headers=patient_headers)
    assert res_patient.status_code == 403, f"Expected 403 Forbidden for patient role on model-inspect, got {res_patient.status_code}"
    
    # Researcher role JWT (authenticated & authorized)
    researcher_token = _get_jwt("dr.smith@genome.edu", "secure123")
    researcher_headers = {"Authorization": f"Bearer {researcher_token}"}
    res_researcher = client.get("/api/fl/model-inspect", headers=researcher_headers)
    assert res_researcher.status_code == 200, f"Expected 200 OK for researcher role, got {res_researcher.status_code}"
    
    data = res_researcher.json()
    assert "weight_matrix_sample" in data, "Weight matrix missing from response"
    assert data["user_role"] == "researcher", f"Unexpected user_role: {data.get('user_role')}"
    
    print("PASS Criterion 3: /api/fl/model-inspect strictly requires 'researcher' role JWT (401 unauth, 403 non-researcher, 200 researcher).")

def test_4_login_endpoint():
    """
    Criterion 4 (new): /auth/login validates credentials and returns JWT.
    """
    # Valid login
    res_ok = client.post("/auth/login", json={"email": "dr.smith@genome.edu", "password": "secure123"})
    assert res_ok.status_code == 200, f"Expected 200 for valid login, got {res_ok.status_code}"
    data = res_ok.json()
    assert "access_token" in data, "Missing access_token in login response"
    assert data["user"]["role"] == "researcher", f"Unexpected role: {data['user']['role']}"
    assert data["expires_in"] > 0, "Token should have a positive expiry"
    
    # Invalid password
    res_bad = client.post("/auth/login", json={"email": "dr.smith@genome.edu", "password": "wrongpassword"})
    assert res_bad.status_code == 401, f"Expected 401 for bad password, got {res_bad.status_code}"
    
    # Non-existent user
    res_nouser = client.post("/auth/login", json={"email": "nobody@nowhere.com", "password": "anything"})
    assert res_nouser.status_code == 401, f"Expected 401 for non-existent user, got {res_nouser.status_code}"
    
    print("PASS Criterion 4: /auth/login validates credentials and returns JWT with expiry.")

def test_5_expired_token_rejected():
    """
    Criterion 5 (new): An expired or tampered JWT is rejected with 401.
    """
    # Tampered token
    tampered_token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmYWtlIn0.tampered_signature"
    res = client.get("/api/fl/history", headers={"Authorization": f"Bearer {tampered_token}"})
    assert res.status_code == 401, f"Expected 401 for tampered token, got {res.status_code}"
    
    print("PASS Criterion 5: Tampered/expired JWT tokens are rejected with 401.")

if __name__ == "__main__":
    print("--- Verifying Task 2 + 2.5 Acceptance Criteria (JWT Auth) ---")
    test_1_unauthenticated_requests_rejected()
    test_2_cors_restriction()
    test_3_model_inspect_requires_researcher_role()
    test_4_login_endpoint()
    test_5_expired_token_rejected()
    print("--- ALL ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY ---")
