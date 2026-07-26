import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import { searchProducts } from '../../utils/helpers'
import ProductCard from '../../components/product/ProductCard'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'
import { addRecentSearch } from '../../features/ui/uiSlice'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const SearchResults = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const query = searchParams.get('q') || ''

  const { data: products = [], isLoading } = useProducts()

  const results = searchProducts(products, query)

  useEffect(() => {
    if (query) dispatch(addRecentSearch(query))
  }, [query, dispatch])

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark">
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-1">{t('searchResults.resultsFor')}</p>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Search size={26} className="text-gray-300" />
            "{query}"
          </h1>
          {!isLoading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {results.length} {t('searchResults.found')}
            </p>
          )}
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-card">
              <X size={30} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('searchResults.noResults', { query })}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
              {t('searchResults.noResultsDesc')}
            </p>
            <Link to="/shop" className="btn-brand btn-md">
              {t('searchResults.browseAll')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {results.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
