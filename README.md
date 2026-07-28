# GenomicSecure

## Privacy-Preserving Federated Genomic Research & Medical Data Transfer Platform

An open-source, multi-agent federated learning framework and application shell created by **Manoj** for secure biomedical collaboration, privacy-preserved genomic research, and confidential medical data exchange.

---

## 1. Executive Summary & Problem Statement

Medical research requires access to large-scale genomic and clinical health datasets to identify disease markers, validate therapeutic targets, and develop polygenic risk models. However, strict data privacy regulations, including the Health Insurance Portability and Accountability Act (HIPAA), the General Data Protection Regulation (GDPR), and the National Institutes of Health (NIH) Genomic Data Sharing Policy, prohibit institutions from centralizing raw patient data.

This regulatory barrier creates isolated institutional data silos, leading to redundant research efforts, smaller sample sizes, and delayed medical breakthroughs.

GenomicSecure addresses this challenge by providing an open-source federated learning shell. Instead of transferring raw genomic data to a central repository, researchers dispatch AI model architectures to participating hospital nodes. Local hospital servers train model weights on private datasets behind institutional firewalls and return differential privacy-preserved gradient updates. The platform aggregates these updates into a global model without exposing raw patient data.

---

## 2. Multi-Agent System Architecture

GenomicSecure coordinates four specialized autonomous agents across institutional boundaries:

```
+-----------------------------------------------------------------------------------+
|                            GENOMICSECURE PLATFORM                                 |
+--------------------------+--------------------------+-----------------------------+
|     RESEARCHER PORTAL    |    PATIENT CONSENT APP   |    INSTITUTION DASHBOARD    |
| - Study Definition       | - My Genomic Records     | - Local Dataset Vault       |
| - Partner Discovery      | - Granular Consent Matrix| - DP Budget Allocation (ε)  |
| - Live FL Training Sim   | - Access Revocation      | - FL Worker Sync Status     |
| - GWAS & Manhattan Plot  | - Real-time Audit Trail  | - Enclave Attestation       |
+--------------------------+--------------------------+-----------------------------+
|                        MULTI-AGENT ORCHESTRATION ENGINE                           |
|  Federated Agent  |  Privacy Guard Agent  |  Consent Agent  | Discovery Agent     |
+-----------------------------------------------------------------------------------+
```

### Agent Roles & Specifications:

1. **Federated Learning Agent**: Coordinates distributed model training across hospital nodes using Federated Averaging (FedAvg). Collects local PyTorch model weight updates without transferring raw VCF, FASTQ, or BAM files.
2. **Privacy Guard Agent**: Enforces Laplace Differential Privacy by injecting calibrated noise into gradient updates:
   $$\text{Noise} \sim \text{Laplace}\left(0, \frac{\Delta f}{\epsilon}\right)$$
   Ensures that mathematical privacy guarantees ($\epsilon, \delta$) are maintained, eliminating patient re-identification and membership inference risks.
3. **Consent Manager Agent**: Manages zero-knowledge dynamic patient consent preferences. Intercepts local training batch generation and excludes patient samples if access has been revoked.
4. **Research Discovery Agent**: Queries metadata schemas across institutional nodes to evaluate statistical power and cohort feasibility prior to launching federated training rounds.

---

## 3. Real Gradient Descent Training & Data Engine (Task 1)

Unlike naive simulations, GenomicSecure executes **real local gradient descent optimization** and evaluates model metrics against held-out validation and test sets:

* **Documented Synthetic Dataset (`backend/dataset.py`)**: Generates multi-locus variant dosage features (`rs1799966`, `rs80357711`, `rs7903146`, `rs429358`, `rs1042522`) with ground-truth odds ratios and balanced target labels. Shards data heterogeneously across hospital nodes (`Metro General`, `St. Jude`, `Apex Biobank`) with distinct training (`X_train`, `y_train`) and validation (`X_val`, `y_val`) splits, plus a global held-out test set (`X_test`, `y_test`).
* **Local Hospital Optimization (`backend/hospital_client.py`)**: Local hospital workers compute gradient updates ($\mathbf{w} \leftarrow \mathbf{w} - \eta \nabla \mathcal{L}$) on their local shard, clip weight diffs ($\Delta \mathbf{w}$) to bound sensitivity ($C = 0.2$), and apply Laplace Differential Privacy noise.
* **Server Aggregation & Metrics (`backend/server.py`)**: The central aggregator applies weighted FedAvg and evaluates loss and accuracy dynamically against real held-out predictions (`X_test`, `y_test`), eliminating all hardcoded formulas.
* **Explicit Dataset Declaration**: All API responses and code modules explicitly declare `"dataset_type": "documented_synthetic"`.

---

## 4. API Security, Authentication & Role Checks (Task 2)

All API endpoints are locked down against unauthorized access, raw model leakage, and cross-site requests:

* **Token-Based Authentication**: All `/api/fl/*` routes require a Bearer token in the `Authorization` header (`Authorization: Bearer <token>`). Requests without valid tokens return `HTTP 401 Unauthorized`.
* **Role-Based Access Control (RBAC)**: Gated `/api/fl/model-inspect` strictly behind the `researcher` role token (`researcher-token-secret`). Requests from non-researcher roles return `HTTP 403 Forbidden`.
* **Strict CORS Whitelist**: Removed wildcard `allow_origins=["*"]`. Restricted allowed origins to explicit trusted URLs (`http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`). Preflight requests from unlisted domains are rejected.
* **Rate Limiting**: Sliding-window rate limiting enforced on `/api/fl/run-round` and `/api/fl/predict`.

---

## 5. Biological Data Sources & Genomic Specifications

GenomicSecure integrates human genomic variant datasets fetched from official open-source biological databases:

* **Ensembl Human Genome Assembly (GRCh38)**: REST API integration for base-pair coordinates, chromosome locations, and reference/alternate allele sequences.
* **NCBI dbSNP (Database of Single Nucleotide Polymorphisms)**: Reference SNP accession numbers (`rsIDs`) for major disease loci.
* **ClinVar Database**: Evidence-based clinical significance classifications (*Pathogenic*, *Likely Pathogenic*, *Risk Factor*, *Uncertain Significance*).

### Featured Loci & Disease Cohorts:

| Disease Locus | Key Genes | Reference rsIDs | GRCh38 Chromosomal Location | Clinical Significance |
| :--- | :--- | :--- | :--- | :--- |
| **Oncology (Breast & Ovarian)** | `BRCA1`, `BRCA2`, `TP53` | `rs80357711`, `rs80357914`, `rs28897672`, `rs1042522` | Chr 17 (`43,091,496`), Chr 13 (`32,398,489`) | Pathogenic / Risk Factor |
| **Type 2 Diabetes (GWAS)** | `TCF7L2`, `PPARG` | `rs7903146`, `rs12255372`, `rs1801282` | Chr 10 (`112,998,590`), Chr 3 (`12,351,626`) | Significant Risk Locus |
| **Cardiovascular Risk** | `APOE`, `PCSK9`, `LDLR` | `rs429358`, `rs7412`, `rs11591147` | Chr 19 (`44,908,684`), Chr 1 (`55,039,984`) | Pathogenic / High Risk |
| **Rare Diseases** | `CFTR`, `PSEN1`, `APP` | `rs113993960`, `rs80357713`, `rs63750066` | Chr 7 (`117,559,591`), Chr 14 (`73,173,740`) | Pathogenic Indels |

---

## 6. How the Platform Functions as a Customizable Open-Source Shell

GenomicSecure is designed as an extensible shell and framework. Organizations can clone, modify, and integrate their own infrastructure into the shell:

### Extending the Python Backend (`backend/`)
* **Federated Algorithms (`backend/server.py`)**: Replace default FedAvg with FedProx, FedOpt, or Secure Multi-Party Computation (MPC).
* **Differential Privacy Parameters (`backend/privacy_guard.py`)**: Customize Laplace or Gaussian noise scale factor calculations and set custom total $\epsilon$ budget limits.
* **Custom Dataset Connectors (`backend/hospital_client.py`)**: Replace local synthetic dataset loader with real genomic file parsers (VCF, BAM, FASTQ) or Electronic Health Record (EHR) databases.

### Extending the Web Interface (`src/`)
* **Custom Institutional Branding**: Modify theme tokens and institutional node identifiers.
* **Additional Research Domains**: Add custom study templates and variant visualization plots for new target diseases.

---

## 7. System Execution & Operational Commands

### Prerequisites
* **Node.js**: Version 18.0 or higher
* **Python**: Version 3.9 or higher with `fastapi`, `uvicorn`, `numpy`, `pydantic`, `httpx` installed

---

### Option A: One-Command Launch (Simultaneous Execution)

To start both the Python FastAPI AI Backend and the React Web Frontend simultaneously on Windows:

```powershell
cd C:\genomicsecure
.\start.bat
```

Or using PowerShell:

```powershell
cd C:\genomicsecure
.\start.ps1
```

Access the application in your browser:
* **Web Frontend**: `http://localhost:5173/`
* **Python API Server**: `http://127.0.0.1:8000/`

---

### Option B: Manual Execution (Separate Terminal Processes)

#### Terminal 1: Python FastAPI AI Backend Server
```powershell
cd C:\genomicsecure
python backend/app.py
```
*Listens on `http://127.0.0.1:8000`*

#### Terminal 2: React Web Frontend Application
```powershell
cd C:\genomicsecure
cmd /c npm run dev
```
*Listens on `http://localhost:5173`*

---

## 8. API Endpoint Documentation

The Python FastAPI backend exposes the following REST endpoints:

* `GET /` — Public health check, active node status, and dataset metadata.
* `GET /api/fl/model-inspect` — Requires `Authorization: Bearer researcher-token-secret`. Returns global model weight matrix tensors ($10 \times 64$ grid slice), mean weight, and standard deviation.
* `POST /api/fl/run-round` — Requires `Authorization: Bearer <token>`. Triggers one round of FedAvg model training across hospital workers with Laplace DP noise.
* `POST /api/fl/predict` — Requires `Authorization: Bearer <token>`. Accepts a patient genomic variant vector and computes disease risk predictions via global model weights.
* `GET /api/fl/history` — Requires `Authorization: Bearer <token>`. Retrieves training metrics (loss, accuracy, privacy budget) across completed rounds.
* `POST /api/fl/reset` — Requires `Authorization: Bearer <token>`. Resets FL server aggregator instance.
* `GET /api/genomics/real-variants` — Public endpoint serving GRCh38 genomic variant records.

---

## 9. Project File Structure

```
genomicsecure/
├── backend/                        # Python FastAPI & PyTorch Federated Engine
│   ├── app.py                      # Authenticated REST API endpoints & security middleware
│   ├── dataset.py                  # Documented synthetic genomic dataset generator & sharding
│   ├── hospital_client.py          # Local Hospital Worker with real logistic gradient descent
│   ├── privacy_guard.py            # Differential Privacy Laplace Noise engine
│   ├── server.py                   # Federated Aggregator (FedAvg engine)
│   ├── test_task1.py               # Automated verification suite for Task 1
│   └── test_task2.py               # Automated security verification suite for Task 2
├── scripts/
│   └── fetch_real_genomics.py      # Script to pull variants from Ensembl REST API
├── src/
│   ├── app/
│   │   ├── components/             # React UI components (Researcher, Patient, Institution)
│   │   ├── realGenomicDataset.json # 38 Real Ensembl GRCh38 genomic variants
│   │   └── realGenomicDatasets.ts  # Dataset mapping & biobank schemas
│   └── main.tsx                    # React application entrypoint
├── start.bat                       # One-click Windows CMD launch script
├── start.ps1                       # One-click Windows PowerShell launch script
└── package.json                    # Dependencies & build scripts
```

---

## 10. License

Distributed under the **MIT License**. Created by **Manoj**.