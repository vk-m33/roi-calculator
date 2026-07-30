import { useState } from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const COLUMNS = [
  { key: 'month',      label: 'Month',         align: 'left'  },
  { key: 'revenue',    label: 'Revenue',        align: 'right' },
  { key: 'costs',      label: 'Costs',          align: 'right' },
  { key: 'netProfit',  label: 'Net Profit',     align: 'right' },
  { key: 'cumulative', label: 'Cumulative P/L', align: 'right' },
  { key: 'roi',        label: 'ROI %',          align: 'right' },
]

function buildRows({ investment, monthlyRevenue, monthlyCosts, monthlyNet, period }) {
  return Array.from({ length: period }, (_, i) => {
    const month      = i + 1
    const cumulative = Math.round(-investment + month * monthlyNet)
    const prev       = Math.round(-investment + i * monthlyNet)
    return {
      month,
      revenue:     monthlyRevenue,
      costs:       monthlyCosts,
      netProfit:   monthlyNet,
      cumulative,
      roi:         investment > 0 ? (cumulative / investment) * 100 : 0,
      isBreakEven: cumulative >= 0 && prev < 0,
    }
  })
}

function sortRows(rows, { col, dir }) {
  if (col === 'month' && dir === 'asc') return rows
  return [...rows].sort((a, b) => dir === 'asc' ? a[col] - b[col] : b[col] - a[col])
}

function exportCSV(rows, filename) {
  const header = 'Month,Revenue,Costs,Net Profit,Cumulative P/L,ROI (%)'
  const lines  = rows.map(r =>
    [r.month, r.revenue, r.costs, r.netProfit, r.cumulative, r.roi.toFixed(2)].join(',')
  )
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function SortChevron({ active, dir }) {
  if (!active) return <span className="ml-1 opacity-30 text-xs">↕</span>
  return <span className="ml-1 text-indigo-500 dark:text-indigo-400 text-xs">{dir === 'asc' ? '↑' : '↓'}</span>
}

function BreakdownTable({ label, rows, sort, onSort, filename }) {
  const sorted = sortRows(rows, sort)

  const toggle = (key) =>
    onSort(
      sort.col === key
        ? { col: key, dir: sort.dir === 'asc' ? 'desc' : 'asc' }
        : { col: key, dir: 'asc' }
    )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {label
          ? <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
          : <span />
        }
        <button
          onClick={() => exportCSV(rows, filename)}
          className="text-xs text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-auto max-h-80 rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggle(col.key)}
                  className={`sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors select-none whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                  <SortChevron active={sort.col === col.key} dir={sort.dir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.month}
                className={
                  row.isBreakEven
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40'
                    : i % 2 === 0
                    ? 'bg-white dark:bg-gray-900'
                    : 'bg-gray-50/60 dark:bg-gray-800/20'
                }
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className={row.isBreakEven ? 'font-medium text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}>
                      {row.month}
                    </span>
                    {row.isBreakEven && (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded">
                        Break-even
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-500 dark:text-gray-400">
                  {currency.format(row.revenue)}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-500 dark:text-gray-400">
                  {currency.format(row.costs)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {currency.format(row.netProfit)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.cumulative >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {currency.format(row.cumulative)}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.roi >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {row.roi.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MonthlyBreakdown({ resultsA, resultsB, comparing = false }) {
  const [expanded,  setExpanded]  = useState(false)
  const [sortA,     setSortA]     = useState({ col: 'month', dir: 'asc' })
  const [sortB,     setSortB]     = useState({ col: 'month', dir: 'asc' })
  const [activeTab, setActiveTab] = useState('A')

  const rowsA = resultsA ? buildRows(resultsA) : []
  const rowsB = resultsB ? buildRows(resultsB) : []
  const hasA  = rowsA.length > 0
  const hasB  = rowsB.length > 0

  if (!hasA && !hasB) return null

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <span>Monthly Breakdown</span>
        <span
          className="text-gray-400 dark:text-gray-600 text-xs transition-transform duration-200 inline-block"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
        >
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800">
          {comparing ? (
            <div className="mt-5 space-y-4">
              {/* Tab selector — narrow screens only, when both scenarios are present */}
              {hasA && hasB && (
                <div className="flex lg:hidden gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
                  {['A', 'B'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveTab(s)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        activeTab === s
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      Scenario {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Wide: side by side */}
              <div className={`hidden lg:grid gap-8 ${hasA && hasB ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {hasA && (
                  <BreakdownTable
                    label="Scenario A"
                    rows={rowsA}
                    sort={sortA}
                    onSort={setSortA}
                    filename="scenario-a.csv"
                  />
                )}
                {hasB && (
                  <BreakdownTable
                    label="Scenario B"
                    rows={rowsB}
                    sort={sortB}
                    onSort={setSortB}
                    filename="scenario-b.csv"
                  />
                )}
              </div>

              {/* Narrow: active tab */}
              <div className="lg:hidden">
                {(activeTab === 'A' || !hasB) && hasA && (
                  <BreakdownTable
                    label={hasB ? undefined : 'Scenario A'}
                    rows={rowsA}
                    sort={sortA}
                    onSort={setSortA}
                    filename="scenario-a.csv"
                  />
                )}
                {(activeTab === 'B' || !hasA) && hasB && (
                  <BreakdownTable
                    label={hasA ? undefined : 'Scenario B'}
                    rows={rowsB}
                    sort={sortB}
                    onSort={setSortB}
                    filename="scenario-b.csv"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <BreakdownTable
                rows={rowsA}
                sort={sortA}
                onSort={setSortA}
                filename="monthly-breakdown.csv"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
