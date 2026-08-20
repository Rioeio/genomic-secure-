import numpy as np
import json
import os
import time
from collections import defaultdict
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException, Depends, Security, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from server import FederatedServerAggregator
from dataset import (
    DATASET_TYPE, DATASET_DESCRIPTION, DATASET_LICENSE, GENOMIC_LOCI,
    POLYGENIC_INDICES, evaluate_monogenic_findings, calculate_prs_percentile
)
from auth import authenticate_user, get_user_from_token

app = FastAPI(
    title="Med-Link Backend API",
    description="Privacy-Preserving Federated Genomic Research Engine API",
    version="1.0.0"
)

# 1. CORS Lockdown: Restrict allowed origins to explicit trusted list (no "*")
ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

fl_server = FederatedServerAggregator()
security = HTTPBearer(auto_error=False)

# In-memory sliding window rate limiter
RATE_LIMIT_STORE: Dict[str, List[float]] = defaultdict(list)

def rate_limiter(request: Request, max_requests: int = 20, window_seconds: int = 10):
    """Basic rate limiter for API endpoints."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    # Remove timestamps older than window_seconds
    RATE_LIMIT_STORE[client_ip] = [t for t in RATE_LIMIT_STORE[client_ip] if now - t < window_seconds]
    
    if len(RATE_LIMIT_STORE[client_ip]) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Too many requests. Please wait."
        )
    
    RATE_LIMIT_STORE[client_ip].append(now)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> dict:
    """Authentication dependency: Validates JWT Bearer token on protected routes."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Bearer token required in Authorization header.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user = get_user_from_token(credentials.credentials)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user

def require_researcher_role(user: dict = Depends(get_current_user)) -> dict:
    """Role-based authorization dependency: Requires researcher role."""
    if user.get("role") != "researcher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. Endpoint requires 'researcher' role authorization."
        )
    return user

# --- Authentication Endpoint ---

class LoginRequest(BaseModel):
    email: str
    password: str

class PredictRequest(BaseModel):
    rs1799966: float = 0.0  # BRCA1 variant dosage (0, 1, or 2 alleles)
    rs80357711: float = 0.0 # BRCA1 pathogenic allele
    rs7903146: float = 0.0  # TCF7L2 T2D risk allele
    rs429358: float = 0.0   # APOE e4 risk allele
    rs1042522: float = 0.0  # TP53 variant

class TrainRoundRequest(BaseModel):
    epsilon_step: float = 0.1
    study_id: Optional[str] = "rs1"
    domain: Optional[str] = "genomics"  # "genomics" or "omop_clinical_ehr"

@app.post("/auth/login")
def login(req: LoginRequest):
    """
    Authenticate a user with email + password.
    Returns a short-lived JWT token on success.
    """
    result = authenticate_user(req.email, req.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return result

@app.get("/")
def read_root():
    """Public health check endpoint."""
    return {
        "status": "ONLINE",
        "service": "Med-Link Federated Learning API",
        "dataset_type": DATASET_TYPE,
        "dataset_description": DATASET_DESCRIPTION,
        "dataset_license": DATASET_LICENSE,
        "populations_represented": ["EUR", "SAS", "AFR"],
        "imbalance_handling": "class_weighted_binary_cross_entropy",
        "active_nodes": len(fl_server.hospitals),
        "rounds_completed": fl_server.current_round,
        "privacy_budget": fl_server.privacy_engine.get_budget_status()
    }

@app.get("/api/fl/model-inspect")
def inspect_model_weights(user: dict = Depends(require_researcher_role)):
    """
    Inspect raw weight tensors of the global AI model.
    Gated behind 'researcher' role authorization to prevent information leakage.
    """
    weights = fl_server.global_weights
    return {
        "current_round": fl_server.current_round,
        "dataset_type": DATASET_TYPE,
        "inspected_by": user["user"],
        "user_role": user["role"],
        "weight_matrix_shape": list(weights.shape),
        "weight_matrix_sample": weights[:3, :6].tolist(),
        "mean_weight": float(np.mean(weights)),
        "weight_std": float(np.std(weights)),
        "weight_min": float(np.min(weights)),
        "weight_max": float(np.max(weights)),
        "privacy_status": fl_server.privacy_engine.get_budget_status()
    }

@app.post("/api/fl/predict")
def run_model_inference(req: PredictRequest, request: Request, user: dict = Depends(get_current_user)):
    """
    Evaluates a patient's genomic variant profile:
    1. Monogenic findings: Discrete presence/absence & clinical pathogenicity classifications.
    2. Polygenic risk: Weighted Polygenic Risk Score reported as an empirical population percentile.
    Protected by token auth and rate limiting.
    """
    rate_limiter(request, max_requests=30, window_seconds=10)
    profile = req.model_dump()
    
    # 1. Monogenic high-penetrance analysis (BRCA1, TP53) - reported as discrete clinical findings
    monogenic_findings = evaluate_monogenic_findings(profile)
    has_pathogenic_monogenic = any(f["pathogenic_allele_present"] for f in monogenic_findings)
    
    # 2. Polygenic risk scoring (TCF7L2, APOE) - reported as population percentile
    # PRS always uses published GWAS effect sizes, not FL classification weights.
    # FL weights learn classification boundaries; PRS weights are fixed effect-size estimates.
    polygenic_features = np.array([req.rs7903146, req.rs429358])
    poly_weights = np.array([
        GENOMIC_LOCI[2]["effect_weight"],  # TCF7L2: 0.65
        GENOMIC_LOCI[3]["effect_weight"],  # APOE: 0.85
    ])
        
    ref_dist = fl_server.reference_prs_distribution
    if len(ref_dist) == 0:
        ref_dist = np.array([0.0, 0.65, 0.85, 1.5, 2.15, 3.0])
        
    prs_percentile, raw_prs = calculate_prs_percentile(polygenic_features, poly_weights, ref_dist)
    
    if prs_percentile >= 80.0:
        prs_tier = "High Polygenic Risk (Top Quintile)"
    elif prs_percentile >= 50.0:
        prs_tier = "Moderate Polygenic Risk (Above Median)"
    elif prs_percentile >= 20.0:
        prs_tier = "Average Population Risk"
    else:
        prs_tier = "Lower Polygenic Risk (Bottom Quintile)"
        
    return {
        "input_genomic_profile": profile,
        "monogenic_findings": monogenic_findings,
        "monogenic_summary": "Pathogenic high-penetrance variant detected" if has_pathogenic_monogenic else "No high-penetrance pathogenic variants detected",
        "polygenic_risk_percentile": prs_percentile,
        "polygenic_risk_score": raw_prs,
        "polygenic_risk_tier": prs_tier,
        "polygenic_loci_evaluated": ["rs7903146 (TCF7L2 - T2D)", "rs429358 (APOE - AD/CVD)"],
        "dataset_type": DATASET_TYPE,
        "federated_rounds_trained": fl_server.current_round,
        "privacy_guarantee": f"Model trained with Laplace DP (ε={fl_server.privacy_engine.epsilon_used:.2f})"
    }

@app.post("/api/fl/run-round")
def run_federated_round(request_data: TrainRoundRequest, request: Request, user: dict = Depends(get_current_user)):
    """
    Triggers one round of federated training across hospital nodes.
    Supports both genomics and non-genomics OMOP EHR domains (Task 12).
    Protected by token auth and rate limiting.
    """
    rate_limiter(request, max_requests=10, window_seconds=10)
    try:
        round_res = fl_server.execute_federated_round(
            epsilon_step=request_data.epsilon_step,
            domain=request_data.domain
        )
        return {
            "success": True,
            "triggered_by": user["user"],
            "data": round_res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/fl/history")
def get_fl_history(user: dict = Depends(get_current_user)):
    """
    Retrieves training round history.
    Protected by token auth.
    """
    return {
        "rounds_completed": fl_server.current_round,
        "dataset_type": DATASET_TYPE,
        "history": fl_server.history,
        "privacy_budget": fl_server.privacy_engine.get_budget_status()
    }

from schema import StandardGenomicRecord, FHIRMolecularSequence, OMOPGenomicMeasurement, GenomicVariantsResponse

@app.get("/api/genomics/real-variants", response_model=GenomicVariantsResponse)
def get_real_variants():
    """
    Public genomic variant definitions endpoint aligned to FHIR R4 & OHDSI OMOP CDM v5.4.
    Enables direct interoperability with the international OHDSI biomedical network.
    """
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "src", "app", "realGenomicDataset.json")
    if not os.path.exists(dataset_path):
        raise HTTPException(status_code=404, detail="Dataset file not found")
        
    with open(dataset_path, "r") as f:
        raw_list = json.load(f)
        
    records = []
    for item in raw_list:
        rsid = item.get("rsId", "rs0")
        allele_str = item.get("alleleString", "REF/ALT")
        alleles = allele_str.split("/")
        ref_allele = alleles[0] if len(alleles) > 0 else "REF"
        alt_allele = alleles[1] if len(alleles) > 1 else (alleles[0] if len(alleles) > 0 else "ALT")
        chrom_num = str(item.get("chromosome", "17")).replace("Chr ", "")
        pos = int(item.get("position", 0))
        
        fhir_seq = FHIRMolecularSequence(
            resourceType="MolecularSequence",
            id=f"ms-{rsid}",
            identifier=[{"system": "http://www.ncbi.nlm.nih.gov/snp", "value": rsid}],
            type="dna",
            coordinateSystem=1,
            referenceSeq={"chromosome": {"text": chrom_num}, "genomeBuild": "GRCh38"},
            variant=[{
                "start": pos,
                "end": pos,
                "observedAllele": alt_allele,
                "referenceAllele": ref_allele
            }]
        )
        
        omop_meas = OMOPGenomicMeasurement(
            measurement_id=f"omop-meas-{rsid}",
            person_id="anonymized_cohort",
            measurement_concept_id=35620000 + (abs(hash(rsid)) % 90000),
            measurement_concept_name=f"{item.get('gene', 'GENE')} {rsid} genetic variant assay",
            measurement_source_value=rsid,
            value_as_concept_id=4181412 if "pathogenic" in item.get("clinicalSignificance", "").lower() else 4125547,
            value_source_value=item.get("clinicalSignificance", "Pathogenic"),
            gene_symbol=item.get("gene", "GENE"),
            chromosome=item.get("chromosome", "Chr 17"),
            position=pos,
            reference_allele=ref_allele,
            alternate_allele=alt_allele,
            odds_ratio=float(item.get("oddsRatio") or 1.0),
            p_value=float(item.get("pValue") or 1.0),
            clinical_significance=item.get("clinicalSignificance", "Pathogenic")
        )
        
        record = StandardGenomicRecord(
            rsId=rsid,
            gene=item.get("gene", "GENE"),
            disease=item.get("disease", "Genetic Condition"),
            chromosome=item.get("chromosome", "Chr 17"),
            position=pos,
            location=item.get("location", f"{chrom_num}:{pos}"),
            alleleString=allele_str,
            clinicalSignificance=item.get("clinicalSignificance", "Pathogenic"),
            minorAlleleFrequency=item.get("minorAlleleFrequency"),
            oddsRatio=float(item.get("oddsRatio") or 1.0) if item.get("oddsRatio") is not None else None,
            pValue=float(item.get("pValue") or 1.0) if item.get("pValue") is not None else None,
            impact=item.get("impact", "High"),
            source=item.get("source", "Ensembl GRCh38 / dbSNP"),
            fhir_representation=fhir_seq,
            omop_representation=omop_meas
        )
        records.append(record)
        
    return GenomicVariantsResponse(
        total_variants=len(records),
        variants=records
    )

from discovery import discovery_engine, CohortQueryRequest, CohortDiscoveryResponse

@app.post("/api/discovery/cohort-count", response_model=CohortDiscoveryResponse)
def query_federated_cohort_count(query: CohortQueryRequest, user: dict = Depends(get_current_user)):
    """
    Zero-exposure federated cohort discovery endpoint (Task 11).
    Broadcasts structured queries to hospital nodes and returns aggregate counts with k-anonymity >= 5.
    Zero patient-level rows ever leave any hospital node.
    """
    return discovery_engine.execute_cohort_query(query)

@app.post("/api/fl/reset")
def reset_fl_engine(user: dict = Depends(get_current_user)):
    """Resets FL server engine. Protected by token auth."""
    global fl_server
    fl_server = FederatedServerAggregator()
    return {"message": "Federated Learning Server reset successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
