# Sprint 2 Summary
Date: 2026-07-30
Branch: master (merged from feature/landing-page)

---

## Overview

Sprint 2 delivered a complete high-converting landing page for the ROI Calculator, a GitHub Pages deployment pipeline, and a publicly accessible live website. The calculator was preserved intact; the landing page sits at `/` and the calculator moved to `/app`.

---

## Agent Pipeline

All three agents ran through the standard BA → Dev → QA workflow.

| Agent | Work done |
|---|---|
| BA | Wrote `features/FEAT-002.md` — 14 user stories (US-01–US-14) with Gherkin acceptance criteria, releases manifest schema, routing spec, and SEO requirements |
| Developer | Implemented full landing page (~430 lines), updated routing, added releases manifest, SEO meta tags, GitHub Actions workflow |
| QA | Verified all 14 ACs, ran full Mode 1 regression on calculator at `/app`, flagged 2 cosmetic observations (checkmark SVG, dark mode contrast) |

Both cosmetic observations were fixed before merge.

---

## Feature Delivered — FEAT-002: Landing Page

### Route changes

| Route | Before | After |
|---|---|---|
| `/` | Calculator | Landing page |
| `/app` | — | Calculator (unchanged behaviour) |
| `/embed` | Embed widget | Embed widget (unchanged) |

### Landing page sections (in order)

| Section | Content |
|---|---|
| Navbar | Logo, brand name, dark/light toggle, "Open App" link |
| Hero | "Calculate ROI with Confidence" headline, subheadline, two CTAs, product mockup |
| Features | 8-card grid — ROI Calculations, Comparison Mode, Monthly Breakdown, Charts, PDF Export, Dark Mode, Embeddable Widget, Offline Desktop |
| Benefits | 5 items — evaluate investments, compare scenarios, break-even tracking, professional reports, online/offline |
| How It Works | 3-step process with connector line on desktop |
| Desktop Version | Platform badges, version number from manifest, offline/privacy highlights |
| Download | Dynamic cards from GitHub Releases API — Windows active, macOS/Linux "Coming Soon"; auto-updates with every new release |
| Technical Features | 5 cards — offline, local storage, fast calculations, responsive, secure |
| Use Cases | 4 quote cards — Startup Founders, Marketing Managers, Financial Analysts, Small Business Owners |
| FAQ | 5 accordion items (click to expand) |
| Footer | Version, docs link, Privacy Policy, Terms of Service |

### New files created

| File | Purpose |
|---|---|
| `src/pages/LandingPage.jsx` | Full landing page (~430 lines) |
| `public/api/releases.json` | Static fallback manifest (superseded by GitHub Releases API — kept for reference) |
| `.github/workflows/deploy.yml` | GitHub Actions — auto-deploy to GitHub Pages on every push to master |

### Files modified

| File | Change |
|---|---|
| `src/main.jsx` | Added `/` → LandingPage, `/app` → App; added `VITE_ROUTER_BASENAME` support |
| `vite.config.js` | Added `VITE_BASE_PATH` support for GitHub Pages sub-path deployment |
| `index.html` | SEO title, meta description, Open Graph tags |

---

## GitHub Pages Deployment

| Item | Detail |
|---|---|
| Live URL | https://vk-m33.github.io/roi-calculator/ |
| Calculator URL | https://vk-m33.github.io/roi-calculator/app |
| GitHub repo | https://github.com/vk-m33/roi-calculator |
| Deployment trigger | Every push to `master` → GitHub Actions builds and deploys automatically |
| SPA routing | `dist/404.html` (copy of `index.html`) handles direct URL navigation on GitHub Pages |
| Base path | `VITE_BASE_PATH=/roi-calculator/` set in CI; local dev and Tauri use `/` |

### How future deploys work

Push to master → GitHub Action runs `npm run build` with correct base path → copies `index.html` to `404.html` → deploys `dist/` to GitHub Pages. No manual steps.

---

## Bug Fixes This Sprint

| Issue | Root cause | Fix |
|---|---|---|
| Checkmark SVG drew wrong shape | `polyline points="20 6 9 12 4 9"` was a reversed zigzag | Corrected to `"4 13 9 18 20 6"` |
| Feature cards invisible in dark mode | Section and cards both used `dark:bg-gray-800` | Section changed to `dark:bg-gray-900` for contrast |
| Download section showed "temporarily unavailable" | `fetch('/api/releases.json')` used absolute path, broken under `/roi-calculator/` base | Changed to `fetch(\`${import.meta.env.BASE_URL}api/releases.json\`)` |
| Download buttons returned 404 | Download URLs pointed to `/downloads/...` — files were never committed to git (gitignored build artefacts) | Switched to GitHub Releases; installers uploaded as release assets at `v0.1.0` |
| Download section would require manual updates per release | Static `releases.json` had hardcoded version, URLs, and file sizes | Replaced with `fetch('https://api.github.com/repos/vk-m33/roi-calculator/releases/latest')` + `transformGithubRelease()` — version, sizes, and URLs now come directly from GitHub automatically |

---

## QA Results

- Feature verification: **14/14 ACs passed**
- Mode 1 regression (calculator): **9/9 items passed**
- Bugs filed: 0 blocking, 2 cosmetic (both fixed before merge)

---

## Git History (Sprint 2 commits)

```
9dfdb29  feat(FEAT-002): add landing page and releases manifest
7d5c7cb  feat(FEAT-002): add /app route and update SEO meta tags
552a699  docs(FEAT-002): mark as IMPLEMENTED, add implementation notes
8d4ead0  fix: correct checkmark SVG path and Features dark mode contrast
86546fb  merge: feature/landing-page — high-converting landing page
d7363ac  feat: add GitHub Pages deployment workflow and base path config
38b47db  fix: use BASE_URL prefix for releases.json fetch on GitHub Pages
c4f5685  fix: point download URLs to GitHub Releases
ad473ba  feat: fetch downloads from GitHub Releases API instead of static JSON
```

---

## How to Ship a New Desktop Release

1. Run `npm run tauri:build` to produce new installers
2. Go to `https://github.com/vk-m33/roi-calculator/releases/new`
3. Create a new tag (e.g. `v0.2.0`), upload the `.exe` and `.msi` from `src-tauri/target/release/bundle/`, publish
4. The landing page download section updates automatically — no code changes needed
5. Push any code changes to `master` to trigger a web redeploy

---

## Final State

- Landing page live at https://vk-m33.github.io/roi-calculator/
- Calculator live at https://vk-m33.github.io/roi-calculator/app
- GitHub repo at https://github.com/vk-m33/roi-calculator
- GitHub Release `v0.1.0` with Windows installers published
- Desktop app (Tauri) unchanged — still works with base path `/`
- Auto-deploy on every push to master via GitHub Actions
- Download section auto-updates from GitHub Releases API — no manual maintenance
- All features QA-verified, no open bugs
