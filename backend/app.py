import numpy as np
import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from server import FederatedServerAggregator

app = FastAPI(
    title="GenomicSecure Backend API",
    description="Privacy-Preserving Federated Genomic Research Engine API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fl_server = FederatedServerAggregator()

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
    return {
        "status": "ONLINE",
        "service": "GenomicSecure Federated Learning API",
        "active_nodes": len(fl_server.hospitals),
        "rounds_completed": fl_server.current_round,
        "privacy_budget": fl_server.privacy_engine.get_budget_status()
    }

@app.get("/api/fl/model-inspect")
def inspect_model_weights():
    """
    Inspect the exact PyTorch weight tensors of the global AI model!
    Shows raw matrix weights, mean weight value, gradient variance, and round progression.
    """
    weights = fl_server.global_weights
    return {
        "current_round": fl_server.current_round,
        "weight_matrix_shape": list(weights.shape),
        "weight_matrix_sample": weights[:3, :6].tolist(), # First 3x6 weight matrix slice
        "mean_weight": float(np.mean(weights)),
        "weight_std": float(np.std(weights)),
        "weight_min": float(np.min(weights)),
        "weight_max": float(np.max(weights)),
        "privacy_status": fl_server.privacy_engine.get_budget_status()
    }

@app.post("/api/fl/predict")
def run_model_inference(req: PredictRequest):
    """
    Pass a patient's genomic variant profile to test the trained AI model!
    Returns risk probability score computed by the federated AI model weights.
    """
    # Vectorize input features
    features = np.array([req.rs1799966, req.rs80357711, req.rs7903146, req.rs429358, req.rs1042522])
    
    # Compute dot product against trained global weights vector (first row slice)
    w_slice = fl_server.global_weights[0, :5]
    logits = np.dot(features, w_slice)
    
    # Apply Sigmoid activation function
    probability = float(1.0 / (1.0 + np.exp(-logits)))
    
    # Risk Classification
    risk_level = "HIGH RISK" if probability > 0.65 else ("MODERATE RISK" if probability > 0.35 else "LOW RISK")
    
    return {
        "input_genomic_profile": req.dict(),
        "model_confidence": round(probability * 100, 2),
        "disease_risk_prediction": risk_level,
        "federated_rounds_trained": fl_server.current_round,
        "privacy_guarantee": f"Model trained with Laplace DP (ε={fl_server.privacy_engine.epsilon_used:.2f})"
    }

@app.post("/api/fl/run-round")
def run_federated_round(request: TrainRoundRequest):
    try:
        round_res = fl_server.execute_federated_round(epsilon_step=request.epsilon_step)
        return {
            "success": True,
            "data": round_res
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/fl/history")
def get_fl_history():
    return {
        "rounds_completed": fl_server.current_round,
        "history": fl_server.history,
        "privacy_budget": fl_server.privacy_engine.get_budget_status()
    }

@app.get("/api/genomics/real-variants")
def get_real_variants():
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "src", "app", "realGenomicDataset.json")
    if os.path.exists(dataset_path):
        with open(dataset_path, "r") as f:
            return json.load(f)
    return {"error": "Dataset file not found"}

@app.post("/api/fl/reset")
def reset_fl_engine():
    global fl_server
    fl_server = FederatedServerAggregator()
    return {"message": "Federated Learning Server reset successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
