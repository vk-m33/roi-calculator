# Security Decisions — ROI Calculator

This document records every security decision made during the FEAT-001 review,
including explicit "not required" decisions, so that the security posture of the
application is auditable by developers, QA, and future maintainers.

---

## 1. localStorage

**Key:** `roi-theme`  
**Values:** `'light'` or `'dark'` only  
**Sensitivity:** Non-Sensitive  
**Decision:** Encryption is not required or appropriate.

**Rationale:** The only value written to localStorage is a UI display preference.
No financial inputs, calculation results, scenario data, or personally identifiable
information are ever written to browser storage, sessionStorage, or IndexedDB.
A cross-tab or extension read of `roi-theme` discloses nothing sensitive.
Source: `src/context/ThemeContext.jsx` — `localStorage.setItem('roi-theme', theme)`.

---

## 2. PDF export filename

**Pattern:** `ROI-Analysis-YYYY-MM-DD.pdf`  
**Sensitivity:** N/A (filename only)  
**Decision:** No sanitisation required.

**Rationale:** The filename is constructed exclusively from the system clock via
`isoDate()` (`new Date().toISOString().slice(0, 10)`). No user-controlled input
(investment amounts, labels, scenario names) is interpolated at any point.
The resulting string is always of the form `ROI-Analysis-YYYY-MM-DD.pdf` and
contains no characters that could be misused for path traversal.
Source: `src/utils/exportPDF.js` — `doc.save(...)` call.

**Future constraint:** If a CSV export is added, its filename must follow the same
constraint (system date only, no user input) and this section must be updated.

---

## 3. `?theme=` URL parameter

**Parameter:** `theme` on the `/embed` route  
**Accepted values:** `'light'` or `'dark'`  
**Sensitivity:** Non-Sensitive  
**Decision:** Safe as-is; no additional protection required.

**Rationale:** `EmbedThemeProvider` in `src/context/ThemeContext.jsx` validates the
parameter with an explicit two-value allowlist (`t === 'light' || t === 'dark'`).
Any other value — including URL-encoded script tags or other injection payloads —
is silently ignored and the page falls back to the system colour-scheme preference.
There is no eval, innerHTML assignment, or other dangerous sink reachable from this
parameter.

---

## 4. Scenario labels in the UI

**Data:** User-typed scenario names (e.g. "Scenario A")  
**Sensitivity:** Non-Sensitive  
**Decision:** No XSS mitigation required beyond React's built-in escaping.

**Rationale:** Scenario labels are rendered via React JSX (`{label}` text nodes and
controlled `<input>` values). React escapes HTML entities before DOM insertion for
all text content, so a label containing `<script>alert(1)</script>` renders as
visible text, not executable markup. No `dangerouslySetInnerHTML` is used anywhere
in the label rendering path.

---

## 5. Third-party runtime dependencies

The following runtime dependencies are used (from `package.json`):

| Package | Version | Purpose |
|---|---|---|
| `react` / `react-dom` | ^19.2.7 | UI framework |
| `react-router-dom` | ^7.18.2 | Client-side routing |
| `recharts` | ^3.10.1 | Chart rendering (SVG) |
| `jspdf` | ^4.2.1 | PDF generation |
| `jspdf-autotable` | ^5.0.8 | PDF table plugin |
| `@tauri-apps/api` | ^2.11.1 | Native desktop bridge |

**Native OS access scope (`@tauri-apps/api`):** The Tauri v2 capabilities are
defined in `src-tauri/capabilities/default.json`. The granted permissions are
`core:default` and `opener:default`. `core:default` covers the minimal IPC
surface needed for a Tauri window to function (window management, app metadata).
`opener:default` allows opening URLs and files via the OS default handler, which
is required for the PDF download flow. No file-system read/write permissions,
clipboard access beyond the web standard, or shell-execution capabilities are
granted. These are the minimum permissions required for the app to function.

None of the above dependencies access sensitive system APIs beyond what Tauri
explicitly grants via `capabilities/default.json`.

---

## 6. Remaining risks and accepted trade-offs

**PDF and (future) CSV exports — unencrypted files on disk**  
Exported files are written to the user's local file system without encryption.
This is accepted for a local desktop application: the operating system's
file-system permissions and user-account isolation provide the primary security
boundary. No server transmission occurs. Risk: Low.

**Embed widget and HTTPS**  
The sandbox attribute `allow-scripts allow-same-origin allow-forms` requires the
host page to serve the embed over HTTPS for the sandbox to function correctly in
all browsers (some browsers block `allow-same-origin` + `allow-scripts` over HTTP
as a security measure). An advisory warning is displayed in the Embed modal when
the configured Base URL uses `http://`. Integrators are responsible for ensuring
HTTPS in production. Risk: Low (advisory warning implemented in AC-07).

**`document.execCommand('copy')` clipboard fallback in EmbedModal.jsx**  
The `execCommand('copy')` fallback used when `navigator.clipboard` is unavailable
is deprecated since Chrome 86 / Firefox 90. It is not a security vulnerability in
this context (the value being copied is already visible in the `<pre>` block) but
it should be removed in a follow-up cleanup. A `// TODO` comment marks the location.
Risk: Negligible.
