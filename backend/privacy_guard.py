import numpy as np

class PrivacyGuardEngine:
    def __init__(self, epsilon_total: float = 10.0, delta: float = 1e-5):
        self.epsilon_total = epsilon_total
        self.epsilon_used = 0.0
        self.delta = delta

    def add_laplace_noise_to_weights(self, weights: np.ndarray, sensitivity: float = 1.0, epsilon: float = 0.3) -> np.ndarray:
        """
        Applies Laplace noise to gradient weight updates:
        Noise ~ Laplace(0, Sensitivity / Epsilon)
        """
        if self.epsilon_used + epsilon > self.epsilon_total:
            raise ValueError(f"Privacy budget exceeded! Used: {self.epsilon_used:.2f}/{self.epsilon_total:.2f}")
        
        scale = sensitivity / max(epsilon, 1e-5)
        noise = np.random.laplace(0, scale, size=weights.shape)
        noisy_weights = weights + noise
        
        # Track epsilon consumption
        self.epsilon_used += epsilon
        return noisy_weights

    def get_budget_status(self) -> dict:
        return {
            "epsilon_total": self.epsilon_total,
            "epsilon_used": round(self.epsilon_used, 4),
            "epsilon_remaining": round(self.epsilon_total - self.epsilon_used, 4),
            "delta": self.delta,
            "re_id_risk_score": f"{min(99.9, max(0.1, (self.epsilon_used / self.epsilon_total) * 100)):.2f}%"
        }
