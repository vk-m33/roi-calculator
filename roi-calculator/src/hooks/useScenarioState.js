import { useState, useRef } from 'react'
import { DEFAULT_INPUTS } from '../constants'
import { validate, isFormValid, toVisible, calculate } from '../utils/calculations'
import { exportPDF } from '../utils/exportPDF'

/**
 * Manages all state for the one-or-two-scenario calculator.
 *
 * Encapsulates inputs, touched flags, derived errors, computed results,
 * the compare toggle, scenario B deletion, and PDF export — keeping
 * CalculatorCore focused on rendering.
 */
export function useScenarioState() {
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

  // Derive errors and validity for each scenario
  const allErrorsA = validate(inputs)
  const allErrorsB = validate(inputsB)
  const errorsA = toVisible(allErrorsA, touchedA)
  const errorsB = toVisible(allErrorsB, touchedB)
  const isValidA = isFormValid(allErrorsA)
  const isValidB = isFormValid(allErrorsB)

  const handleBlurA = (field) => setTouchedA((t) => ({ ...t, [field]: true }))
  const handleBlurB = (field) => setTouchedB((t) => ({ ...t, [field]: true }))

  // Run calculations only when inputs are valid
  const resultsA = isValidA ? calculate(inputs) : null
  const resultsB = isValidB ? calculate(inputsB) : null

  // Which scenario has the better ROI (used for "Better ROI" badge)
  const aWins = !!(resultsA && resultsB && resultsA.roi >= resultsB.roi)
  const bWins = !!(resultsA && resultsB && resultsB.roi > resultsA.roi)

  // Longest period across both scenarios — drives the shared chart x-axis
  const maxPeriod = Math.max(parseInt(inputs.period) || 12, parseInt(inputsB.period) || 12)

  const toggleCompare = () => {
    if (!comparing) {
      // Pre-fill Scenario B with Scenario A's current values so the user can
      // tweak a single parameter rather than starting from scratch.
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

  return {
    // Scenario A
    inputs, setInputs,
    errorsA,
    handleBlurA,
    resultsA,
    labelA, setLabelA,
    aWins,
    // Scenario B
    inputsB, setInputsB,
    errorsB,
    handleBlurB,
    resultsB,
    labelB, setLabelB,
    bWins,
    // Comparison
    comparing,
    toggleCompare,
    deleteScenarioB,
    maxPeriod,
    // Export
    exporting,
    exportError,
    handleExport,
    // Chart ref passed to exportPDF
    chartRef,
  }
}
