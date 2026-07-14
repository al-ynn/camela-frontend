import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { setFilter, resetFilters, selectFilters } from '../../features/products/productsSlice'
import { useGetCategoriesQuery } from '../../services/productsApi'
import { useState } from 'react'
import { cn } from '../../utils/helpers'

const ProductFilters = ({ onClose, activeCategory }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const { data: categories = [] } = useGetCategoriesQuery()

  const PRICE_RANGES = [
    { label: t('filter.under25'), min: 0, max: 25 },
    { label: t('filter.range25to50'), min: 25, max: 50 },
    { label: t('filter.range50to100'), min: 50, max: 100 },
    { label: t('filter.range100to200'), min: 100, max: 200 },
    { label: t('filter.over200'), min: 200, max: 10000 },
  ]

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen)
    return (
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full mb-3 group"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
          <ChevronDown
            size={15}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const handleCategory = (slug) => {
    dispatch(setFilter({ category: filters.category === slug ? '' : slug }))
  }

  const handlePriceRange = (range) => {
    dispatch(setFilter({ priceMin: range.min, priceMax: range.max }))
  }

  const handleRating = (rating) => {
    dispatch(setFilter({ rating: filters.rating === rating ? 0 : rating }))
  }

  const handleReset = () => dispatch(resetFilters())

  const hasActiveFilters =
    filters.category || filters.rating > 0 || filters.priceMin > 0 || filters.priceMax < 1000

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-gray-900 dark:text-white">{t('filter.title')}</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
              !
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
            >
              {t('filter.clearAll')}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <FilterSection title={t('filter.category')}>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-3 cursor-pointer group py-1"
            >
              <div
                onClick={() => handleCategory(cat.slug)}
                className={cn(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0',
                  filters.category === cat.slug
                    ? 'bg-brand-600 border-brand-600'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-400'
                )}
              >
                {filters.category === cat.slug && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => handleCategory(cat.slug)}
                className={cn(
                  'text-sm transition-colors',
                  filters.category === cat.slug
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                )}
              >
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title={t('filter.priceRange')}>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const active = filters.priceMin === range.min && filters.priceMax === range.max
            return (
              <label key={range.label} className="flex items-center gap-3 cursor-pointer group py-1">
                <div
                  onClick={() => handlePriceRange(range)}
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0',
                    active
                      ? 'border-brand-600'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-400'
                  )}
                >
                  {active && <div className="w-2 h-2 rounded-full bg-brand-600" />}
                </div>
                <span
                  onClick={() => handlePriceRange(range)}
                  className={cn(
                    'text-sm transition-colors',
                    active
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  )}
                >
                  {range.label}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title={t('filter.minRating')}>
        <div className="space-y-1.5">
          {[4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-all',
                filters.rating === star
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-base',
                    i < star ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'
                  )}
                >
                  ★
                </span>
              ))}
              <span className="text-xs ml-1">{t('filter.andUp')}</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

export default ProductFilters
