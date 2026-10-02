# SpA Lab

Public website for the SpA Research AI Laboratory. A static, accessible editorial site with distinct researcher/physician and patient/public routes. Research outputs are clearly labeled by scope and review status.

## Run locally

Requires Python, no dependency installation:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Production uses GitHub Pages and the custom domain in CNAME. Cloudflare provides domain/DNS/proxy services. Updating the publishing branch can deploy publicly.

## Content

- `index.html`, `style.css`, `script.js`: audience experiences, original schematic artwork and motion.
- `study.html`, `study.css`: P002 study report with accessible explanatory figures.
- `data/`: public endpoint extracts, comparison data, source locations and arithmetic reproduction.
- `spa_knowledge_graph/`: legacy URL retained as an archive notice; the old graph is not treated as validated evidence.
- `JOURNAL.md`: historical prototype plans, explicitly labeled as historical and unvalidated.

## Editing and release

Keep factual claims source-linked. Distinguish completed research from external peer review and avoid promises of cures or treatment advice. Illustrative artwork must not masquerade as measured anatomy or data. No private health records, credentials, internal board reports or operating memory belong here.

Check both audience modes, keyboard navigation, narrow screens, reduced motion, pause controls, local links and data integrity before release. Keep critical content usable without JavaScript. Preserve existing URLs or give them useful archive/redirect pages. Use Git history for rollback; document substantive research corrections and version changes.

The site makes no appointment, diagnostic or personalized-treatment service claims. Third-party research remains attributable to its original authors. No third-party full-text paper PDFs are distributed in the public data package.
