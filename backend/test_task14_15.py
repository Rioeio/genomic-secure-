import os
from fastapi.testclient import TestClient
from app import app
from dataset import DATASET_PATH, DATASET_LICENSE, DATASET_TYPE

client = TestClient(app)

def _get_jwt() -> str:
    res = client.post("/auth/login", json={"email": "dr.smith@genome.edu", "password": "secure123"})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_dataset_license_and_provenance():
    """
    Task 14 Acceptance Criteria:
    - DATASET_LICENSE.md exists and documents sources, licenses, and imbalance handling.
    - Real dataset exists at backend/data/real_genomic_cohort.json.
    """
    license_md_path = os.path.join(os.path.dirname(__file__), "..", "DATASET_LICENSE.md")
    assert os.path.exists(license_md_path), "DATASET_LICENSE.md is missing!"
    
    with open(license_md_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    content_lower = content.lower()
    assert "ensembl" in content_lower, "License doc missing Ensembl attribution"
    assert "dbsnp" in content_lower, "License doc missing dbSNP attribution"
    assert "clinvar" in content_lower, "License doc missing ClinVar attribution"
    assert "1000 genomes" in content_lower, "License doc missing 1000 Genomes attribution"
    assert "cc-by 4.0" in content_lower, "License doc missing CC-BY 4.0 terms"
    assert "class-weighted" in content_lower or "imbalance" in content_lower, "License doc missing imbalance documentation"
    
    assert os.path.exists(DATASET_PATH), f"Real cohort dataset not found at {DATASET_PATH}"
    print("PASS Criterion 1: DATASET_LICENSE.md and real genomic cohort file verified.")

def test_federated_round_with_ancestry_breakdown():
    """
    Task 14 & 15 Acceptance Criteria:
    - Training runs end-to-end on real dataset.
    - Class imbalance handling reported in response.
    - Response includes per-population metrics breakdown (EUR, SAS, AFR).
    """
    token = _get_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    res = client.post("/api/fl/run-round", json={"epsilon_step": 0.3}, headers=headers)
    assert res.status_code == 200, f"FL round failed: {res.status_code} {res.text}"
    
    body = res.json()
    assert body["success"] is True
    data = body["data"]
    
    # Verify Task 14 real dataset & imbalance attributes
    assert data["dataset_type"] == "real_world_derived_benchmark"
    assert "imbalance_handling" in data
    assert data["imbalance_handling"] == "class_weighted_binary_cross_entropy"
    assert data["dataset_license"] == DATASET_LICENSE
    
    # Verify Task 15 ancestry breakdown
    assert "population_metrics" in data, "Missing population_metrics in FL round response"
    pop_metrics = data["population_metrics"]
    
    assert "EUR" in pop_metrics, "Missing EUR population metrics"
    assert "SAS" in pop_metrics, "Missing SAS population metrics"
    assert "AFR" in pop_metrics, "Missing AFR population metrics"
    
    for pop in ["EUR", "SAS", "AFR"]:
        metrics = pop_metrics[pop]
        assert "accuracy" in metrics, f"Missing accuracy for {pop}"
        assert "balanced_accuracy" in metrics, f"Missing balanced_accuracy for {pop}"
        assert "loss" in metrics, f"Missing loss for {pop}"
        assert "test_samples" in metrics, f"Missing test_samples for {pop}"
        assert metrics["test_samples"] > 0
    
    # Verify node updates contain population ancestry tags
    node_updates = data["node_updates"]
    assert len(node_updates) == 3
    for node in node_updates:
        assert "population_code" in node
        assert "population_ancestry" in node
        assert "local_balanced_accuracy" in node
        
    print("PASS Criterion 2: Multi-ancestry federated round executed with per-population breakdown (EUR, SAS, AFR) and class-imbalance weighting.")

if __name__ == "__main__":
    print("--- Running Task 14 & 15 Verification Tests ---")
    test_dataset_license_and_provenance()
    test_federated_round_with_ancestry_breakdown()
    print("--- ALL TASK 14 & 15 CRITERIA VERIFIED SUCCESSFULLY ---")
