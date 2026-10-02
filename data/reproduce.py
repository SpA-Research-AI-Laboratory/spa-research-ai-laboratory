"""Reproduce P002's five descriptive contrasts. Python standard library only.

Run from this directory: python reproduce.py
Source table rates are rounded. These are not treatment-effect comparisons.
"""
import json,math
from pathlib import Path
p=Path(__file__).parent
rows=json.loads((p/'p002-comparisons.json').read_text(encoding='utf-8'))
expected=[82.1-60.7,72.5-52.2,89.7-76.5,100*(277-273)/280,100*(135-132)/136]
assert len(rows)==5
for row,value in zip(rows,expected):
 assert math.isclose(row['difference_percentage_points'],value,abs_tol=1e-10)
 label=row['comparison_label'].replace('≤','<=').replace('→','to')
 print(f"{row['family_id']}: {label} = +{value:.4f} percentage points")
assert rows[2]['comparison_label']=='≤0 → <2'
assert all('<=2' in row['upper_rule'] for row in rows[3:])
print('Verified. No pooling; no confidence intervals reconstructed.')
