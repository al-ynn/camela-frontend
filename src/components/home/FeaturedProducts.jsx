import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'
import { ProductGridSkeleton } from '../ui/Skeleton'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const FeaturedProducts = ({ title = 'Featured Products', subtitle, category, limit = 8, showMore = true, morePath = '/shop' }) => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })

  const { data: products = [], isLoading } = useProducts()

  const displayProducts = category
    ? products.filter((p) => p.category === category).slice(0, limit)
    : products.slice(0, limit)

  return (
    <section className="py-20">
      <div className="container">
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              {t('home.featured.tag')}
            </p>
            <h2 className="section-title">{title || t('home.featured.title')}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </motion.div>
          {showMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={hasIntersected ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                to={morePath}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
              >
                {t('common.viewAll')}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={limit} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FeaturedProducts
