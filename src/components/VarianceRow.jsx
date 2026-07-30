import { currency } from '../utils/formatters'

function roiVariance(a, b) {
  const delta = b.roi - a.roi
  const label = `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pp`
  return { label, winner: delta >= 0 ? 'B' : 'A', neutral: Math.abs(delta) < 0.05 }
}

function paybackVariance(a, b) {
  const pa = a.paybackMonths
  const pb = b.paybackMonths

  if (pa === null && pb === null) return { label: 'Both never recover', winner: null, neutral: true }
  if (pa === null) return { label: 'Only B recovers', winner: 'B', neutral: false }
  if (pb === null) return { label: 'Only A recovers', winner: 'A', neutral: false }

  const delta = pb - pa
  const abs = Math.abs(delta).toFixed(1)
  const label = delta < 0 ? `B is ${abs} mo faster` : delta > 0 ? `A is ${abs} mo faster` : 'Equal payback'
  return { label, winner: delta < 0 ? 'B' : delta > 0 ? 'A' : null, neutral: delta === 0 }
}

function profitVariance(a, b) {
  const delta = b.totalNetProfit - a.totalNetProfit
  const sign = delta >= 0 ? '+' : ''
  const pct =
    a.totalNetProfit !== 0
      ? ` (${sign}${((delta / Math.abs(a.totalNetProfit)) * 100).toFixed(1)}%)`
      : ''
  const label = `${sign}${currency.format(delta)}${pct}`
  return { label, winner: delta >= 0 ? 'B' : 'A', neutral: Math.abs(delta) < 1 }
}

function VarCard({ heading, label, winner, neutral }) {
  const color = neutral
    ? 'text-gray-500 dark:text-gray-400'
    : winner === 'B'
    ? 'text-orange-600 dark:text-orange-400'
    : 'text-indigo-600 dark:text-indigo-400'

  const winnerText = neutral ? null : `Scenario ${winner} wins`

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-500 uppercase tracking-widest">{heading}</p>
      <p className={`text-lg font-semibold leading-snug ${color}`}>{label}</p>
      {winnerText && <p className="text-xs text-gray-400 dark:text-gray-600">{winnerText}</p>}
    </div>
  )
}

export default function VarianceRow({ a, b }) {
  const roi = roiVariance(a, b)
  const payback = paybackVariance(a, b)
  const profit = profitVariance(a, b)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
        Variance — B vs A
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 sm:divide-x sm:divide-gray-200 dark:sm:divide-gray-800">
        <VarCard heading="ROI" {...roi} />
        <div className="sm:pl-4">
          <VarCard heading="Payback Period" {...payback} />
        </div>
        <div className="sm:pl-4">
          <VarCard heading="Net Profit" {...profit} />
        </div>
      </div>
    </div>
  )
}
