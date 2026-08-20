import numpy as np
from hospital_client import LocalHospitalWorker
from privacy_guard import PrivacyGuardEngine
from dataset import get_hospital_shards, get_omop_clinical_shards, DATASET_TYPE, DATASET_DESCRIPTION, DATASET_LICENSE

class FederatedServerAggregator:
    def __init__(self, seed: int = 42, domain: str = "genomics"):
        self.seed = seed
        self.domain = domain
        np.random.seed(seed)
        
        # Global model parameters (10 x 64 matrix structure)
        self.global_weights = np.zeros((10, 64), dtype=np.float64)
        
        self.current_round = 0
        self.history = []
        
        # Privacy Guard Engine instance
        self.privacy_engine = PrivacyGuardEngine(epsilon_total=10.0)
        
        # Load dataset shards based on domain
        self.load_domain_data(domain)

    def load_domain_data(self, domain: str):
        self.domain = domain
        if domain == "omop_clinical_ehr":
            self.dataset_info = get_omop_clinical_shards(seed=self.seed)
        else:
            self.dataset_info = get_hospital_shards(seed=self.seed)
            
        self.X_test = self.dataset_info["global_test"]["X_test"]
        self.y_test = self.dataset_info["global_test"]["y_test"]
        self.ancestry_labels = np.array(self.dataset_info["global_test"].get("ancestry_labels", ["ALL"] * len(self.y_test)))
        self.reference_prs_distribution = self.dataset_info.get("reference_prs_distribution", np.array([]))
        
        # Instantiate Hospital Nodes with distinct data shards
        self.hospitals = []
        for node_id, node_data in self.dataset_info["nodes"].items():
            worker = LocalHospitalWorker(
                hospital_id=node_id,
                name=node_data["name"],
                population_code=node_data.get("population_code", "EUR"),
                population_ancestry=node_data.get("population_ancestry", "Site Shard"),
                X_train=node_data["X_train"],
                y_train=node_data["y_train"],
                X_val=node_data["X_val"],
                y_val=node_data["y_val"],
                pos_loss_weight=node_data.get("pos_loss_weight", 1.0),
                privacy_engine=self.privacy_engine
            )
            self.hospitals.append(worker)

    def _sigmoid(self, z: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(z, -25.0, 25.0)))

    def evaluate_global_model(self) -> dict:
        """
        Evaluates global model against held-out multi-ancestry test set (X_test, y_test).
        Calculates both overall pooled performance and per-population breakdown (EUR, SAS, AFR).
        """
        w_flat = self.global_weights.flatten()[:5]
        bias = self.global_weights.flatten()[5] if len(self.global_weights.flatten()) > 5 else 0.0
        
        logits = np.dot(self.X_test, w_flat) + bias
        preds = self._sigmoid(logits)
        
        eps = 1e-12
        overall_loss = -np.mean(self.y_test * np.log(preds + eps) + (1 - self.y_test) * np.log(1 - preds + eps))
        pred_labels = (preds >= 0.5).astype(int)
        overall_acc = float(np.mean(pred_labels == self.y_test))
        
        # Per-population metrics breakdown (Task 15)
        population_breakdown = {}
        unique_pops = np.unique(self.ancestry_labels)
        
        for pop in unique_pops:
            mask = (self.ancestry_labels == pop)
            if np.sum(mask) > 0:
                y_pop = self.y_test[mask]
                preds_pop = preds[mask]
                pred_labels_pop = pred_labels[mask]
                
                pop_loss = -np.mean(y_pop * np.log(preds_pop + eps) + (1 - y_pop) * np.log(1 - preds_pop + eps))
                pop_acc = float(np.mean(pred_labels_pop == y_pop))
                
                pos_mask = (y_pop == 1)
                neg_mask = (y_pop == 0)
                sens = float(np.mean(pred_labels_pop[pos_mask] == 1)) if np.sum(pos_mask) > 0 else 1.0
                spec = float(np.mean(pred_labels_pop[neg_mask] == 0)) if np.sum(neg_mask) > 0 else 1.0
                balanced_acc = (sens + spec) / 2.0
                
                population_breakdown[str(pop)] = {
                    "population_code": str(pop),
                    "test_samples": int(np.sum(mask)),
                    "accuracy": float(round(pop_acc, 4)),
                    "balanced_accuracy": float(round(balanced_acc, 4)),
                    "loss": float(round(pop_loss, 4)),
                    "prevalence_rate": f"{round(float(np.mean(y_pop) * 100), 1)}%"
                }
        
        return {
            "overall_loss": float(round(overall_loss, 4)),
            "overall_accuracy": float(round(overall_acc, 4)),
            "population_breakdown": population_breakdown
        }

    def execute_federated_round(self, epsilon_step: float = 0.5, domain: str = None) -> dict:
        """
        Executes 1 Federated Learning Round (FedAvg):
        Supports both genomics and non-genomics OMOP EHR domains (Task 12).
        """
        if domain and domain != self.domain:
            self.load_domain_data(domain)
            
        self.current_round += 1
        client_results = []
        total_samples = sum(h.sample_count for h in self.hospitals)
        
        aggregated_diff = np.zeros_like(self.global_weights)
        
        for hospital in self.hospitals:
            res = hospital.train_local_epoch(self.global_weights, epsilon_step=epsilon_step)
            client_results.append(res)
            
            weight_factor = hospital.sample_count / total_samples
            aggregated_diff += weight_factor * res["private_weight_diff"]

        # Apply FedAvg update to global model parameters
        self.global_weights += aggregated_diff
        
        # Evaluate global model
        eval_metrics = self.evaluate_global_model()
        
        round_summary = {
            "round": self.current_round,
            "domain": self.domain,
            "loss": eval_metrics["overall_loss"],
            "accuracy": eval_metrics["overall_accuracy"],
            "population_metrics": eval_metrics["population_breakdown"],
            "dataset_type": self.dataset_info.get("dataset_type", DATASET_TYPE),
            "dataset_name": self.dataset_info.get("dataset_name", "Genomic Benchmark"),
            "description": self.dataset_info.get("description", DATASET_DESCRIPTION),
            "dataset_license": self.dataset_info.get("license", DATASET_LICENSE),
            "imbalance_handling": "class_weighted_binary_cross_entropy",
            "participating_nodes": len(self.hospitals),
            "total_samples": total_samples,
            "privacy_status": self.privacy_engine.get_budget_status(),
            "node_updates": [
                {
                    "hospital": r["hospital_name"],
                    "population_code": r["population_code"],
                    "population_ancestry": r["population_ancestry"],
                    "local_accuracy": r["local_accuracy"],
                    "local_balanced_accuracy": r["local_balanced_accuracy"],
                    "local_loss": r["local_loss"],
                    "samples": r["samples_processed"],
                    "privacy_noise_applied": r["privacy_noise_applied"]
                } for r in client_results
            ]
        }
        
        self.history.append(round_summary)
        return round_summary

if __name__ == "__main__":
    print("Testing Federated Server with OMOP Clinical EHR Domain...")
    server = FederatedServerAggregator(domain="omop_clinical_ehr")
    res = server.execute_federated_round(epsilon_step=0.3)
    print(f"OMOP EHR Round {res['round']}: Accuracy={res['accuracy']*100:.1f}%, Loss={res['loss']}, Domain={res['domain']}")
