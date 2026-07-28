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
from dataset import DATASET_TYPE, DATASET_DESCRIPTION

app = FastAPI(
    title="GenomicSecure Backend API",
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

# Token database mapping tokens to user roles
VALID_TOKENS: Dict[str, dict] = {
    "researcher-token-secret": {"user": "dr_smith", "role": "researcher"},
    "institution-token-secret": {"user": "metro_general", "role": "institution"},
    "patient-token-secret": {"user": "patient_pat7", "role": "patient"}
}

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
    """Authentication dependency: Validates Bearer token on protected routes."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Bearer token required in Authorization header.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = credentials.credentials
    if token not in VALID_TOKENS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return VALID_TOKENS[token]

def require_researcher_role(user: dict = Depends(get_current_user)) -> dict:
    """Role-based authorization dependency: Requires researcher role."""
    if user.get("role") != "researcher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden. Endpoint requires 'researcher' role authorization."
        )
    return user

class TrainRoundRequest(BaseModel):
    epsilon_step: float = 0.1
    study_id: Optional[str] = "rs1"

class PredictRequest(BaseModel):
    rs1799966: float = 0.0  # BRCA1 variant dosage (0, 1, or 2 alleles)
    rs80357711: float = 0.0 # BRCA1 pathogenic allele
    rs7903146: float = 0.0  # TCF7L2 T2D risk allele
    rs429358: float = 0.0   # APOE e4 risk allele
    rs1042522: float = 0.0  # TP53 variant

@app.get("/")
def read_root():
    """Public health check endpoint."""
    return {
        "status": "ONLINE",
        "service": "GenomicSecure Federated Learning API",
        "dataset_type": DATASET_TYPE,
        "dataset_description": DATASET_DESCRIPTION,
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
    Pass a patient's genomic variant profile to test the trained AI model.
    Protected by token auth and rate limiting.
    """
    rate_limiter(request, max_requests=30, window_seconds=10)
    
    features = np.array([req.rs1799966, req.rs80357711, req.rs7903146, req.rs429358, req.rs1042522])
    
    w_slice = fl_server.global_weights.flatten()[:5]
    bias = fl_server.global_weights.flatten()[5] if len(fl_server.global_weights.flatten()) > 5 else 0.0
    logits = np.dot(features, w_slice) + bias
    
    probability = float(1.0 / (1.0 + np.exp(-np.clip(logits, -25.0, 25.0))))
    risk_level = "HIGH RISK" if probability > 0.65 else ("MODERATE RISK" if probability > 0.35 else "LOW RISK")
    
    return {
        "input_genomic_profile": req.dict(),
        "model_confidence": round(probability * 100, 2),
        "disease_risk_prediction": risk_level,
        "dataset_type": DATASET_TYPE,
        "federated_rounds_trained": fl_server.current_round,
        "privacy_guarantee": f"Model trained with Laplace DP (ε={fl_server.privacy_engine.epsilon_used:.2f})"
    }

@app.post("/api/fl/run-round")
def run_federated_round(request_data: TrainRoundRequest, request: Request, user: dict = Depends(get_current_user)):
    """
    Triggers one round of federated training across hospital nodes.
    Protected by token auth and rate limiting.
    """
    rate_limiter(request, max_requests=10, window_seconds=10)
    try:
        round_res = fl_server.execute_federated_round(epsilon_step=request_data.epsilon_step)
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

@app.get("/api/genomics/real-variants")
def get_real_variants():
    """Public genomic variant definitions endpoint."""
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "src", "app", "realGenomicDataset.json")
    if os.path.exists(dataset_path):
        with open(dataset_path, "r") as f:
            return json.load(f)
    return {"error": "Dataset file not found"}

@app.post("/api/fl/reset")
def reset_fl_engine(user: dict = Depends(get_current_user)):
    """Resets FL server engine. Protected by token auth."""
    global fl_server
    fl_server = FederatedServerAggregator()
    return {"message": "Federated Learning Server reset successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
