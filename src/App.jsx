import { useState } from 'react'
import InputForm from './components/InputForm'
import ResultCards from './components/ResultCards'
import PaybackChart from './components/PaybackChart'
import VarianceRow from './components/VarianceRow'
import MonthlyBreakdown from './components/MonthlyBreakdown'

const DEFAULT_INPUTS = {
  investment: '100000',
  monthlyRevenue: '15000',
  monthlyCosts: '5000',
  period: '12',
}

// ── Validation ────────────────────────────────────────────────────────────────

function validate({ investment, monthlyRevenue, monthlyCosts }) {
  const inv = parseFloat(investment)
  const rev = parseFloat(monthlyRevenue)
  const costs = parseFloat(monthlyCosts)
  const revValid = !isNaN(rev) && rev > 0

  return {
    investment:
      investment === '' ? 'Required' :
      isNaN(inv) ? 'Enter a valid number' :
      inv < 1000 ? 'Minimum is $1,000' : '',

    monthlyRevenue:
      monthlyRevenue === '' ? 'Required' :
      isNaN(rev) ? 'Enter a valid number' :
      rev <= 0 ? 'Must be greater than $0' : '',

    monthlyCosts:
      monthlyCosts === '' ? 'Required' :
      isNaN(costs) ? 'Enter a valid number' :
      costs < 0 ? 'Must be $0 or more' :
      revValid && costs > rev ? 'Cannot exceed monthly revenue' : '',

    period: '',
  }
}

function isFormValid(errors) {
  return Object.values(errors).every((v) => v === '')
}

// Only surface errors for fields the user has already interacted with
function toVisible(allErrors, touched) {
  return Object.fromEntries(
    Object.keys(allErrors).map((k) => [k, touched[k] ? allErrors[k] : ''])
  )
}

// ── Calculation ───────────────────────────────────────────────────────────────

function calculate(inputs) {
  const investment = parseFloat(inputs.investment)
  const monthlyRevenue = parseFloat(inputs.monthlyRevenue)
  const monthlyCosts = parseFloat(inputs.monthlyCosts)
  const period = parseInt(inputs.period) || 12

  const monthlyNet = monthlyRevenue - monthlyCosts
  const totalNetProfit = monthlyNet * period - investment
  const roi = investment > 0 ? (totalNetProfit / investment) * 100 : 0
  const paybackMonths = monthlyNet > 0 && investment > 0 ? investment / monthlyNet : null

  const chartData = Array.from({ length: period + 1 }, (_, i) => ({
    month: i,
    cashFlow: Math.round(-investment + i * monthlyNet),
  }))

  return { investment, monthlyRevenue, monthlyCosts, monthlyNet, totalNetProfit, roi, paybackMonths, period, chartData }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScenarioLabel({ label, winner }) {
  return (
    <div className="flex items-center gap-2.5 h-7">
      <span className="text-sm font-semibold text-gray-300">{label}</span>
      {winner && (
        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
          Better ROI
        </span>
      )}
    </div>
  )
}

function EmptyResults() {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-800 p-12">
      <p className="text-sm text-gray-600">Fix the errors above to see results</p>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [inputs, setInputs] = useState({ ...DEFAULT_INPUTS })
  const [inputsB, setInputsB] = useState({ ...DEFAULT_INPUTS })
  const [comparing, setComparing] = useState(false)
  const [touchedA, setTouchedA] = useState({})
  const [touchedB, setTouchedB] = useState({})

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">ROI Calculator</h1>
            <p className="text-gray-400 mt-2 text-base">
              Model your investment returns and visualise the payback timeline.
            </p>
          </div>
          <button
            onClick={toggleCompare}
            className={`mt-1 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              comparing
                ? 'border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                : 'border-indigo-500/40 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 hover:text-indigo-300'
            }`}
          >
            {comparing ? 'Exit comparison' : 'Compare scenarios'}
          </button>
        </header>

        {comparing ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <ScenarioLabel label="Scenario A" winner={aWins} />
                <InputForm inputs={inputs} setInputs={setInputs} errors={errorsA} onBlur={handleBlurA} />
                {resultsA ? <ResultCards results={resultsA} /> : <EmptyResults />}
              </div>
              <div className="space-y-4">
                <ScenarioLabel label="Scenario B" winner={bWins} />
                <InputForm inputs={inputsB} setInputs={setInputsB} errors={errorsB} onBlur={handleBlurB} />
                {resultsB ? <ResultCards results={resultsB} /> : <EmptyResults />}
              </div>
            </div>

            {resultsA && resultsB && <VarianceRow a={resultsA} b={resultsB} />}

            {(resultsA || resultsB) && (
              <PaybackChart
                dataA={resultsA?.chartData ?? null}
                dataB={resultsB?.chartData ?? null}
                period={maxPeriod}
              />
            )}

            {(resultsA || resultsB) && (
              <MonthlyBreakdown
                resultsA={resultsA}
                resultsB={resultsB}
                comparing
              />
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
                    <PaybackChart dataA={resultsA.chartData} period={resultsA.period} />
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
    </div>
  )
}
