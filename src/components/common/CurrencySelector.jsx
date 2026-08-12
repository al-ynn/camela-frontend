import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useCurrency } from '../../contexts/CurrencyContext'

const CurrencySelector = ({ className = '', compact = false }) => {
  const { selectedCurrency, setCurrency, options, loading } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const compactSelectorRef = useRef(null)

  useEffect(() => {
    if (!compact || !isOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!compactSelectorRef.current?.contains(event.target)) setIsOpen(false)
    }

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [compact, isOpen])

  const currencyOptions = options.map((currency) => (
    <option key={currency.code} value={currency.code} disabled={!currency.available}>
      {currency.code} — {currency.name}{!currency.available && !loading ? ' (Unavailable)' : ''}
    </option>
  ))

  if (compact) {
    return (
      <div ref={compactSelectorRef} className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Select currency"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 outline-none transition-colors hover:bg-gray-50 focus:border-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <span>{selectedCurrency}</span>
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            role="listbox"
            aria-label="Currencies"
            className="absolute right-0 top-full z-50 mt-2 max-h-72 w-64 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 text-gray-800 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          >
            {options.map((currency) => {
              const unavailable = !currency.available
              const selected = currency.code === selectedCurrency

              return (
                <button
                  key={currency.code}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={unavailable}
                  onClick={() => {
                    setCurrency(currency.code)
                    setIsOpen(false)
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selected
                      ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  } disabled:cursor-not-allowed disabled:opacity-45`}
                >
                  {currency.code} — {currency.name}{unavailable && !loading ? ' (Unavailable)' : ''}
                </button>
              )
            })}
          </div>
        )}
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
