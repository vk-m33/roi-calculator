import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { currency } from '../utils/formatters'

const COLOR_A = '#818cf8' // indigo-400
const COLOR_B = '#fb923c' // orange-400

// Compact formatter used only for Y-axis tick labels — different from the full `currency` formatter
const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const TICK_INTERVAL = { 12: 3, 24: 4, 36: 6 }

function mergeData(dataA, dataB) {
  const len = Math.max(dataA?.length ?? 0, dataB?.length ?? 0)
  return Array.from({ length: len }, (_, i) => ({
    month: i,
    A: dataA?.[i]?.cashFlow,
    B: dataB?.[i]?.cashFlow,
  }))
}

function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm shadow-xl space-y-1">
      <p className="text-gray-500 dark:text-gray-400 mb-2">Month {label}</p>
      {payload.map((p) =>
        p.value !== undefined ? (
          <div key={p.dataKey} className="flex items-center justify-between gap-6">
            <span style={{ color: p.color }} className="font-medium">
              {p.dataKey === 'A' ? 'Scenario A' : 'Scenario B'}
            </span>
            <span className={p.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
              {currency.format(p.value)}
            </span>
          </div>
        ) : null
      )}
      <p className="text-gray-400 dark:text-gray-600 text-xs pt-1">Cumulative cash flow</p>
    </div>
  )
}

export default function PaybackChart({ dataA, dataB, period }) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const hasA = Boolean(dataA)
  const hasB = Boolean(dataB)
  const chartData = hasA || hasB ? mergeData(dataA, dataB) : []

  // Theme-aware SVG color values (not Tailwind — these go to Recharts props)
  const gridColor   = isDark ? '#1f2937' : '#e5e7eb'
  const tickColor   = isDark ? '#6b7280' : '#6b7280'
  const axisColor   = isDark ? '#374151' : '#d1d5db'
  const refColor    = isDark ? '#6b7280' : '#9ca3af'

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Cumulative Cash Flow</h2>
          <p className="text-sm text-gray-500 mt-0.5">Line crosses $0 at the break-even point</p>
        </div>
        {hasA && hasB && (
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 items-center">
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 inline-block rounded" style={{ background: COLOR_A }} />
              Scenario A
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 inline-block rounded" style={{ background: COLOR_B }} />
              Scenario B
            </span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            interval={TICK_INTERVAL[period] ?? 3}
            tickFormatter={(v) => `Mo ${v}`}
          />
          <YAxis
            tickFormatter={(v) => compact.format(v)}
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={68}
          />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <ReferenceLine
            y={0}
            stroke={refColor}
            strokeDasharray="6 4"
            strokeWidth={1.5}
            label={{ value: '$0', position: 'insideTopRight', fill: refColor, fontSize: 11 }}
          />
          {hasA && (
            <Line
              type="monotone"
              dataKey="A"
              stroke={COLOR_A}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLOR_A, stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 2 }}
              connectNulls={false}
            />
          )}
          {hasB && (
            <Line
              type="monotone"
              dataKey="B"
              stroke={COLOR_B}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLOR_B, stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 2 }}
              connectNulls={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
