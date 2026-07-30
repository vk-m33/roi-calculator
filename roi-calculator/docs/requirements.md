# Business Requirements Document — ROI Calculator

**Version:** 1.0  
**Date:** 2026-07-30  
**Status:** Baseline

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Functional Requirements](#2-functional-requirements)
3. [Non-Functional Requirements](#3-non-functional-requirements)
4. [User Stories and Acceptance Criteria](#4-user-stories-and-acceptance-criteria)

---

## 1. Executive Summary

### 1.1 Application Overview

The ROI Calculator is a dual-mode financial analysis tool that helps business decision-makers evaluate the financial return on an investment. It is distributed as a Tauri v2 native desktop application for Windows (approximately 15 MB installer, runs fully offline) and is simultaneously deployable as a standard web application served from any static host.

Users enter four parameters — an initial capital outlay, expected monthly revenue, expected monthly costs, and a planning horizon of 12, 24, or 36 months — and receive instantaneous results presented in three forms: summary metric cards (ROI %, payback period in months, and net profit in USD), an interactive cumulative cash flow chart that visually marks the break-even crossover, and a collapsible month-by-month breakdown table.

### 1.2 Key Capabilities

- **Single-scenario analysis** — immediate calculation and visualization as the user types, with field-level validation errors surfaced on blur
- **Side-by-side scenario comparison** — toggle a two-column layout to evaluate two investment options concurrently, with a variance summary row identifying which scenario wins on each metric
- **PDF export** — one-click A4 report generation (inputs, metrics, break-even card, cash flow chart) for single or comparison mode, downloadable as `ROI-Analysis-YYYY-MM-DD.pdf`
- **CSV export** — monthly breakdown data exported as CSV directly from the table, available per scenario in comparison mode
- **Embed widget** — a modal that generates a ready-to-paste `<iframe>` snippet for embedding the calculator into any third-party website, with configurable dimensions, theme, and deployment base URL
- **Dark/light theme** — persistent user preference stored in `localStorage` (web) or the WebView2 profile (`%APPDATA%\com.roicalculator.app\`), with automatic system-preference detection on first launch

### 1.3 Target Audience

| Role | Primary Use Case |
|---|---|
| Business Analyst | Build and compare investment scenarios; share PDF reports with stakeholders |
| Finance Manager | Validate break-even timelines and net profit projections before approving capital expenditure |
| Web Developer | Embed the calculator widget into marketing or customer-facing pages via the iframe integration |

### 1.4 Technology Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM v7 |
| Charting | Recharts v3 |
| PDF Generation | jsPDF v4 + jspdf-autotable v5 |
| Desktop Shell | Tauri v2 (WebView2 on Windows) |
| Linter | oxlint |

---

## 2. Functional Requirements

### 2.1 Input and Validation

| ID | Priority | Description |
|---|---|---|
| FR-001 | Must Have | The application shall provide an input form with four fields: **Initial Investment** (USD), **Monthly Revenue** (USD), **Monthly Costs** (USD), and **Calculation Period** (dropdown: 12, 24, or 36 months). |
| FR-002 | Must Have | The **Initial Investment** field shall enforce: non-empty, parseable as a number, and a minimum value of **$1,000**. Error messages: "Required", "Enter a valid number", "Minimum is $1,000". |
| FR-003 | Must Have | The **Monthly Revenue** field shall enforce: non-empty, parseable as a number, and strictly greater than **$0**. Error messages: "Required", "Enter a valid number", "Must be greater than $0". |
| FR-004 | Must Have | The **Monthly Costs** field shall enforce: non-empty, parseable as a number, greater than or equal to **$0**, and not exceeding the Monthly Revenue when Revenue is itself valid. Error messages: "Required", "Enter a valid number", "Must be $0 or more", "Cannot exceed monthly revenue". |
| FR-005 | Must Have | Validation errors shall be **displayed only after the user has blurred a field** (touched-state pattern). An error is never shown for a field the user has not yet interacted with. |
| FR-006 | Must Have | Result cards and charts shall only render when **all fields are valid**. While any field is invalid, an "Fix the errors above to see results" placeholder shall be displayed instead. |
| FR-007 | Should Have | Currency input fields shall display a **dollar-sign prefix** (`$`) and use `type="number"` with `min="0"`. |
| FR-008 | Should Have | The form shall be **pre-populated with default values** on first load: Investment $100,000 · Monthly Revenue $15,000 · Monthly Costs $5,000 · Period 12 months. |

### 2.2 Calculations

| ID | Priority | Description |
|---|---|---|
| FR-009 | Must Have | The application shall calculate **monthly net profit** as `monthlyRevenue − monthlyCosts`. |
| FR-010 | Must Have | The application shall calculate **total net profit** as `(monthlyNet × period) − investment`. |
| FR-011 | Must Have | The application shall calculate **ROI** as `(totalNetProfit / investment) × 100`, expressed as a percentage with one decimal place and a leading sign (`+` or `−`). |
| FR-012 | Must Have | The application shall calculate the **payback period** as `investment / monthlyNet` in months (one decimal place). If `monthlyNet ≤ 0` or `investment ≤ 0`, the payback period shall be reported as **"Never"**. |
| FR-013 | Must Have | All calculations shall update **reactively** whenever a valid input changes, without requiring an explicit submit action. |

### 2.3 Result Display

| ID | Priority | Description |
|---|---|---|
| FR-014 | Must Have | The application shall display three **result metric cards**: ROI (%), Payback Period (months or "Never"), and Net Profit (USD, formatted with `Intl.NumberFormat`). |
| FR-015 | Must Have | Metric card values shall be **color-coded**: emerald/green for positive or achievable values (ROI ≥ 0, payback not null, profit ≥ 0) and red for negative or unachievable values. |
| FR-016 | Must Have | The application shall display a **Cumulative Cash Flow** line chart plotting cash position from month 0 (negative investment) through the last month of the period. |
| FR-017 | Must Have | The chart shall include a **$0 reference line** with a dashed stroke and label, marking the break-even point. |
| FR-018 | Should Have | Hovering over the chart shall display a **tooltip** showing the month number and exact cumulative cash flow value(s), formatted as full USD. |
| FR-019 | Should Have | The application shall display a collapsible **Monthly Breakdown** section below the chart, toggled by a button labeled "Monthly Breakdown". |
| FR-020 | Should Have | The monthly breakdown table shall contain columns: Month, Revenue, Costs, Net Profit, Cumulative P/L, and ROI %. The **break-even month** (first month where cumulative P/L ≥ 0 after being negative) shall be visually highlighted in emerald and carry a "Break-even" badge. |
| FR-021 | Should Have | Each column header in the monthly breakdown table shall be **clickable to sort** the rows ascending or descending; a chevron indicator shall reflect the current sort state. |

### 2.4 Data Export

| ID | Priority | Description |
|---|---|---|
| FR-022 | Should Have | An **Export to PDF** button shall generate an A4-format PDF report using jsPDF. In single mode the report contains: indigo header strip with title and date, inputs table, ROI metrics table with color-coded values, break-even info card (success/error style), and the cumulative cash flow chart image. |
| FR-023 | Should Have | In comparison mode, the PDF shall contain: a side-by-side inputs table, a metrics table with Scenario A, Scenario B, and Δ (B−A) columns, a winner info card, and the combined chart. |
| FR-024 | Should Have | The PDF shall include **page numbers** and a "Generated by ROI Calculator" footer on every page. The file shall be saved as `ROI-Analysis-YYYY-MM-DD.pdf`. |
| FR-025 | Should Have | The Export button shall show a **loading spinner and "Generating PDF…" label** while export is in progress and shall be disabled to prevent duplicate clicks. |
| FR-026 | Should Have | If PDF generation fails, an inline **error message** ("Failed to generate PDF. Please try again.") shall be shown beneath the button. |
| FR-027 | Should Have | The monthly breakdown table shall expose an **Export CSV** link that triggers an in-browser download of the table data with header row: `Month,Revenue,Costs,Net Profit,Cumulative P/L,ROI (%)`. |
| FR-028 | Should Have | In comparison mode, CSV export buttons shall produce **separate files** named `scenario-a.csv` and `scenario-b.csv`. |

### 2.5 Scenario Comparison

| ID | Priority | Description |
|---|---|---|
| FR-029 | Should Have | A **"Compare scenarios"** toggle button shall appear above the input form. Activating it switches the layout to a two-column side-by-side view labeled "Scenario A" and "Scenario B". |
| FR-030 | Should Have | When comparison mode is first activated, Scenario B's inputs shall be **pre-populated with Scenario A's current values**; Scenario B's touched state shall be reset. |
| FR-031 | Should Have | Each scenario shall have its own **independent input form and result cards**. Validation, error display, and calculation operate independently per scenario. |
| FR-032 | Should Have | When both scenarios are valid, the scenario with the **higher ROI** shall display a "Better ROI" badge next to its label. If ROI values are equal, Scenario A receives the badge. |
| FR-033 | Should Have | When both scenarios are valid, a **Variance Row** component shall appear showing: ROI delta in percentage points, payback comparison in months, and net profit delta in USD with percentage. It shall identify the winner for each metric. |
| FR-034 | Should Have | Clicking **"Exit comparison"** shall dismiss the second scenario column and return to single-scenario mode, preserving Scenario A's inputs. |
| FR-035 | Should Have | In comparison mode the monthly breakdown shall show **tabs (mobile) or side-by-side columns (desktop, ≥1024px)** for the two scenarios. |

### 2.6 Theme Management

| ID | Priority | Description |
|---|---|---|
| FR-036 | Must Have | The application header shall contain a **theme toggle button** (sun icon for dark mode, moon icon for light mode) with descriptive `aria-label` and `title` attributes. |
| FR-037 | Must Have | Clicking the toggle shall **switch the theme** between "dark" and "light" by adding/removing the `dark` class on `<html>`. |
| FR-038 | Must Have | The selected theme shall be **persisted** in `localStorage` under the key `roi-theme` and restored on subsequent loads. |
| FR-039 | Should Have | On first load with no stored preference, the application shall **detect the OS color scheme** via `window.matchMedia('(prefers-color-scheme: dark)')` and apply it automatically. |

### 2.7 Embed Widget

| ID | Priority | Description |
|---|---|---|
| FR-040 | Could Have | The application header shall contain an **"Embed" button** that opens the embed configuration modal. |
| FR-041 | Could Have | The embed modal shall present configuration options for: **Width** (100% / 600px / 800px / 1024px), **Height** (600px / 700px / 800px / 900px / 1000px), **Theme** (Dark / Light / System preference), and a free-text **Base URL** field. |
| FR-042 | Could Have | The modal shall render a **live iframe preview** at 400px height sourced from the current origin's `/embed` route (with `?theme=` appended when not "system"), updating whenever the theme selection changes. |
| FR-043 | Could Have | The modal shall display the **generated iframe snippet** in a monospace code block. The snippet's `src` shall use the configured base URL; `width` and `height` reflect selections; `frameborder="0"` and `style="border: none; border-radius: 12px;"` are fixed. |
| FR-044 | Could Have | A **"Copy Code"** button shall write the snippet to the clipboard (using `navigator.clipboard` with a legacy `execCommand` fallback). On success the button shall change to "Copied!" for 2 seconds. |
| FR-045 | Could Have | When any setting differs from defaults (width=100%, height=800, theme=dark, baseUrl=current origin), a **"Reset to defaults"** link shall be shown; clicking it restores all settings. |
| FR-046 | Could Have | The modal shall close when the user clicks the **backdrop** (area outside the modal panel), presses the **Escape key**, or clicks the **×** close button. |
| FR-047 | Could Have | The embed route (`/embed`) shall use **`EmbedThemeProvider`**, which reads `?theme=dark` or `?theme=light` from the URL to pin the widget theme; if absent, the OS preference is used. The embed route does not render the app header or the embed button. |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Priority | Description |
|---|---|---|
| NFR-001 | Must Have | All financial calculations and UI re-renders shall complete within **100 ms** of a valid input change as perceived by the user. |
| NFR-002 | Should Have | PDF export (including chart capture via canvas) shall complete within **5 seconds** on a mid-range machine. |
| NFR-003 | Should Have | Initial application load (web, production build) shall achieve a Largest Contentful Paint (LCP) of **under 2 seconds** on a broadband connection. |

### 3.2 Accessibility

| ID | Priority | Description |
|---|---|---|
| NFR-004 | Should Have | All interactive controls shall be reachable and operable via **keyboard navigation** (Tab, Shift+Tab, Enter, Space). |
| NFR-005 | Must Have | Invalid input fields shall carry `aria-invalid="true"` and an associated visible error message, meeting **WCAG 2.1 SC 3.3.1**. |
| NFR-006 | Should Have | The embed modal shall carry `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` pointing to its heading, meeting **WCAG 2.1 SC 4.1.2**. |
| NFR-007 | Should Have | Theme toggle and modal close buttons shall carry descriptive **`aria-label`** attributes. |
| NFR-008 | Could Have | Color alone shall not be the sole indicator of meaning. Negative values are rendered red and carry a `−` sign prefix; positive values are green and carry a `+` sign prefix. |

### 3.3 Offline Capability

| ID | Priority | Description |
|---|---|---|
| NFR-009 | Must Have | The **desktop (Tauri) build** shall operate fully without any internet connection. All JavaScript dependencies (React, Recharts, jsPDF, Tailwind) are bundled at build time. |
| NFR-010 | Should Have | No user-entered financial data shall be transmitted to any external server. All calculations are performed entirely **client-side**. |

### 3.4 Installer Size and Distribution

| ID | Priority | Description |
|---|---|---|
| NFR-011 | Should Have | The Windows desktop installer (NSIS `.exe` or MSI `.msi`) shall not exceed **30 MB**; the target size is approximately **15 MB**. |
| NFR-012 | Must Have | The installer shall target **Windows 10 21H2+** and **Windows 11**. WebView2 is pre-installed on these platforms; end-users do not need separate runtime installation. |
| NFR-013 | Could Have | For public distribution, the installer should be signed with an Authenticode certificate to prevent Windows SmartScreen prompts. |
| NFR-014 | Should Have | The desktop window shall enforce a **minimum size of 800 × 600 px** to prevent layout breakage. |

### 3.5 Security

| ID | Priority | Description |
|---|---|---|
| NFR-015 | Should Have | The Tauri Content Security Policy is currently set to `null`. For production distribution it should be tightened to restrict resource origins and disable inline script execution. |
| NFR-016 | Must Have | The application makes **no network requests** to external APIs. The CSP, once configured, can safely block all external fetch origins. |
| NFR-017 | Should Have | User preferences stored in `localStorage` (`roi-theme`) contain no sensitive financial data. No financial inputs are persisted to storage. |

### 3.6 Compatibility

| ID | Priority | Description |
|---|---|---|
| NFR-018 | Should Have | The web build shall support current major versions of **Chromium-based browsers** (Chrome, Edge), **Firefox**, and **Safari**. |
| NFR-019 | Must Have | The responsive layout shall be usable at viewport widths from **375 px** (mobile) through full desktop (≥ 1440 px). Input and result panels stack vertically on narrow viewports and display side-by-side at `lg` breakpoint (≥ 1024 px). |

---

## 4. User Stories and Acceptance Criteria

---

### Role: Business Analyst

---

#### US-001 — Calculate ROI for a single investment scenario

> **As a** Business Analyst,  
> **I want** to enter an initial investment, monthly revenue, monthly costs, and time horizon  
> **so that** I can instantly see the expected ROI percentage, payback period, and net profit without manual calculation.

**Acceptance Criteria**

```gherkin
Feature: Single-scenario ROI calculation

  Scenario: Valid inputs produce correct metrics
    Given I open the ROI Calculator
    And the form is pre-populated with default values
    When I enter Investment "$100,000", Monthly Revenue "$15,000",
         Monthly Costs "$5,000", Period "12 months"
    Then the ROI card displays "+20.0%"
    And the Payback Period card displays "10.0 months"
    And the Net Profit card displays "$20,000"

  Scenario: Results update reactively on input change
    Given valid inputs are already entered
    When I change the Monthly Revenue from "$15,000" to "$20,000"
    Then the ROI, Payback Period, and Net Profit cards update
         within 100 ms without clicking any button

  Scenario: Results are withheld while inputs are invalid
    Given I clear the Investment field and tab away
    When the field error "Required" is displayed
    Then the results area shows "Fix the errors above to see results"
    And no metric cards are rendered
```

---

#### US-002 — Export a PDF report to share with stakeholders

> **As a** Business Analyst,  
> **I want** to export a professionally formatted PDF of the analysis  
> **so that** I can share a self-contained report with stakeholders who do not have access to the calculator.

**Acceptance Criteria**

```gherkin
Feature: PDF export

  Scenario: Successful PDF generation in single mode
    Given valid inputs are entered and results are displayed
    When I click "Export to PDF"
    Then the button label changes to "Generating PDF…" with a spinner
    And a file named "ROI-Analysis-<today's date>.pdf" is downloaded
    And the PDF contains an indigo header strip, an inputs table,
        an ROI metrics table, a break-even info card,
        and the cumulative cash flow chart
    And each page has a footer with "Generated by ROI Calculator"
         and "Page N of M"

  Scenario: Export button is disabled while generating
    Given export is in progress
    When I attempt to click "Export to PDF" again
    Then the button remains disabled and no second export is initiated

  Scenario: Export error is surfaced to the user
    Given the chart SVG is unavailable (e.g. render blocked)
    When jsPDF throws an exception during generation
    Then the error message "Failed to generate PDF. Please try again."
         is displayed beneath the button
    And the button returns to its normal state
```

---

#### US-003 — Compare two investment scenarios side by side

> **As a** Business Analyst,  
> **I want** to compare two investment scenarios on a single screen  
> **so that** I can identify which option delivers a better return and by how much.

**Acceptance Criteria**

```gherkin
Feature: Scenario comparison

  Scenario: Activating comparison mode copies Scenario A values
    Given Scenario A has Investment "$100,000", Revenue "$15,000",
          Costs "$5,000", Period "12 months"
    When I click "Compare scenarios"
    Then Scenario B's input form is pre-populated with the same values
    And Scenario B's validation errors are not displayed

  Scenario: Better ROI badge appears on the winning scenario
    Given comparison mode is active
    And Scenario A has ROI "+20.0%" and Scenario B has ROI "+30.0%"
    Then the "Better ROI" badge appears on Scenario B's label
    And no badge appears on Scenario A's label

  Scenario: Variance row shows metric differences
    Given both scenarios are valid
    Then the Variance row displays ROI delta in percentage points,
         payback comparison in months, and net profit delta in USD
    And it identifies the winner for each metric

  Scenario: Exiting comparison preserves Scenario A inputs
    Given comparison mode is active with custom Scenario A values
    When I click "Exit comparison"
    Then the layout returns to single-scenario mode
    And Scenario A's inputs are unchanged
```

---

### Role: Finance Manager

---

#### US-004 — Identify the break-even month in the monthly breakdown

> **As a** Finance Manager,  
> **I want** to see a month-by-month cash flow table with the break-even month highlighted  
> **so that** I can confirm when the investment starts generating positive cumulative returns.

**Acceptance Criteria**

```gherkin
Feature: Monthly breakdown table

  Scenario: Break-even month is visually highlighted
    Given valid inputs where the investment breaks even at month 10
    When I expand the "Monthly Breakdown" section
    Then month 10 row has an emerald background
    And the month cell displays a "Break-even" badge
    And all preceding rows show negative cumulative P/L values
    And all following rows show positive cumulative P/L values

  Scenario: Table can be sorted by any column
    Given the monthly breakdown table is expanded
    When I click the "Net Profit" column header once
    Then rows are sorted ascending by Net Profit
    When I click the "Net Profit" column header again
    Then rows are sorted descending by Net Profit
    And a chevron indicator reflects the active sort direction

  Scenario: Table collapses and expands
    Given the monthly breakdown is currently expanded
    When I click the "Monthly Breakdown" toggle button
    Then the table collapses and is no longer visible
    When I click the toggle button again
    Then the table expands and rows are visible again
```

---

#### US-005 — Export the monthly data to CSV for further analysis

> **As a** Finance Manager,  
> **I want** to download the monthly breakdown as a CSV file  
> **so that** I can import it into spreadsheet software for custom financial modelling.

**Acceptance Criteria**

```gherkin
Feature: CSV export

  Scenario: Single-mode CSV download
    Given valid inputs are entered and the monthly breakdown is visible
    When I click "Export CSV"
    Then a file named "monthly-breakdown.csv" is downloaded
    And the file contains a header row: "Month,Revenue,Costs,Net Profit,Cumulative P/L,ROI (%)"
    And the file contains one data row per month in the selected period
    And numeric values are not formatted with currency symbols

  Scenario: Comparison mode exports two separate CSV files
    Given comparison mode is active and both scenarios are valid
    When I click "Export CSV" for Scenario A
    Then a file named "scenario-a.csv" is downloaded
    When I click "Export CSV" for Scenario B
    Then a file named "scenario-b.csv" is downloaded
```

---

### Role: Web Developer (Embedding)

---

#### US-006 — Embed the ROI Calculator in a company website

> **As a** Web Developer,  
> **I want** to generate an iframe snippet configured for my deployment  
> **so that** I can embed the calculator into our marketing or client-facing page with minimal effort.

**Acceptance Criteria**

```gherkin
Feature: Embed widget configuration

  Scenario: Opening the embed modal
    Given I am on the main calculator page
    When I click the "Embed" button in the header
    Then the embed modal opens with the heading "Embed ROI Calculator"
    And the modal displays configuration options for Width, Height, Theme,
        and Base URL
    And a live preview iframe is visible

  Scenario: Generated code reflects selected configuration
    Given the embed modal is open
    When I select Width "800 px", Height "700 px", Theme "Light",
         and Base URL "https://example.com"
    Then the embed code block shows:
         src="https://example.com/embed?theme=light"
         width="800"
         height="700"

  Scenario: Copy Code button copies snippet to clipboard
    Given the embed modal is open and a configuration is selected
    When I click "Copy Code"
    Then the button label changes to "Copied!" for approximately 2 seconds
    And the clipboard contains the displayed iframe snippet

  Scenario: Reset to defaults restores original settings
    Given I have changed Width to "600 px" and Theme to "Light"
    Then the "Reset to defaults" link is visible
    When I click "Reset to defaults"
    Then Width is restored to "100% (responsive)"
    And Height is restored to "800 px (default)"
    And Theme is restored to "Dark"
    And Base URL is restored to the current origin

  Scenario: Modal closes on Escape key
    Given the embed modal is open
    When I press the Escape key
    Then the modal is dismissed

  Scenario: Modal closes on backdrop click
    Given the embed modal is open
    When I click the backdrop area outside the modal panel
    Then the modal is dismissed
```

---

#### US-007 — Pin the embed widget's theme independently of the host page

> **As a** Web Developer,  
> **I want** the embedded widget to respect a `?theme=` URL parameter  
> **so that** the calculator's appearance matches my site's design without relying on the visitor's OS preference.

**Acceptance Criteria**

```gherkin
Feature: Embed route theme parameter

  Scenario: ?theme=light pins light mode
    Given the calculator is deployed at https://example.com
    When I navigate to https://example.com/embed?theme=light
    Then the calculator renders with the light color scheme
    And no theme toggle button is shown in the embed view

  Scenario: ?theme=dark pins dark mode
    When I navigate to https://example.com/embed?theme=dark
    Then the calculator renders with the dark color scheme

  Scenario: No ?theme parameter defaults to OS preference
    When I navigate to https://example.com/embed (no query param)
    Then the calculator adopts the visitor's OS color scheme preference

  Scenario: Embed view omits the application shell
    When I navigate to /embed
    Then the page does not contain the "ROI Calculator" heading,
         the theme toggle button, or the Embed button
    And only the CalculatorCore component is rendered
```

---

## 5. Supplemental Functional Requirements (Code Audit — 2026-07-30)

The following requirements were identified during a source-code audit as features fully implemented in the codebase but absent from the baseline specification. They are appended here without modifying any existing content.

### 5.1 Advanced Financial Metrics

| ID | Priority | Description |
|---|---|---|
| FR-048 | Should Have | The input form shall include a fifth field: **Discount Rate (%)** rendered as `type="number"` with `min="0"`, `max="100"`, `step="0.1"`, and a pre-populated default value of **10**. Validation follows the same touched-state pattern as the currency fields: "Required" when the field is empty, "Enter a valid number" when non-numeric, "Must be 0% or more" when the parsed value is below 0, "Cannot exceed 100%" when above 100. The field carries `aria-invalid` reflecting its error state, consistent with FR-005 and NFR-005. |
| FR-049 | Should Have | The application shall calculate **NPV (Net Present Value)** as `−investment + Σ(monthlyNet / (1 + monthlyRate)^t)` for t = 1 … period, where `monthlyRate = discountRate / 100 / 12`. An **NPV** result card shall display the rounded value formatted as USD with no decimal places via `Intl.NumberFormat`. The card shall be color-coded emerald for NPV ≥ 0 and red for NPV < 0. The NPV card and the IRR card (FR-050) shall be rendered as a second row of metric cards, below the existing ROI / Payback Period / Net Profit row. |
| FR-050 | Should Have | The application shall calculate **IRR (Internal Rate of Return)** as the annualised monthly rate (monthly rate × 12 × 100) at which NPV equals zero, determined by binary search with 100 iterations over the range [0, 1.0] for the monthly rate. An **IRR** result card shall display the annualised result as a percentage to one decimal place. If investment ≤ 0, monthlyNet ≤ 0, or the total undiscounted cash flows over the period do not exceed the investment, the card shall display **"N/A"** in red. |

### 5.2 Scenario Label Management

| ID | Priority | Description |
|---|---|---|
| FR-051 | Should Have | In comparison mode, each scenario column header shall display a **clickable inline-editable label** (initial values "Scenario A" and "Scenario B"). Clicking the label text replaces it with an auto-focused `<input>` pre-filled with the current value. Pressing **Enter** or blurring the field commits the trimmed value; pressing **Escape** discards the edit and restores the previous label. Submitting an all-whitespace string after trimming silently reverts to the previous label without saving. |
| FR-052 | Should Have | In comparison mode, Scenario B's column header shall include a **× delete button** (`title="Remove scenario"`, `aria-label="Remove scenario B"`). Clicking it shall: exit comparison mode, reset Scenario B's inputs to application defaults, clear Scenario B's touched state, and reset the Scenario B label to "Scenario B". |

### 5.3 PDF Monthly Breakdown

| ID | Priority | Description |
|---|---|---|
| FR-053 | Should Have | In **single mode**, the PDF export shall include a **Monthly Breakdown** section placed after the break-even info card. The section opens with an indigo-labelled section divider ("MONTHLY BREAKDOWN") followed by a striped autotable with columns: Month, Revenue, Costs, Net, Cumulative P/L, ROI %; one data row per month of the selected period; currency values formatted as USD strings. |
| FR-054 | Should Have | In **comparison mode**, the PDF export shall include **two Monthly Breakdown tables** placed after the winner info card, with section headers "SCENARIO A — MONTHLY BREAKDOWN" and "SCENARIO B — MONTHLY BREAKDOWN" respectively. Each table covers its scenario's full period using the same column schema as FR-053. |
