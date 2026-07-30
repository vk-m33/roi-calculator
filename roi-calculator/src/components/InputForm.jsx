export default function InputForm({ inputs, setInputs, errors = {}, onBlur = () => {} }) {
  const set = (key) => (e) => setInputs((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-6">
        Parameters
      </p>
      <div className="space-y-5">
        <CurrencyField
          label="Initial Investment"
          value={inputs.investment}
          onChange={set('investment')}
          onBlur={() => onBlur('investment')}
          error={errors.investment}
        />
        <CurrencyField
          label="Monthly Revenue"
          value={inputs.monthlyRevenue}
          onChange={set('monthlyRevenue')}
          onBlur={() => onBlur('monthlyRevenue')}
          error={errors.monthlyRevenue}
        />
        <CurrencyField
          label="Monthly Costs"
          value={inputs.monthlyCosts}
          onChange={set('monthlyCosts')}
          onBlur={() => onBlur('monthlyCosts')}
          error={errors.monthlyCosts}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-400">Calculation Period</label>
          <select
            value={inputs.period}
            onChange={set('period')}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function CurrencyField({ label, value, onChange, onBlur, error }) {
  const invalid = Boolean(error)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
          $
        </span>
        <input
          type="number"
          min="0"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={invalid}
          className={`w-full bg-gray-800 border rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none focus:ring-1 transition-colors ${
            invalid
              ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20'
              : 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
        />
      </div>
      {invalid && (
        <p className="text-red-400 text-xs leading-none mt-0.5">{error}</p>
      )}
    </div>
  )
}
