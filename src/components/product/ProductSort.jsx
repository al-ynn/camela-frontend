import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutGrid, List } from 'lucide-react'
import { setView, selectView } from '../../features/products/productsSlice'
import { cn } from '../../utils/helpers'

const ProductSort = ({ total }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const view = useSelector(selectView)

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
        <span className="font-semibold text-gray-900 dark:text-white">{total}</span> {t('common.products')}
      </p>

      <div className="flex items-center gap-3 ml-auto">
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
