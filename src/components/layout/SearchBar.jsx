import { useTranslation } from 'react-i18next'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { closeSearch, selectSearchOpen, addRecentSearch, selectRecentSearches } from '../../features/ui/uiSlice'
import { useSearchProductsQuery } from '../../services/productsApi'
import { useDebounce } from '../../hooks/useDebounce'
import { formatPrice } from '../../utils/formatters'

const SearchBar = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector(selectSearchOpen)
  const recentSearches = useSelector(selectRecentSearches)
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data: products = [] } = useSearchProductsQuery(debouncedQuery, {
    skip: debouncedQuery.length < 2,
  })

  const suggestions = products.slice(0, 5)

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
    else setQuery('')
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') dispatch(closeSearch()) }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [dispatch])

  const handleSearch = (searchQuery) => {
    const q = (searchQuery || query).trim()
    if (!q) return
    dispatch(addRecentSearch(q))
    dispatch(closeSearch())
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setQuery('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const TRENDING = t('search.trending', { returnObjects: true }) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => dispatch(closeSearch())}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-premium border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('search.placeholder')}
                className="flex-1 text-base bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => dispatch(closeSearch())}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white ml-2 font-medium transition-colors"
              >
                {t('common.cancel')}
              </button>
            </div>

            {/* Results or suggestions */}
            <div className="max-h-[60vh] overflow-y-auto">
              {suggestions.length > 0 ? (
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 mb-2 uppercase tracking-wider">
                    {t('search.products')}
                  </p>
                  {suggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        dispatch(closeSearch())
                        navigate(`/product/${product.id}`)
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left group"
                    >
                      <img
                        src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                        alt={product.title}
                        className="w-10 h-10 object-contain rounded-lg bg-gray-50 dark:bg-gray-800 p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white flex-shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSearch(debouncedQuery)}
                    className="flex items-center gap-2 w-full px-3 py-3 mt-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-colors"
                  >
                    <ArrowRight size={15} />
                    {t('search.seeAllResults')} "{debouncedQuery}"
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                        <Clock size={12} /> {t('search.recentSearches')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleSearch(term)}
                            className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                      <TrendingUp size={12} />
                      {t('search.trendingLabel')}
                    </p>

      
                    <div className="flex flex-wrap gap-2">

                      
                      {TRENDING.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SearchBar
