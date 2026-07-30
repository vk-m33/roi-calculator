# Test Case Document — ROI Calculator

**Version:** 1.0  
**Date:** 2026-07-30  
**Status:** Baseline

---

## Table of Contents

1. [Scope and Conventions](#1-scope-and-conventions)
2. [Test Cases](#2-test-cases)
   - [2.1 Input Validation](#21-input-validation)
   - [2.2 Core Calculations](#22-core-calculations)
   - [2.3 Result Display](#23-result-display)
   - [2.4 Cumulative Cash Flow Chart](#24-cumulative-cash-flow-chart)
   - [2.5 Monthly Breakdown Table](#25-monthly-breakdown-table)
   - [2.6 PDF Export](#26-pdf-export)
   - [2.7 CSV Export](#27-csv-export)
   - [2.8 Scenario Comparison](#28-scenario-comparison)
   - [2.9 Theme Management](#29-theme-management)
   - [2.10 Embed Widget](#210-embed-widget)
   - [2.11 Routing and Navigation](#211-routing-and-navigation)
   - [2.12 Accessibility and Keyboard Interaction](#212-accessibility-and-keyboard-interaction)

---

## 1. Scope and Conventions

### 1.1 In Scope

- All functional requirements for the web deployment and the Tauri desktop build
- Happy paths, boundary/edge cases, invalid input handling, and cross-feature interactions

### 1.2 Priority Definitions

| Priority | Meaning |
|---|---|
| High | Core business logic; regression in this area blocks a release |
| Med | Important but not blocking; must be fixed before the release |
| Low | Polish / edge case; should be fixed but non-blocking |

### 1.3 Default Valid Inputs

Unless a test specifies otherwise, the following inputs are used as the valid baseline:

| Field | Value |
|---|---|
| Initial Investment | $100,000 |
| Monthly Revenue | $15,000 |
| Monthly Costs | $5,000 |
| Calculation Period | 12 months |

Expected outputs: ROI = +20.0% · Payback = 10.0 months · Net Profit = $20,000

---

## 2. Test Cases

### 2.1 Input Validation

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-001 | Input Validation | Error is hidden before field is touched | App freshly loaded; default inputs pre-filled | 1. Observe Investment field without interacting with it | No error message displayed beneath Investment field | High |
| TC-002 | Input Validation | Required error shown after clearing and blurring Investment | App loaded | 1. Clear the Investment field. 2. Tab away (blur) | Error "Required" appears beneath Investment field; results area shows placeholder | High |
| TC-003 | Input Validation | Investment below minimum ($999) is rejected | App loaded | 1. Enter "999" in Investment. 2. Blur the field | Error "Minimum is $1,000" appears | High |
| TC-004 | Input Validation | Investment at exact minimum ($1,000) is accepted | App loaded | 1. Enter "1000" in Investment. 2. Blur the field. 3. Ensure other fields are valid | No error on Investment; results are calculated | High |
| TC-005 | Input Validation | Non-numeric Investment is rejected | App loaded | 1. Enter "abc" in Investment. 2. Blur | Error "Enter a valid number" appears | High |
| TC-006 | Input Validation | Zero Monthly Revenue is rejected | App loaded | 1. Enter "0" in Monthly Revenue. 2. Blur | Error "Must be greater than $0" appears | High |
| TC-007 | Input Validation | Negative Monthly Revenue is rejected | App loaded | 1. Enter "-500" in Monthly Revenue. 2. Blur | Error "Must be greater than $0" appears | High |
| TC-008 | Input Validation | Negative Monthly Costs is rejected | App loaded | 1. Enter "-1" in Monthly Costs. 2. Blur | Error "Must be $0 or more" appears | High |
| TC-009 | Input Validation | Monthly Costs exceeding Revenue is rejected | App loaded, Revenue = $10,000 | 1. Enter "10001" in Monthly Costs. 2. Blur | Error "Cannot exceed monthly revenue" appears | High |
| TC-010 | Input Validation | Monthly Costs equal to Revenue is rejected | App loaded, Revenue = $10,000 | 1. Enter "10000" in Monthly Costs. 2. Blur | Error "Cannot exceed monthly revenue" appears | High |
| TC-011 | Input Validation | Monthly Costs at zero (minimum boundary) is accepted | App loaded, other fields valid | 1. Enter "0" in Monthly Costs. 2. Blur | No error; results calculated with monthlyNet = monthlyRevenue | High |
| TC-012 | Input Validation | All errors clear when valid values are restored | Multiple fields in error state | 1. Enter valid values in all fields. 2. Blur each | All error messages disappear; result cards render | High |
| TC-013 | Input Validation | Empty Monthly Costs field shows Required error | App loaded | 1. Clear Monthly Costs field. 2. Blur | Error "Required" appears | Med |

### 2.2 Core Calculations

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-014 | Calculations | Standard ROI calculation | Valid inputs: Investment $100k, Revenue $15k, Costs $5k, Period 12 mo | Observe result cards | ROI = +20.0%, Payback = 10.0 months, Net Profit = $20,000 | High |
| TC-015 | Calculations | Negative ROI when net profit is negative | Investment $100k, Revenue $5k, Costs $3k, Period 12 mo | Observe result cards | ROI = −76.0% (monthlyNet=$2k, totalNet=24k−100k=−$76k), Net Profit = −$76,000, ROI card renders in red | High |
| TC-016 | Calculations | Payback "Never" when monthly net is zero | Investment $50k, Revenue $5k, Costs $5k, Period 12 mo | Observe Payback Period card | Payback card displays "Never" in red | High |
| TC-017 | Calculations | Payback period with 24-month horizon | Investment $100k, Revenue $15k, Costs $5k, Period 24 mo | Observe results | ROI = +140.0%, Payback = 10.0 months, Net Profit = $140,000 | High |
| TC-018 | Calculations | Payback period with 36-month horizon | Investment $100k, Revenue $15k, Costs $5k, Period 36 mo | Observe results | ROI = +260.0%, Payback = 10.0 months, Net Profit = $260,000 | High |
| TC-019 | Calculations | Zero monthly costs maximises net | Investment $100k, Revenue $10k, Costs $0, Period 12 mo | Observe results | monthlyNet = $10k, Net Profit = $20,000, ROI = +20.0%, Payback = 10.0 months | Med |
| TC-020 | Calculations | Very large numbers do not cause overflow | Investment $999,999,999, Revenue $999,999,999, Costs $0, Period 12 mo | Enter values and observe | All result cards display formatted large numbers without NaN, Infinity, or layout overflow | Med |
| TC-021 | Calculations | Fractional payback period rounds to one decimal | Investment $100k, Revenue $12k, Costs $2k, Period 12 mo | Observe Payback card | monthlyNet = $10k, Payback = "10.0 months" | Med |
| TC-022 | Calculations | Results update without page reload when period changes | Default valid inputs, Period = 12 months | 1. Change Period dropdown to "24 months" | ROI and Net Profit update immediately reflecting 24-month horizon; no page reload required | High |

### 2.3 Result Display

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-023 | Result Display | Positive values render in green | Default valid inputs | Observe result cards | ROI, Payback, Net Profit values all display in emerald/green color | High |
| TC-024 | Result Display | Negative values render in red | Investment $100k, Revenue $5k, Costs $3k, Period 12 mo (net profit negative) | Observe result cards | ROI and Net Profit cards display in red | High |
| TC-025 | Result Display | "Never" payback renders in red | Monthly Costs = Monthly Revenue | Observe Payback card | "Never" text is displayed in red | High |
| TC-026 | Result Display | Results placeholder shown while any field is invalid | Default inputs loaded | 1. Clear Investment field. 2. Blur | "Fix the errors above to see results" placeholder is shown; metric cards are absent | High |
| TC-027 | Result Display | Currency formatted with no decimal places | Default valid inputs | Observe Net Profit card | Net Profit displayed as "$20,000" (no cents, commas as thousands separator) | Med |

### 2.4 Cumulative Cash Flow Chart

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-028 | Chart | Chart renders with $0 reference line | Default valid inputs | Observe chart section | A dashed horizontal reference line labeled "$0" is visible crossing the chart | High |
| TC-029 | Chart | Chart starts at negative investment value | Default valid inputs | Observe month 0 data point | At month 0 the line is at −$100,000 | High |
| TC-030 | Chart | Chart tooltip shows correct values on hover | Default valid inputs, chart visible | 1. Hover over month 10 on the chart | Tooltip displays "Month 10" and "$0" cumulative cash flow (break-even month) | Med |
| TC-031 | Chart | Chart adapts correctly for 36-month period | Investment $100k, Revenue $15k, Costs $5k, Period 36 months | Observe X-axis | X-axis extends to month 36; tick interval is 6 months (Mo 0, 6, 12, 18, 24, 30, 36) | Med |
| TC-032 | Chart | Chart hidden when form is invalid | Default inputs, then clear Investment and blur | Observe chart area | Chart component is not rendered; only the error placeholder is shown | High |

### 2.5 Monthly Breakdown Table

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-033 | Monthly Breakdown | Table expands and collapses | Default valid inputs, results displayed | 1. Click "Monthly Breakdown" toggle. 2. Click it again | Table rows appear on first click; disappear on second click | High |
| TC-034 | Monthly Breakdown | Break-even row is highlighted | Default valid inputs (break-even at month 10) | Expand monthly breakdown | Month 10 row has emerald background; "Break-even" badge is visible in the month cell | High |
| TC-035 | Monthly Breakdown | Correct row count matches period | Period = 24 months | Expand breakdown | Table contains exactly 24 data rows (months 1–24) | High |
| TC-036 | Monthly Breakdown | Column sort ascending by Cumulative P/L | Default valid inputs, breakdown expanded | Click "Cumulative P/L" header once | Rows sorted from most-negative to most-positive cumulative value; ascending chevron shown | Med |
| TC-037 | Monthly Breakdown | Column sort descending on second click | Default valid inputs, breakdown expanded | Click "Cumulative P/L" header twice | Rows sorted from most-positive to most-negative; descending chevron shown | Med |
| TC-038 | Monthly Breakdown | Default sort is Month ascending | Default valid inputs, breakdown expanded | Observe initial table state | Rows appear in chronological order (month 1 through 12/24/36); "↕" neutral indicator on Month header changes to "↑" when clicked | Med |

### 2.6 PDF Export

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-039 | PDF Export | PDF generates with valid single-mode inputs | Default valid inputs | 1. Click "Export to PDF" | File "ROI-Analysis-YYYY-MM-DD.pdf" is downloaded; contains indigo header, inputs table, metrics table, info card, cash flow chart image, and page footer | High |
| TC-040 | PDF Export | Export button shows loading state | Valid inputs | 1. Click "Export to PDF" and observe immediately | Button label changes to "Generating PDF…" with a spinner animation; button is disabled | High |
| TC-041 | PDF Export | Button returns to normal state after export | Default valid inputs | 1. Click "Export to PDF". 2. Wait for completion | Button reverts to "Export to PDF" label and becomes enabled again | High |
| TC-042 | PDF Export | Comparison mode PDF includes delta column | Both scenarios valid in comparison mode | 1. Click "Export to PDF" | Downloaded PDF contains a metrics table with "Scenario A", "Scenario B", and "Δ (B−A)" columns, and a winner info card | High |
| TC-043 | PDF Export | PDF not available until form is valid | Investment field cleared and blurred | Observe the results area | "Export to PDF" button is not rendered (results are hidden by the placeholder) | High |
| TC-044 | PDF Export | Export error message displayed on failure | Simulate jsPDF exception (e.g., by mocking `exportPDF` to reject) | Trigger export | Error message "Failed to generate PDF. Please try again." appears beneath the button | Med |

### 2.7 CSV Export

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-045 | CSV Export | Single-mode CSV downloaded with correct headers | Default valid inputs, breakdown expanded | Click "Export CSV" | File "monthly-breakdown.csv" downloaded; first row is "Month,Revenue,Costs,Net Profit,Cumulative P/L,ROI (%)" | High |
| TC-046 | CSV Export | CSV row count matches period | Period = 36 months, valid inputs | Click "Export CSV" | CSV contains header + 36 data rows | High |
| TC-047 | CSV Export | CSV values are unformatted numbers | Default valid inputs | Download CSV and inspect | Revenue column shows "15000", not "$15,000"; ROI column shows "20.00", not "20%" | Med |
| TC-048 | CSV Export | Comparison mode produces two named files | Both scenarios valid, breakdown expanded | 1. Click "Export CSV" for Scenario A. 2. Click "Export CSV" for Scenario B | Files "scenario-a.csv" and "scenario-b.csv" are downloaded separately | High |

### 2.8 Scenario Comparison

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-049 | Comparison | Activating comparison copies Scenario A values | Default valid inputs | Click "Compare scenarios" | Scenario B input form is pre-populated with Investment $100k, Revenue $15k, Costs $5k, Period 12 mo | High |
| TC-050 | Comparison | Scenario B errors not shown on activation | Default valid inputs | Activate comparison mode | No validation error messages displayed under Scenario B fields despite them being pre-populated | High |
| TC-051 | Comparison | Both scenarios compute independently | Comparison active; change Scenario B Revenue to $20k | Observe both result card sets | Scenario A shows ROI +20.0%; Scenario B shows ROI +140.0% with different period/investment intact | High |
| TC-052 | Comparison | "Better ROI" badge appears on winning scenario | Scenario A ROI = +20.0%, Scenario B ROI = +140.0% | Observe scenario labels | "Better ROI" badge appears on Scenario B's header; Scenario A's header has no badge | High |
| TC-053 | Comparison | "Better ROI" badge on A when ROI is equal | Both scenarios identical inputs | Observe scenario labels | "Better ROI" badge on Scenario A (tie goes to A per `>=` comparison) | Med |
| TC-054 | Comparison | Variance Row: ROI delta computed correctly | Scenario A ROI = +20.0%, Scenario B ROI = +140.0% | Observe Variance Row | ROI variance shows "+120.0 pp"; "Scenario B wins" label is present | High |
| TC-055 | Comparison | Variance Row: "Only B recovers" when A never pays back | Scenario A: Revenue = Costs (payback Never); Scenario B: valid payback | Observe Variance Row payback cell | Variance Row payback cell shows "Only B recovers"; winner = B | Med |
| TC-056 | Comparison | Variance Row: "Both never recover" when neither pays back | Both scenarios: Revenue = Costs | Observe Variance Row payback cell | Variance Row payback cell shows "Both never recover"; neutral styling | Med |
| TC-057 | Comparison | Exiting comparison preserves Scenario A | Scenario A has custom values, comparison active | Click "Exit comparison" | Single-scenario view restored with Scenario A's original custom inputs intact | High |
| TC-058 | Comparison | Combined chart shows two lines with legend | Both scenarios valid in comparison mode | Observe chart | Chart renders indigo line for Scenario A and orange line for Scenario B; legend with both labels is visible | High |
| TC-059 | Comparison | Monthly breakdown shows tab selector on mobile | Both scenarios valid, viewport < 1024px | Expand monthly breakdown at narrow viewport | Tabs "Scenario A" and "Scenario B" appear; only the active tab's table is displayed | Med |
| TC-060 | Comparison | Monthly breakdown shows two columns on desktop | Both scenarios valid, viewport ≥ 1024px | Expand monthly breakdown | Two tables displayed side by side; no tab selector visible | Med |

### 2.9 Theme Management

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-061 | Theme | Toggle switches from dark to light | App loaded in dark mode | Click the sun icon theme toggle | The `dark` class is removed from `<html>`; the UI background switches from dark gray to light gray | High |
| TC-062 | Theme | Toggle switches from light to dark | App loaded in light mode | Click the moon icon theme toggle | The `dark` class is added to `<html>`; the UI switches to dark | High |
| TC-063 | Theme | Preference persists across page reload | User has toggled to light mode | Reload the page (F5) | App re-opens in light mode; `localStorage` key `roi-theme` equals "light" | High |
| TC-064 | Theme | OS dark preference applied on first load | No `roi-theme` key in `localStorage`; OS set to dark mode | Open app for first time | App renders in dark mode without user action | Med |
| TC-065 | Theme | OS light preference applied on first load | No `roi-theme` key in `localStorage`; OS set to light mode | Open app for first time | App renders in light mode without user action | Med |
| TC-066 | Theme | Theme toggle aria-label updates correctly | App in dark mode | 1. Observe `aria-label` on toggle. 2. Click toggle. 3. Re-observe | In dark mode `aria-label` = "Switch to light mode"; after toggle = "Switch to dark mode" | Med |

### 2.10 Embed Widget

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-067 | Embed Widget | Modal opens from Embed button | App loaded | Click the `</>` Embed button in the header | Embed modal appears with heading "Embed ROI Calculator"; backdrop overlay is visible; body scroll is locked | High |
| TC-068 | Embed Widget | Generated src URL uses configured base URL | Embed modal open | Change Base URL to "https://example.com", Theme to "Dark" | Embed code contains `src="https://example.com/embed?theme=dark"` | High |
| TC-069 | Embed Widget | System theme omits ?theme param | Embed modal open | Select Theme = "System preference" | Embed code `src` URL does not contain `?theme=` parameter | Med |
| TC-070 | Embed Widget | Width and height attributes reflect selections | Embed modal open | Set Width to "600 px", Height to "700 px" | Embed code contains `width="600"` and `height="700"` | High |
| TC-071 | Embed Widget | 100% width renders as "100%" in attribute | Embed modal open | Ensure Width = "100% (responsive)" | Embed code contains `width="100%"` | Med |
| TC-072 | Embed Widget | Copy Code writes to clipboard | Embed modal open, embed code generated | Click "Copy Code" | Button label changes to "Copied!" and reverts after ~2 seconds; clipboard contains the full iframe snippet | High |
| TC-073 | Embed Widget | Reset to defaults restores all settings | Width changed to "800 px", Height to "600 px", Theme to "Light" | Click "Reset to defaults" | All four settings return to: Width=100%, Height=800, Theme=Dark, BaseURL=current origin; "Reset to defaults" link disappears | Med |
| TC-074 | Embed Widget | Reset link hidden when settings are at defaults | Embed modal freshly opened | Observe modal sidebar | "Reset to defaults" link is not present | Low |
| TC-075 | Embed Widget | Modal closes on Escape key | Embed modal open | Press Escape | Modal is dismissed; body scroll is restored | High |
| TC-076 | Embed Widget | Modal closes on backdrop click | Embed modal open | Click outside the modal panel on the backdrop | Modal is dismissed | High |
| TC-077 | Embed Widget | Live preview reflects theme change | Embed modal open, Theme = "Dark" | Change Theme to "Light" | Live preview iframe reloads with `?theme=light`; preview renders the light-themed calculator | Med |
| TC-078 | Embed Widget | Preview note shows configured height | Embed modal open, Height = "900 px" | Observe note beneath preview | Note reads "Preview at 400 px — configured height is 900 px." | Low |

### 2.11 Routing and Navigation

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-079 | Routing | Root route renders the main app shell | Web build deployed | Navigate to `/` | Full app header (title, Embed button, theme toggle) and CalculatorCore are rendered | High |
| TC-080 | Routing | /embed route renders the embed view | Web build deployed | Navigate to `/embed` | No app header; CalculatorCore is rendered inside EmbedThemeProvider | High |
| TC-081 | Routing | /embed?theme=light applies light theme | Web build deployed | Navigate to `/embed?theme=light` | Calculator renders with light background; no theme toggle button | High |
| TC-082 | Routing | /embed?theme=dark applies dark theme | Web build deployed | Navigate to `/embed?theme=dark` | Calculator renders with dark background | High |
| TC-083 | Routing | /embed with no theme param uses OS preference | OS set to light mode; no stored preference | Navigate to `/embed` (no query param) | Calculator renders in light mode | Med |

### 2.12 Accessibility and Keyboard Interaction

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-084 | Accessibility | Invalid input carries aria-invalid | Investment field has error | Inspect the Investment `<input>` element in DevTools | `aria-invalid="true"` attribute is present on the invalid input | High |
| TC-085 | Accessibility | Valid input does not carry aria-invalid | All fields valid | Inspect any currency `<input>` | `aria-invalid="false"` (or attribute absent) on valid inputs | Med |
| TC-086 | Accessibility | Embed modal carries correct ARIA roles | Embed modal open | Inspect modal container `<div>` | Attributes `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="embed-modal-title"` are present | Med |
| TC-087 | Accessibility | Theme toggle aria-label matches current state | App in dark mode | Inspect theme toggle `<button>` | `aria-label="Switch to light mode"` is set; after toggling, `aria-label="Switch to dark mode"` | Med |
| TC-088 | Accessibility | Tab navigation reaches all interactive elements | App in single-scenario mode, light theme | Press Tab repeatedly from the first input | Focus moves through: Investment → Monthly Revenue → Monthly Costs → Period → Compare button → theme toggle → Embed button → Export PDF (when visible) → Monthly Breakdown toggle | Med |
| TC-089 | Accessibility | Monthly Breakdown sortable headers are keyboard accessible | Breakdown table expanded | Tab to a column header; press Enter | Column sort is triggered; sort state changes as expected | Low |

### 2.13 Advanced Financial Metrics

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-090 | Advanced Metrics | Discount Rate field present with default value 10 | App freshly loaded | 1. Observe the Parameters form below the Calculation Period dropdown | A "Discount Rate (%)" input field is visible; its value is "10" | High |
| TC-091 | Advanced Metrics | Discount Rate Required error after clearing and blurring | App loaded | 1. Clear the Discount Rate field. 2. Tab away (blur) | Error "Required" appears beneath the Discount Rate field; result cards are hidden | High |
| TC-092 | Advanced Metrics | Discount Rate above 100% is rejected | App loaded | 1. Enter "101" in Discount Rate. 2. Blur | Error "Cannot exceed 100%" appears beneath the Discount Rate field | High |
| TC-093 | Advanced Metrics | Discount Rate at 0% boundary is accepted | App loaded; all other fields valid | 1. Enter "0" in Discount Rate. 2. Blur | No error message displayed; results recalculate; NPV card shows $20,000 (equal to total undiscounted net profit minus investment with default inputs) | High |
| TC-094 | Advanced Metrics | NPV card renders with positive value on default inputs | Default valid inputs (Investment $100k, Revenue $15k, Costs $5k, Period 12 mo, Discount Rate 10%) | Observe the second row of result cards | An "NPV" card is visible; its value is a positive USD amount (approximately $13,680); card text is emerald/green | High |
| TC-095 | Advanced Metrics | NPV card turns red when high discount rate makes NPV negative | Default valid inputs loaded | 1. Change Discount Rate to "99". 2. Blur | NPV card displays a negative USD value; card text is red | Med |
| TC-096 | Advanced Metrics | IRR card displays annualised percentage for profitable scenario | Default valid inputs (monthlyNet = $10k; total cash flows $120k > investment $100k) | Observe IRR card in the second row of result cards | An "IRR" card is visible; its value is a positive percentage (approximately 35.4%); card text is emerald/green | High |
| TC-097 | Advanced Metrics | IRR card shows "N/A" when investment never recovers | Investment $100k, Revenue $5k, Costs $5k, Period 12 mo (monthlyNet = $0) | Observe IRR card | IRR card displays "N/A"; card text is red | High |

### 2.14 Scenario Label Management

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-098 | Scenario Labels | Clicking scenario label text enters inline edit mode | Comparison mode active | 1. Click the "Scenario A" label text in the column header | An `<input>` field replaces the label text; it is pre-filled with "Scenario A" and is focused | High |
| TC-099 | Scenario Labels | Enter key commits the new label | Comparison mode active; Scenario A label in edit mode | 1. Clear the input. 2. Type "Option 1". 3. Press Enter | Edit mode exits; the label is now displayed as "Option 1" | High |
| TC-100 | Scenario Labels | Blurring the input commits the new label | Comparison mode active; Scenario B label in edit mode with text "Option 2" | 1. Click elsewhere on the page to blur the input | Edit mode exits; label is committed as "Option 2" | Med |
| TC-101 | Scenario Labels | Escape key cancels rename and reverts to original label | Comparison mode active; Scenario A label in edit mode | 1. Clear the input. 2. Type "Draft". 3. Press Escape | Edit mode exits; label reverts to "Scenario A"; no change is saved | High |
| TC-102 | Scenario Labels | Submitting blank label reverts to original | Comparison mode active; Scenario A label in edit mode | 1. Clear the input entirely (leave blank). 2. Press Enter | Label reverts to "Scenario A"; no empty or whitespace string is displayed | Med |
| TC-103 | Scenario Labels | Delete button (×) appears only on Scenario B header | Comparison mode active | 1. Observe both scenario column headers | A × button (title="Remove scenario") is visible in Scenario B's header; Scenario A's header has no × button | High |
| TC-104 | Scenario Labels | Clicking delete button exits comparison and resets Scenario B | Comparison mode active; Scenario B has custom inputs and a renamed label | 1. Click the × delete button on Scenario B's header | Comparison mode is exited; single-scenario layout is restored; Scenario A's inputs are unchanged; Scenario B label resets to "Scenario B" | High |

### 2.15 PDF Monthly Breakdown

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-105 | PDF Export | Single-mode PDF includes a monthly breakdown table | Default valid inputs (12-month period); single mode | 1. Click "Export to PDF". 2. Wait for download. 3. Open the downloaded PDF | The PDF contains a "MONTHLY BREAKDOWN" section with a table whose columns are Month, Revenue, Costs, Net, Cumulative P/L, ROI % and exactly 12 data rows | High |
| TC-106 | PDF Export | Comparison-mode PDF includes two monthly breakdown tables | Both scenarios valid in comparison mode (Scenario A = 12 mo, Scenario B = 24 mo) | 1. Click "Export to PDF". 2. Open the downloaded PDF | The PDF contains a section "SCENARIO A — MONTHLY BREAKDOWN" with 12 data rows and "SCENARIO B — MONTHLY BREAKDOWN" with 24 data rows | High |

### 2.16 Input Field Presentation and Default Values

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-107 | Input Form | Dollar-sign prefix visible on all currency input fields | App loaded | 1. Observe the Initial Investment, Monthly Revenue, and Monthly Costs fields | Each field displays a non-interactive "$" prefix symbol to the left of the numeric value | High |
| TC-108 | Input Form | Form is pre-populated with default values on a fresh load | Browser localStorage cleared; app opened in a fresh tab | 1. Open the application | Fields are pre-filled: Initial Investment = 100000, Monthly Revenue = 15000, Monthly Costs = 5000, Calculation Period = "12 months", Discount Rate = 10 — without any user interaction | High |

### 2.17 Embed Modal Close Button

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-109 | Embed Widget | Modal closes when the × close button is clicked | Embed modal open | 1. Locate the × close button in the top-right area of the modal panel. 2. Click it | The embed modal is dismissed; the backdrop overlay disappears; body scroll is restored | High |

### 2.18 Non-Functional Requirements

| TC-ID | Feature | Title | Preconditions | Test Steps | Expected Result | Priority |
|---|---|---|---|---|---|---|
| TC-110 | Performance | Reactive calculation completes within 100 ms after a valid input change | Default valid inputs displayed | 1. Open browser DevTools → Performance tab. 2. Start profiling. 3. Change Monthly Revenue from $15,000 to $16,000. 4. Stop profiling | The scripting and rendering time for the React update is under 100 ms; updated result cards are visible without perceptible delay | High |
| TC-111 | Performance | PDF export completes within 5 seconds on a mid-range machine | Default valid inputs; monthly breakdown visible | 1. Start a stopwatch. 2. Click "Export to PDF". 3. Record elapsed time when the browser download dialog appears | The file download begins within 5 seconds; the "Generating PDF…" spinner disappears before 5 seconds have elapsed | Med |
| TC-112 | Performance | Largest Contentful Paint is under 2 seconds on production build | Production web build deployed on a broadband connection | 1. Open Chrome DevTools → Lighthouse tab. 2. Run a Performance audit in desktop mode on the `/` route | Lighthouse reports an LCP of under 2.0 s | Med |
| TC-113 | Accessibility | Negative metric values carry both a sign prefix and red color | Investment $100k, Revenue $5k, Costs $3k, Period 12 mo | 1. Enter the inputs above. 2. Observe the ROI and Net Profit result cards | ROI card displays "−76.0%" (leading minus sign) in red; Net Profit card displays a negative currency value with "−" in red — the meaning is conveyed by both color and the sign character, not color alone | High |
| TC-114 | Desktop | Minimum window size is enforced at 800 × 600 px | Tauri desktop build running on Windows | 1. Attempt to drag the window resize handle to shrink the window below 800 × 600 px | The window cannot be resized below 800 × 600 px; the Tauri framework prevents further shrinkage | Med |
| TC-115 | Security | No financial input data is stored in localStorage | App loaded in browser; localStorage cleared | 1. Enter non-default values in all input fields (e.g., Investment $50,000, Revenue $8,000). 2. Open DevTools → Application → Local Storage → current origin. 3. Inspect all stored keys | Only the key `roi-theme` is present; no investment amounts, revenue, costs, discount rate, period, or calculated results appear as stored values | High |
| TC-116 | Responsive | Layout stacks vertically at 375 px viewport width | Web app loaded in browser | 1. Open DevTools → Responsive Design mode. 2. Set viewport to 375 × 812 px. 3. Observe the page layout | The input form and results section stack vertically (single column); no horizontal scrollbar appears; all interactive controls remain accessible by scrolling vertically | High |
| TC-117 | Security | No outbound network requests are made during normal use | Browser DevTools → Network tab open with Fetch/XHR and WS filters enabled | 1. Clear the Network log. 2. Perform a full session: enter valid inputs, toggle comparison, export PDF, export CSV, open embed modal. 3. Review the captured request list | Zero requests to external domains are logged; all resources originate from the local server / origin or are bundled assets | High |
| TC-118 | Desktop | Desktop build operates fully without an internet connection | Tauri desktop app installed on Windows; network adapter disabled | 1. Disconnect from the internet. 2. Launch the app. 3. Use all features: calculations, comparison mode, PDF export, CSV export, embed modal | All features function correctly; no error messages or failed resource loads are observed | Med |
| TC-119 | Distribution | Windows installer file does not exceed 30 MB | Release CI pipeline has produced a Windows NSIS .exe or MSI .msi artifact | 1. Locate the installer artifact in the release output directory. 2. Check its file size | File size is ≤ 30 MB (target approximately 15 MB) | Med |
| TC-120 | Compatibility | Core features work across Chrome, Edge, Firefox, and Safari | Production web build deployed | 1. Open the app in the latest stable versions of Chrome, Edge, Firefox, and Safari. 2. In each browser: enter valid inputs, toggle comparison mode, verify result cards, render the chart, and click "Export to PDF" | Result cards, chart, monthly breakdown, and PDF export function correctly in all four browsers; no console errors are observed | Med |
