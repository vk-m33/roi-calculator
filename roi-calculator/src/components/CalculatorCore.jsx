import { useState, useRef } from 'react'
import InputForm from './InputForm'
import ResultCards from './ResultCards'
import PaybackChart from './PaybackChart'
import VarianceRow from './VarianceRow'
import MonthlyBreakdown from './MonthlyBreakdown'
import { exportPDF } from '../utils/exportPDF'

// Security (AC-05): upper bound for all currency fields — prevents Infinity/NaN
// from propagating into the calculation engine when a user enters astronomically
// large numbers (e.g. 1e308 or 1e309).
const MAX_CURRENCY = 999_999_999_999

const DEFAULT_INPUTS = {
  investment: '100000',
  monthlyRevenue: '15000',
  monthlyCosts: '5000',
  period: '12',
  discountRate: '10',
}

function validate({ investment, monthlyRevenue, monthlyCosts, discountRate }) {
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

function isFormValid(errors) {
  return Object.values(errors).every((v) => v === '')
}

function toVisible(allErrors, touched) {
  return Object.fromEntries(
    Object.keys(allErrors).map((k) => [k, touched[k] ? allErrors[k] : ''])
  )
}

function computeIRR(investment, monthlyNet, period) {
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

function calculate(inputs) {
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

function ScenarioLabel({ label, onRename, winner, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed) onRename(trimmed)
    else setDraft(label)
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setDraft(label); setEditing(false) }
  }

  return (
    <div className="flex items-center gap-2.5 h-7">
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-transparent border-b border-indigo-500 focus:outline-none w-40"
        />
      ) : (
        <span
          className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
          onClick={() => { setDraft(label); setEditing(true) }}
          title="Click to rename"
        >
          {label}
        </span>
      )}
      {winner && (
        <span className="text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full">
          Better ROI
        </span>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="ml-auto text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
          title="Remove scenario"
          aria-label="Remove scenario B"
        >
          ×
        </button>
      )}
    </div>
  )
}

function EmptyResults() {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-12">
      <p className="text-sm text-gray-400 dark:text-gray-600">Fix the errors above to see results</p>
    </div>
  )
}

function ExportButton({ loading, error, onClick }) {
  return (
    <div>
      <button
        onClick={onClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-indigo-500 dark:border-t-indigo-400 animate-spin" />
            Generating PDF…
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export to PDF
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600 dark:text-red-400 text-center mt-1.5">{error}</p>}
    </div>
  )
}

export default function CalculatorCore() {
  const [inputs, setInputs] = useState({ ...DEFAULT_INPUTS })
  const [inputsB, setInputsB] = useState({ ...DEFAULT_INPUTS })
  const [comparing, setComparing] = useState(false)
  const [touchedA, setTouchedA] = useState({})
  const [touchedB, setTouchedB] = useState({})
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [labelA, setLabelA] = useState('Scenario A')
  const [labelB, setLabelB] = useState('Scenario B')
  const chartRef = useRef(null)

  const allErrorsA = validate(inputs)
  const allErrorsB = validate(inputsB)
  const errorsA = toVisible(allErrorsA, touchedA)
  const errorsB = toVisible(allErrorsB, touchedB)
  const isValidA = isFormValid(allErrorsA)
  const isValidB = isFormValid(allErrorsB)

  const handleBlurA = (field) => setTouchedA((t) => ({ ...t, [field]: true }))
  const handleBlurB = (field) => setTouchedB((t) => ({ ...t, [field]: true }))

  const resultsA = isValidA ? calculate(inputs) : null
  const resultsB = isValidB ? calculate(inputsB) : null

  const aWins = !!(resultsA && resultsB && resultsA.roi >= resultsB.roi)
  const bWins = !!(resultsA && resultsB && resultsB.roi > resultsA.roi)

  const maxPeriod = Math.max(parseInt(inputs.period) || 12, parseInt(inputsB.period) || 12)

  const toggleCompare = () => {
    if (!comparing) {
      setInputsB({ ...inputs })
      setTouchedB({})
    }
    setComparing((c) => !c)
  }

  const deleteScenarioB = () => {
    setComparing(false)
    setInputsB({ ...DEFAULT_INPUTS })
    setTouchedB({})
    setLabelB('Scenario B')
  }

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      await exportPDF({ inputs, inputsB, resultsA, resultsB, comparing, chartRef })
    } catch {
      setExportError('Failed to generate PDF. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          onClick={toggleCompare}
          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
            comparing
              ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              : 'border-indigo-300 dark:border-indigo-500/40 bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-600/20'
          }`}
        >
          {comparing ? 'Exit comparison' : 'Compare scenarios'}
        </button>
      </div>

      {comparing ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ScenarioLabel label={labelA} onRename={setLabelA} winner={aWins} />
              <InputForm inputs={inputs} setInputs={setInputs} errors={errorsA} onBlur={handleBlurA} />
              {resultsA ? <ResultCards results={resultsA} /> : <EmptyResults />}
            </div>
            <div className="space-y-4">
              <ScenarioLabel label={labelB} onRename={setLabelB} winner={bWins} onDelete={deleteScenarioB} />
              <InputForm inputs={inputsB} setInputs={setInputsB} errors={errorsB} onBlur={handleBlurB} />
              {resultsB ? <ResultCards results={resultsB} /> : <EmptyResults />}
            </div>
          </div>

          {resultsA && resultsB && <VarianceRow a={resultsA} b={resultsB} />}

          {(resultsA || resultsB) && (
            <>
              <ExportButton loading={exporting} error={exportError} onClick={handleExport} />
              <div ref={chartRef}>
                <PaybackChart
                  dataA={resultsA?.chartData ?? null}
                  dataB={resultsB?.chartData ?? null}
                  period={maxPeriod}
                />
              </div>
            </>
          )}

          {(resultsA || resultsB) && (
            <MonthlyBreakdown resultsA={resultsA} resultsB={resultsB} comparing />
          )}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <InputForm inputs={inputs} setInputs={setInputs} errors={errorsA} onBlur={handleBlurA} />
            <div className="space-y-6">
              {resultsA ? (
                <>
                  <ResultCards results={resultsA} />
                  <ExportButton loading={exporting} error={exportError} onClick={handleExport} />
                  <div ref={chartRef}>
                    <PaybackChart dataA={resultsA.chartData} period={resultsA.period} />
                  </div>
                </>
              ) : (
                <EmptyResults />
              )}
            </div>
          </div>

          {resultsA && <MonthlyBreakdown resultsA={resultsA} />}
        </div>
      )}
    </div>
  )
}
