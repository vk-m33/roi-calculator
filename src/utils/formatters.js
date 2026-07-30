// Shared number formatters used across UI components and PDF export.
// Centralised here to avoid re-instantiating Intl objects in every module.

/** Full USD currency formatter with no fractional digits — e.g. $12,500 */
export const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
