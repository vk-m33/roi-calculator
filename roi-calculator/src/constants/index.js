// ── Validation bounds ────────────────────────────────────────────────────────

// Security (AC-05): upper bound for all currency fields — prevents Infinity/NaN
// from propagating into the calculation engine when a user enters astronomically
// large numbers (e.g. 1e308 or 1e309).
export const MAX_CURRENCY = 999_999_999_999

// ── Default form state ───────────────────────────────────────────────────────

/** Initial values populated in both Scenario A and the freshly-created Scenario B. */
export const DEFAULT_INPUTS = {
  investment: '100000',
  monthlyRevenue: '15000',
  monthlyCosts: '5000',
  period: '12',
  discountRate: '10',
}
