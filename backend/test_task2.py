from fastapi.testclient import TestClient
from app import app, ALLOWED_ORIGINS

client = TestClient(app)

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
    
    print("✅ Criterion 1 PASSED: Unauthenticated requests to all /api/fl/* routes return 401 Unauthorized.")

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
    
    print("✅ Criterion 2 PASSED: CORS preflight from unlisted origin is properly rejected (allow_origins != '*').")

def test_3_model_inspect_requires_researcher_role():
    """
    Criterion 3: /api/fl/model-inspect requires the 'researcher' role token.
    """
    # Unauthenticated request
    res_no_auth = client.get("/api/fl/model-inspect")
    assert res_no_auth.status_code == 401, f"Expected 401 for unauthenticated model-inspect, got {res_no_auth.status_code}"
    
    # Patient role token (authenticated, but insufficient role)
    patient_headers = {"Authorization": "Bearer patient-token-secret"}
    res_patient = client.get("/api/fl/model-inspect", headers=patient_headers)
    assert res_patient.status_code == 403, f"Expected 403 Forbidden for patient role on model-inspect, got {res_patient.status_code}"
    
    # Researcher role token (authenticated & authorized)
    researcher_headers = {"Authorization": "Bearer researcher-token-secret"}
    res_researcher = client.get("/api/fl/model-inspect", headers=researcher_headers)
    assert res_researcher.status_code == 200, f"Expected 200 OK for researcher role, got {res_researcher.status_code}"
    
    data = res_researcher.json()
    assert "weight_matrix_sample" in data, "Weight matrix missing from response"
    assert data["user_role"] == "researcher", f"Unexpected user_role: {data.get('user_role')}"
    
    print("✅ Criterion 3 PASSED: /api/fl/model-inspect strictly requires the 'researcher' role token (401 for unauth, 403 for non-researcher, 200 for researcher).")

if __name__ == "__main__":
    print("--- Verifying Task 2 Acceptance Criteria ---")
    test_1_unauthenticated_requests_rejected()
    test_2_cors_restriction()
    test_3_model_inspect_requires_researcher_role()
    print("--- ALL TASK 2 ACCEPTANCE CRITERIA VERIFIED SUCCESSFULLY ---")
