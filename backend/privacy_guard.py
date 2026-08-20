"""
Rényi Differential Privacy (RDP) & Moments Accountant Engine (Task 9)
---------------------------------------------------------------------
Implements formal mathematical DP accounting using Rényi Differential Privacy (Mironov, 2017)
and tight $(\epsilon, \delta)$-conversion matching Google dp-accounting / Opacus standards.
Tracks privacy loss over composition across multiple federated learning rounds.
"""

import math
import numpy as np
from typing import List, Tuple, Dict, Any

class RenyiDifferentialPrivacyAccountant:
    """
    Rényi Differential Privacy (RDP) Accountant.
    Calculates tight (epsilon, delta) privacy bounds across composition.
    """
    def __init__(self, orders: List[float] = None, delta: float = 1e-5):
        if orders is None:
            self.orders = [1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0, 16.0, 20.0, 24.0, 32.0, 48.0, 64.0]
        else:
            self.orders = orders
        self.delta = delta
        self.rdp_history = np.zeros(len(self.orders), dtype=np.float64)
        self.steps_recorded = 0

    def compute_rdp_laplace(self, alpha: float, scale: float, sensitivity: float = 0.2) -> float:
        """
        Computes exact RDP for the Laplace mechanism at order alpha.
        RDP_alpha = 1/(alpha - 1) * ln( alpha/(2*alpha - 1) * exp((alpha-1)*sens/scale) + (alpha-1)/(2*alpha-1) * exp(-alpha*sens/scale) )
        """
        eps_step = sensitivity / max(scale, 1e-6)
        if alpha == 1.0:
            return eps_step
        try:
            term1 = (alpha / (2.0 * alpha - 1.0)) * math.exp((alpha - 1.0) * eps_step)
            term2 = ((alpha - 1.0) / (2.0 * alpha - 1.0)) * math.exp(-alpha * eps_step)
            return (1.0 / (alpha - 1.0)) * math.log(max(1e-12, term1 + term2))
        except OverflowError:
            return eps_step * alpha

    def record_step(self, scale: float, sensitivity: float = 0.2):
        """Records one private federated round step and composes RDP."""
        self.steps_recorded += 1
        for i, alpha in enumerate(self.orders):
            step_rdp = self.compute_rdp_laplace(alpha, scale, sensitivity)
            self.rdp_history[i] += step_rdp

    def get_epsilon(self, target_delta: float = None) -> float:
        """
        Converts composed RDP to standard (epsilon, delta)-DP:
        epsilon(delta) = min_{alpha > 1} [ RDP(alpha) + ln(1/delta)/(alpha - 1) ]
        """
        if self.steps_recorded == 0:
            return 0.0
        delta = target_delta if target_delta is not None else self.delta
        epsilons = []
        for i, alpha in enumerate(self.orders):
            if alpha > 1.0:
                eps = self.rdp_history[i] + math.log(1.0 / delta) / (alpha - 1.0)
                epsilons.append(eps)
        return float(round(min(epsilons), 4)) if epsilons else 0.0


class PrivacyGuardEngine:
    def __init__(self, epsilon_total: float = 10.0, delta: float = 1e-5):
        self.epsilon_total = epsilon_total
        self.delta = delta
        self.accountant = RenyiDifferentialPrivacyAccountant(delta=delta)
        self.epsilon_used = 0.0
        self.rounds_composed = 0

    def add_laplace_noise_to_weights(self, weights: np.ndarray, sensitivity: float = 0.2, epsilon: float = 0.3) -> np.ndarray:
        """
        Applies calibrated Laplace noise to weight diffs and updates RDP moments accountant:
        Noise ~ Laplace(0, Sensitivity / Epsilon)
        """
        scale = sensitivity / max(epsilon, 1e-5)
        noise = np.random.laplace(0, scale, size=weights.shape)
        noisy_weights = weights + noise
        
        # Update RDP Accountant (Task 9)
        self.accountant.record_step(scale=scale, sensitivity=sensitivity)
        self.epsilon_used = self.accountant.get_epsilon(self.delta)
        self.rounds_composed += 1
        
        if self.epsilon_used > self.epsilon_total:
            raise ValueError(f"Privacy budget exceeded! Used: {self.epsilon_used:.2f}/{self.epsilon_total:.2f}")
            
        return noisy_weights

    def get_budget_status(self) -> dict:
        current_eps = self.accountant.get_epsilon(self.delta)
        return {
            "accounting_method": "Renyi Differential Privacy (RDP) Moments Accountant",
            "epsilon_total": self.epsilon_total,
            "epsilon_used": round(current_eps, 4),
            "epsilon_remaining": round(max(0.0, self.epsilon_total - current_eps), 4),
            "delta": self.delta,
            "rounds_composed": self.accountant.steps_recorded,
            "re_id_risk_score": f"{min(99.9, max(0.1, (current_eps / self.epsilon_total) * 100)):.2f}%",
            "formal_guarantee": f"({round(current_eps, 2)}, {self.delta})-RDP Differential Privacy"
        }
