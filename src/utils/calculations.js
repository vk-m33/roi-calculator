import { MAX_CURRENCY } from '../constants'

// ── Validation ───────────────────────────────────────────────────────────────

/**
 * Returns a map of field-name → error message string.
 * An empty string means the field is valid.
 */
export function validate({ investment, monthlyRevenue, monthlyCosts, discountRate }) {
  const inv = parseFloat(investment)
  const rev = parseFloat(monthlyRevenue)
  const costs = parseFloat(monthlyCosts)
  const rate = parseFloat(discountRate)
  const revValid = !isNaN(rev) && rev > 0

  return {
    investment:
      investment === '' ? 'Required' :
      isNaN(inv) ? 'Enter a valid number' :
      inv < 1000 ? 'Minimum is $1,000' :
      inv > MAX_CURRENCY ? `Maximum value is ${MAX_CURRENCY.toLocaleString()}` : '',

    monthlyRevenue:
      monthlyRevenue === '' ? 'Required' :
      isNaN(rev) ? 'Enter a valid number' :
      rev <= 0 ? 'Must be greater than $0' :
      rev > MAX_CURRENCY ? `Maximum value is ${MAX_CURRENCY.toLocaleString()}` : '',

    monthlyCosts:
      monthlyCosts === '' ? 'Required' :
      isNaN(costs) ? 'Enter a valid number' :
      costs < 0 ? 'Must be $0 or more' :
      costs > MAX_CURRENCY ? `Maximum value is ${MAX_CURRENCY.toLocaleString()}` :
      revValid && costs > rev ? 'Cannot exceed monthly revenue' : '',

    period: '',

    discountRate:
      discountRate === '' ? 'Required' :
      isNaN(rate) ? 'Enter a valid number' :
      rate < 0 ? 'Must be 0% or more' :
      rate > 100 ? 'Cannot exceed 100%' : '',
  }
}

/** Returns true when every field in the errors map is empty. */
export function isFormValid(errors) {
  return Object.values(errors).every((v) => v === '')
}

/**
 * Filters an allErrors map down to only the fields the user has touched,
 * so errors are shown progressively rather than all at once on load.
 */
export function toVisible(allErrors, touched) {
  return Object.fromEntries(
    Object.keys(allErrors).map((k) => [k, touched[k] ? allErrors[k] : ''])
  )
}

// ── Financial calculations ────────────────────────────────────────────────────

/**
 * Computes the annualised Internal Rate of Return via binary search.
 * Returns null when no positive IRR exists (e.g. cash flows never exceed the investment).
 */
export function computeIRR(investment, monthlyNet, period) {
  // Security (AC-05): guard against Infinity/NaN propagating from out-of-range inputs
  if (!isFinite(monthlyNet) || !isFinite(investment)) return null
  if (investment <= 0 || monthlyNet <= 0) return null
  // Positive IRR only exists when total undiscounted cash flows exceed investment
  if (monthlyNet * period <= investment) return null

  const npvAtRate = (r) => {
    let sum = 0
    for (let t = 1; t <= period; t++) {
      sum += monthlyNet / Math.pow(1 + r, t)
    }
    return sum - investment
  }

  // Binary search: NPV(0) > 0, NPV(1.0) ≈ -investment < 0
  let lo = 0
  let hi = 1.0 // 100% monthly = 1,200% annual — practical upper bound
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2
    if (npvAtRate(mid) > 0) lo = mid
    else hi = mid
    if (hi - lo < 1e-10) break
  }
  return ((lo + hi) / 2) * 12 * 100 // annualised percentage
}

/**
 * Derives all result metrics from validated form inputs.
 * Returns null if any computed value is non-finite (defence-in-depth guard).
 */
export function calculate(inputs) {
  const investment = parseFloat(inputs.investment)
  const monthlyRevenue = parseFloat(inputs.monthlyRevenue)
  const monthlyCosts = parseFloat(inputs.monthlyCosts)
  const period = parseInt(inputs.period) || 12
  const discountRate = parseFloat(inputs.discountRate) || 0

  const monthlyNet = monthlyRevenue - monthlyCosts

  // Security (AC-05): defence-in-depth guard — isFormValid() already blocks
  // infinite/NaN values through validate(), but this guard ensures calculate()
  // is safe if called directly (e.g. during testing or future refactoring).
  if (!isFinite(monthlyNet) || !isFinite(investment)) return null
  const totalNetProfit = monthlyNet * period - investment
  const roi = investment > 0 ? (totalNetProfit / investment) * 100 : 0
  const paybackMonths = monthlyNet > 0 && investment > 0 ? investment / monthlyNet : null

  // NPV
  const monthlyRate = discountRate / 100 / 12
  let npv = -investment
  for (let t = 1; t <= period; t++) {
    npv += monthlyNet / Math.pow(1 + monthlyRate, t)
  }

  // IRR
  const irr = computeIRR(investment, monthlyNet, period)

  const chartData = Array.from({ length: period + 1 }, (_, i) => ({
    month: i,
    cashFlow: Math.round(-investment + i * monthlyNet),
  }))

  return { investment, monthlyRevenue, monthlyCosts, monthlyNet, totalNetProfit, roi, paybackMonths, period, chartData, npv, irr }
}
