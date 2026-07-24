# Export Feature - System Architecture & Flow Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      GENOMESECURE PLATFORM                          │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐            │
│  │  Researcher │  │   Patient   │  │   Institution    │            │
│  │   Portal    │  │   Portal    │  │   Dashboard      │            │
│  └─────────────┘  └─────────────┘  └──────────────────┘            │
│         │                                                            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │          RESEARCHER PORTAL - STUDY RESULTS          │            │
│  │                                                      │            │
│  │  Study: Rare Neurodegenerative Genomic Biomarkers  │            │
│  │  Samples: 1,204 | AUC: 0.87 | Findings: 8          │            │
│  │  Privacy Budget: ε=0.3 Used                         │            │
│  │                                                      │            │
│  │  [Export Results Button] ◄────── YOU CLICK THIS    │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │           EXPORT RESULTS DIALOG                     │            │
│  │                                                      │            │
│  │  ┌──────────────────────────────────────────────┐  │            │
│  │  │  Privacy Notice (ε=0.3, k=5, l=3)           │  │            │
│  │  └──────────────────────────────────────────────┘  │            │
│  │                                                      │            │
│  │  Select Format:                                     │            │
│  │  ○ JSON Format     ← Structured data                │            │
│  │  ○ CSV Format      ← Tabular data                   │            │
│  │  ○ Executive Summary ← Human-readable               │            │
│  │                                                      │            │
│  │  Included Data: 8 variants, 4 pathways...          │            │
│  │                                                      │            │
│  │  [Cancel]  [Export JSON] ◄────── YOU CLICK THIS    │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │         DATA GENERATION ENGINE                      │            │
│  │                                                      │            │
│  │  • generateExportData()                             │            │
│  │  • Fabricate 8 genomic variants                     │            │
│  │  • Generate pathway analysis (4 pathways)           │            │
│  │  • Calculate institutional contributions            │            │
│  │  • Add privacy metadata                             │            │
│  │  • Include compliance documentation                 │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │         FORMAT CONVERSION                           │            │
│  │                                                      │            │
│  │  JSON:    JSON.stringify(data, null, 2)            │            │
│  │  CSV:     convertToCSV(data)                        │            │
│  │  Summary: generateTextSummary(data)                 │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │         FILE DOWNLOAD                               │            │
│  │                                                      │            │
│  │  • Create Blob with correct MIME type               │            │
│  │  • Generate object URL                              │            │
│  │  • Trigger browser download                         │            │
│  │  • Filename: rs3_deidentified_results.[ext]         │            │
│  └─────────────────────────────────────────────────────┘            │
│         │                                                            │
│         ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐            │
│  │      ✓ SUCCESS MESSAGE                              │            │
│  │                                                      │            │
│  │  "Export Successful"                                │            │
│  │  "De-identified results downloaded to your device"  │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────┐
│   STUDY      │
│   RESULTS    │
│              │
│ • 1,204      │
│   samples    │
│ • 0.87 AUC   │
│ • ε=0.3      │
└──────┬───────┘
       │
       │ User clicks "Export Results"
       ▼
┌──────────────────────────────────────────────────────┐
│              EXPORT DATA STRUCTURE                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  studyMetadata                                       │
│  ├─ studyId: "rs3"                                   │
│  ├─ title: "Rare Neurodegenerative..."              │
│  ├─ researcher: "Dr. Priya Nair"                     │
│  ├─ totalSamples: 1204                               │
│  └─ privacyBudget: "ε=0.3, δ=1e-5"                  │
│                                                       │
│  privacyGuarantees                                   │
│  ├─ mechanism: "Laplace Differential Privacy"       │
│  ├─ epsilonValue: 0.3                                │
│  ├─ kAnonymity: 5                                    │
│  └─ lDiversity: 3                                    │
│                                                       │
│  statisticalSummary                                  │
│  ├─ modelPerformance                                 │
│  │  ├─ auc: 0.87                                     │
│  │  ├─ accuracy: 0.84                                │
│  │  └─ f1Score: 0.805                                │
│  ├─ cohortStatistics                                 │
│  │  ├─ totalParticipants: 1204                       │
│  │  └─ averageAge: "62.4 ± 8.3 years"               │
│  └─ qualityMetrics                                   │
│     ├─ sequencingDepth: "125X"                       │
│     └─ variantCallQuality: 0.96                      │
│                                                       │
│  genomicVariants [8 items]                           │
│  ├─ VAR_001: PSEN1 rs80357713 (OR=3.42)             │
│  ├─ VAR_002: APP rs63750066 (OR=2.89)               │
│  ├─ VAR_003: MAPT rs104893877 (OR=1.95)             │
│  ├─ VAR_004: SNCA rs113993960 (OR=1.12)             │
│  ├─ VAR_005: PSEN1 rs63751039 (OR=3.18)             │
│  ├─ VAR_006: PSEN1 rs121908231 (OR=2.76)            │
│  ├─ VAR_007: PSEN2 rs63750424 (OR=1.84)             │
│  └─ VAR_008: MAPT rs121918389 (OR=1.67)             │
│                                                       │
│  pathwayAnalysis [4 items]                           │
│  ├─ KEGG:05010 Alzheimer Disease (Score: 4.73)      │
│  ├─ GO:0006915 Apoptotic Process (Score: 3.42)      │
│  ├─ GO:0007215 Glutamate Receptor (Score: 2.98)     │
│  └─ REACTOME GABA Receptor (Score: 2.31)            │
│                                                       │
│  institutionalContributions [3 items]                │
│  ├─ Mayo Clinic: 487 samples (40.4%)                │
│  ├─ Stanford: 412 samples (34.2%)                    │
│  └─ Johns Hopkins: 305 samples (25.4%)               │
│                                                       │
│  exportMetadata                                      │
│  ├─ exportedBy: "Dr. Priya Nair"                     │
│  ├─ exportDate: "2026-03-26"                         │
│  └─ privacyCompliance: [HIPAA, GDPR, NIH, ISO]      │
│                                                       │
└──────────────────────────────────────────────────────┘
       │
       │ Format selection
       ▼
┌──────────────┬─────────────────┬────────────────────┐
│              │                 │                    │
│     JSON     │      CSV        │  EXECUTIVE SUMMARY │
│              │                 │                    │
│  Structured  │   Tabular       │  Human-readable    │
│  Complete    │   Statistical   │  Presentation      │
│  ~15-20 KB   │   ~8-10 KB      │  ~5-7 KB           │
│              │                 │                    │
│  {           │  Variant,Gene.. │  ═══════════════   │
│    "study"   │  VAR_001,PSEN1  │  EXECUTIVE SUMMARY │
│    ...       │  VAR_002,APP    │  ─────────────────  │
│  }           │  ...            │  Study: Rare...    │
│              │                 │  Samples: 1204     │
└──────┬───────┴────────┬────────┴────────┬───────────┘
       │                │                 │
       │                │                 │
       ▼                ▼                 ▼
┌──────────────────────────────────────────────────────┐
│            BROWSER DOWNLOAD API                      │
│                                                       │
│  1. Create Blob with data + MIME type                │
│  2. Generate object URL (blob:http://...)            │
│  3. Create temporary <a> element                     │
│  4. Set href = URL, download = filename              │
│  5. Programmatically click <a>                       │
│  6. Clean up: remove element, revoke URL             │
│                                                       │
└──────────────────────────────────────────────────────┘
       │
       │
       ▼
┌──────────────────────────────────────────────────────┐
│           USER'S DOWNLOADS FOLDER                    │
│                                                       │
│  📄 rs3_deidentified_results.json                    │
│  📄 rs3_deidentified_results.csv                     │
│  📄 rs3_executive_summary.txt                        │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────┐
│         ResearcherPortal Component State                │
│                                                          │
│  [activeTab]: 'results'                                  │
│  [selectedStudy]: Study object (rs3)                     │
│  [showExportDialog]: false ──���──────┐                   │
└─────────────────────────────────────┼───────────────────┘
                                      │
          User clicks "Export Results"│
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│  [showExportDialog]: true                                │
└─────────────────────────────────────┬───────────────────┘
                                      │
              Renders ExportResults component
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│           ExportResults Component State                  │
│                                                          │
│  [selectedFormat]: 'json'                                │
│  [isExporting]: false                                    │
│  [exportComplete]: false                                 │
└─────────────────────────────────────┬───────────────────┘
                                      │
              User clicks "Export JSON"
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│  [isExporting]: true ──────────────┐                    │
│  Button shows: "Exporting..."       │                    │
│  Spinner animation plays            │                    │
└─────────────────────────────────────┼───────────────────┘
                                      │
                          setTimeout(1500ms)
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│  • generateExportData()                                  │
│  • Format conversion (JSON.stringify)                    │
│  • Create Blob                                           │
│  • Download file                                         │
└─────────────────────────────────────┬───────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│  [isExporting]: false                                    │
│  [exportComplete]: true                                  │
│  Shows green success message ✓                          │
└─────────────────────────────────────┬───────────────────┘
                                      │
                    User clicks "Cancel" or "X"
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────┐
│  onClose() → setShowExportDialog(false)                 │
│  Dialog closes, returns to results view                 │
└─────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.tsx
└─ ResearcherPortal.tsx
   ├─ DefineStudy.tsx
   ├─ DiscoverPartners.tsx
   ├─ FederatedAnalysis.tsx
   └─ ExportResults.tsx ◄─────── NEW COMPONENT
      ├─ Privacy Notice Section
      ├─ Format Selection (Radio Buttons)
      │  ├─ JSON Format Option
      │  ├─ CSV Format Option
      │  └─ Summary Format Option
      ├─ Data Elements Preview
      ├─ Compliance Notice
      ├─ Success Message (conditional)
      └─ Action Buttons
         ├─ Cancel Button
         └─ Export Button (with loading state)
```

---

## Privacy Data Flow

```
┌────────────────────────────────────────────────────┐
│      RAW STUDY DATA (Protected)                    │
│                                                     │
│  Individual patient genomic sequences              │
│  Personal identifiers (names, SSNs, etc.)          │
│  Exact clinical measurements                       │
│  Precise timestamps                                │
│  Institutional IDs                                 │
└─────────────────┬──────────────────────────────────┘
                  │
                  │ Federated Analysis Agent
                  ▼
┌────────────────────────────────────────────────────┐
│   AGGREGATED ANALYSIS RESULTS (ε-DP Applied)       │
│                                                     │
│  Variant frequencies (noise added)                 │
│  Odds ratios (calibrated)                          │
│  P-values (significance preserved)                 │
│  Cohort statistics (k-anonymity enforced)          │
│  Institutional totals (l-diversity checked)        │
└─────────────────┬──────────────────────────────────┘
                  │
                  │ Privacy Guard Agent
                  │ • Add Laplace noise (ε=0.3)
                  │ • Enforce k-anonymity (k≥5)
                  │ • Check l-diversity (l≥3)
                  │ • Remove identifiers
                  ▼
┌────────────────────────────────────────────────────┐
│    DE-IDENTIFIED EXPORT DATA (Public Safe)         │
│                                                     │
│  ✓ Anonymized study ID                             │
│  ✓ Aggregated variant statistics                   │
│  ✓ Privacy-preserved odds ratios                   │
│  ✓ Group-level demographics                        │
│  ✓ Institutional contribution metrics              │
│  ✓ Compliance metadata                             │
│                                                     │
│  ✗ No individual patient data                      │
│  ✗ No personal identifiers                         │
│  ✗ No reconstruction possible                      │
└────────────────────────────────────────────────────┘
```

---

## Security & Compliance Stack

```
                    ┌─────────────────┐
                    │  EXPORT FILES   │
                    │  (Public Safe)  │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐     ┌──────▼─────┐    ┌──────▼─────┐
    │   HIPAA   │     │    GDPR    │    │ NIH Policy │
    │ Compliant │     │ Compliant  │    │ Adherent   │
    └───────────┘     └────────────┘    └────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   ISO 27001     │
                    │   Certified     │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐     ┌──────▼─────┐    ┌──────▼─────┐
    │Differential│     │K-Anonymity │    │L-Diversity │
    │  Privacy   │     │   k = 5    │    │   l = 3    │
    │  ε = 0.3   │     │            │    │            │
    └───────────┘     └────────────┘    └────────────┘
```

---

## File Format Comparison Matrix

```
╔══════════════╦══════════╦══════════╦══════════════════╗
║  Feature     ║   JSON   ║   CSV    ║ Executive Summary║
╠══════════════╬══════════╬══════════╬══════════════════╣
║ File Size    ║ 15-20 KB ║ 8-10 KB  ║ 5-7 KB           ║
║ Structure    ║ Nested   ║ Tabular  ║ Text             ║
║ Readable     ║ Medium   ║ Low      ║ High             ║
║ Parseable    ║ High     ║ High     ║ Low              ║
║ API Ready    ║ Yes      ║ No       ║ No               ║
║ Excel Ready  ║ No       ║ Yes      ║ No               ║
║ Print Ready  ║ No       ║ No       ║ Yes              ║
║ Complete     ║ 100%     ║ 95%      ║ 85%              ║
║ Audience     ║ Devs     ║ Analysts ║ Executives       ║
╚══════════════╩══════════╩══════════╩══════════════════╝
```

---

*This architecture ensures privacy-preserving data sharing while maintaining scientific utility and regulatory compliance.*
