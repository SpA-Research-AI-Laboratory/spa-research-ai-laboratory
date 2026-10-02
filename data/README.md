# P002 public data — version 1, 2 October 2026

Question: what do approximately two-year spinal non-progression endpoints mean in accessible axial SpA trial reports published 2018–2026?

Nine parent trial families, 46 endpoint rows; five within-cohort threshold contrasts from four families. Trial families are not paper counts. MEASURE-1 and ENRADAS have distinct participants but share one comparative reading campaign. No pooling, treatment ranking or lesion-repair inference. No external peer review.

## Files and units

- p002-endpoints.json / .csv: extracted endpoint records, including source URL/location, population, nominal week, outcome rule, missing-data method, estimate type and denominator. CSV nested fields contain JSON. Percentages run 0–100. Blank/null means unknown or not applicable, never zero; consult the corresponding reason.
- p002-comparisons.json: five separate contrasts. Preserve warning and calculation fields. Differences use percentage points.
- p002-thresholds.svg: figure of those contrasts, generated with matplotlib.
- reproduce.py: standalone standard-library Python arithmetic check. Uses reported percentages and explicit PREVENT counts; makes no network request.
- manifest.json: SHA-256 hashes of exported data and figure.

## Exact interpretation

MEASURE-1: 60.7%→82.1% for ≤0→≤2; ENRADAS: 52.2%→72.5% for ≤0→≤2; SELECT-AXIS-1: 76.5%→89.7% for ≤0→<2. Differences are subtraction of rounded published values. SELECT1 n=136 is linked from the common imaging cohort, not independently restated beside the binary rates.

PREVENT uses observed counts 273/280 and 132/136 at≤0.76; progression >2 counts 3/280 and1/136 yield complements 277/280 and 135/136 at≤2. A complement of >2 is ≤2, never <2.

Four-family comparability is descriptive and within cohorts. Excluding SELECT1's inferred linkage leaves three families but only two source reading exercises. SURPASS baseline counts are not treated as confirmed endpoint analysis denominators. No uncertainty intervals are reconstructed.

## Scope and limits

One EuropePMC title/abstract query produced 42 records, screened once by the lab; supplemental discovery added reports outside that query. An initial 841-result all-fields query was not screened. This is not a comprehensive systematic review. POSTURE, BE-MOBILE-2 and pooled COAST-V/W remain access-limited report groups. Registry histories, some supplements and publication-status checks are unfinished. Nominal 96–112week visits do not guarantee identical actual imaging intervals. Internal AI source crosschecks are not external validation.

No lesion-specific repair endpoint was identified in inspected material; this does not establish universal absence or impossibility of repair. Hidden cohort/estimator differences or substantive source corrections would invalidate the corresponding contrast.

## Principal sources

- MEASURE/ENRADAS: https://doi.org/10.1186/s13075-019-1911-1 Table 2, primary sets
- PREVENT: https://pmc.ncbi.nlm.nih.gov/articles/PMC10186767/
- SELECT-AXIS-1: https://pmc.ncbi.nlm.nih.gov/articles/PMC9335045/
- All other source URLs and locations: endpoint data.

The public package contains extracted research facts and lab-written documentation, not participant-level data or redistributed full-text articles. Cite the original studies as well as this versioned audit when reusing it.
