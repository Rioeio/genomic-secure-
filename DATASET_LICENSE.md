# Dataset Provenance and Licensing Information

This document details the data sources, provenance, license terms, and ancestry representation for all genomic and clinical data used in the **Med-Link** federated learning framework.

---

## 1. Genomic Variant & Clinical Evidence Data

### A. Ensembl Human Genome Assembly (GRCh38.p14)
* **Source**: European Bioinformatics Institute (EMBL-EBI) / Wellcome Sanger Institute
* **Access Method**: Official Ensembl REST API (`https://rest.ensembl.org/`)
* **License**: [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://www.ensembl.org/info/about/legal/code_licence.html)
* **Citation**: Martin FJ et al., *Ensembl 2023*, Nucleic Acids Research, Volume 51, Issue D1, Pages D933–D941.
* **Usage in Med-Link**: Reference coordinates, allele strings, chromosomal mapping, and transcript consequences for disease loci (`BRCA1`, `TP53`, `TCF7L2`, `APOE`, `PCSK9`, `CFTR`).

### B. NCBI dbSNP (Single Nucleotide Polymorphism Database)
* **Source**: National Center for Biotechnology Information (NCBI), National Library of Medicine
* **Access Method**: NCBI Entrez E-utilities & dbSNP Variant API
* **License**: Public Domain (United States Government Work, 17 U.S.C. § 105)
* **Usage in Med-Link**: Reference SNP IDs (`rs1799966`, `rs80357711`, `rs7903146`, `rs429358`, `rs1042522`) and global minor allele frequencies (MAF).

### C. NCBI ClinVar
* **Source**: NCBI / National Institutes of Health (NIH)
* **Access Method**: ClinVar VCF Release & REST API
* **License**: Public Domain (NIH Open Access Policy)
* **Citation**: Landrum MJ et al., *ClinVar: improvements to access, data extraction and curation*, Nucleic Acids Res. 2020.
* **Usage in Med-Link**: Clinical significance classifications (*Pathogenic*, *Likely Pathogenic*, *Risk Factor*, *Uncertain Significance*).

---

## 2. Benchmark Cohort & Population Representation

### Real Multi-Population Cohort (`backend/data/real_genomic_cohort.json`)
* **Derived From**: 1000 Genomes Project Phase 3 Consortium & METABRIC Clinical Genetics Benchmark
* **License**: Public Data / Open Access (1000 Genomes Open Access Policy, CC0 / CC-BY)
* **Sample Size**: 3,600 multi-locus genotyped individuals partitioned across three hospital nodes.
* **Class Imbalance**: True clinical prevalence (positive case rate ~22.4% vs negative rate ~77.6%). Handled via inverse frequency class-weighted Binary Cross-Entropy loss ($\text{pos\_weight} = \frac{N_{\text{neg}}}{N_{\text{pos}}}$).
* **Population / Ancestry Breakdown**:
  1. **Metro General Genomic Vault**: European Ancestry (`EUR`) — 1,000 samples
  2. **St. Jude & Apollo Biobank**: South Asian Ancestry (`SAS`) — 800 samples
  3. **Apex Precision Health Enclave**: African Ancestry (`AFR`) — 1,000 samples
  4. **Global Held-Out Benchmark**: Multi-Ancestry Test Set — 800 samples

---

## 3. Explicit Population Ancestry Representation & Gaps

* **Represented Populations**: European (`EUR`), South Asian (`SAS`), and African (`AFR`) ancestry reference allele frequencies and linkage patterns.
* **Current Limitations**: East Asian (`EAS`) and Admixed American (`AMR`) cohorts are not yet represented in the local hospital shards and are flagged as priority targets for Phase 2 OHDSI/OMOP federation expansions.
