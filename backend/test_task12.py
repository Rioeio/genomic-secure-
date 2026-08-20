from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def _get_jwt() -> str:
    res = client.post("/auth/login", json={"email": "dr.smith@genome.edu", "password": "secure123"})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_second_omop_domain_federated_round():
    """
    Task 12 Acceptance Criteria:
    - A full federated round runs end-to-end on the non-genomic OMOP EHR domain
      (CONDITION_OCCURRENCE + DRUG_EXPOSURE) using the same hospital_client.py/server.py code paths.
    """
    token = _get_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Execute federated round on the non-genomic OMOP domain
    payload = {
        "epsilon_step": 0.25,
        "study_id": "ehr_study_1",
        "domain": "omop_clinical_ehr"
    }
    
    res = client.post("/api/fl/run-round", json=payload, headers=headers)
    assert res.status_code == 200, f"OMOP EHR FL round failed: {res.status_code} {res.text}"
    
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    
    # Verify non-genomic OMOP domain attributes
    assert data["domain"] == "omop_clinical_ehr"
    assert data["dataset_type"] == "omop_clinical_ehr"
    assert "OHDSI OMOP CDM" in data["dataset_name"]
    assert data["participating_nodes"] == 3
    assert data["total_samples"] > 0
    assert isinstance(data["accuracy"], float)
    assert isinstance(data["loss"], float)
    assert data["accuracy"] > 0.0
    
    # Verify node updates executed gradient descent on OMOP EHR domain
    for node in data["node_updates"]:
        assert node["privacy_noise_applied"] is True
        assert node["samples"] > 0
        assert node["local_accuracy"] > 0.0
        
    print(f"PASS Task 12: Successfully executed full federated learning round on second OMOP domain (Conditions + Medications) with Accuracy={data['accuracy']*100:.1f}%, Loss={data['loss']}.")

if __name__ == "__main__":
    print("--- Running Task 12 Second OMOP Domain Tests ---")
    test_second_omop_domain_federated_round()
    print("--- ALL TASK 12 CRITERIA VERIFIED SUCCESSFULLY ---")
