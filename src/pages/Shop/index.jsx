import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts, useProductsByCategory } from '../../hooks/useProducts'
import ProductCard from '../../components/product/ProductCard'
import ProductFilters from '../../components/product/ProductFilters'
import ProductSort from '../../components/product/ProductSort'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { selectFilters, selectSort, selectView, selectPage } from '../../features/products/productsSlice'
import { sortProducts, filterProducts, paginateProducts } from '../../utils/helpers'
import { PRODUCTS_PER_PAGE } from '../../constants/config'
import { useGetCategoriesQuery } from '../../services/productsApi'
import { useDispatch } from 'react-redux'
import { setPage } from '../../features/products/productsSlice'

const Shop = () => {
  const { t } = useTranslation()
  const { category } = useParams()
  const dispatch = useDispatch()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filters = useSelector(selectFilters)
  const sort = useSelector(selectSort)
  const view = useSelector(selectView)
  const page = useSelector(selectPage)

  const { data: allProducts = [], isLoading: allLoading } = useProducts()
  const { data: categoryProducts = [], isLoading: catLoading } = useProductsByCategory(category || '')
  const { data: categories = [] } = useGetCategoriesQuery()

  const isLoading = category ? catLoading : allLoading
  const rawProducts = category ? categoryProducts : allProducts


  const filtered = filterProducts(rawProducts, filters)


  const sorted = sortProducts(filtered, sort)

  
  const paginated = paginateProducts(sorted, page, PRODUCTS_PER_PAGE)
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE)

  const breadcrumbs = [
    { label: t('nav.shop'), href: '/shop' },
    ...(category ? [{ label: categories.find((item) => item.slug === category)?.name || category }] : []),
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      {/* Page Header */}
      <div className="bg-surface-secondary dark:bg-surface-dark-secondary border-b border-gray-100 dark:border-gray-800">
        <div className="container py-8">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-3">
            {category ? categories.find((item) => item.slug === category)?.name || category : t('shop.allProducts')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLoading ? '...' : `${sorted.length} ${t('shop.productsFound')}`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <ProductFilters activeCategory={category} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 btn-outline btn-sm"
              >
                <SlidersHorizontal size={15} />
                {t('shop.filters')}
              </button>
              <div className="flex-1">
                <ProductSort total={sorted.length} />
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <ProductGridSkeleton count={PRODUCTS_PER_PAGE} />
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-5">
                  <X size={32} className="text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('shop.noProducts')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs">
                  {t('shop.noProductsDesc')}
                </p>
                <Link to="/shop" className="btn-brand btn-md">
                  {t('shop.clearFilters')}
                </Link>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${sort}-${view}-${page}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={
                      view === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {paginated.map((product) => (
                      <ProductCard key={product.id} product={product} view={view} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
                      disabled={page === 1}
                      className="btn-outline btn-sm disabled:opacity-40"
                    >
                      {t('shop.previous')}
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => dispatch(setPage(i + 1))}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                          page === i + 1
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'btn-outline'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => dispatch(setPage(Math.min(totalPages, page + 1)))}
                      disabled={page === totalPages}
                      className="btn-outline btn-sm disabled:opacity-40"
                    >
                      {t('shop.next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-[300px] bg-white dark:bg-gray-900 overflow-y-auto p-5"
            >
              <ProductFilters onClose={() => setFiltersOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Shop
