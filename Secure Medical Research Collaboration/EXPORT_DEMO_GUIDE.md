# Export Feature Demo Guide

## Quick Start for Jury Presentation

### Step 1: Login to Researcher Portal
1. Open the application
2. Click "Researcher" domain tab at the top
3. Use any of these quick-fill credentials:
   - Dr. Sarah Chen (Johns Hopkins)
   - Dr. Marcus Webb (MGH Harvard)
   - Dr. Priya Nair (Mayo Clinic)
4. Click "Sign In"

### Step 2: Navigate to Completed Study
1. The "My Studies" tab will show all research studies
2. Look for the **completed** study badge (white background with border)
3. Study available: **"Rare Neurodegenerative Genomic Biomarkers"**
4. Click the **"View Results"** button on the right side

### Step 3: Access Study Results
You'll see a comprehensive results page with:
- **Summary statistics**: 1,204 patients, 0.87 AUC, 23 biomarkers, 8 significant findings
- **Privacy badge**: Green badge showing ε=0.3 privacy budget used
- **Genomic variants table**: 4 key variants displayed (PSEN1, APP, MAPT, SNCA)
- **Privacy verification**: Explanation of differential privacy guarantees

### Step 4: Export De-Identified Results
1. Click the **"Export Results"** button (top-right corner with download icon)
2. Export dialog opens with three format options:

#### Option A: JSON Format (Recommended for APIs)
- Complete structured data
- All 8 variants with detailed metadata
- Pathway analysis with 4 enriched pathways
- Institutional contributions
- Privacy guarantees and compliance info
- **File**: `rs3_deidentified_results.json`

#### Option B: CSV Format (For Statistical Analysis)
- Excel/R/Python compatible
- Separate tables for variants, pathways, institutions
- Statistical summary included
- **File**: `rs3_deidentified_results.csv`

#### Option C: Executive Summary (For Presentations)
- Human-readable text report
- Perfect for stakeholder presentations
- Includes all key findings and privacy details
- **File**: `rs3_executive_summary.txt`

### Step 5: Review Export Contents

The export includes:

✅ **Study Metadata**
- Study ID, title, researcher, institutions
- 1,204 samples across 3 medical centers
- Privacy budget: ε=0.3, δ=1e-5

✅ **Privacy Guarantees**
- Laplace Differential Privacy mechanism
- K-anonymity = 5
- L-diversity = 3
- Noise calibration details

✅ **8 Genomic Variants**
- Complete variant details (rsID, chromosome, position)
- Gene names (PSEN1, APP, MAPT, SNCA, PSEN2)
- Protein changes
- Clinical significance (Pathogenic, Likely Pathogenic, etc.)
- Odds ratios with confidence intervals
- P-values (all significant)

✅ **4 Pathway Analysis Results**
- Alzheimer Disease Pathway (KEGG:05010)
- Apoptotic Process Regulation (GO:0006915)
- Glutamate Receptor Signaling (GO:0007215)
- GABA Receptor Activation (REACTOME)

✅ **Model Performance**
- AUC: 0.87
- Accuracy: 0.84
- Precision: 0.82
- Recall: 0.79
- F1 Score: 0.805

✅ **Institutional Contributions**
- Mayo Clinic: 487 samples (40.4%)
- Stanford Med Center: 412 samples (34.2%)
- Johns Hopkins: 305 samples (25.4%)

✅ **Compliance Information**
- HIPAA, GDPR, NIH Genomic Data Sharing Policy
- ISO 27001 certification
- Intended use documentation

---

## Key Demo Talking Points

### For Privacy & Security Focus
> "All exported data has been processed through Laplace differential privacy with epsilon 0.3, ensuring individual patient records cannot be reconstructed. We enforce k-anonymity of 5 and l-diversity of 3 across all aggregated metrics."

### For Research Collaboration Focus
> "This export contains findings from 1,204 genomic samples across three major medical institutions—Mayo Clinic, Stanford, and Johns Hopkins—demonstrating truly federated research at scale."

### For Data Quality Focus
> "Our study achieved 0.87 AUC with 125X mean sequencing coverage and identified 8 statistically significant variants, including pathogenic variants in PSEN1, APP, and MAPT genes associated with neurodegenerative diseases."

### For Compliance Focus
> "The export is fully compliant with HIPAA, GDPR, and NIH Genomic Data Sharing Policy. Each file includes comprehensive metadata documenting privacy mechanisms and intended use restrictions."

### For Pathway Enrichment Focus
> "Beyond individual variants, we identified 4 significantly enriched biological pathways, including the Alzheimer Disease Pathway with an enrichment score of 4.73 and adjusted p-value of 1.2e-8."

---

## Demonstration Flow (30 seconds)

1. **[5s]** "Let me show you our de-identified results export feature..."
2. **[5s]** Navigate to completed study → Click "View Results"
3. **[5s]** "Here are our findings: 1,204 samples, 8 significant variants, all privacy-protected..."
4. **[5s]** Click "Export Results" → Show three format options
5. **[5s]** Select JSON format → Click "Export JSON"
6. **[5s]** "File downloaded with complete differential privacy guarantees and compliance documentation."

---

## Sample Export Preview (JSON snippet)

```json
{
  "studyMetadata": {
    "studyId": "rs3",
    "title": "Rare Neurodegenerative Genomic Biomarkers",
    "totalSamples": 1204,
    "privacyBudget": "ε=0.3, δ=1e-5",
    "participatingInstitutions": [
      "Mayo Clinic Research",
      "Stanford Med Center",
      "Johns Hopkins Medical"
    ]
  },
  "privacyGuarantees": {
    "mechanism": "Laplace Differential Privacy",
    "epsilonValue": 0.3,
    "deltaValue": 0.00001,
    "kAnonymity": 5,
    "lDiversity": 3
  },
  "genomicVariants": [
    {
      "variantId": "VAR_001",
      "rsId": "rs80357713",
      "gene": "PSEN1",
      "clinicalSignificance": "Pathogenic",
      "oddsRatio": 3.42,
      "pValue": "1.3e-12",
      "privacyNoiseApplied": true
    }
    // ... 7 more variants
  ]
}
```

---

## Troubleshooting

**Q: Export button not visible?**
- Make sure you clicked "View Results" on a **completed** study (not active or discovering)
- Look for the white badge with "completed" status

**Q: Export dialog won't open?**
- Refresh the page and try again
- Make sure you're logged in to the Researcher Portal

**Q: Which format should I use for demo?**
- **JSON**: Best for showing technical depth and API integration
- **CSV**: Best for demonstrating statistical analysis compatibility
- **Summary**: Best for executive audience or regulatory presentation

---

## Advanced Demo Variations

### Variation 1: Multiple Exports
Show exporting the same study in all three formats to demonstrate flexibility:
1. Export as JSON for developers
2. Export as CSV for data scientists
3. Export as Summary for clinicians

### Variation 2: Data Interpretation
After export, open the file and walk through:
- Specific pathogenic variant findings
- Privacy noise application on statistics
- Pathway enrichment significance
- Multi-institutional contribution breakdown

### Variation 3: Compliance Story
Emphasize the compliance documentation:
- Point out HIPAA/GDPR compliance flags
- Explain k-anonymity minimum group size
- Discuss reconstruction attack prevention
- Reference intended use documentation

---

## Success Metrics to Highlight

- **1,204** genomic samples federated
- **3** major medical institutions
- **8** significant genomic findings
- **4** enriched biological pathways
- **0.87** model AUC performance
- **ε=0.3** differential privacy guarantee
- **4** regulatory compliance standards (HIPAA, GDPR, NIH, ISO)

---

*For detailed data reference, see EXPORT_DATA_REFERENCE.md*
