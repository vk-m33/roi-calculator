import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── Constants ────────────────────────────────────────────────────────────────
const PW = 210           // A4 width mm
const PH = 297           // A4 height mm
const M  = 15            // page margin mm
const CW = PW - M * 2   // content width

const C = {
  white:    [255, 255, 255],
  gray50:   [249, 250, 251],
  gray100:  [243, 244, 246],
  gray300:  [209, 213, 219],
  gray500:  [107, 114, 128],
  gray700:  [55,  65,  81],
  gray900:  [17,  24,  39],
  indigo:   [99,  102, 241],
  orange:   [251, 146, 60],
  emerBg:   [236, 253, 245],
  emerText: [6,   78,  59],
  redBg:    [254, 242, 242],
  redText:  [127, 29,  29],
}

// ── Formatters ───────────────────────────────────────────────────────────────
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', maximumFractionDigits: 0,
})

function fmtRoi(n)  { return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%` }
function fmtPay(m)  { return m === null ? 'Never' : `${m.toFixed(1)} mo` }
function fmtProfit(n) { return (n >= 0 ? '+' : '') + currency.format(n) }

function isoDate()  { return new Date().toISOString().slice(0, 10) }
function longDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// ── PDF helpers ──────────────────────────────────────────────────────────────
function section(doc, y, label) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...C.indigo)
  doc.text(label, M, y)
  doc.setDrawColor(...C.indigo)
  doc.setLineWidth(0.25)
  doc.line(M, y + 1.5, M + CW, y + 1.5)
  return y + 7
}

function needPage(doc, y, needed) {
  if (y + needed > PH - M - 14) {
    doc.addPage()
    return M + 4
  }
  return y
}

function infoCard(doc, y, text, style) {
  const bg   = style === 'success' ? C.emerBg  : C.redBg
  const text_ = style === 'success' ? C.emerText : C.redText
  doc.setFillColor(...bg)
  doc.roundedRect(M, y, CW, 11, 2, 2, 'F')
  doc.setFont('helvetica', style === 'success' ? 'bold' : 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...text_)
  doc.text(text, M + CW / 2, y + 7, { align: 'center' })
  return y + 15
}

// ── Chart capture (no extra dependency) ─────────────────────────────────────
async function chartToPng(chartRef) {
  const svgEl = chartRef?.current?.querySelector('svg')
  if (!svgEl) return null

  const { width, height } = svgEl.getBoundingClientRect()
  if (!width || !height) return null

  const clone = svgEl.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))

  // Inject background so the PDF image isn't transparent
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('width', '100%')
  bg.setAttribute('height', '100%')
  bg.setAttribute('fill', '#111827')
  clone.insertBefore(bg, clone.firstChild)

  const svgStr  = new XMLSerializer().serializeToString(clone)
  const svgData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`

  return new Promise((resolve) => {
    const img    = new Image()
    const scale  = 2
    const canvas = document.createElement('canvas')
    canvas.width  = width  * scale
    canvas.height = height * scale

    img.onload = () => {
      const ctx = canvas.getContext('2d')
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, width, height)
      resolve({ dataUrl: canvas.toDataURL('image/png'), width, height })
    }
    img.onerror = () => resolve(null)
    img.src = svgData
  })
}

// ── Main export ──────────────────────────────────────────────────────────────
export async function exportPDF({
  inputs, inputsB, resultsA, resultsB, comparing, chartRef,
}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = 0

  // ── Header strip ────────────────────────────────────────────────────────────
  doc.setFillColor(...C.indigo)
  doc.rect(0, 0, PW, 34, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...C.white)
  doc.text('ROI Analysis Report', M, 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(200, 210, 255)
  doc.text(longDate(), M, 24)

  if (comparing) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.text('COMPARISON MODE', PW - M, 24, { align: 'right' })
  }

  y = 42

  // ── Content ──────────────────────────────────────────────────────────────────
  if (!comparing) {
    // Single mode ──────────────────────────────────────────────────────────────

    y = section(doc, y, 'INPUTS')
    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      body: [
        ['Initial Investment', currency.format(parseFloat(inputs.investment))],
        ['Monthly Revenue',    currency.format(parseFloat(inputs.monthlyRevenue))],
        ['Monthly Costs',      currency.format(parseFloat(inputs.monthlyCosts))],
        ['Calculation Period', `${inputs.period} months`],
        ['Discount Rate',      `${inputs.discountRate}%`],
      ],
      styles:             { fontSize: 9, cellPadding: 3.5, textColor: C.gray700 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80, textColor: C.gray900 },
        1: { halign: 'right', fontStyle: 'bold', textColor: C.gray900 },
      },
      alternateRowStyles: { fillColor: C.gray50 },
      theme: 'plain',
    })
    y = doc.lastAutoTable.finalY + 10

    y = needPage(doc, y, 44)
    y = section(doc, y, 'ROI METRICS')

    const posColor = (n) => n >= 0 ? [16, 185, 129] : [239, 68, 68]

    if (resultsA) {
      autoTable(doc, {
        startY: y,
        margin: { left: M, right: M },
        body: [
          ['ROI',            fmtRoi(resultsA.roi)],
          ['Payback Period', fmtPay(resultsA.paybackMonths)],
          ['Net Profit',     currency.format(resultsA.totalNetProfit)],
          ['NPV',            resultsA.npv != null ? currency.format(resultsA.npv) : 'N/A'],
          ['IRR',            resultsA.irr != null ? `${resultsA.irr.toFixed(2)}%` : 'N/A'],
        ],
        styles:             { fontSize: 9, cellPadding: 3.5, textColor: C.gray700 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80, textColor: C.gray900 },
          1: { halign: 'right', fontStyle: 'bold' },
        },
        alternateRowStyles: { fillColor: C.gray50 },
        theme: 'plain',
        didParseCell(data) {
          if (data.column.index === 1 && data.section === 'body') {
            const vals = [
              resultsA.roi,
              resultsA.paybackMonths ?? 0,
              resultsA.totalNetProfit,
              resultsA.npv,
              resultsA.irr,
            ]
            const v = vals[data.row.index]
            if (v != null) data.cell.styles.textColor = posColor(v)
          }
        },
      })
      y = doc.lastAutoTable.finalY + 8

      y = needPage(doc, y, 14)
      if (resultsA.paybackMonths !== null) {
        const mo = Math.ceil(resultsA.paybackMonths)
        y = infoCard(
          doc, y,
          `Break-even reached at month ${mo}  (${resultsA.paybackMonths.toFixed(1)} months)`,
          'success'
        )
      } else {
        y = infoCard(
          doc, y,
          'Investment does not break even within the selected period',
          'error'
        )
      }

      // Monthly breakdown table
      y = needPage(doc, y, 20)
      y = section(doc, y, 'MONTHLY BREAKDOWN')
      const fmt = (n) => currency.format(n)
      const period = parseInt(inputs.period)
      const monthlyRevenue = parseFloat(inputs.monthlyRevenue)
      const monthlyCosts = parseFloat(inputs.monthlyCosts)
      const investment = parseFloat(inputs.investment)
      const net = monthlyRevenue - monthlyCosts
      const monthlyRows = Array.from({ length: period }, (_, i) => {
        const month = i + 1
        const cumulative = net * month - investment
        const roi = investment > 0 ? (cumulative / investment) * 100 : 0
        return [month, fmt(monthlyRevenue), fmt(monthlyCosts), fmt(net), fmt(cumulative), roi.toFixed(1) + '%']
      })
      autoTable(doc, {
        head: [['Month', 'Revenue', 'Costs', 'Net', 'Cumulative P/L', 'ROI %']],
        body: monthlyRows,
        startY: y,
        margin: { left: M, right: M },
        theme: 'striped',
        styles: { fontSize: 8 },
      })
      y = doc.lastAutoTable.finalY + 8
    }

  } else {
    // Comparison mode ──────────────────────────────────────────────────────────

    y = section(doc, y, 'INPUTS')
    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head:  [['Parameter', 'Scenario A', 'Scenario B']],
      body: [
        ['Initial Investment',
          currency.format(parseFloat(inputs.investment)),
          currency.format(parseFloat(inputsB.investment))],
        ['Monthly Revenue',
          currency.format(parseFloat(inputs.monthlyRevenue)),
          currency.format(parseFloat(inputsB.monthlyRevenue))],
        ['Monthly Costs',
          currency.format(parseFloat(inputs.monthlyCosts)),
          currency.format(parseFloat(inputsB.monthlyCosts))],
        ['Calculation Period', `${inputs.period} months`, `${inputsB.period} months`],
        ['Discount Rate', `${inputs.discountRate}%`, `${inputsB.discountRate}%`],
      ],
      styles:             { fontSize: 8.5, cellPadding: 3, textColor: C.gray700 },
      headStyles:         { fillColor: C.gray700, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: C.gray50 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: C.gray900 },
        1: { halign: 'right', textColor: C.indigo },
        2: { halign: 'right', textColor: C.orange },
      },
      theme: 'grid',
    })
    y = doc.lastAutoTable.finalY + 10

    y = needPage(doc, y, 44)
    y = section(doc, y, 'ROI METRICS')

    const roiDelta    = resultsA && resultsB ? resultsB.roi - resultsA.roi : null
    const payDelta    =
      resultsA?.paybackMonths != null && resultsB?.paybackMonths != null
        ? resultsB.paybackMonths - resultsA.paybackMonths
        : null
    const profDelta   = resultsA && resultsB ? resultsB.totalNetProfit - resultsA.totalNetProfit : null
    const npvDelta    = resultsA && resultsB ? resultsB.npv - resultsA.npv : null
    const irrDelta    =
      resultsA?.irr != null && resultsB?.irr != null
        ? resultsB.irr - resultsA.irr
        : null

    const delta = (v, suffix = '') =>
      v === null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}${suffix}`

    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head:  [['Metric', 'Scenario A', 'Scenario B', 'Δ (B − A)']],
      body: [
        ['ROI',
          resultsA ? fmtRoi(resultsA.roi) : '—',
          resultsB ? fmtRoi(resultsB.roi) : '—',
          delta(roiDelta, ' pp')],
        ['Payback Period',
          resultsA ? fmtPay(resultsA.paybackMonths) : '—',
          resultsB ? fmtPay(resultsB.paybackMonths) : '—',
          delta(payDelta, ' mo')],
        ['Net Profit',
          resultsA ? currency.format(resultsA.totalNetProfit) : '—',
          resultsB ? currency.format(resultsB.totalNetProfit) : '—',
          profDelta !== null ? fmtProfit(profDelta) : '—'],
        ['NPV',
          resultsA ? currency.format(resultsA.npv) : '—',
          resultsB ? currency.format(resultsB.npv) : '—',
          npvDelta !== null ? fmtProfit(npvDelta) : '—'],
        ['IRR',
          resultsA?.irr != null ? `${resultsA.irr.toFixed(2)}%` : 'N/A',
          resultsB?.irr != null ? `${resultsB.irr.toFixed(2)}%` : 'N/A',
          irrDelta !== null ? delta(irrDelta, ' pp') : '—'],
      ],
      styles:             { fontSize: 8.5, cellPadding: 3, textColor: C.gray700 },
      headStyles:         { fillColor: C.gray700, textColor: C.white, fontSize: 8, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: C.gray50 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: C.gray900 },
        1: { halign: 'right', textColor: C.indigo },
        2: { halign: 'right', textColor: C.orange },
        3: { halign: 'right', textColor: C.gray500 },
      },
      theme: 'grid',
    })
    y = doc.lastAutoTable.finalY + 8

    // Winner card
    if (resultsA && resultsB) {
      y = needPage(doc, y, 14)
      const winner = resultsA.roi >= resultsB.roi ? 'Scenario A' : 'Scenario B'
      const diff   = Math.abs(resultsB.roi - resultsA.roi).toFixed(1)
      y = infoCard(
        doc, y,
        `${winner} has the better ROI by ${diff} percentage points`,
        'success'
      )
    }

    // Monthly breakdown tables for comparison mode
    const scenarios = [
      { label: 'SCENARIO A — MONTHLY BREAKDOWN', inp: inputs },
      { label: 'SCENARIO B — MONTHLY BREAKDOWN', inp: inputsB },
    ]
    for (const { label: sLabel, inp } of scenarios) {
      if (!inp) continue
      y = needPage(doc, y, 20)
      y = section(doc, y, sLabel)
      const fmt = (n) => currency.format(n)
      const period = parseInt(inp.period)
      const monthlyRevenue = parseFloat(inp.monthlyRevenue)
      const monthlyCosts = parseFloat(inp.monthlyCosts)
      const investment = parseFloat(inp.investment)
      const net = monthlyRevenue - monthlyCosts
      const monthlyRows = Array.from({ length: period }, (_, i) => {
        const month = i + 1
        const cumulative = net * month - investment
        const roi = investment > 0 ? (cumulative / investment) * 100 : 0
        return [month, fmt(monthlyRevenue), fmt(monthlyCosts), fmt(net), fmt(cumulative), roi.toFixed(1) + '%']
      })
      autoTable(doc, {
        head: [['Month', 'Revenue', 'Costs', 'Net', 'Cumulative P/L', 'ROI %']],
        body: monthlyRows,
        startY: y,
        margin: { left: M, right: M },
        theme: 'striped',
        styles: { fontSize: 8 },
      })
      y = doc.lastAutoTable.finalY + 8
    }
  }

  // ── Chart image ─────────────────────────────────────────────────────────────
  try {
    const chart = await chartToPng(chartRef)
    if (chart) {
      y = needPage(doc, y, 16)
      y = section(doc, y, 'CUMULATIVE CASH FLOW')

      const imgH = Math.round((chart.height / chart.width) * CW)
      y = needPage(doc, y, imgH + 4)
      doc.addImage(chart.dataUrl, 'PNG', M, y, CW, imgH)
      y += imgH + 8
    }
  } catch (_) {
    // chart capture optional — skip on failure
  }

  // ── Footer on every page ─────────────────────────────────────────────────────
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setDrawColor(...C.gray300)
    doc.setLineWidth(0.2)
    doc.line(M, PH - 12, PW - M, PH - 12)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...C.gray500)
    doc.text('Generated by ROI Calculator', M, PH - 7)
    doc.text(`Page ${i} of ${pages}`, PW - M, PH - 7, { align: 'right' })
  }

  // Security: filename uses system date only; no user input is interpolated; no sanitisation required.
  doc.save(`ROI-Analysis-${isoDate()}.pdf`)
}
