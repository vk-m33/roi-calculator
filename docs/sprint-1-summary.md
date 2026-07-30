# Sprint 1 Summary
Date: 2026-07-30
Branch: master (merged from feature/optimization, feature/refactor)

---

## Overview

Sprint 1 took the ROI Calculator from a basic Vite + React web app to a fully featured, packaged Windows desktop application with a complete BA → Dev → QA agent pipeline. Six bugs were found and resolved, one security feature was shipped, and a full codebase refactor was completed — all without breaking any existing functionality.

---

## Agent Pipeline

Three persistent Claude Code agents were created and are committed to `.claude/agents/`:

| Agent | File | Responsibilities |
|---|---|---|
| Business Analyst | `business-analyst.md` | BRD, user stories, test cases, FEAT-NNN feature specs |
| Developer | `developer.md` | Bug fixes, feature implementation, build verification |
| QA / Tester | `tester.md` | Full regression, feature verification, BUG-NNN reports |

### Pipeline workflow
```
BA → features/FEAT-NNN.md (READY)
       ↓
Dev → implements → marks IMPLEMENTED
       ↓
QA  → verifies → TESTED or FAILED
       ↓ (on FAIL)
QA  → bugs/BUG-NNN.md (OPEN)
       ↓
Dev → fixes → marks RESOLVED
       ↓
QA  → re-verifies
```

A reusable generic version of the pipeline was exported to `../agent-pipeline/` for use in other projects.

---

## Tauri v2 Desktop App

The web app was wrapped as a native Windows desktop application using Tauri v2.

| Item | Detail |
|---|---|
| Runtime | WebView2 (Microsoft Edge-based) |
| Installers | MSI + NSIS (.exe) — both produced |
| Window | 1280×900 default, 800×600 minimum, resizable |
| Icons | All sizes generated from `src/assets/app-icon.svg` |
| Rust toolchain | MSVC, auto-detected — no vcvarsall.bat needed |

**New files:** `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`, `src-tauri/src/lib.rs`, `src-tauri/src/main.rs`, `src-tauri/build.rs`, `src-tauri/capabilities/default.json`, `BUILDING.md`

---

## Features Implemented

### Financial calculations
- Added **Discount Rate** input (0–100%, step 0.1, default 10%)
- Added **NPV** (Net Present Value) — discounted cash-flow loop
- Added **IRR** (Internal Rate of Return) — binary search convergence
- Added **NPV and IRR result cards** in the UI (second row alongside ROI/Payback/Net Profit)
- Added `MAX_CURRENCY = 999_999_999_999` upper-bound validation on all currency inputs

### Comparison mode
- Scenario labels are inline-editable (click to rename)
- Scenario B has a dedicated × delete button
- Winner badge correctly shown on the better-performing scenario

### PDF export
- Monthly breakdown table included (was missing)
- Discount Rate, NPV, and IRR included in the metrics table (were missing)
- Tauri-aware export: native Windows Save As dialog via `tauri-plugin-dialog` + `tauri-plugin-fs`

### FEAT-001 — Security hardening (all 8 acceptance criteria passed)
- `EmbedModal`: removed unsafe URL fallback; `embedUrl` starts null until user provides valid input
- `EmbedModal`: generated iframe snippet includes `sandbox` and `referrerpolicy` attributes
- `EmbedModal`: HTTP advisory warning shown when user enters a non-HTTPS URL
- `EmbedModal`: Copy button disabled when `embedUrl` is null
- `ThemeContext`: `?theme=` param validated against an explicit allowlist (`light`/`dark` only)
- `ThemeContext`: security comment documents localStorage usage (theme only, non-sensitive)
- `exportPDF.js`: filename uses system date only — no user input interpolated
- `docs/security-decisions.md`: documents all security decisions, remaining risks, and rationale

---

## Bugs Found and Resolved

| ID | Title | Severity | Root Cause | Resolution |
|---|---|---|---|---|
| BUG-001 | Monthly breakdown missing from PDF | High | `exportPDF.js` never called `autoTable` for the breakdown section | Added monthly breakdown autoTable with break-even row highlight |
| BUG-002 | Scenario B cannot be deleted | Medium | No delete handler or UI element existed | Added `deleteScenarioB` handler and × button on Scenario B header only |
| BUG-003 | Scenario labels not editable | Medium | Labels were static text | Added `ScenarioLabel` inline-edit component with click-to-edit behaviour |
| BUG-004 | Winner badge shown on both scenarios | Medium | Badge logic checked ROI > 0 instead of comparing A vs B | Fixed comparator to only badge the scenario with higher ROI |
| BUG-005 | PDF missing Discount Rate, NPV, IRR | High | New financial metrics were never added to the PDF template | Added all three to the key metrics table in `exportPDF.js` |
| BUG-006 | PDF export silent failure in Tauri desktop | Critical | `doc.save()` uses blob-URL anchor click — silently dropped by WebView2 | Switched to `window.__TAURI_INTERNALS__` detection + `tauriSave()` + `writeFile()` |

All six bugs are **RESOLVED** and QA-verified.

---

## Pipeline Gap Found and Fixed (BUG-006 Post-mortem)

**What happened:** BUG-006 (PDF export broken in desktop) was not caught by the initial QA pass. QA only tested against the Vite dev server (real browser), where `doc.save()` works. The defect was WebView2-specific.

**Why it was missed:** The pipeline had no concept of a "desktop environment" test pass. No acceptance criteria mentioned the `.exe` build.

**Fixes applied to the pipeline:**

- **QA agent** — Added explicit WebView2 compatibility check rule: any feature using blob-URL downloads, `createObjectURL`, or OS dialogs must use a `window.__TAURI_INTERNALS__` branch; web-only is a FAIL.
- **Developer agent** — Added WebView2 compatibility section listing APIs that don't work in WebView2 and the correct Tauri plugin alternatives.
- **BA agent** — Added rule: any feature touching file I/O, clipboard, or OS dialogs must include a desktop acceptance criterion requiring the feature to work in the `.exe`, not just the browser.

---

## Codebase Refactor

Completed as a separate branch (`feature/refactor`), QA-verified (9/9 regression items), merged to master.

### New files created

| File | Purpose |
|---|---|
| `src/constants/index.js` | `MAX_CURRENCY` and `DEFAULT_INPUTS` — single source of truth |
| `src/utils/formatters.js` | Shared `Intl.NumberFormat` currency formatter (was duplicated in 4 files) |
| `src/utils/calculations.js` | All financial logic: `validate`, `isFormValid`, `toVisible`, `computeIRR`, `calculate` |
| `src/hooks/useScenarioState.js` | All scenario state and event handlers extracted from CalculatorCore |

### Key metrics

| Metric | Before | After |
|---|---|---|
| `CalculatorCore.jsx` lines | 353 | 184 |
| Duplicate `Intl.NumberFormat` instances | 4 | 1 |
| Calculation logic location | Inline in component | `src/utils/calculations.js` (independently testable) |
| Dead code | `isDark` prop (never read), always-identical ternary | Removed |

### What was NOT changed
- All calculation formulas (ROI, NPV, IRR, payback) — moved verbatim
- All UI layout and Tailwind classes
- All routing and provider structure
- All security code

---

## Documentation Produced

| File | Contents |
|---|---|
| `docs/requirements.md` | 54 FRs + 19 NFRs, user stories, Gherkin acceptance criteria |
| `docs/test-cases.md` | 120 test cases across 18 functional areas |
| `docs/security-decisions.md` | All security decisions, remaining risks, rationale |
| `docs/sprint-1-summary.md` | This document |
| `BUILDING.md` | Prerequisites, first-time setup, dev workflow, production build |

---

## Git History (master, chronological)

```
7fcf979  Add Tauri v2 desktop app configuration
4a68e13  Part 4: Tauri desktop app — icons, Cargo.lock, and build config
e0ed8ee  Part 5: Bug fixes — discount rate/NPV/IRR, scenario rename/delete, PDF breakdown
dc4f650  Part 6: Security hardening, agent pipeline, and project docs
5e33882  Fix BUG-005: add Discount Rate, NPV, IRR to PDF export
495c960  fix: PDF export in Tauri desktop via native save dialog
d222894  fix: correct Tauri v2 PDF export — write permission and detection
b8f47b5  extract shared currency formatter into utils/formatters.js
6375755  extract MAX_CURRENCY and DEFAULT_INPUTS into constants/index.js
3cc8871  extract validate, calculate, and IRR functions into utils/calculations.js
f000db6  extract scenario state management into useScenarioState custom hook
5d98985  clean up unused prop and redundant ternary in PaybackChart
22eb76a  merge: feature/refactor — full codebase refactor
1db65b5  merge: feature/optimization — Tauri desktop, security, PDF export fixes
```

---

## Final State

- All features implemented and QA-verified
- All 6 bugs resolved
- Security feature (FEAT-001) shipped and tested
- Codebase refactored — maintainable, modular, no dead code
- Desktop installers built and installed (MSI + NSIS)
- Agent pipeline committed and ready for Sprint 2
