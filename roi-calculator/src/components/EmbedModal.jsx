import { useState, useEffect, useRef } from 'react'

const DEFAULTS = {
  width: '100%',
  height: '800',
  theme: 'dark',
}

const WIDTH_OPTIONS = [
  { label: '100% (responsive)', value: '100%' },
  { label: '600 px', value: '600' },
  { label: '800 px', value: '800' },
  { label: '1024 px', value: '1024' },
]

const HEIGHT_OPTIONS = [
  { label: '600 px', value: '600' },
  { label: '700 px', value: '700' },
  { label: '800 px (default)', value: '800' },
  { label: '900 px', value: '900' },
  { label: '1000 px', value: '1000' },
]

const THEME_OPTIONS = [
  { label: 'Dark', value: 'dark' },
  { label: 'Light', value: 'light' },
  { label: 'System preference', value: 'system' },
]

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-600 dark:text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

export default function EmbedModal({ onClose }) {
  const [width, setWidth] = useState(DEFAULTS.width)
  const [height, setHeight] = useState(DEFAULTS.height)
  const [embedTheme, setEmbedTheme] = useState(DEFAULTS.theme)
  const [baseUrl, setBaseUrl] = useState(() => window.location.origin)
  const [baseUrlError, setBaseUrlError] = useState('')
  const [copied, setCopied] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const themeParam = embedTheme !== 'system' ? `?theme=${embedTheme}` : ''
  // Security (AC-03/INFO): previewUrl is always derived from window.location.origin,
  // not from the user-supplied baseUrl, so it is not subject to injection risk.
  const previewUrl = `${window.location.origin}/embed${themeParam}`

  // Security (AC-03/CRITICAL): embedUrl is only constructed when baseUrl passes
  // new URL() validation. The raw-string-concatenation catch-block fallback has been
  // removed entirely — it allowed a malicious base URL to break out of the src attribute.
  // If new URL() throws, embedUrl remains null and the UI shows an error instead.
  let embedUrl = null
  const trimmedBase = baseUrl.trim()
  if (!trimmedBase) {
    // Empty input: fall back to the current origin (always valid)
    const _url = new URL('/embed', window.location.origin)
    if (embedTheme !== 'system') _url.searchParams.set('theme', embedTheme)
    embedUrl = _url.toString()
  } else {
    try {
      new URL(trimmedBase) // Validate first — throws for malformed or adversarial input
      const _url = new URL('/embed', trimmedBase)
      if (embedTheme !== 'system') _url.searchParams.set('theme', embedTheme)
      embedUrl = _url.toString()
    } catch {
      // embedUrl remains null; error is shown below the Base URL field
    }
  }

  const widthAttr = width === '100%' ? '100%' : width
  // Security (AC-04/HIGH): sandbox and referrerpolicy attributes added to harden the
  // generated snippet. sandbox="allow-scripts allow-same-origin allow-forms" is the
  // minimum set needed for the React app and form inputs inside the iframe to function;
  // allow-top-navigation and allow-popups are intentionally omitted.
  // referrerpolicy="no-referrer" prevents the host page URL from leaking to the
  // embedded origin's server logs.
  // embedCode is null when embedUrl is null so the snippet is never rendered for invalid URLs.
  const embedCode = embedUrl
    ? [
        '<iframe',
        `  src="${embedUrl}"`,
        `  width="${widthAttr}"`,
        `  height="${height}"`,
        '  frameborder="0"',
        '  style="border: none; border-radius: 12px;"',
        '  sandbox="allow-scripts allow-same-origin allow-forms"',
        '  referrerpolicy="no-referrer"',
        '  title="ROI Calculator"',
        '></iframe>',
      ].join('\n')
    : null

  // Security (AC-07/LOW): warn when the base URL uses plain HTTP. Advisory only —
  // HTTP may be valid for local development, so generation is not blocked.
  const showHttpWarning = trimmedBase.startsWith('http://')

  const handleCopy = async () => {
    if (!embedCode) return
    try {
      await navigator.clipboard.writeText(embedCode)
    } catch {
      // TODO: remove deprecated execCommand fallback
      const ta = document.createElement('textarea')
      ta.value = embedCode
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isDefault =
    width === DEFAULTS.width &&
    height === DEFAULTS.height &&
    embedTheme === DEFAULTS.theme &&
    baseUrl === window.location.origin

  const handleReset = () => {
    setWidth(DEFAULTS.width)
    setHeight(DEFAULTS.height)
    setEmbedTheme(DEFAULTS.theme)
    setBaseUrl(window.location.origin)
    setBaseUrlError('')
  }

  // On blur, attempt new URL() validation and surface an error if it throws.
  // On change, the error is cleared immediately so the user can correct their input
  // without waiting for another blur.
  const handleBaseUrlBlur = () => {
    const val = baseUrl.trim()
    if (!val) {
      setBaseUrlError('')
      return
    }
    try {
      new URL(val)
      setBaseUrlError('')
    } catch {
      setBaseUrlError('Invalid URL — must start with https:// or http://')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="embed-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-5xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 id="embed-modal-title" className="text-base font-semibold text-gray-900 dark:text-white">
              Embed ROI Calculator
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Add the calculator to any website with a single snippet of HTML.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800">
          {/* Left — configuration */}
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Configuration
            </p>

            <SelectField label="Width" value={width} onChange={setWidth} options={WIDTH_OPTIONS} />
            <SelectField label="Height" value={height} onChange={setHeight} options={HEIGHT_OPTIONS} />
            <SelectField label="Theme" value={embedTheme} onChange={setEmbedTheme} options={THEME_OPTIONS} />

            <div className="space-y-1.5">
              <label className="text-sm text-gray-600 dark:text-gray-400">Base URL</label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => { setBaseUrl(e.target.value); setBaseUrlError('') }}
                onBlur={handleBaseUrlBlur}
                placeholder="https://your-domain.com"
                className={`w-full bg-gray-50 dark:bg-gray-800 border rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition-colors ${
                  baseUrlError
                    ? 'border-red-400 dark:border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
              {baseUrlError && (
                <p className="text-xs text-red-600 dark:text-red-400">{baseUrlError}</p>
              )}
              {!baseUrlError && showHttpWarning && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠ HTTP URLs are not secure. Use HTTPS for production deployments.
                </p>
              )}
              {!baseUrlError && !showHttpWarning && (
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Your deployment domain. Preview always uses the current origin.
                </p>
              )}
            </div>

            {!isDefault && (
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-2"
              >
                Reset to defaults
              </button>
            )}
          </div>

          {/* Right — preview + code */}
          <div className="p-6 space-y-6">
            {/* Live preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                Live Preview
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                <iframe
                  key={previewUrl}
                  src={previewUrl}
                  className="w-full block"
                  style={{ height: '400px', border: 'none' }}
                  title="Widget preview"
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-1.5">
                Preview at 400 px — configured height is {height} px.
              </p>
            </div>

            {/* Embed code */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Embed Code
                </p>
                <button
                  onClick={handleCopy}
                  disabled={!embedUrl}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    copied
                      ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              {embedUrl ? (
                <pre className="bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300 overflow-x-auto font-mono whitespace-pre">
                  {embedCode}
                </pre>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800/80 border border-red-200 dark:border-red-500/30 rounded-xl p-4 text-xs text-red-600 dark:text-red-400 font-mono">
                  Enter a valid Base URL to generate the embed code.
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-4">
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-3">
                How to embed
              </p>
              <ol className="space-y-2 text-sm text-indigo-700/80 dark:text-indigo-300/80">
                <li className="flex gap-2.5">
                  <span className="font-semibold shrink-0">1.</span>
                  Set the <strong>Base URL</strong> above to your deployment domain.
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold shrink-0">2.</span>
                  Copy the embed code and paste it into your HTML page.
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold shrink-0">3.</span>
                  Use <code className="font-mono bg-indigo-100 dark:bg-indigo-500/20 px-1 py-0.5 rounded text-xs">width="100%"</code> for fluid, responsive layouts.
                </li>
                <li className="flex gap-2.5">
                  <span className="font-semibold shrink-0">4.</span>
                  The <code className="font-mono bg-indigo-100 dark:bg-indigo-500/20 px-1 py-0.5 rounded text-xs">?theme=</code> param pins the widget theme independently of the host page.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
