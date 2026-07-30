# FEAT-002: Landing Page
Status: IMPLEMENTED
Priority: High
Requested by: business-analyst

## Business Goal

Design and implement a high-converting landing page for the ROI Calculator application that
serves as the public entry point at `/`. The page must clearly communicate the tool's value,
drive visitors to calculate ROI online via the web app (now at `/app`), and promote downloads
of the desktop version. The existing `/embed` route must remain unchanged. All new UI must
respect the established light/dark theme system via `src/context/ThemeContext.jsx` and require
no new production npm dependencies.

---

## User Stories

**US-01 — Hero: first impression and primary CTAs**
As a first-time visitor, I want to land on a page that immediately tells me what the tool does
and offers two clear actions — start the web calculator and download the desktop app — so that
I can choose the right path without reading through the whole page.

**US-02 — Features: capability overview**
As a potential user evaluating the tool, I want to see a concise grid of all key features
(ROI Calculations, Comparison Mode, Monthly Breakdown Table, Interactive Charts, PDF Export,
Dark Mode, Embeddable Widget, Offline Desktop Version) so that I can quickly decide whether the
product meets my needs.

**US-03 — Benefits: outcome framing**
As a business decision-maker, I want the landing page to explain the business value I get
(evaluate investments, compare scenarios, track break-even, generate reports, work online or
offline) so that I can justify using or recommending the tool.

**US-04 — How It Works: onboarding in three steps**
As a visitor unfamiliar with the tool, I want a simple three-step visual guide (enter data,
analyse, export/share) so that I understand the workflow before committing to signing up or
downloading.

**US-05 — Desktop version promotion**
As someone who handles sensitive financial data and needs offline capability, I want a dedicated
section describing the desktop app (offline operation, local storage, privacy, supported
platforms) so that I trust the app meets my data-sovereignty requirements.

**US-06 — Download section: platform-specific links**
As a user ready to install the desktop app, I want clearly labelled, platform-specific download
buttons that are disabled (visually marked as coming soon) for unavailable platforms, so that I
can download the correct file without guessing which build to use.

**US-07 — Technical features: trust signals**
As a technical evaluator or IT approver, I want a section that calls out offline support, local
data storage, fast calculations, responsive design, and secure data handling so that I can
approve the tool for my team without further investigation.

**US-08 — Testimonials / use cases: role identification**
As a visitor from a specific professional background (startup founder, marketing manager,
financial analyst, small business owner), I want to see use-case cards that reflect my role so
that the product feels relevant to my specific context.

**US-09 — FAQ: addressing objections**
As a cautious visitor, I want a FAQ section that answers the five most common questions (free
to use, offline capability, data storage, multi-investment comparison, PDF export) so that I
am not left with blockers that prevent me from starting.

**US-10 — Footer: navigation and legal**
As any visitor, I want a footer showing the current application version, a documentation link,
contact information, a Privacy Policy link, and a Terms of Service link so that I can access
support resources and legal information from any point on the page.

**US-11 — Route migration: existing users**
As an existing user who has bookmarked the calculator directly, I want the calculator to be
reachable at `/app` so that my bookmark remains usable after the landing page is added at `/`.

**US-12 — Releases manifest: download metadata**
As the download section component (and any future CI/CD or bot that checks release availability),
I want a machine-readable manifest at `/api/releases.json` that declares the version, release
date, file sizes, download URLs, and availability for each platform so that the download
buttons always reflect the actual state of releases without a code change.

**US-13 — SEO: discoverability**
As a search engine crawler, I want `index.html` to contain a meaningful `<title>`, meta
description, and Open Graph tags so that the page ranks for relevant queries and previews
correctly when shared on social platforms.

**US-14 — Responsive layout and theming**
As a user on any device or in any lighting condition, I want the landing page to render
correctly on desktop (1280 px and above), tablet (768 px–1279 px), and mobile (below 768 px),
and to honour the system dark/light preference via the existing `ThemeProvider` and
`localStorage` persistence so that the experience is consistent with the rest of the app.

---

## Acceptance Criteria

### AC-01 — Hero CTAs (for US-01)

**Given** a visitor loads `/`,

**When** the Hero section renders,

**Then**:
1. An `<h1>` element contains the exact text "Calculate ROI with Confidence".
2. A sub-headline paragraph describes analysing investments, comparing scenarios, and generating
   reports in minutes (exact wording is up to the developer; the key phrases must be present).
3. A primary button labelled "Start Calculating" uses `react-router-dom`'s `<Link to="/app">`
   (or `useNavigate`) so that clicking it performs a client-side navigation to `/app` without
   a full page reload.
4. A secondary button labelled "Download Desktop App" scrolls the viewport to the element with
   `id="download"` when clicked — implemented via `document.getElementById('download')
   .scrollIntoView({ behavior: 'smooth' })` or an equivalent anchor (`<a href="#download">`).
5. A product screenshot or stylised mockup area is present in the Hero section (may be an
   `<img>` with a descriptive `alt` attribute, an inline SVG, or a decorative `<div>` with
   `aria-hidden="true"` — at minimum the layout slot must exist).

---

### AC-02 — Features grid (for US-02)

**Given** a visitor scrolls to the Features section,

**When** the section renders,

**Then** all eight of the following feature labels are present in the DOM (case-insensitive
text match is acceptable):
- "ROI Calculations"
- "Comparison Mode"
- "Monthly Breakdown Table"
- "Interactive Charts"
- "PDF Export"
- "Dark Mode"
- "Embeddable Widget"
- "Offline Desktop Version"

Each feature must appear as a distinct card or tile — not as a single block of prose — so that
each item is individually scannable.

---

### AC-03 — Benefits list (for US-03)

**Given** a visitor reaches the Benefits section,

**When** the section renders,

**Then** all five of the following benefit statements are present (paraphrasing is allowed;
each concept must be represented):
1. Evaluate business investments
2. Compare multiple scenarios
3. Track break-even points
4. Generate professional reports
5. Work online or offline

---

### AC-04 — How It Works (for US-04)

**Given** a visitor views the "How It Works" section,

**When** the section renders,

**Then**:
1. Exactly three steps are displayed in sequential order.
2. Step 1 communicates entering investment data.
3. Step 2 communicates analysing ROI and projections.
4. Step 3 communicates exporting or sharing results.
5. Each step is visually numbered (e.g. "1", "2", "3") or uses an ordered visual indicator
   that makes the sequence unambiguous.

---

### AC-05 — Desktop version section (for US-05)

**Given** a visitor views the Desktop Version section,

**When** the section renders,

**Then**:
1. The section contains text describing at least three of the following: offline operation,
   local data storage, privacy, supported platforms.
2. The application version (e.g. "v0.1.0") is displayed — sourced from
   `public/api/releases.json` (the `version` field at the root of the JSON object).
3. A "Download Now" (or equivalent) call-to-action button is present and either scrolls to
   `#download` or links to `#download`.
4. At least the Windows and macOS platform names are mentioned or indicated in the section
   (may be icons, labels, or list items).

---

### AC-06 — Download section and platform buttons (for US-06, US-12)

**Given** a visitor reaches the element with `id="download"`,

**When** the section renders using data from `public/api/releases.json`,

**Then**:
1. A **Windows Installer (.exe)** download entry is rendered as an active `<a>` element (or
   `<button>`) with a non-empty `href` pointing to the installer file — because the
   `available` field for this entry is `true` in the manifest.
2. A **Windows Portable** download entry is rendered as an active `<a>` element with a
   non-empty `href` pointing to the portable `.exe` directly — because the `available` field
   for this entry is `true` in the manifest.
3. A **macOS Installer** entry is rendered as a disabled or visually greyed-out element
   labelled "Coming Soon" (or equivalent) — because the `available` field for this entry is
   `false` in the manifest and its `url` is `null`.
4. A **Linux AppImage** entry is rendered as a disabled or visually greyed-out element
   labelled "Coming Soon" (or equivalent) — because the `available` field for this entry is
   `false` in the manifest and its `url` is `null`.
5. Disabled platform elements must not be interactive `<a>` elements with valid `href`
   attributes; they must be rendered as `<button disabled>`, `<span>`, or `<a>` with
   `aria-disabled="true"` and no `href`, so that keyboard navigation does not land on a
   non-functional link.

---

### AC-07 — Technical features (for US-07)

**Given** a visitor views the Technical Features section,

**When** the section renders,

**Then** all five of the following are individually represented (as cards, list items, or
badge-style chips — not as a single sentence):
- "Offline Support" (or "Offline")
- "Local Data Storage" (or "Local Storage")
- "Fast Calculations"
- "Responsive Design"
- "Secure Data Handling" (or "Secure")

---

### AC-08 — Use case cards (for US-08)

**Given** a visitor views the Testimonials / Use Cases section,

**When** the section renders,

**Then** exactly four cards are present, one for each of:
- Startup Founders
- Marketing Managers
- Financial Analysts
- Small Business Owners

Each card must include a role label and at least one sentence describing how that persona
benefits from the tool.

---

### AC-09 — FAQ (for US-09)

**Given** a visitor views the FAQ section,

**When** the section renders,

**Then** all five of the following questions are present (exact wording may vary; each
topic must be covered):
1. Whether the calculator is free.
2. Whether it works offline.
3. Whether user data is stored online.
4. Whether multiple investments can be compared.
5. Whether reports can be exported.

Each FAQ item must have an answer that is either always visible or revealed on interaction
(accordion / disclosure pattern). If an accordion is used, clicking a question must toggle
the answer visibility without a page reload.

---

### AC-10 — Footer (for US-10)

**Given** a visitor scrolls to the bottom of the landing page,

**When** the footer renders,

**Then**:
1. The application version (sourced from `public/api/releases.json`, `version` field) is
   displayed, e.g. "v0.1.0".
2. A documentation link is present (`href` may point to an internal anchor, a `/docs` route,
   or an external URL — the element must exist and be non-empty).
3. Contact information (email address, contact form link, or equivalent) is present.
4. A "Privacy Policy" link element is present (`href` may be a placeholder `#privacy`).
5. A "Terms of Service" link element is present (`href` may be a placeholder `#terms`).

---

### AC-11 — Route migration (for US-11)

**Given** the router is configured in `src/main.jsx`,

**When** the updated `<Routes>` block is read,

**Then**:
1. `<Route path="/" element={...}>` renders `LandingPage` wrapped in `ThemeProvider` — not
   the existing `App` component.
2. `<Route path="/app" element={...}>` renders the existing `App` component wrapped in
   `ThemeProvider` (same component, same wrapper, new path).
3. `<Route path="/embed" element={<EmbedPage />}>` is unchanged from the current
   configuration at line 18 of `src/main.jsx`.
4. No other routes are added, removed, or renamed by this feature.

---

### AC-12 — Releases manifest (for US-12)

**Given** the file `public/api/releases.json` is served at the path `/api/releases.json`,

**When** the file is parsed as JSON,

**Then** the following structure is valid:
1. A root `version` string field is present and matches the version displayed in the
   Desktop section and Footer (e.g. `"0.1.0"`).
2. A root `releaseDate` string field is present in ISO 8601 date format (`YYYY-MM-DD`).
3. A root `downloads` array contains exactly four objects, one per platform entry.
4. Each download object has the following fields:
   - `platform` (string): one of `"windows"`, `"macos"`, `"linux"`
   - `type` (string): e.g. `"installer"`, `"portable"`, `"dmg"`, `"appimage"`
   - `label` (string): human-readable name shown in the UI button
   - `filename` (string): the expected filename of the release artifact
   - `sizeBytes` (number or null): file size in bytes, or `null` if not yet available
   - `url` (string or null): relative or absolute URL to the download file, or `null` if
     `available` is `false`
   - `available` (boolean): `true` for Windows Installer and Windows Portable; `false` for
     macOS Installer and Linux AppImage
5. The two entries with `available: false` must have `url: null`.

---

### AC-13 — SEO meta tags (for US-13)

**Given** `index.html` is served to a browser or crawler,

**When** the `<head>` section is parsed,

**Then** all of the following tags are present:
1. `<title>` contains a meaningful description — not the current placeholder value
   `"roi-calculator"` — for example: `"ROI Calculator — Calculate Investment Returns Online"`.
2. `<meta name="description" content="...">` with at least 50 characters describing the tool.
3. `<meta property="og:title" content="...">` present.
4. `<meta property="og:description" content="...">` present.
5. `<meta property="og:type" content="website">` present.
6. None of these tags duplicate an identical `<meta>` with the same `name` or `property`
   attribute elsewhere in `<head>`.

---

### AC-14 — Responsive layout and theming (for US-14)

**Given** `ThemeProvider` in `src/context/ThemeContext.jsx` applies Tailwind's `.dark` class
to `document.documentElement` (line 14–16 of ThemeContext.jsx) and persists the preference to
`localStorage` under the key `"roi-theme"` (line 20),

**When** a visitor loads `/` in any theme or screen width,

**Then**:
1. `LandingPage` is a descendant of `<ThemeProvider>` in the component tree rendered at the
   `/` route in `src/main.jsx` — same wrapping pattern as the existing `/app` route.
2. `LandingPage` (or a header component within it) calls `useTheme()` from
   `src/context/ThemeContext.jsx` and renders a theme-toggle button, so that the user can
   switch between light and dark modes on the landing page itself.
3. All section backgrounds, text colours, and borders use Tailwind `dark:` variants (e.g.
   `dark:bg-gray-950`, `dark:text-white`) consistent with the palette used in `App.jsx`
   (`bg-gray-50 dark:bg-gray-950`, `text-gray-900 dark:text-white`).
4. At viewport width 375 px (iPhone SE), no horizontal scroll bar appears and all text
   remains readable without zooming.
5. At viewport width 768 px (tablet), the Features grid collapses from a multi-column layout
   to a two-column or single-column layout.
6. At viewport width 1280 px and above (desktop), the page matches the intended full-width
   design with multi-column sections.
7. No JavaScript animation or scroll-driven effect causes layout shifts visible at 60 fps on
   a mid-range device (animations must use CSS `transition` or `animation` properties, not
   `setInterval`-driven position updates).

---

## Scope & Constraints

**In scope:**
- New page component `src/pages/LandingPage.jsx` (and optional sub-components under
  `src/components/landing/` if the developer chooses to split sections)
- Route table update in `src/main.jsx`: add `/app`, rename `/` to landing, keep `/embed`
- Static releases manifest `public/api/releases.json`
- SEO tags in `index.html`
- Dark/light theme support via existing `ThemeProvider` and `useTheme()` — no changes to
  `src/context/ThemeContext.jsx`
- Subtle CSS animations and hover transitions using Tailwind utility classes

**Out of scope:**
- Changes to `src/components/CalculatorCore.jsx`, `src/components/InputForm.jsx`, or any
  other existing calculator components
- Changes to `src/pages/EmbedPage.jsx` or the `/embed` route
- A server-side API for release metadata (the manifest is a static JSON file)
- A real download CDN or S3 bucket — URL fields in the manifest are placeholders; active
  links must resolve to valid files but stub paths are acceptable for the initial sprint
- Authentication, user accounts, or any back-end infrastructure
- Animation libraries (Framer Motion, GSAP, etc.) — all motion via Tailwind utilities only,
  per the "no new npm dependencies unless essential" constraint
- A live fetch of the releases manifest on page load — the manifest may be imported as a
  static JSON module (Vite supports `import data from '/public/api/releases.json'`) or
  fetched; either approach is acceptable, but a runtime network error must not crash the page

**Technical notes for developer:**

- **`src/main.jsx` (route changes):** Replace the current `<Route path="/" element={
  <ThemeProvider><App /></ThemeProvider>} />` with two routes:
  ```jsx
  <Route path="/"    element={<ThemeProvider><LandingPage /></ThemeProvider>} />
  <Route path="/app" element={<ThemeProvider><App /></ThemeProvider>} />
  ```
  Import `LandingPage` from `'./pages/LandingPage.jsx'`. The `/embed` route at line 18
  must not change.

- **`src/pages/LandingPage.jsx`:** New file. Should not import `CalculatorCore` — the
  landing page is a pure marketing page. Use `<Link to="/app">` from `react-router-dom`
  for the "Start Calculating" CTA to stay within the SPA router. The "Download Desktop App"
  secondary CTA and the Desktop section's "Download Now" button should target `#download`
  via a smooth-scroll anchor or `scrollIntoView`.

- **`public/api/releases.json`:** Place under `public/api/` so that Vite serves it at
  `/api/releases.json` in dev and copies it to `dist/api/releases.json` at build time.
  Minimum shape:
  ```json
  {
    "version": "0.1.0",
    "releaseDate": "YYYY-MM-DD",
    "downloads": [
      {
        "platform": "windows",
        "type": "installer",
        "label": "Windows Installer (.exe)",
        "filename": "ROI-Calculator_0.1.0_x64-setup.exe",
        "sizeBytes": null,
        "url": "/downloads/ROI-Calculator_0.1.0_x64-setup.exe",
        "available": true
      },
      {
        "platform": "windows",
        "type": "portable",
        "label": "Windows Portable (.exe)",
        "filename": "ROI-Calculator_0.1.0_x64.exe",
        "sizeBytes": null,
        "url": "/downloads/ROI-Calculator_0.1.0_x64.exe",
        "available": true
      },
      {
        "platform": "macos",
        "type": "dmg",
        "label": "macOS Installer (.dmg)",
        "filename": "ROI-Calculator_0.1.0_x64.dmg",
        "sizeBytes": null,
        "url": null,
        "available": false
      },
      {
        "platform": "linux",
        "type": "appimage",
        "label": "Linux AppImage",
        "filename": "ROI-Calculator_0.1.0_amd64.AppImage",
        "sizeBytes": null,
        "url": null,
        "available": false
      }
    ]
  }
  ```

- **`index.html` (SEO):** The current `<title>roi-calculator</title>` (line 6) must be
  replaced and the following meta tags added inside `<head>` before the closing `</head>`:
  ```html
  <title>ROI Calculator — Calculate Investment Returns Online</title>
  <meta name="description" content="Calculate ROI, compare investment scenarios, view monthly breakdowns, and export professional reports. Works online and as an offline desktop app." />
  <meta property="og:title" content="ROI Calculator — Calculate Investment Returns Online" />
  <meta property="og:description" content="Analyze investments, compare scenarios, and generate PDF reports in minutes. Free online tool with an optional offline desktop version." />
  <meta property="og:type" content="website" />
  ```

- **Colour palette:** Use the same Tailwind tokens already present in `App.jsx`: primary
  indigo (`indigo-600`, `indigo-700`, `hover:indigo-700`) for CTAs, `gray-50` / `gray-950`
  for page backgrounds, `gray-900` / `gray-800` for cards in dark mode, `gray-200` /
  `gray-700` for borders. This guarantees visual consistency without introducing new design
  tokens.

- **Animation constraint:** Use only Tailwind's built-in `transition-*`, `duration-*`,
  `ease-*`, and `hover:scale-*` utilities. Do not install Framer Motion or any other
  animation library. Entrance animations (e.g. fade-in on scroll) may use the
  `@keyframes` / `animate-` mechanism already available via Tailwind's `animation` utilities
  without adding new packages.

- **Version display:** The `version` field of `releases.json` is the authoritative source
  for the version string shown in the Desktop section and Footer. Do not hard-code the version
  string inline in JSX; derive it from the manifest import or fetch result so that a single
  manifest update propagates everywhere.

- **Tauri desktop app:** The landing page is a web page only. It must not import or call
  `@tauri-apps/api` or any `@tauri-apps/plugin-*` package, as those imports will throw
  when the page is loaded in a standard browser (non-Tauri context).

---

## Test Hints for QA

**Routing (AC-11):**
1. Navigate to `/` — confirm the landing page (not the calculator) loads.
2. Navigate to `/app` — confirm the calculator loads and is fully functional (InputForm,
   ResultCards, PaybackChart all visible).
3. Navigate to `/embed` — confirm EmbedPage loads unchanged (CalculatorCore visible,
   no header, no landing content).
4. Using `<Link to="/app">` on "Start Calculating" — click the button and confirm no full
   page reload occurs (the React app stays mounted; network tab shows no new HTML document
   request).

**Hero CTAs (AC-01):**
5. Click "Download Desktop App" — confirm the viewport smoothly scrolls to the Download
   section and the URL hash changes to `#download` (or scrollIntoView fires without hash
   change — either is acceptable; confirm no 404).

**Downloads (AC-06):**
6. Confirm Windows Installer and Windows Portable buttons are clickable `<a>` elements with
   `href` values that are not empty or `#`.
7. Confirm macOS and Linux entries are not clickable `<a>` elements — tab through them and
   confirm focus is not placed on an interactive link.
8. Temporarily set `available: false` for Windows Installer in `public/api/releases.json`,
   reload, and confirm the button becomes disabled / "Coming Soon". Restore afterwards.

**Releases manifest (AC-12):**
9. Fetch `/api/releases.json` directly in the browser — confirm it returns valid JSON with
   status 200 and `Content-Type: application/json`.
10. Validate the JSON shape matches the schema in the Technical Notes: four download objects,
    correct `available` booleans, `url: null` for disabled entries.

**FAQ accordion (AC-09):**
11. Click each FAQ question in turn — confirm the answer appears and that clicking the same
    question again collapses it (or that clicking a different question collapses the previous
    one, if a single-open accordion is implemented).
12. Confirm the FAQ section is operable by keyboard: Tab to question, Enter to expand.

**Theme (AC-14):**
13. Toggle theme on the landing page — confirm the `dark` class is added/removed on
    `<html>`, and confirm that `localStorage.getItem('roi-theme')` reflects the new value.
14. Reload the page after toggling — confirm the theme persists (ThemeContext reads from
    `localStorage` on init at `ThemeContext.jsx` line 7–9).
15. Navigate from `/` to `/app` after toggling theme — confirm the theme is still applied on
    the calculator page (same `ThemeProvider` wrapping both routes means state is fresh on
    each mount, but `localStorage` persistence ensures consistency).

**Responsive layout (AC-14):**
16. At 375 px viewport width: no horizontal scroll, all text legible, CTA buttons full-width
    or appropriately sized.
17. At 768 px viewport width: features grid shows two columns or one column (not four), hero
    layout stacks vertically.
18. At 1280 px: multi-column layouts visible in Features, Benefits, and Use Cases sections.

**SEO (AC-13):**
19. View page source (`Ctrl+U`) — confirm `<title>` does not contain the string
    `"roi-calculator"` verbatim and contains at least the phrase "ROI Calculator".
20. Confirm `<meta name="description">` is present with a `content` attribute of 50+
    characters.
21. Confirm `og:title`, `og:description`, and `og:type` meta tags are present.

**No Tauri imports on landing page:**
22. Open browser DevTools console on `/` — confirm no errors of the form
    `"Cannot find module '@tauri-apps/api'"` or `"__TAURI__ is not defined"`.

**Edge cases:**
- If `releases.json` cannot be fetched (simulate by renaming the file): the Download section
  must degrade gracefully — show an error message or a loading/unavailable state rather than
  crashing the page with an unhandled promise rejection.
- If `sizeBytes` is `null` in the manifest, the download button must not render "null bytes"
  — file size display must be omitted or shown as "—" when the field is null.
- Dark mode: all eight feature cards, all four use-case cards, and all FAQ answers must be
  legible (sufficient contrast) in dark mode; no white-on-white or dark-on-dark text.

**Files expected to be created or modified by this feature:**

- `src/pages/LandingPage.jsx` — new (primary deliverable)
- `src/components/landing/` — new directory (optional; only if developer splits sections)
- `src/main.jsx` — modified (route table)
- `public/api/releases.json` — new
- `index.html` — modified (SEO tags)
- `src/context/ThemeContext.jsx` — no changes expected
- `src/components/CalculatorCore.jsx` — no changes expected
- `src/pages/EmbedPage.jsx` — no changes expected

---

## Implementation Notes

**Implemented on:** 2026-07-30

**Branch:** `feature/landing-page`

**Commits:**
- `feat(FEAT-002): add landing page and releases manifest`
- `feat(FEAT-002): add /app route and update SEO meta tags`

**Architecture decisions:**

- `LandingPage.jsx` is a single self-contained file (~430 lines). All 11 section components are co-located in the same file as named functions (no `src/components/landing/` split needed at this size).
- Release data is fetched once at the `LandingPage` root via `useEffect` / `fetch('/api/releases.json')`. State (`releases`, `releasesLoading`, `releasesError`) is passed as props to `DesktopVersion`, `Download`, and `Footer`. This avoids duplicating fetches and enables graceful loading/error states.
- `releases.json` uses the schema from AC-12 exactly: lowercase `platform` values (`"windows"`, `"macos"`, `"linux"`), `sizeBytes: null` (no builds hosted yet), and the second Windows entry is `type: "portable"` per AC-06 item 2.
- Disabled download entries are rendered as `<span aria-disabled="true">` — they are not `<a>` elements, satisfying AC-06 item 5 (keyboard navigation does not land on a non-functional link).
- `public/api/releases.json` is served statically by Vite in dev and copied to `dist/api/releases.json` at build time — no server-side API required.
- The FAQ accordion uses a single `openIndex` state; clicking an open item collapses it, clicking a different item opens that one (single-open pattern). Each trigger is a `<button>` with `aria-expanded` for keyboard and screen-reader accessibility.
- No new npm packages were introduced. All animations use Tailwind `transition`, `duration-200`, `hover:-translate-y-1`, and `hover:scale-105` utilities.

**Build status:** `npm run build` exits 0. The large-chunk warning is pre-existing (Recharts + jspdf bundles); no new code contributed to it.

**AC coverage:**
- AC-01: h1 = "Calculate ROI with Confidence", "Start Calculating" Link to="/app", "Download Desktop App" scrollIntoView, mockup present
- AC-02: All 8 feature titles present as individual cards
- AC-03: All 5 benefit concepts present as list items
- AC-04: 3 numbered steps (1/2/3), each with correct description
- AC-05: Windows + macOS badges, version from releases.json, "Download Now" → #download
- AC-06: id="download" on section, Windows links active &lt;a&gt;, macOS/Linux as &lt;span aria-disabled&gt;
- AC-07: 5 technical feature cards (Offline Support, Local Data Storage, Fast Calculations, Responsive Design, Secure Data Handling)
- AC-08: 4 use-case cards (Startup Founders, Marketing Managers, Financial Analysts, Small Business Owners)
- AC-09: 5 FAQ accordion items covering all required topics
- AC-10: Footer has version, documentation link, contact email, Privacy Policy, Terms of Service
- AC-11: / → LandingPage in ThemeProvider, /app → App in ThemeProvider, /embed unchanged
- AC-12: releases.json validated — 4 entries, correct schema, available booleans, url:null for disabled
- AC-13: title, meta description (80+ chars), og:title, og:description, og:type all present
- AC-14: LandingPage is a child of ThemeProvider; Navbar calls useTheme() and renders toggle; all sections use dark: variants; responsive grid (1→2→4 col for features)
