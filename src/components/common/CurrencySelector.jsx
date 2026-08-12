import { ChevronDown } from 'lucide-react'
import { useCurrency } from '../../contexts/CurrencyContext'

const CurrencySelector = ({ className = '', compact = false }) => {
  const { selectedCurrency, setCurrency, options, loading } = useCurrency()

  const currencyOptions = options.map((currency) => (
    <option key={currency.code} value={currency.code} disabled={!currency.available}>
      {currency.code} — {currency.name}{!currency.available && !loading ? ' (Unavailable)' : ''}
    </option>
  ))

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
          <span>{selectedCurrency}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </div>
        <select
          value={selectedCurrency}
          onChange={(event) => setCurrency(event.target.value)}
          aria-label="Select currency"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {currencyOptions}
        </select>
      </div>
    )
  }

  return (
    <select
      value={selectedCurrency}
      onChange={(event) => setCurrency(event.target.value)}
      aria-label="Select currency"
      className={`rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 outline-none transition-colors focus:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${className}`}
    >
      {currencyOptions}
    </select>
  )
}

export default CurrencySelector
