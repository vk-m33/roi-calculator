const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function fmtRoi(n) {
  return `${n >= 0 ? '+' : ''}${n.toLocaleString('en-US', { maximumFractionDigits: 1 })}%`
}

function fmtPayback(months) {
  if (months === null) return 'Never'
  return `${months.toLocaleString('en-US', { maximumFractionDigits: 1 })} months`
}

export default function ResultCards({ results }) {
  const { roi, totalNetProfit, paybackMonths } = results

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card label="ROI" value={fmtRoi(roi)} positive={roi >= 0} accent />
      <Card
        label="Payback Period"
        value={fmtPayback(paybackMonths)}
        positive={paybackMonths !== null}
      />
      <Card
        label="Net Profit"
        value={currency.format(totalNetProfit)}
        positive={totalNetProfit >= 0}
      />
    </div>
  )
}

function Card({ label, value, positive, accent }) {
  return (
    <div
      className={`rounded-2xl p-5 border bg-gray-900 ${
        accent ? 'border-indigo-500/40' : 'border-gray-800'
      }`}
    >
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p
        className={`font-bold truncate ${accent ? 'text-2xl' : 'text-lg'} ${
          positive ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {value}
      </p>
    </div>
  )
}
