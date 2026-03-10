# SpA Research AI Laboratory — Journal

---

## 2026-03-09 — Launch Planning Session

### Launch Roadmap

**Phase 1 — Foundation (Week 1–2)**

1. **Digital Identity** — Domain, professional email, website with About/Research/Team/Contact pages.
2. **Research Dashboard** — Central hub tracking projects, datasets, agent runs, papers in progress, key findings.
3. **Social & Community Presence** — Twitter/X, GitHub organization (spa-research-ai-lab), ORCID profile, LinkedIn page.

**Phase 2 — Research Infrastructure (Week 2–4)**

4. **Research Methodology Framework** — Document the AI-native pipeline: hypothesis generation → computational modeling → validation design → paper writing. Create templates. Publishable as methods paper.
5. **First Project Launch** — Pick one computationally completable project, scope tightly, run end-to-end as proof of concept.
6. **Data Strategy** — Catalog publicly available SpA datasets: GEO/ArrayExpress, UK Biobank, GWAS Catalog, clinical trial registries, microbiome databases.

**Phase 3 — Visibility & Growth (Month 2–3)**

7. **First Publication** — Target a methods/perspective paper: "AI-Agent-Driven Computational Biology for Spondyloarthritis: A Patient-Led Research Framework." Journals: Frontiers in Immunology, RMD Open, npj Digital Medicine.
8. **Collaborator Recruitment** — Open call for rheumatologist co-investigator, computational biology collaborators, SpA patient citizen scientists.
9. **Institutional Registration** — Register as research association or non-profit in Portugal for journal affiliations and grant applications.

### Decision: Start with website first.
### Next: Choose domain registrar and hosting platform.

---

## 2026-03-10 — Website Live + Project 1 Selected

### Website milestones completed
- Domain `spa-research-ai-laboratory.org` registered at Cloudflare
- GitHub org `SpA-Research-AI-Laboratory` created, repo pushed, GitHub Pages live
- Knowledge Graph integrated into main site (nav item + teaser card)
- Team section: photo and ORCID (0000-0001-8440-654X) added
- Git credential helper configured (Windows Credential Manager)

### Project 1 Selected: Systematic Molecular Mimicry Mapping in SpA

**Full title:** AI-Driven Discovery of Bacterial Peptides that Cross-React with Self-Antigens via HLA-B27

**Core hypothesis:** Gut bacterial dysbiosis triggers joint inflammation in SpA through molecular mimicry — bacterial peptides structurally resembling human self-antigens are presented by HLA-B27 to CD8+ T cells, which then attack host tissues.

**Key novelty:** First proteome-wide survey using protein language model (ESM2) embeddings instead of BLAST — captures structural/evolutionary similarity beyond sequence identity.

**Pipeline:** Data collection → Peptide generation → ESM2 embeddings → FAISS similarity search → NetMHCpan HLA binding → Composite scoring → Visualization → Publication

**Target bacteria:** Klebsiella pneumoniae, Ruminococcus gnavus, Prevotella copri, Chlamydia trachomatis, Campylobacter jejuni, Proteus mirabilis, Clostridium perfringens, Faecalibacterium prausnitzii (negative control)

**Critical control:** B*27:05 vs B*27:09 allelic discrimination — peptides binding B*27:05 but NOT B*27:09 are the most pathogenically relevant.

**Target journals:** Annals of the Rheumatic Diseases, Arthritis & Rheumatology, PLOS Computational Biology

**Timeline:** ~8 weeks part-time

**Status:** Ready to begin Phase 0 (environment setup). GPU model and WSL2 status to be confirmed.
