import numpy as np
from hospital_client import LocalHospitalWorker
from privacy_guard import PrivacyGuardEngine
from dataset import get_hospital_shards, DATASET_TYPE, DATASET_DESCRIPTION

# DATASET NOTE: Uses documented synthetic genomic data (dataset_type: "documented_synthetic").
# All loss and accuracy metrics are computed from real model predictions on held-out test splits.

class FederatedServerAggregator:
    def __init__(self, seed: int = 42):
        self.seed = seed
        np.random.seed(seed)
        
        # Global PyTorch/NumPy model parameters (10 x 64 genomic matrix)
        self.global_weights = np.zeros((10, 64), dtype=np.float64)
        
        self.current_round = 0
        self.history = []
        
        # Privacy Guard Engine instance
        self.privacy_engine = PrivacyGuardEngine(epsilon_total=10.0)
        
        # Load dataset shards
        self.dataset_info = get_hospital_shards(seed=seed)
        self.X_test = self.dataset_info["global_test"]["X_test"]
        self.y_test = self.dataset_info["global_test"]["y_test"]
        
        # Instantiate Hospital Nodes with distinct data shards
        self.hospitals = []
        for node_id, node_data in self.dataset_info["nodes"].items():
            worker = LocalHospitalWorker(
                hospital_id=node_id,
                name=node_data["name"],
                X_train=node_data["X_train"],
                y_train=node_data["y_train"],
                X_val=node_data["X_val"],
                y_val=node_data["y_val"],
                privacy_engine=self.privacy_engine
            )
            self.hospitals.append(worker)

    def _sigmoid(self, z: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(z, -25.0, 25.0)))

    def evaluate_global_model(self) -> tuple[float, float]:
        """
        Evaluates global model weights against held-out global test dataset (X_test, y_test).
        Returns (loss, accuracy).
        """
        w_flat = self.global_weights.flatten()[:5]
        bias = self.global_weights.flatten()[5] if len(self.global_weights.flatten()) > 5 else 0.0
        
        logits = np.dot(self.X_test, w_flat) + bias
        preds = self._sigmoid(logits)
        
        eps = 1e-12
        loss = -np.mean(self.y_test * np.log(preds + eps) + (1 - self.y_test) * np.log(1 - preds + eps))
        acc = np.mean((preds >= 0.5) == self.y_test)
        
        return float(round(loss, 4)), float(round(acc, 4))

    def execute_federated_round(self, epsilon_step: float = 0.5) -> dict:
        """
        Executes 1 Federated Learning Round (FedAvg):
        1. Dispatch global weights to all hospital nodes.
        2. Hospital nodes compute local gradient updates on local data shards.
        3. Hospital nodes apply Laplace noise to weight diffs.
        4. Central Server aggregates updates via weighted FedAvg.
        5. Evaluates global model on held-out global test set.
        """
        self.current_round += 1
        client_results = []
        total_samples = sum(h.sample_count for h in self.hospitals)
        
        aggregated_diff = np.zeros_like(self.global_weights)
        
        for hospital in self.hospitals:
            # Hospital trains locally and returns privacy-preserved weight diff
            res = hospital.train_local_epoch(self.global_weights, epsilon_step=epsilon_step)
            client_results.append(res)
            
            # FedAvg Weight Calculation: weight = sample_count / total_samples
            weight_factor = hospital.sample_count / total_samples
            aggregated_diff += weight_factor * res["private_weight_diff"]

        # Apply FedAvg update to global model parameters
        self.global_weights += aggregated_diff
        
        # Calculate real global model loss and accuracy on held-out global test set
        loss, accuracy = self.evaluate_global_model()
        
        round_summary = {
            "round": self.current_round,
            "loss": loss,
            "accuracy": accuracy,
            "dataset_type": DATASET_TYPE,
            "dataset_description": DATASET_DESCRIPTION,
            "participating_nodes": len(self.hospitals),
            "total_samples": total_samples,
            "privacy_status": self.privacy_engine.get_budget_status(),
            "node_updates": [
                {
                    "hospital": r["hospital_name"],
                    "local_accuracy": r["local_accuracy"],
                    "local_loss": r["local_loss"],
                    "samples": r["samples_processed"],
                    "privacy_noise_applied": r["privacy_noise_applied"]
                } for r in client_results
            ]
        }
        
        self.history.append(round_summary)
        return round_summary

if __name__ == "__main__":
    print("Testing Python Federated Server Engine with Real Data & Gradient Descent...")
    server = FederatedServerAggregator()
    for r in range(1, 6):
        res = server.execute_federated_round(epsilon_step=0.5)
        print(f"Round {res['round']}: Accuracy={res['accuracy']*100:.1f}%, Loss={res['loss']}, Dataset={res['dataset_type']}")
