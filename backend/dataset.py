import numpy as np

DATASET_TYPE = "documented_synthetic"
DATASET_DESCRIPTION = "Documented synthetic multi-locus genomic variant dataset (5 loci: rs1799966, rs80357711, rs7903146, rs429358, rs1042522) with known ground-truth risk weights."

def generate_genomic_dataset(num_samples: int = 3600, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    """
    Generates a synthetic genomic dataset with ground-truth risk relationship.
    Features X: 5 variant dosages in {0, 1, 2}.
    Target y: binary disease status {0, 1} (balanced).
    """
    np.random.seed(seed)
    
    # Minor allele frequencies for 5 loci
    mafs = np.array([0.25, 0.15, 0.35, 0.20, 0.30])
    
    # Generate allele dosages (0, 1, 2) based on Hardy-Weinberg equilibrium
    X = np.zeros((num_samples, 5), dtype=np.float64)
    for j, p in enumerate(mafs):
        q = 1.0 - p
        probs = [q**2, 2*p*q, p**2]
        X[:, j] = np.random.choice([0, 1, 2], size=num_samples, p=probs)
    
    # True ground-truth risk effect coefficients (log-odds ratios)
    true_weights = np.array([0.8, 1.5, 0.6, 0.9, -0.4])
    
    raw_logits = np.dot(X, true_weights)
    # Use median split to ensure 50-50 balanced binary outcome labels
    median_logit = np.median(raw_logits)
    probs = 1.0 / (1.0 + np.exp(-(raw_logits - median_logit)))
    y = (probs >= 0.5).astype(np.float64)
    
    return X, y

def get_hospital_shards(seed: int = 42) -> dict:
    """
    Splits dataset heterogeneously across 3 hospital nodes + 1 global test set.
    """
    X, y = generate_genomic_dataset(num_samples=3600, seed=seed)
    
    # Shuffle dataset indices
    np.random.seed(seed)
    indices = np.random.permutation(len(X))
    X, y = X[indices], y[indices]
    
    # Shard allocations: Node 1 (1200), Node 2 (800), Node 3 (1000), Global Test (600)
    shards = {
        "dataset_type": DATASET_TYPE,
        "description": DATASET_DESCRIPTION,
        "nodes": {
            "node-1": {
                "name": "Metro General Genomic Vault",
                "X_train": X[:1000], "y_train": y[:1000],
                "X_val": X[1000:1200], "y_val": y[1000:1200]
            },
            "node-2": {
                "name": "St. Jude Children's Research",
                "X_train": X[1200:1800], "y_train": y[1200:1800],
                "X_val": X[1800:2000], "y_val": y[1800:2000]
            },
            "node-3": {
                "name": "Apex Precision Health & Biobank",
                "X_train": X[2000:2800], "y_train": y[2000:2800],
                "X_val": X[2800:3000], "y_val": y[2800:3000]
            }
        },
        "global_test": {
            "X_test": X[3000:],
            "y_test": y[3000:]
        }
    }
    return shards
