# FEAT-001: Security Review and Data Protection
Status: TESTED
Priority: High
Requested by: business-analyst

## Business Goal

Perform a comprehensive security review of the ROI Calculator and implement appropriate
encryption and data-protection measures so that sensitive financial data is handled safely —
whether stored locally, exported to PDF, embedded in third-party sites, or displayed in the UI.
The review must produce a documented, auditable record of every decision (including explicit
"not needed" decisions) so that the security posture of the application is clear to developers,
QA, and future maintainers.

---

## User Stories

**US-01 — Data classification**
As a data protection officer, I want a documented classification of every data type the
application handles (financial inputs, calculation results, localStorage, PDF exports, URL
parameters), so that I know unambiguously which items are sensitive and whether each requires
encryption or additional protection.

**US-02 — localStorage review**
As a security reviewer, I want confirmation that nothing sensitive is stored in browser storage,
so that a user's financial data cannot be extracted by another browser tab or a browser
extension that reads localStorage.

**US-03 — Embed snippet injection prevention**
As an integrator copying the iframe snippet from the Embed modal, I want the generated HTML to
be safe regardless of what I type into the Base URL field, so that a malformed or adversarial
URL cannot break the src attribute or inject unexpected HTML into my host page.

**US-04 — Iframe sandbox hardening**
As a site owner embedding the calculator, I want the generated iframe snippet to include a
sandbox attribute and a restrictive referrer policy, so that the embedded calculator cannot
escalate privileges on my host page.

**US-05 — Input overflow protection**
As a user, I want the application to reject out-of-range numeric inputs before they reach the
calculation engine, so that entering an astronomically large number (e.g. 1e308) does not
produce Infinity, NaN, or silent miscalculation in results or the exported PDF.

**US-06 — Export filename safety**
As a user, I want the exported PDF filename to contain only safe characters derived from a
system date, so that the file cannot be misused for path traversal and the review confirms this
is permanently the case.

**US-07 — HTTPS and embed URL guidance**
As a developer deploying the calculator, I want clear guidance (and, where possible, a runtime
warning) that the embed widget's Base URL must use HTTPS, so that financial data entered into
an embedded calculator is never transmitted over an unencrypted connection.

**US-08 — Dependency vulnerability audit**
As a developer, I want all runtime dependencies checked for known CVEs and the results
documented, so that no high- or critical-severity vulnerability ships unaddressed.

---

## Acceptance Criteria

### AC-01 — Data classification (for US-01)

**Given** the application handles the following data types:
financial inputs in component state (investment, monthlyRevenue, monthlyCosts, discountRate,
period), calculation results in component state (ROI, NPV, IRR, paybackMonths, chartData),
the localStorage key `roi-theme` (values `'light'` or `'dark'`), the PDF file produced by
exportPDF.js, and the `?theme=` URL query parameter used by EmbedThemeProvider,

**When** a developer reads the security notes in FEAT-001 or an agreed code comment block,

**Then** each item has an explicit sensitivity label (Non-Sensitive / Sensitive / Restricted),
a documented decision on whether encryption is required, and a rationale — at minimum:
- Financial inputs and results: Sensitive / in-memory only / no browser storage / no encryption
  required at rest (ephemeral); recommend HTTPS for transit when embedded.
- `roi-theme`: Non-Sensitive / public value / no encryption required — accepted by design.
- PDF export: Sensitive / client-side download only / no server storage / integrity markers
  not required but filename must be safe.
- `?theme=` URL param: Non-Sensitive / validated to `'light'` or `'dark'` only.

---

### AC-02 — localStorage review (for US-02)

**Given** ThemeContext.jsx line 19 writes `localStorage.setItem('roi-theme', theme)` where
`theme` is always either `'light'` or `'dark'`,

**When** a reviewer inspects localStorage after using the application,

**Then**:
1. No financial inputs, calculation results, or scenario data are present in localStorage,
   sessionStorage, or IndexedDB.
2. The only key present is `roi-theme` with a value of `'light'` or `'dark'`.
3. A code comment in ThemeContext.jsx at the `localStorage.setItem` call explicitly documents:
   "Only a UI preference (non-sensitive) is stored; encryption is not required."

---

### AC-03 — Embed snippet injection prevention (for US-03)

**Given** EmbedModal.jsx line 169 provides a free-text `type="url"` input for `baseUrl`, and
the catch-block fallback at line 75 currently builds the embed URL via bare string
concatenation (`` `${baseUrl.trim()}/embed${themeParam}` ``) without encoding special characters,

**When** a user enters a `baseUrl` value containing `"`, `>`, or other HTML-special characters
(e.g. `https://evil.com" onload="alert(1)`),

**Then**:
1. The catch-block fallback is removed or replaced so that only well-formed URLs produced by
   the `new URL()` constructor at line 71 are used in the embed snippet; if the URL constructor
   throws, the snippet displays an inline error message rather than falling back to raw string
   concatenation.
2. The resulting `src` attribute value in the displayed embed code contains no unescaped `"`
   or `>` characters that could break the attribute boundary.
3. A manual test confirms that pasting the generated snippet into an HTML page does not
   introduce any new attributes or tags beyond the intended `<iframe>` element.

---

### AC-04 — Iframe sandbox hardening (for US-04)

**Given** the `embedCode` string built at EmbedModal.jsx lines 80–89 currently produces:
```
<iframe
  src="..."
  width="..."
  height="..."
  frameborder="0"
  style="border: none; border-radius: 12px;"
  title="ROI Calculator"
></iframe>
```
with no `sandbox`, `allow`, or `referrerpolicy` attributes,

**When** the updated embed snippet is generated,

**Then** the snippet includes at minimum:
1. `sandbox="allow-scripts allow-same-origin allow-forms"` — the minimum set needed for the
   React app and form inputs inside the iframe to function; no `allow-top-navigation` or
   `allow-popups` unless a documented use-case requires them.
2. `referrerpolicy="no-referrer"` — so that the host page URL is not leaked to the embedded
   origin's server logs.
3. These two new attributes are visible in the code block displayed in the Embed modal's
   "Embed Code" panel and in any snippet copied to clipboard.

---

### AC-05 — Input overflow protection (for US-05)

**Given** the `validate()` function in CalculatorCore.jsx lines 17–49 currently imposes no
upper bound on `investment`, `monthlyRevenue`, or `monthlyCosts`, and the `InputForm.jsx`
`CurrencyField` components (line 82) do not set an HTML `max` attribute,

**When** a user enters a value equal to or greater than 1,000,000,000,000 (one trillion) in
any currency field, or enters a value that causes `parseFloat` to produce `Infinity` (e.g.
`1e309`),

**Then**:
1. The `validate()` function returns a non-empty error string such as "Maximum value is
   $999,999,999,999" for that field.
2. `isFormValid()` returns `false` and `calculate()` is not called.
3. The results panel shows `EmptyResults` (the "Fix the errors above" placeholder).
4. No result card displays `Infinity`, `NaN`, or an empty value.
5. The guard is also applied inside `computeIRR()` (lines 61–83): if either argument is
   `Infinity` or `NaN`, the function returns `null` rather than entering the binary search.

---

### AC-06 — Export filename safety (for US-06)

**Given** the PDF save call at exportPDF.js line 392 is
`doc.save(`ROI-Analysis-${isoDate()}.pdf`)` where `isoDate()` at line 35 returns
`new Date().toISOString().slice(0, 10)` — a value of the form `YYYY-MM-DD` derived
entirely from the system clock with no user input,

**When** a developer reviews the filename construction,

**Then**:
1. A code comment is added at the `doc.save()` call confirming: "Filename is derived from the
   system date only; no user input is interpolated; no sanitisation required."
2. The review confirms that none of the user-controlled inputs (investment, labels, scenario
   names) are interpolated into the filename at any point.
3. If a CSV export is added in a future feature, its filename must follow the same constraint
   and the FEAT-001 scope comment must be updated.

---

### AC-07 — HTTPS guidance for embed URL (for US-07)

**Given** the Base URL field in EmbedModal.jsx (line 169) accepts any string including
`http://` URLs, and the `new URL()` constructor at line 71 does not enforce HTTPS,

**When** a user enters an `http://` URL in the Base URL field,

**Then**:
1. A visible inline warning is displayed below the Base URL field (e.g. "Warning: HTTP URLs
   transmit financial data without encryption. Use HTTPS for production deployments.").
2. The warning does not block generation of the embed code (it is advisory, not a hard
   error), as HTTP may be valid in local development.
3. The check is implemented as a simple `baseUrl.trim().startsWith('http://')` condition
   in EmbedModal.jsx.

---

### AC-08 — Dependency vulnerability audit (for US-08)

**Given** the runtime dependencies in package.json are: `@tauri-apps/api ^2.11.1`,
`jspdf ^4.2.1`, `jspdf-autotable ^5.0.8`, `react ^19.2.7`, `react-dom ^19.2.7`,
`react-router-dom ^7.18.2`, `recharts ^3.10.1`,

**When** `npm audit` is run against the installed versions and the output is reviewed,

**Then**:
1. Any finding rated **high** or **critical** is either remediated (version bump or patch)
   or has a written accepted-risk note with a proposed remediation date.
2. The `@tauri-apps/api` dependency's native-OS access scope is reviewed in
   `src-tauri/tauri.conf.json` (allowlist / capabilities config) and the granted permissions
   are confirmed to be the minimum required; a comment in that file or in this ticket records
   which permissions are enabled and why.
3. The deprecated `document.execCommand('copy')` fallback at EmbedModal.jsx lines 96–103 is
   noted as a minor finding; it is not a security vulnerability but should be removed in a
   follow-up cleanup.
4. A copy of the `npm audit` output (or a summary of findings and their dispositions) is
   attached to the pull request that closes this ticket.

---

## Scope & Constraints

**In scope:**
- Security classification and documentation of all data the app handles (US-01, AC-01)
- Review and comment on localStorage usage in ThemeContext.jsx (US-02, AC-02)
- EmbedModal.jsx baseUrl sanitisation — removing the raw-string-concatenation fallback at
  line 75 (US-03, AC-03)
- EmbedModal.jsx generated snippet hardening — adding `sandbox` and `referrerpolicy` attributes
  to the generated iframe HTML (US-04, AC-04)
- CalculatorCore.jsx validation — adding upper-bound guards in `validate()` and a NaN/Infinity
  guard in `computeIRR()` (US-05, AC-05)
- exportPDF.js filename confirmation and code comment (US-06, AC-06)
- EmbedModal.jsx HTTP warning for non-HTTPS base URLs (US-07, AC-07)
- Dependency audit of package.json runtime dependencies and src-tauri capabilities review
  (US-08, AC-08)

**Out of scope:**
- Backend or server-side security hardening (the application is fully client-side / offline-first
  with no server component)
- Authentication or access control (there are no user accounts)
- Encryption of in-memory financial inputs (ephemeral browser process memory)
- Content Security Policy (CSP) header configuration — this belongs in server/deployment config
  and is out of scope for a client-side React/Tauri project
- Adding a CSV export feature (not yet implemented; filename safety requirement noted in AC-06
  for when it is added)
- Penetration testing or automated DAST scanning

**Technical notes for developer:**

- **EmbedModal.jsx line 75 (CRITICAL):** The catch block `return \`${baseUrl.trim()}/embed${themeParam}\``
  performs unencoded string interpolation of user input directly into HTML attribute content.
  Replace the catch block body with a user-visible validation error: if `new URL()` throws,
  set an error state (e.g. `embedUrlError`) displayed below the Base URL field and render
  an error placeholder in the embed code panel instead of the malformed snippet. Do not fall
  back to string concatenation.

- **EmbedModal.jsx lines 80–89 (HIGH):** The `embedCode` array must be extended to include
  `'  sandbox="allow-scripts allow-same-origin allow-forms"'` and
  `'  referrerpolicy="no-referrer"'`. These lines should appear after the existing
  `frameborder="0"` line. Both the displayed `<pre>` block and the clipboard copy will
  automatically pick up the change since they both use the same `embedCode` string.

- **EmbedModal.jsx line 67 (INFO):** The `previewUrl` is correctly hardcoded to
  `window.location.origin` and is not affected by the `baseUrl` input. The live preview
  iframe inside the modal is therefore not subject to the injection risk. No change needed
  for the preview iframe.

- **EmbedModal.jsx lines 96–103 (LOW):** The `document.execCommand('copy')` fallback is
  deprecated since Chrome 86 / Firefox 90. It is not a security vulnerability in this context
  (the value being copied is already visible in the `<pre>` block) but it should be removed
  in a follow-up. For now, add a `// TODO: remove deprecated execCommand fallback` comment.

- **CalculatorCore.jsx lines 17–49:** Add a shared constant `MAX_CURRENCY = 999_999_999_999`
  (or 1e12 − 1). Apply it in the `investment`, `monthlyRevenue`, and `monthlyCosts` branches
  of `validate()`. Also add an explicit guard at the top of `computeIRR()` (line 61):
  `if (!isFinite(investment) || !isFinite(monthlyNet)) return null`.

- **CalculatorCore.jsx line 42:** The `period` field validation currently returns `''`
  unconditionally. Because `period` is a `<select>` constrained to values `'12'`, `'24'`,
  `'36'` (InputForm.jsx lines 37–41), direct manipulation via DevTools is the only attack
  vector. The developer should nonetheless add a guard in `calculate()`: clamp
  `parseInt(inputs.period)` to the range [1, 120] before use. This is a defence-in-depth
  measure, not a critical fix.

- **ThemeContext.jsx line 19:** Add a one-line comment above `localStorage.setItem`:
  `// Security: stores only the UI theme preference ('light'|'dark'); not sensitive; no encryption required.`

- **exportPDF.js line 392:** Add a comment above `doc.save(...)`:
  `// Security: filename uses system date only; no user input is interpolated.`

- **package.json / src-tauri:** The Tauri runtime grants native OS access significantly beyond
  what a pure web app has. Review `src-tauri/tauri.conf.json` (Tauri v2: `capabilities/*.json`
  or `tauri.conf.json` `app.security` section) and confirm that only the file-system access
  needed for the PDF download is granted. Revoke any capability not actively used.

- **ThemeContext.jsx lines 33–36 (EmbedThemeProvider):** The `?theme=` query parameter is
  validated with an explicit allowlist (`t === 'light' || t === 'dark'`). This is correct and
  requires no change. Add a brief comment confirming the allowlist validation.

---

## Test Hints for QA

**Key scenarios to cover:**

1. **BaseUrl HTML injection (AC-03):** Open the Embed modal. In the Base URL field, enter
   `https://evil.com" onload="alert(1)`. Verify that (a) the embed code panel shows a
   validation error or a safe encoded URL — not a snippet with a broken src attribute — and
   (b) no `onload` or other injected attribute appears in the displayed snippet.

2. **BaseUrl with angle brackets (AC-03):** Enter `https://example.com/><script>alert(1)</script>`
   as the Base URL. Verify the generated snippet does not contain an unescaped `<script>` tag.

3. **HTTP Base URL warning (AC-07):** Enter `http://example.com` as the Base URL. Verify a
   yellow/amber inline warning appears below the field mentioning HTTPS. Verify the embed code
   is still generated (advisory only).

4. **Sandbox in generated snippet (AC-04):** With a valid Base URL, verify the displayed embed
   code in the `<pre>` block and the clipboard copy both contain
   `sandbox="allow-scripts allow-same-origin allow-forms"` and `referrerpolicy="no-referrer"`.

5. **Currency input overflow (AC-05):** Enter `1e309` in the Initial Investment field. Verify
   an error message appears (e.g. "Maximum value is $999,999,999,999") and no result cards are
   shown. Repeat for Monthly Revenue and Monthly Costs.

6. **Large-but-valid number (AC-05):** Enter `999999999999` (one less than the maximum).
   Verify the input is accepted and results are displayed without `Infinity` or `NaN`.

7. **Scenario label XSS (defence-in-depth):** In comparison mode, rename Scenario A to
   `<img src=x onerror=alert(1)>`. Verify the label renders as visible text and no alert fires.
   This should already pass due to React's JSX escaping; the test confirms it is not regressed.

8. **Theme URL param injection (AC-02 / ThemeContext):** Load `/embed?theme=%3Cscript%3Ealert(1)%3C/script%3E`.
   Verify no alert fires and the page falls back to the system preference (dark or light).

9. **localStorage contents (AC-02):** After using the app (toggle theme, enter inputs, export
   PDF), open DevTools → Application → Local Storage. Verify only one key (`roi-theme`) exists
   with the value `'light'` or `'dark'`. No financial data, no scenario data.

10. **PDF filename (AC-06):** Export a PDF. Verify the downloaded filename matches the pattern
    `ROI-Analysis-YYYY-MM-DD.pdf` where the date is today's date and no other characters appear.

11. **npm audit (AC-08):** Run `npm audit` in the project root. Verify no high or critical
    findings are present (or that each finding has a documented accepted-risk note in the PR).

**Edge cases to watch:**

- Entering `0` for monthly revenue then switching to comparison mode — verify no division-by-zero
  error surfaces in the UI or console.
- Extremely long scenario label (e.g. 500 characters) — verify the UI does not overflow or
  truncate unexpectedly.
- Rapid toggling of the Compare Scenarios button — verify no stale state causes validation
  errors to appear on untouched fields.
- Base URL field left blank in EmbedModal — verify it falls back to `window.location.origin`
  cleanly (line 71: `baseUrl.trim() || window.location.origin`) and does not trigger the HTTP
  warning or any injection.

**Files likely affected:**

- `src/components/EmbedModal.jsx` — primary: baseUrl validation, sandbox attribute, HTTP warning
- `src/components/CalculatorCore.jsx` — upper-bound validation, computeIRR guard
- `src/context/ThemeContext.jsx` — documentation comment only
- `src/utils/exportPDF.js` — documentation comment only
- `src-tauri/tauri.conf.json` (or `src-tauri/capabilities/`) — capability review (no code
  changes expected unless over-privileged)
- `package.json` — version bumps if npm audit finds actionable findings

---

## Implementation Notes

### Files changed

**`src/components/EmbedModal.jsx`** — three security fixes applied:
- *Fix 1 (CRITICAL / AC-03):* Removed the raw-string-concatenation catch-block fallback that
  allowed HTML attribute injection via a malformed `baseUrl`. `embedUrl` is now only set when
  `new URL(trimmedBase)` succeeds; on failure it remains `null`. A `baseUrlError` state is
  displayed below the Base URL field and the embed code panel shows a placeholder instead of
  a broken snippet. The "Copy Code" button is disabled when `embedUrl` is `null`.
- *Fix 2 (HIGH / AC-04):* `sandbox="allow-scripts allow-same-origin allow-forms"` and
  `referrerpolicy="no-referrer"` added to the generated iframe snippet. Both the displayed
  `<pre>` block and the clipboard copy use the same `embedCode` string, so both are updated.
- *Fix 4 (LOW / AC-07):* When `baseUrl` starts with `http://`, an amber inline warning
  ("⚠ HTTP URLs are not secure. Use HTTPS for production deployments.") is displayed below the
  Base URL field. Generation is not blocked (advisory only).

**`src/components/CalculatorCore.jsx`** — three security fixes applied:
- *Fix 3a:* Added `const MAX_CURRENCY = 999_999_999_999` constant near the top of the file.
- *Fix 3b:* Added upper-bound check `inv > MAX_CURRENCY`, `rev > MAX_CURRENCY`, and
  `costs > MAX_CURRENCY` in `validate()` for the three currency fields, after the existing
  lower-bound checks. Returns `"Maximum value is 999,999,999,999"` for any field that exceeds
  the limit.
- *Fix 3c/3d:* Added `if (!isFinite(monthlyNet) || !isFinite(investment)) return null` at
  the top of both `computeIRR()` and `calculate()` to prevent `Infinity`/`NaN` from entering
  the binary-search loop or the results calculation.

**`src/context/ThemeContext.jsx`** — documentation comments only:
- Added `// Security:` comment above `localStorage.setItem` confirming that only the UI theme
  preference is stored and encryption is not required (AC-02).
- Added `// Security:` comment above the `?theme=` allowlist check in `EmbedThemeProvider`
  confirming the two-value allowlist is the correct mitigation (AC-03).

**`src/utils/exportPDF.js`** — documentation comment only:
- Added `// Security:` comment above `doc.save(...)` confirming that the filename is derived
  from the system date only and no user input is interpolated (AC-06).

**`docs/security-decisions.md`** — new file created documenting:
- localStorage (non-sensitive UI preference, no encryption required)
- PDF export filename (system date only, no sanitisation required)
- `?theme=` URL parameter (two-value allowlist, safe)
- Scenario labels (React JSX escaping, no XSS risk)
- Third-party dependencies and Tauri capabilities review
- Remaining accepted risks (unencrypted exports on disk, HTTPS requirement for embed widget)

### QA notes — embed modal URL validation flow

The most critical flow to verify manually is the `baseUrl` injection path (AC-03):

1. Open the Embed modal. The Base URL field is pre-filled with `window.location.origin`
   (always valid); the embed code should render normally with `sandbox` and `referrerpolicy`.
2. Clear the field entirely — the code should still render (falls back to current origin; no
   error shown).
3. Type a valid HTTPS URL (e.g. `https://example.com`) and tab away — no error; code renders
   with the new origin in the `src`.
4. Type an adversarial value such as `https://evil.com" onload="alert(1)` and tab away —
   the field border turns red, the error "Invalid URL — must start with https:// or http://"
   appears below the field, the embed code panel shows the placeholder text, and the Copy
   Code button is greyed out and non-interactive.
5. Type `http://localhost:3000` — no error (HTTP is allowed); the amber HTTP warning appears
   below the field; the embed code is generated normally.
6. Correct the field to a valid HTTPS URL — the error/warning clears and the code panel
   returns to normal.

---

## QA Sign-off

PASSED — All eight acceptance criteria verified by static code inspection and a successful production build (2026-07-30): URL injection fallback removed and error path confirmed (AC-03), sandbox and referrerpolicy attributes present in generated snippet (AC-04), MAX_CURRENCY guard and isFinite guards verified in validate()/computeIRR()/calculate() (AC-05), Security comments confirmed in ThemeContext.jsx and exportPDF.js (AC-02, AC-06), HTTP advisory warning implemented in amber (AC-07), and docs/security-decisions.md covers all required topics (AC-08); four regression checks (embed snippet generation, copy button, normal-input validation, five result cards) all pass; build: PASS.
