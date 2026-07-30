import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

/* ═══════════════════════════════════════════════════════════════
   ICON COMPONENTS
═══════════════════════════════════════════════════════════════ */

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5"
         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 12 4 9"/>
    </svg>
  )
}

function ChevronDownIcon({ open }) {
  return (
    <svg
      className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

function LinuxIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.535-.09.134-.244.quality.254.554.107.85.945 1.172 1.384 1.172.278 0 .513-.16.785-.33.272-.166.579-.337.858-.337.294 0 .49.174.74.33.25.16.563.33.858.33.466 0 1.07-.305 1.384-1.172.109-.35-.036-.538.254-.554.3-.133.586-.201.797-.4.213-.239.403-.571.663-.839a.424.424 0 00.11-.135c.123-.805-.009-1.657-.287-2.489-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021z"/>
    </svg>
  )
}

function LogoIcon() {
  return (
    <svg className="w-7 h-7 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <polyline points="6 9 10 13 14 9 18 11"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LogoIcon />
          <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            ROI Calculator
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link
            to="/app"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors duration-200"
          >
            Open App
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */

function AppMockup() {
  return (
    <div aria-hidden="true" className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Title bar */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          <span className="ml-3 flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-400 dark:text-gray-500 text-center">
            roi-calculator.app
          </span>
        </div>
        {/* App header */}
        <div className="bg-white dark:bg-gray-950 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900 dark:text-white">ROI Calculator</span>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">v0.1.0</span>
        </div>
        {/* App body */}
        <div className="bg-gray-50 dark:bg-gray-950 p-5 space-y-4">
          {/* Input fields mockup */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Initial Investment</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">$50,000</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Annual Gain</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">$15,000</div>
            </div>
          </div>
          {/* Results row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-indigo-600 rounded-xl p-3 text-center col-span-1">
              <div className="text-xs text-indigo-200 mb-0.5">ROI</div>
              <div className="text-xl font-bold text-white">30%</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Payback</div>
              <div className="text-base font-bold text-gray-900 dark:text-white">3.3 yr</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Net Profit</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">+$25K</div>
            </div>
          </div>
          {/* Mini bar chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">Payback Timeline</div>
            <div className="flex items-end gap-1 h-12">
              {[25, 45, 60, 72, 82, 90, 95, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-indigo-500 dark:bg-indigo-600 opacity-80"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Decorative glow */}
      <div className="absolute -inset-4 -z-10 bg-indigo-200 dark:bg-indigo-900 rounded-3xl opacity-30 blur-2xl"></div>
    </div>
  )
}

function Hero() {
  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white dark:bg-gray-900 pt-16 pb-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-tight">
            Calculate ROI with Confidence
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Analyze investments, compare scenarios, and generate professional reports in minutes.
            Make smarter financial decisions backed by clear, data-driven insights.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-md shadow-indigo-200 dark:shadow-indigo-900"
            >
              Start Calculating
            </Link>
            <button
              onClick={scrollToDownload}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-semibold transition-colors duration-200"
            >
              Download Desktop App
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Free forever. No account required. Works in any browser.
          </p>
        </div>
        <AppMockup />
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    title: 'ROI Calculations',
    description: 'Instantly compute return on investment with accurate percentage, net profit, and annualized return metrics.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  {
    title: 'Comparison Mode',
    description: 'Analyse multiple investment scenarios side by side and instantly see which option delivers the best return.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: 'Monthly Breakdown Table',
    description: 'View a detailed month-by-month breakdown of cumulative returns, costs, and profit for the full investment period.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="9" y1="9" x2="9" y2="21"/>
        <line x1="15" y1="9" x2="15" y2="21"/>
      </svg>
    ),
  },
  {
    title: 'Interactive Charts',
    description: 'Visualise the payback timeline and growth curve with dynamic, interactive charts powered by Recharts.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    title: 'PDF Export',
    description: 'Generate polished, professional PDF reports with all calculations, charts, and tables ready for presentations.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: 'Dark Mode',
    description: 'Full dark mode support with automatic system preference detection and one-click toggle — easy on the eyes.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
  {
    title: 'Embeddable Widget',
    description: 'Embed the ROI calculator directly on your website or blog with a single script tag — no backend needed.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    title: 'Offline Desktop Version',
    description: 'Download the native desktop app for Windows. Works completely offline — your data never leaves your machine.',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
]

function Features() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Everything you need to evaluate investments
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Powerful features built for founders, analysts, and business owners who need fast, reliable investment analysis.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BENEFITS
═══════════════════════════════════════════════════════════════ */

const BENEFITS = [
  {
    title: 'Evaluate business investments',
    description: 'Quantify the financial return of any business investment — from equipment purchases to marketing campaigns.',
  },
  {
    title: 'Compare multiple scenarios',
    description: 'Run side-by-side scenario analysis to find the option with the highest ROI before committing.',
  },
  {
    title: 'Track break-even points',
    description: 'Instantly see when each investment crosses into profitability so you can plan cash flow with confidence.',
  },
  {
    title: 'Generate professional reports',
    description: 'Export polished PDF reports with full calculations and charts — ready for board meetings and investor pitches.',
  },
  {
    title: 'Work online or offline',
    description: 'Use the free web calculator from any device, or download the desktop app for private, offline analysis.',
  },
]

function Benefits() {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Built for better investment decisions
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Stop guessing. Use data-driven analysis to back every financial decision you make.
          </p>
        </div>
        <ul className="space-y-5">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-3">
              <CheckIcon />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{benefit.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{benefit.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════════ */

const HOW_IT_WORKS_STEPS = [
  {
    number: '1',
    title: 'Enter Investment Data',
    description: 'Input your initial investment cost, expected annual gain, investment period, and any additional parameters.',
  },
  {
    number: '2',
    title: 'Analyse ROI & Projections',
    description: 'Instantly view your ROI percentage, payback period, net profit, and a detailed month-by-month breakdown table.',
  },
  {
    number: '3',
    title: 'Export & Share Results',
    description: 'Download a professional PDF report with all calculations and charts, or embed the calculator on your own site.',
  },
]

function HowItWorks() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Get from zero to insight in under two minutes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line (desktop only) */}
              {index < HOW_IT_WORKS_STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-indigo-200 dark:bg-indigo-800 -z-10" />
              )}
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 dark:bg-indigo-700 flex items-center justify-center text-white text-2xl font-extrabold mb-5 shadow-md shadow-indigo-200 dark:shadow-indigo-900 z-10">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-md shadow-indigo-200 dark:shadow-indigo-900"
          >
            Try it now — it&apos;s free
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP VERSION
═══════════════════════════════════════════════════════════════ */

function DesktopVersion({ releases }) {
  const version = releases?.version ? `v${releases.version}` : 'v0.1.0'

  const scrollToDownload = () => {
    document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl border border-indigo-100 dark:border-indigo-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                  Desktop App
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium px-3 py-1 rounded-full">
                  {version}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Take it offline — your data stays yours
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                The desktop version gives you all the power of the web app, plus true offline operation with complete
                data privacy. Nothing is ever sent to a server.
              </p>
              <button
                onClick={scrollToDownload}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 hover:scale-105 shadow-md shadow-indigo-200 dark:shadow-indigo-900"
              >
                Download Now
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Platform availability */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-blue-500 dark:text-blue-400">
                    <WindowsIcon />
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">Windows</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full">
                  Available
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Windows 10 / 11 (64-bit)</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-gray-500 dark:text-gray-400">
                    <AppleIcon />
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">macOS</span>
                </div>
                <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">macOS 12 Monterey and later</p>
              </div>
              {/* Key points */}
              {[
                { icon: '🔒', label: 'Complete offline operation', sub: 'No internet required after install' },
                { icon: '💾', label: 'Local data storage', sub: 'Your data never leaves your device' },
              ].map((item) => (
                <div key={item.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DOWNLOAD
═══════════════════════════════════════════════════════════════ */

function PlatformIcon({ platform }) {
  if (platform === 'windows') return <span className="text-blue-500 dark:text-blue-400"><WindowsIcon /></span>
  if (platform === 'macos') return <span className="text-gray-500 dark:text-gray-400"><AppleIcon /></span>
  return <span className="text-orange-500 dark:text-orange-400"><LinuxIcon /></span>
}

function formatSize(sizeBytes) {
  if (sizeBytes == null) return null
  if (sizeBytes < 1024 * 1024) return `${(sizeBytes / 1024).toFixed(0)} KB`
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
}

function Download({ releases, loading, error }) {
  if (loading) {
    return (
      <section id="download" className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400">Loading download options...</p>
        </div>
      </section>
    )
  }

  if (error || !releases) {
    return (
      <section id="download" className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-900 dark:text-white font-semibold mb-2">Download options temporarily unavailable</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Please try refreshing the page.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="download" className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Download the desktop app
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Current release:{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              v{releases.version}
            </span>
            {releases.releaseDate && (
              <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                ({releases.releaseDate})
              </span>
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {releases.downloads.map((dl) => {
            const size = formatSize(dl.sizeBytes)
            return (
              <div
                key={`${dl.platform}-${dl.type}`}
                className={`bg-white dark:bg-gray-800 rounded-xl border p-6 flex flex-col gap-4 ${
                  dl.available
                    ? 'border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-1 transition-transform duration-200'
                    : 'border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <PlatformIcon platform={dl.platform} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
                      {dl.label}
                    </p>
                    {size && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{size}</p>
                    )}
                    {!size && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
                        {dl.platform} &middot; {dl.type}
                      </p>
                    )}
                  </div>
                </div>
                {dl.available && dl.url ? (
                  <a
                    href={dl.url}
                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download
                  </a>
                ) : (
                  <span
                    aria-disabled="true"
                    className="mt-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium cursor-not-allowed"
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          By downloading, you agree to our{' '}
          <a href="#terms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Terms of Service</a>.
          {' '}All builds are signed and verified.
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TECHNICAL FEATURES
═══════════════════════════════════════════════════════════════ */

const TECH_FEATURES = [
  {
    label: 'Offline Support',
    description: 'The desktop app runs without an internet connection. All calculations happen locally.',
    icon: '📶',
  },
  {
    label: 'Local Data Storage',
    description: 'No cloud sync. Your investment data is stored on your device only — full data sovereignty.',
    icon: '💾',
  },
  {
    label: 'Fast Calculations',
    description: 'Instant results on every keystroke. Powered by optimised in-memory computation, no server round trips.',
    icon: '⚡',
  },
  {
    label: 'Responsive Design',
    description: 'Pixel-perfect layout from mobile (375 px) to widescreen (1920 px+). Works on any device.',
    icon: '📱',
  },
  {
    label: 'Secure Data Handling',
    description: 'Zero telemetry, zero analytics, zero data collection. Your financial data is never transmitted.',
    icon: '🔐',
  },
]

function TechnicalFeatures() {
  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Built to enterprise standards
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Technical evaluators and IT teams can deploy with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TECH_FEATURES.map((feat) => (
            <div
              key={feat.label}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 text-center hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="text-3xl mb-3">{feat.icon}</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{feat.label}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   USE CASES
═══════════════════════════════════════════════════════════════ */

const USE_CASES = [
  {
    role: 'Startup Founders',
    quote: 'I use the ROI Calculator to evaluate new product launches and feature investments before committing budget. It cuts our decision time in half.',
    avatar: '🚀',
    name: 'Alex M.',
    title: 'Co-founder & CEO',
  },
  {
    role: 'Marketing Managers',
    quote: 'Comparing campaign ROI across channels used to take hours in spreadsheets. Now I have accurate numbers in minutes and a report ready for the board.',
    avatar: '📈',
    name: 'Sarah K.',
    title: 'Head of Growth',
  },
  {
    role: 'Financial Analysts',
    quote: 'The monthly breakdown tables and the PDF export feature save hours of manual work. Exactly the kind of tool I can recommend to any finance team.',
    avatar: '📊',
    name: 'David R.',
    title: 'Senior Financial Analyst',
  },
  {
    role: 'Small Business Owners',
    quote: 'I finally understand which investments are actually worth making. The break-even tracker alone has paid for itself many times over.',
    avatar: '🏪',
    name: 'Maria L.',
    title: 'Owner, ML Retail',
  },
]

function UseCases() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Trusted across industries
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See how different roles use ROI Calculator to make smarter financial decisions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {USE_CASES.map((item) => (
            <div
              key={item.role}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.avatar}</span>
                <div>
                  <p className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{item.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.title}</p>
                </div>
              </div>
              <blockquote className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">— {item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════════ */

const FAQ_ITEMS = [
  {
    question: 'Is the calculator free to use?',
    answer: 'Yes — the web calculator is completely free with no account required and no usage limits. The desktop app is also free to download and use indefinitely.',
  },
  {
    question: 'Does it work offline?',
    answer: 'The desktop app works fully offline after installation — no internet connection required. The web version requires a browser but runs all calculations entirely client-side; no data is sent to any server.',
  },
  {
    question: 'Is my financial data stored online?',
    answer: 'No. All calculations run locally in your browser or inside the desktop app. We do not collect, transmit, or store any of your financial data. There is no account system and no backend database.',
  },
  {
    question: 'Can I compare multiple investments at once?',
    answer: 'Yes. Comparison Mode lets you set up and analyse multiple investment scenarios side by side, making it easy to identify which option delivers the strongest return.',
  },
  {
    question: 'Can I export my results to a report?',
    answer: 'Yes. Use the PDF Export feature to generate a professional report that includes all calculations, a monthly breakdown table, and the payback timeline chart. Reports are ready for presentations and investor decks.',
  },
]

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="bg-white dark:bg-gray-900 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know before getting started.
          </p>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={item.question}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"
              >
                <span>{item.question}</span>
                <ChevronDownIcon open={openIndex === i} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Still have questions?{' '}
          <a href="mailto:support@roi-calculator.app" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */

function Footer({ releases }) {
  const version = releases?.version ? `v${releases.version}` : 'v0.1.0'

  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <LogoIcon />
              <span className="font-bold text-gray-900 dark:text-white">ROI Calculator</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Free investment analysis tool for founders, analysts, and business owners.
            </p>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Release {version}
            </p>
          </div>
          {/* Product */}
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Product</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Web Calculator
                </Link>
              </li>
              <li>
                <a href="#download" onClick={(e) => { e.preventDefault(); document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' }) }} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Desktop App
                </a>
              </li>
              <li>
                <Link to="/app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Contact</p>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <a href="mailto:support@roi-calculator.app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  support@roi-calculator.app
                </a>
              </li>
              <li>
                <a href="https://github.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span>&copy; {new Date().getFullYear()} ROI Calculator. All rights reserved.</span>
          <span>
            Built with React &amp; Tauri &middot; Release {version}
          </span>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE (default export)
═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const [releases, setReleases] = useState(null)
  const [releasesLoading, setReleasesLoading] = useState(true)
  const [releasesError, setReleasesError] = useState(false)

  useEffect(() => {
    fetch('/api/releases.json')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        setReleases(data)
        setReleasesLoading(false)
      })
      .catch(() => {
        setReleasesError(true)
        setReleasesLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Benefits />
      <HowItWorks />
      <DesktopVersion releases={releases} />
      <Download releases={releases} loading={releasesLoading} error={releasesError} />
      <TechnicalFeatures />
      <UseCases />
      <FAQ />
      <Footer releases={releases} />
    </div>
  )
}
