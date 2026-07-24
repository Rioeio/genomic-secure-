import json
import urllib.request
import time

# List of key disease genes & associated real rsIDs from dbSNP / ClinVar
GENES_TO_FETCH = [
  {"gene": "BRCA1", "disease": "Breast & Ovarian Cancer", "chr": "17", "rsids": ["rs1799966", "rs80357906", "rs80357711", "rs41293455", "rs80357914", "rs28897672", "rs80357474", "rs80357608"]},
  {"gene": "TCF7L2", "disease": "Type 2 Diabetes", "chr": "10", "rsids": ["rs7903146", "rs12255372", "rs11196205", "rs7901695", "rs4506565", "rs7895340", "rs10885406"]},
  {"gene": "PPARG", "disease": "Type 2 Diabetes & Metabolic Syndrome", "chr": "3", "rsids": ["rs1801282", "rs3856806", "rs10865710", "rs709158", "rs12497191"]},
  {"gene": "APOE", "disease": "Alzheimer's & Cardiovascular Disease", "chr": "19", "rsids": ["rs429358", "rs7412", "rs405509", "rs440446", "rs157580"]},
  {"gene": "PCSK9", "disease": "Familial Hypercholesterolemia", "chr": "1", "rsids": ["rs505151", "rs11591147", "rs562556", "rs28362286", "rs11583680"]},
  {"gene": "CFTR", "disease": "Cystic Fibrosis", "chr": "7", "rsids": ["rs113993960", "rs75527207", "rs121908745", "rs121908746", "rs121908769"]},
  {"gene": "TP53", "disease": "Li-Fraumeni / Pan-Cancer Oncology", "chr": "17", "rsids": ["rs1042522", "rs28934578", "rs28934571", "rs28934575", "rs11540652"]}
]

real_dataset = []

headers = {
  "User-Agent": "GenomicSecure/1.0 (Research Platform; Contact: manoj@saec.edu)"
}

print("Fetching real genomic variant data from Ensembl REST API...")

for item in GENES_TO_FETCH:
    gene = item["gene"]
    disease = item["disease"]
    chrom = item["chr"]
    print(f"Fetching variants for {gene} ({disease})...")
    
    for rsid in item["rsids"]:
        url = f"https://rest.ensembl.org/variation/human/{rsid}?content-type=application/json"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                
                # Extract real genomic attributes
                mappings = data.get("mappings", [{}])[0]
                pos = mappings.get("start", 0)
                location = mappings.get("location", f"{chrom}:{pos}")
                seq_region = mappings.get("seq_region_name", chrom)
                allele_string = mappings.get("allele_string", "A/G")
                
                # Extract clinical significance / minor allele frequency if available
                clinical = data.get("clinical_significance", ["Unspecified"])
                clin_sig = clinical[0] if clinical else "Unspecified"
                
                # Extract MAF
                maf = data.get("MAF", 0.15)
                
                real_dataset.append({
                    "rsId": rsid,
                    "gene": gene,
                    "disease": disease,
                    "chromosome": f"Chr {seq_region}",
                    "position": pos,
                    "location": location,
                    "alleleString": allele_string,
                    "clinicalSignificance": clin_sig,
                    "minorAlleleFrequency": maf,
                    "source": "Ensembl GRCh38 / dbSNP"
                })
                print(f"  [OK] {rsid} -> {gene} ({location}) - {clin_sig}")
        except Exception as e:
            print(f"  [FAIL] {rsid}: {e}")
        time.sleep(0.1)

output_file = "src/app/realGenomicDataset.json"
with open(output_file, "w") as f:
    json.dump(real_dataset, f, indent=2)

print(f"\nSuccessfully saved {len(real_dataset)} real genomic variants to {output_file}!")
