import numpy as np
from privacy_guard import PrivacyGuardEngine

# DATASET NOTE: Uses documented synthetic genomic data (dataset_type: "documented_synthetic").
# Training is performed via real local Gradient Descent (Logistic Regression with L2 regularization).

class LocalHospitalWorker:
    def __init__(self, hospital_id: str, name: str, X_train: np.ndarray, y_train: np.ndarray, 
                 X_val: np.ndarray, y_val: np.ndarray, privacy_engine: PrivacyGuardEngine):
        self.hospital_id = hospital_id
        self.name = name
        self.X_train = X_train
        self.y_train = y_train
        self.X_val = X_val
        self.y_val = y_val
        self.sample_count = len(X_train)
        self.privacy_engine = privacy_engine

    @staticmethod
    def _sigmoid(z: np.ndarray) -> np.ndarray:
        return 1.0 / (1.0 + np.exp(-np.clip(z, -25.0, 25.0)))

    def evaluate(self, weights: np.ndarray) -> tuple[float, float]:
        """
        Evaluates model weights on held-out local validation split (X_val, y_val).
        Returns (loss, accuracy).
        """
        flat = weights.flatten()
        w_flat = flat[:5]
        bias = flat[5]
        
        logits = np.dot(self.X_val, w_flat) + bias
        preds = self._sigmoid(logits)
        
        eps = 1e-12
        loss = -np.mean(self.y_val * np.log(preds + eps) + (1 - self.y_val) * np.log(1 - preds + eps))
        acc = np.mean((preds >= 0.5) == self.y_val)
        return float(round(loss, 4)), float(round(acc, 4))

    def train_local_epoch(self, global_weights: np.ndarray, epsilon_step: float = 0.5, 
                          learning_rate: float = 0.15, epochs: int = 15) -> dict:
        """
        1. Initialize local weights with received global weights.
        2. Perform real gradient descent epochs on local hospital genomic dataset.
        3. Compute raw weight diffs: ΔW = W_local - W_global
        4. Clip ΔW sensitivity bound (C=0.2) and apply Laplace Differential Privacy noise.
        5. Evaluate loss & accuracy on held-out validation set.
        """
        flat = global_weights.flatten()
        w_flat = np.copy(flat[:5])
        bias = float(flat[5])
        
        m = len(self.X_train)
        
        # Real gradient descent epochs on local shard
        for _ in range(epochs):
            logits = np.dot(self.X_train, w_flat) + bias
            preds = self._sigmoid(logits)
            error = preds - self.y_train
            
            dw = (1.0 / m) * np.dot(self.X_train.T, error) + 0.001 * w_flat
            db = (1.0 / m) * np.sum(error)
            
            w_flat -= learning_rate * dw
            bias -= learning_rate * db

        # Construct parameter vector (5 weights + 1 bias)
        params_updated = np.zeros(6, dtype=np.float64)
        params_updated[:5] = w_flat
        params_updated[5] = bias
        
        params_global = np.zeros(6, dtype=np.float64)
        params_global[:5] = flat[:5]
        params_global[5] = flat[5]
        
        raw_diff_6 = params_updated - params_global
        
        # Gradient Clipping to bound sensitivity to C = 0.2
        norm = np.linalg.norm(raw_diff_6)
        max_norm = 0.2
        if norm > max_norm:
            clipped_diff_6 = raw_diff_6 * (max_norm / norm)
        else:
            clipped_diff_6 = raw_diff_6
            
        # Add Laplace Differential Privacy noise to active parameters
        noise = np.random.laplace(0.0, max_norm / max(0.01, epsilon_step), size=6)
        private_diff_6 = clipped_diff_6 + noise
        
        # Map 6 parameters back to (10, 64) matrix structure
        private_diff = np.zeros_like(global_weights)
        diff_flat = private_diff.flatten()
        diff_flat[:6] = private_diff_6
        private_diff = diff_flat.reshape(global_weights.shape)
        
        # Evaluate local accuracy and loss on held-out validation split
        local_loss, local_accuracy = self.evaluate(global_weights + private_diff)
        
        return {
            "hospital_id": self.hospital_id,
            "hospital_name": self.name,
            "samples_processed": self.sample_count,
            "private_weight_diff": private_diff,
            "local_accuracy": local_accuracy,
            "local_loss": local_loss,
            "privacy_noise_applied": True,
            "epsilon_consumed": epsilon_step
        }
