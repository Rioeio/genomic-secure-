"""
FHIR R4 & OHDSI OMOP CDM v5.4 Standards-Aligned Genomic Schema
--------------------------------------------------------------
Provides Pydantic data models for HL7 FHIR MolecularSequence resources
and OMOP CDM Genomic Measurement records. Enables interoperability
with the OHDSI network (544 data sources, ~974M patient records).
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# HL7 FHIR R4 MolecularSequence Model
# ---------------------------------------------------------------------------

class FHIRVariant(BaseModel):
    start: int = Field(..., description="0-based or 1-based start coordinate")
    end: int = Field(..., description="End coordinate")
    observedAllele: str = Field(..., description="Observed alternate allele")
    referenceAllele: str = Field(..., description="Reference allele")
    cigar: Optional[str] = Field(None, description="Extended CIGAR string for structural indels")

class FHIRReferenceSeq(BaseModel):
    chromosome: Dict[str, str] = Field(default_factory=lambda: {"text": "17"})
    genomeBuild: str = Field(default="GRCh38", description="Human genome assembly")
    referenceSeqId: Optional[Dict[str, str]] = None

class FHIRMolecularSequence(BaseModel):
    resourceType: str = Field(default="MolecularSequence", description="FHIR Resource Type")
    id: str = Field(..., description="Unique FHIR resource identifier")
    identifier: List[Dict[str, str]] = Field(default_factory=list, description="System identifiers e.g. dbSNP rsID")
    type: str = Field(default="dna", description="Amino acid or nucleic acid sequence type")
    coordinateSystem: int = Field(default=1, description="1-based coordinate system")
    referenceSeq: FHIRReferenceSeq
    variant: List[FHIRVariant]

# ---------------------------------------------------------------------------
# OHDSI OMOP CDM v5.4 Genomic Measurement Model
# ---------------------------------------------------------------------------

class OMOPGenomicMeasurement(BaseModel):
    measurement_id: str
    person_id: Optional[str] = "anonymized_cohort"
    measurement_concept_id: int = Field(..., description="Standard OMOP Concept ID from SNOMED/LOINC/NCIt")
    measurement_concept_name: str = Field(..., description="Standard concept label")
    measurement_source_value: str = Field(..., description="dbSNP rsID accession")
    value_as_concept_id: int = Field(default=4181412, description="OMOP Concept for Pathogenic / Present")
    value_source_value: str = Field(..., description="Clinical significance label from ClinVar")
    gene_symbol: str = Field(..., description="HGNC standard gene symbol")
    chromosome: str = Field(..., description="Chromosomal location e.g. Chr 17")
    position: int = Field(..., description="GRCh38 basepair position")
    reference_allele: str
    alternate_allele: str
    odds_ratio: Optional[float] = 1.0
    p_value: Optional[float] = 1.0
    clinical_significance: str

# ---------------------------------------------------------------------------
# Harmonized Standard Genomic Record Model
# ---------------------------------------------------------------------------

class StandardGenomicRecord(BaseModel):
    rsId: str
    gene: str
    disease: str
    chromosome: str
    position: int
    location: str
    alleleString: str
    clinicalSignificance: str
    minorAlleleFrequency: Optional[float] = None
    oddsRatio: Optional[float] = None
    pValue: Optional[float] = None
    impact: Optional[str] = "High"
    source: str = "Ensembl GRCh38 / dbSNP"
    fhir_representation: FHIRMolecularSequence
    omop_representation: OMOPGenomicMeasurement

class GenomicVariantsResponse(BaseModel):
    schema_version: str = "FHIR-R4 / OMOP-CDM-v5.4"
    standards_compliance: List[str] = [
        "HL7 FHIR R4 (MolecularSequence)",
        "OHDSI OMOP CDM v5.4 (Measurement Domain)",
        "HGVS Sequence Variant Nomenclature",
        "GA4GH Variant Representation Specification (VRS)"
    ]
    total_variants: int
    variants: List[StandardGenomicRecord]
