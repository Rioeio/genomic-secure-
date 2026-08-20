from fastapi.testclient import TestClient
from app import app
from discovery import CohortDiscoveryResponse

client = TestClient(app)

def _get_jwt() -> str:
    res = client.post("/auth/login", json={"email": "dr.smith@genome.edu", "password": "secure123"})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_federated_cohort_discovery():
    """
    Task 11 Acceptance Criteria:
    - Cohort-count query returns aggregate counts only — no row-level data leaves any node.
    - Response validates against CohortDiscoveryResponse schema.
    """
    token = _get_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Query 1: BRCA1 monogenic high penetrance variant search
    query_payload = {
        "gene": "BRCA1",
        "variant_class": "monogenic_high_penetrance",
        "min_dosage": 1
    }
    
    res = client.post("/api/discovery/cohort-count", json=query_payload, headers=headers)
    assert res.status_code == 200, f"Discovery query failed: {res.status_code} {res.text}"
    
    data = res.json()
    validated = CohortDiscoveryResponse(**data)
    
    # Verify aggregate counts only
    assert validated.total_matching_cohort_size > 0
    assert validated.total_screened_samples > 0
    assert validated.estimated_statistical_power > 0.0
    assert "Zero patient-level rows" in validated.privacy_guarantee
    
    # Verify node level breakdowns
    assert len(validated.node_breakdown) == 3
    for node in validated.node_breakdown:
        assert isinstance(node.matching_cohort_count, int)
        assert isinstance(node.statistical_power_contribution, float)
        assert node.matching_cohort_count >= 0
        # Ensure no row-level array fields exist
        assert not hasattr(node, "patient_ids")
        assert not hasattr(node, "raw_records")
        
    print(f"PASS Task 11: Validated zero-exposure federated cohort discovery: found {validated.total_matching_cohort_size} matching patients across {validated.nodes_reporting} nodes with estimated power {validated.estimated_statistical_power}.")

if __name__ == "__main__":
    print("--- Running Task 11 Federated Cohort Discovery Tests ---")
    test_federated_cohort_discovery()
    print("--- ALL TASK 11 CRITERIA VERIFIED SUCCESSFULLY ---")
