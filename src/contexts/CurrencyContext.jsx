import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../constants/config'
import { commerceService } from '../services/commerceApi'
import { formatPrice as formatCurrencyAmount } from '../utils/formatters'

const STORAGE_KEY = 'camela_currency'
const supportedCodes = new Set(SUPPORTED_CURRENCIES.map((currency) => currency.code))
const CurrencyContext = createContext(null)

const savedCurrency = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return supportedCodes.has(saved) ? saved : DEFAULT_CURRENCY
  } catch {
    return DEFAULT_CURRENCY
  }
}

export const CurrencyProvider = ({ children }) => {
  const [preferredCurrency, setPreferredCurrency] = useState(savedCurrency)
  const [currencies, setCurrencies] = useState({ SGD: { name: 'Singapore Dollar', rate: 1 } })
  const [loading, setLoading] = useState(true)
  const [rateDate, setRateDate] = useState(null)

  useEffect(() => {
    let active = true

    commerceService.getCurrencies()
      .then((data) => {
        if (!active || data?.base !== 'SGD' || !data?.currencies?.SGD) return
        setCurrencies(data.currencies)
        setRateDate(data.rate_date || null)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const selectedCurrency = currencies[preferredCurrency]?.rate > 0 ? preferredCurrency : DEFAULT_CURRENCY
  const rate = Number(currencies[selectedCurrency]?.rate) || 1

  const setCurrency = useCallback((code) => {
    if (!supportedCodes.has(code) || (code !== 'SGD' && !currencies[code]?.rate)) return
    setPreferredCurrency(code)
    try { localStorage.setItem(STORAGE_KEY, code) } catch { /* current session still updates */ }
  }, [currencies])

  const convertFromSGD = useCallback((amount) => {
    const value = Number(amount)
    return Number.isFinite(value) ? value * rate : 0
  }, [rate])

  const formatPrice = useCallback(
    (amount) => formatCurrencyAmount(convertFromSGD(amount), selectedCurrency),
    [convertFromSGD, selectedCurrency]
  )
  const formatSGD = useCallback((amount) => formatCurrencyAmount(Number(amount) || 0, 'SGD'), [])
  const options = useMemo(() => SUPPORTED_CURRENCIES.map((currency) => ({
    ...currency,
    available: currency.code === 'SGD' || Number(currencies[currency.code]?.rate) > 0,
  })), [currencies])

  const value = useMemo(() => ({
    selectedCurrency,
    setCurrency,
    rate,
    rateDate,
    loading,
    options,
    convertFromSGD,
    formatPrice,
    formatSGD,
    isConverted: selectedCurrency !== 'SGD',
  }), [selectedCurrency, setCurrency, rate, rateDate, loading, options, convertFromSGD, formatPrice, formatSGD])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider')
  return context
}
