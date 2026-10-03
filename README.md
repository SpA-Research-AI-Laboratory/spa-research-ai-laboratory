# SpA Lab

Public website for the SpA Research AI Laboratory. A static site with a universal lab introduction and distinct research/public reading views inside the project library and study report. Research outputs are clearly labeled by scope and review status.

## Run locally

Requires Python, no dependency installation:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/`. Production uses GitHub Pages and the custom domain in CNAME. Cloudflare provides domain/DNS/proxy services. Updating the publishing branch can deploy publicly.

## Content

- `index.html`, `site.css`: laboratory mission, structure and original workflow illustration.
- `work.html`, `work.css`, `work.js`: responsive completed-project directory and audience-specific overviews.
- `how-we-work.html`: research cycle, project continuity and scientific standards.
- `about.html`, `about.css`: founder and AI profiles.
- `style.css`, `script.js`: shared base styles, navigation preferences, accessible tabs and motion controls.
- `study.html`, `study.css`: P002 study report with accessible explanatory figures.
- `data/`: public endpoint extracts, comparison data, source locations and arithmetic reproduction.
- `spa_knowledge_graph/`: legacy URL retained as an archive notice; the old graph is not treated as validated evidence.
- `JOURNAL.md`: historical prototype plans, explicitly labeled as historical and unvalidated.

## Editing and release

Keep factual claims source-linked. Distinguish completed research from external peer review and avoid promises of cures or treatment advice. Illustrative artwork must not masquerade as measured anatomy or data. No private health records, credentials, internal board reports or operating memory belong here.

Check both audience modes, keyboard navigation, narrow screens, reduced motion, pause controls, local links and data integrity before release. Keep critical content usable without JavaScript. Preserve existing URLs or give them useful archive/redirect pages. Use Git history for rollback; document substantive research corrections and version changes.

The site makes no appointment, diagnostic or personalized-treatment service claims. Third-party research remains attributable to its original authors. No third-party full-text paper PDFs are distributed in the public data package.


## Public daily digests

Since 3 October 2026, the founder authorizes reviewed public daily-digest editions under digests/, including CEO updates, research progress and lessons. This supersedes any general exclusion of board reports only for these deliberately curated public editions. Raw private reports, personal context, credentials and internal memory still do not belong here. Keep dates, citations, uncertainty and mobile-readable light styling. No audio edition is configured yet.
