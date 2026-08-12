import { useCurrency } from '../../contexts/CurrencyContext'

const CurrencySelector = ({ className = '' }) => {
  const { selectedCurrency, setCurrency, options, loading } = useCurrency()

  return (
    <select
      value={selectedCurrency}
      onChange={(event) => setCurrency(event.target.value)}
      aria-label="Select currency"
      className={`rounded-xl border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700 outline-none transition-colors focus:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${className}`}
    >
      {options.map((currency) => (
        <option key={currency.code} value={currency.code} disabled={!currency.available}>
          {currency.code} — {currency.name}{!currency.available && !loading ? ' (Unavailable)' : ''}
        </option>
      ))}
    </select>
  )
}

export default CurrencySelector
