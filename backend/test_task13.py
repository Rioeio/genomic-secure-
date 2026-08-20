from fastapi.testclient import TestClient
from app import app
from dataset import GENOMIC_LOCI, MONOGENIC_INDICES, POLYGENIC_INDICES

client = TestClient(app)

def _get_jwt(email: str = "dr.smith@genome.edu", password: str = "secure123") -> str:
    res = client.post("/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200
    return res.json()["access_token"]

def test_separate_monogenic_and_polygenic_risk():
    """
    Task 13 Verification:
    - monogenic_findings and polygenic_risk_percentile are distinct fields.
    - No single field blends both variant types into one probability.
    """
    token = _get_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test case 1: Patient with BRCA1 pathogenic variant (rs80357711=1) and low polygenic risk
    profile_1 = {
        "rs1799966": 0.0,
        "rs80357711": 1.0,  # Monogenic pathogenic
        "rs7903146": 0.0,   # Polygenic TCF7L2 = 0
        "rs429358": 0.0,    # Polygenic APOE = 0
        "rs1042522": 0.0
    }
    
    res1 = client.post("/api/fl/predict", json=profile_1, headers=headers)
    assert res1.status_code == 200, f"Error: {res1.status_code} {res1.text}"
    data1 = res1.json()
    
    # Check separate fields exist
    assert "monogenic_findings" in data1, "Missing monogenic_findings field"
    assert "polygenic_risk_percentile" in data1, "Missing polygenic_risk_percentile field"
    assert "model_confidence" not in data1, "Old blended model_confidence must NOT exist"
    assert "disease_risk_prediction" not in data1, "Old blended disease_risk_prediction must NOT exist"
    
    # Check monogenic findings structure
    monogenic = data1["monogenic_findings"]
    assert len(monogenic) == 3, f"Expected 3 monogenic loci (BRCA1 x2, TP53), got {len(monogenic)}"
    
    brca1_pathogenic = next(f for f in monogenic if f["rsid"] == "rs80357711")
    assert brca1_pathogenic["pathogenic_allele_present"] is True
    assert "POSITIVE" in brca1_pathogenic["clinical_interpretation"]
    
    # Check polygenic percentile is separate and low for 0 alleles
    assert isinstance(data1["polygenic_risk_percentile"], (int, float))
    assert data1["polygenic_risk_percentile"] <= 50.0, "With 0 risk alleles, PRS percentile should be low/median"
    
    # Test case 2: Patient with no monogenic variants but high polygenic burden
    profile_2 = {
        "rs1799966": 0.0,
        "rs80357711": 0.0,
        "rs7903146": 2.0,   # Homozygous risk allele
        "rs429358": 2.0,    # Homozygous risk allele
        "rs1042522": 0.0
    }
    
    res2 = client.post("/api/fl/predict", json=profile_2, headers=headers)
    assert res2.status_code == 200
    data2 = res2.json()
    
    # Monogenic should be negative
    assert all(f["pathogenic_allele_present"] is False for f in data2["monogenic_findings"])
    assert "No high-penetrance" in data2["monogenic_summary"]
    
    # Polygenic percentile should be high (top percentile)
    assert data2["polygenic_risk_percentile"] >= 80.0, f"Expected top percentile PRS for max dosage, got {data2['polygenic_risk_percentile']}"
    assert "High Polygenic Risk" in data2["polygenic_risk_tier"]

    print("PASS Task 13: Separate monogenic findings and polygenic risk percentile verified.")

if __name__ == "__main__":
    print("--- Running Task 13 Tests ---")
    test_separate_monogenic_and_polygenic_risk()
    print("--- ALL TASK 13 TESTS PASSED ---")
