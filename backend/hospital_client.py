import numpy as np
from privacy_guard import PrivacyGuardEngine

class LocalHospitalWorker:
    def __init__(self, hospital_id: str, name: str, population_code: str, population_ancestry: str,
                 X_train: np.ndarray, y_train: np.ndarray, X_val: np.ndarray, y_val: np.ndarray, 
                 pos_loss_weight: float, privacy_engine: PrivacyGuardEngine):
        self.hospital_id = hospital_id
        self.name = name
        self.population_code = population_code
        self.population_ancestry = population_ancestry
        self.X_train = X_train
        self.y_train = y_train
        self.X_val = X_val
        self.y_val = y_val
        self.pos_loss_weight = pos_loss_weight
        self.sample_count = len(X_train)
        self.privacy_engine = privacy_engine

    @staticmethod
    def _sigmoid(z: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(z, -25.0, 25.0)))

    def evaluate(self, weights: np.ndarray) -> tuple[float, float, float]:
        """
        Evaluates model weights on held-out local validation split (X_val, y_val).
        Returns (loss, raw_accuracy, balanced_accuracy).
        """
        flat = weights.flatten()
        w_flat = flat[:5]
        bias = flat[5] if len(flat) > 5 else 0.0
        
        logits = np.dot(self.X_val, w_flat) + bias
        preds = self._sigmoid(logits)
        
        eps = 1e-12
        # Weighted BCE Loss to handle class imbalance
        loss = -np.mean(self.pos_loss_weight * self.y_val * np.log(preds + eps) + (1 - self.y_val) * np.log(1 - preds + eps))
        
        pred_labels = (preds >= 0.5).astype(int)
        raw_acc = float(np.mean(pred_labels == self.y_val))
        
        # Balanced accuracy across positive cases and negative controls
        pos_mask = (self.y_val == 1)
        neg_mask = (self.y_val == 0)
        sensitivity = float(np.mean(pred_labels[pos_mask] == 1)) if np.sum(pos_mask) > 0 else 1.0
        specificity = float(np.mean(pred_labels[neg_mask] == 0)) if np.sum(neg_mask) > 0 else 1.0
        balanced_acc = float((sensitivity + specificity) / 2.0)
        
        return float(round(loss, 4)), float(round(raw_acc, 4)), float(round(balanced_acc, 4))

    def train_local_epoch(self, global_weights: np.ndarray, epsilon_step: float = 0.5, 
                          learning_rate: float = 0.12, epochs: int = 15) -> dict:
        """
        1. Initialize local weights with received global weights.
        2. Perform real gradient descent with class-imbalance weighting.
        3. Clip ΔW sensitivity bound (C=0.2) and apply Laplace Differential Privacy noise.
        4. Evaluate local loss & accuracy on held-out validation set.
        """
        flat = global_weights.flatten()
        w_flat = np.copy(flat[:5])
        bias = float(flat[5]) if len(flat) > 5 else 0.0
        
        m = len(self.X_train)
        
        # Real gradient descent epochs on local hospital cohort
        for _ in range(epochs):
            logits = np.dot(self.X_train, w_flat) + bias
            preds = self._sigmoid(logits)
            
            # Weighted error gradient for class imbalance
            weights_mask = np.where(self.y_train == 1, self.pos_loss_weight, 1.0)
            error = (preds - self.y_train) * weights_mask
            
            dw = (1.0 / m) * np.dot(self.X_train.T, error) + 0.001 * w_flat
            db = (1.0 / m) * np.sum(error)
            
            w_flat -= learning_rate * dw
            bias -= learning_rate * db

        # Parameter vector (5 weights + 1 bias)
        params_updated = np.zeros(6, dtype=np.float64)
        params_updated[:5] = w_flat
        params_updated[5] = bias
        
        params_global = np.zeros(6, dtype=np.float64)
        params_global[:5] = flat[:5]
        params_global[5] = flat[5] if len(flat) > 5 else 0.0
        
        raw_diff_6 = params_updated - params_global
        
        # Gradient Clipping to bound sensitivity to C = 0.2
        norm = np.linalg.norm(raw_diff_6)
        max_norm = 0.2
        if norm > max_norm:
            clipped_diff_6 = raw_diff_6 * (max_norm / norm)
        else:
            clipped_diff_6 = raw_diff_6
            
        # Add Laplace Differential Privacy noise
        noise = np.random.laplace(0.0, max_norm / max(0.01, epsilon_step), size=6)
        private_diff_6 = clipped_diff_6 + noise
        
        # Map back to (10, 64) matrix structure
        private_diff = np.zeros_like(global_weights)
        diff_flat = private_diff.flatten()
        diff_flat[:6] = private_diff_6
        private_diff = diff_flat.reshape(global_weights.shape)
        
        local_loss, local_raw_acc, local_balanced_acc = self.evaluate(global_weights + private_diff)
        
        return {
            "hospital_id": self.hospital_id,
            "hospital_name": self.name,
            "population_code": self.population_code,
            "population_ancestry": self.population_ancestry,
            "samples_processed": self.sample_count,
            "private_weight_diff": private_diff,
            "local_accuracy": local_raw_acc,
            "local_balanced_accuracy": local_balanced_acc,
            "local_loss": local_loss,
            "privacy_noise_applied": True,
            "epsilon_consumed": epsilon_step
        }
