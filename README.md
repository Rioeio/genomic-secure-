# GenomicSecure 🧬

> **Privacy-Preserving Federated Genomic Research & Medical Data Transfer Platform**
> 
> *An open-source, multi-agent federated learning framework created by **Manoj** for secure biomedical collaboration and privacy-preserved genomic research.*

---

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Framework: Vite + React](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%20%7C%20TypeScript-blue.svg)](https://vitejs.dev/)
[![Backend: Python FastAPI](https://img.shields.io/badge/Backend-Python%20%7C%20FastAPI%20%7C%20PyTorch-green.svg)](https://fastapi.tiangolo.com/)
[![Genomics: Ensembl GRCh38](https://img.shields.io/badge/Genomics-Ensembl%20GRCh38%20%7C%20dbSNP-emerald.svg)](https://rest.ensembl.org/)

---

## 📌 Problem Statement & Core Vision

Medical research requires large genomic and clinical health datasets, but strict data privacy regulations (**HIPAA**, **GDPR**, **NIH Genomic Data Sharing Policy**) prevent hospitals from sharing raw patient records. This creates isolated **data silos**, leads to duplicated research efforts, and slows down therapeutic breakthroughs.

**GenomicSecure** solves this critical barrier by providing an **open-source, multi-agent federated learning shell**. Instead of centralizing sensitive patient data, researchers dispatch AI model architectures to participating hospital nodes. Local hospital servers train model weights on private datasets and return **differential privacy-preserved gradient updates**, ensuring **zero raw data exposure**.

---

## 🏛️ Multi-Agent Architecture & Key Roles

GenomicSecure coordinates four specialized autonomous agents across institutional boundaries:

```
+-----------------------------------------------------------------------------------+
|                            GENOMICSECURE PLATFORM                                 |
+--------------------------+--------------------------+-----------------------------+
|    🔬 RESEARCHER PORTAL  |  🛡️ PATIENT CONSENT APP   | 🏥 INSTITUTION DASHBOARD    |
| - Study Definition       | - My Genomic Records     | - Local Dataset Vault       |
| - Partner Discovery      | - Granular Consent Matrix| - DP Budget Allocation (ε)  |
| - Live FL Training Sim   | - Access Revocation      | - FL Worker Sync Status     |
| - GWAS & Manhattan Plot  | - Real-time Audit Trail  | - Enclave Attestation       |
+--------------------------+--------------------------+-----------------------------+
|                        🤖 MULTI-AGENT ORCHESTRATION ENGINE                        |
|  Federated Agent  |  Privacy Guard Agent  |  Consent Agent  | Discovery Agent     |
+-----------------------------------------------------------------------------------+
```

1. 🤖 **Federated Learning Agent**: Coordinates distributed PyTorch model training across hospital nodes using **Federated Averaging (FedAvg)** without transferring raw VCF/FASTQ datasets.
2. 🛡️ **Privacy Guard Agent**: Enforces **Laplace Differential Privacy** ($\text{Noise} \sim \text{Laplace}(0, \Delta f / \epsilon)$), injecting calibrated noise into model weight updates to mathematically eliminate re-identification risks.
3. 👤 **Consent Manager Agent**: Manages zero-knowledge dynamic patient consent. Intercepts local training batch generation and instantly excludes samples when a patient revokes access.
4. 🔍 **Research Discovery Agent**: Queries metadata across hospital nodes to evaluate statistical power and cohort feasibility prior to training.

---

## 🧬 Integrated Open-Source Biological Datasets

GenomicSecure incorporates **real human genomic variant datasets** fetched directly from official databases:
* **Ensembl Human Genome Assembly (GRCh38)**: REST API queries for exact base-pair coordinates, chromosome locations, and allele strings.
* **NCBI dbSNP**: Reference SNP accession numbers (`rsIDs`) for major disease loci.
* **ClinVar Database**: Evidence-based pathogenicity classifications (*Pathogenic*, *Risk Factor*, *Likely Pathogenic*).

---

## ⚡ Quick Start (Simultaneous Frontend & Backend Execution)

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [Python (v3.9+)](https://www.python.org/)

### 🚀 One-Command Launch (Windows)
Open PowerShell or Command Prompt, navigate to the folder, and run:

```powershell
cd C:\genomicsecure
.\start.bat
```

This single command automatically launches:
1. **Python FastAPI AI Backend**: `http://127.0.0.1:8000`
2. **Vite React Frontend**: `http://localhost:5173/`

---

## 📜 License

Distributed under the **MIT License**. Created by **Manoj**.