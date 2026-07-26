import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutGrid, List, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { setSort, setView, selectSort, selectView } from '../../features/products/productsSlice'
import { SORT_OPTIONS } from '../../constants/config'
import { getSortLabel } from '../../utils/helpers'
import { cn } from '../../utils/helpers'

const ProductSort = ({ total }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const sort = useSelector(selectSort)
  const view = useSelector(selectView)
  const [sortOpen, setSortOpen] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> {t('common.products')}
      </p>

      <div className="flex items-center gap-3 ml-auto">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all"
          >
            <span className="hidden sm:inline text-gray-400">{t('common.sort')}:</span>
            <span>{getSortLabel(sort)}</span>
            <ChevronDown size={14} className={cn('text-gray-400 transition-transform', sortOpen && 'rotate-180')} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-premium border border-gray-100 dark:border-gray-800 overflow-hidden z-20"
              >
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      dispatch(setSort(option.value))
                      setSortOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2.5 text-sm transition-colors',
                      sort === option.value
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => dispatch(setView('grid'))}
            className={cn(
              'p-2 rounded-lg transition-all',
              view === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            )}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => dispatch(setView('list'))}
            className={cn(
              'p-2 rounded-lg transition-all',
              view === 'list'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
            )}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductSort
