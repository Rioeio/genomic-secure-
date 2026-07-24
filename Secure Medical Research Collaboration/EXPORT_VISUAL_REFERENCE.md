# Export Feature - Visual Summary

## Feature Location

**Path to Access:**
1. Login → Researcher Portal
2. My Studies → "Rare Neurodegenerative Genomic Biomarkers" (completed study)
3. Click "View Results" button
4. Click "Export Results" button (top-right, next to Privacy Budget badge)

---

## Export Dialog Components

### Header Section
```
┌────────────────────────────────────────────────────┐
│ [Download Icon]  Export De-Identified Results      │
│                  Privacy-preserved genomic research │
│                                              [X]    │
└────────────────────────────────────────────────────┘
```

### Privacy Notice (Zinc-50 Background)
```
┌────────────────────────────────────────────────────┐
│ [Lock Icon] Privacy Guarantees Applied             │
│                                                     │
│ All exported data has been processed through       │
│ Laplace differential privacy (ε=0.3, δ=1e-5)       │
│ with k-anonymity=5 and l-diversity=3. Individual   │
│ patient records cannot be reconstructed from this  │
│ aggregated data.                                   │
└────────────────────────────────────────────────────┘
```

### Format Selection (3 Radio Options)
```
┌────────────────────────────────────────────────────┐
│ Select Export Format                               │
│                                                     │
│ ○ [JSON Icon] JSON Format                          │
│   Structured data for programmatic analysis        │
│                                                     │
│ ○ [CSV Icon] CSV Format                            │
│   Compatible with Excel and statistical software   │
│                                                     │
│ ○ [Text Icon] Executive Summary                    │
│   Human-readable report for presentations          │
└────────────────────────────────────────────────────┘
```

### Data Elements Preview (Zinc-50 Background)
```
┌────────────────────────────────────────────────────┐
│ Included Data Elements                             │
│                                                     │
│ ✓ Study Metadata        ✓ Privacy Guarantees       │
│ ✓ 8 Genomic Variants    ✓ Model Performance        │
│ ✓ Pathway Analysis      ✓ Cohort Statistics        │
│ ✓ Institutional Contrib ✓ Quality Metrics          │
└────────────────────────────────────────────────────┘
```

### Compliance Notice
```
┌────────────────────────────────────────────────────┐
│ [i] Compliance & Usage                             │
│                                                     │
│ This export is compliant with HIPAA, GDPR, and    │
│ NIH Genomic Data Sharing Policy.                   │
│                                                     │
│ Intended Use: Scientific publication, regulatory   │
│ submission, and collaborative research only.       │
└────────────────────────────────────────────────────┘
```

### Action Buttons
```
┌────────────────────────────────────────────────────┐
│ [Cancel]                      [Export JSON] ▼     │
└────────────────────────────────────────────────────┘
```

---

## Export Data Structure

### JSON Export Contains:

```
{
  "studyMetadata": { ... },           // 8 fields
  "privacyGuarantees": { ... },       // 6 fields
  "statisticalSummary": {
    "modelPerformance": { ... },      // 5 metrics
    "cohortStatistics": { ... },      // 4 fields
    "qualityMetrics": { ... }         // 3 fields
  },
  "genomicVariants": [ ... ],         // 8 variants
  "pathwayAnalysis": [ ... ],         // 4 pathways
  "institutionalContributions": [ ... ], // 3 institutions
  "exportMetadata": { ... }           // 5 fields
}
```

### CSV Export Structure:

```
SECTION 1: GENOMIC VARIANTS (8 rows)
  Columns: Variant ID, rsID, Chromosome, Position, Gene,
           Protein Change, Impact, Clinical Significance,
           Allele Frequency, Odds Ratio, CI, P-Value, Privacy

SECTION 2: PATHWAY ANALYSIS (4 rows)
  Columns: Pathway ID, Name, Genes, Enrichment Score,
           Adjusted P-Value, Biological Process

SECTION 3: INSTITUTIONAL CONTRIBUTIONS (3 rows)
  Columns: Institution, Samples, Data Types,
           Privacy Budget, Compute Contribution

SECTION 4: STATISTICAL SUMMARY (key-value pairs)
SECTION 5: PRIVACY GUARANTEES (key-value pairs)
```

### Executive Summary Structure:

```
================================================================
    DE-IDENTIFIED GENOMIC RESEARCH RESULTS
       EXECUTIVE SUMMARY REPORT
================================================================

Study Information (8 fields)
Privacy Guarantees (6 fields)
Model Performance Metrics (5 metrics)
Cohort Statistics (4 fields)
Key Genomic Findings (8 variants with details)
Top Enriched Pathways (4 pathways with details)
Participating Institutions (3 institutions with breakdown)
Export Metadata (5 fields)

================================================================
Privacy disclaimer and verification statement
================================================================
```

---

## Color Scheme (Monochrome Zinc Palette)

### Dialog Container
- Background: `#FFFFFF` (white)
- Border: `#E4E4E7` (zinc-200)
- Shadow: `shadow-2xl`

### Header
- Background: `#FFFFFF` (white)
- Border Bottom: `#E4E4E7` (zinc-200)
- Text: `#18181B` (zinc-900)

### Privacy Notice Box
- Background: `#FAFAFA` (zinc-50)
- Border: `#E4E4E7` (zinc-200)
- Icon Color: `#3F3F46` (zinc-700)

### Format Selection (Active)
- Border: `#18181B` (zinc-900) - 2px
- Background: `#FAFAFA` (zinc-50)
- Text: `#18181B` (zinc-900)

### Format Selection (Inactive)
- Border: `#E4E4E7` (zinc-200) - 2px
- Background: `#FFFFFF` (white)
- Text: `#18181B` (zinc-900)
- Hover Border: `#D4D4D8` (zinc-300)

### Radio Button (Active)
- Outer Circle: `#18181B` (zinc-900)
- Inner Dot: `#18181B` (zinc-900)

### Radio Button (Inactive)
- Outer Circle: `#D4D4D8` (zinc-300)

### Export Button
- Background: `#18181B` (zinc-900)
- Text: `#FFFFFF` (white)
- Hover: `#27272A` (zinc-800)
- Icon: Download icon (lucide-react)

### Cancel Button
- Background: Transparent
- Text: `#3F3F46` (zinc-700)
- Hover Text: `#18181B` (zinc-900)

---

## Interaction States

### Loading State
```
[⟳ Exporting...]
  ↓
[✓ Export Successful]
```

### Success Message (After Export)
```
┌────────────────────────────────────────────────────┐
│ ✓ Export Successful                                │
│   De-identified results have been downloaded       │
│   to your device.                                  │
└────────────────────────────────────────────────────┘
```
(Green-50 background, green-700 text)

---

## File Downloads

### JSON Export
- **Filename**: `rs3_deidentified_results.json`
- **Size**: ~15-20 KB
- **MIME Type**: `application/json`

### CSV Export
- **Filename**: `rs3_deidentified_results.csv`
- **Size**: ~8-10 KB
- **MIME Type**: `text/csv`

### Summary Export
- **Filename**: `rs3_executive_summary.txt`
- **Size**: ~5-7 KB
- **MIME Type**: `text/plain`

---

## Keyboard Navigation

- **Tab**: Navigate between format options and buttons
- **Space/Enter**: Select format option
- **Escape**: Close dialog (same as clicking X or Cancel)

---

## Responsive Behavior

- **Desktop**: Full modal dialog (max-width: 672px)
- **Tablet**: Slightly reduced padding
- **Mobile**: Full-width with padding (uses 90vh max-height with scroll)

---

## Animation Details

- **Dialog Entry**: Fade in with backdrop blur
- **Format Selection**: Smooth border color transition (150ms)
- **Button Hover**: Background color transition (200ms)
- **Loading Spinner**: Continuous rotation animation

---

## Accessibility Features

- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus indicators on all focusable elements
- Screen reader announcements for state changes
- Color contrast meets WCAG AA standards (minimum 4.5:1)

---

*All visual elements maintain the strict monochrome zinc palette while ensuring clear hierarchy and usability.*
