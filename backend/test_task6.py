from fastapi.testclient import TestClient
from app import app
from schema import GenomicVariantsResponse, FHIRMolecularSequence, OMOPGenomicMeasurement

client = TestClient(app)

def test_fhir_omop_genomic_variants_schema():
    """
    Task 6 Acceptance Criteria:
    - /api/genomics/real-variants response validates against the FHIR/OMOP schema.
    - Each record contains valid FHIR MolecularSequence and OMOP Measurement models.
    """
    res = client.get("/api/genomics/real-variants")
    assert res.status_code == 200, f"Expected 200 OK, got {res.status_code}: {res.text}"
    
    data = res.json()
    
    # Validate against Pydantic schema
    validated_response = GenomicVariantsResponse(**data)
    assert validated_response.total_variants > 0, "No variants returned in response"
    assert "HL7 FHIR R4 (MolecularSequence)" in validated_response.standards_compliance
    assert "OHDSI OMOP CDM v5.4 (Measurement Domain)" in validated_response.standards_compliance
    
    # Inspect individual variant compliance
    first_variant = validated_response.variants[0]
    assert first_variant.rsId.startswith("rs"), f"Invalid rsId: {first_variant.rsId}"
    
    # FHIR validation
    fhir = first_variant.fhir_representation
    assert isinstance(fhir, FHIRMolecularSequence)
    assert fhir.resourceType == "MolecularSequence"
    assert fhir.type == "dna"
    assert len(fhir.variant) > 0
    assert fhir.variant[0].observedAllele != ""
    assert fhir.variant[0].referenceAllele != ""
    
    # OMOP validation
    omop = first_variant.omop_representation
    assert isinstance(omop, OMOPGenomicMeasurement)
    assert omop.measurement_concept_id > 0
    assert omop.gene_symbol == first_variant.gene
    assert omop.measurement_source_value == first_variant.rsId
    assert omop.clinical_significance != ""
    
    print(f"PASS Task 6: Validated {validated_response.total_variants} variants against FHIR R4 & OMOP CDM v5.4 standard schema.")

if __name__ == "__main__":
    print("--- Running Task 6 FHIR / OMOP Integration Tests ---")
    test_fhir_omop_genomic_variants_schema()
    print("--- ALL TASK 6 CRITERIA VERIFIED SUCCESSFULLY ---")
