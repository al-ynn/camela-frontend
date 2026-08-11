import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useProducts } from '../../hooks/useProducts'
import { useGetCategoriesQuery } from '../../services/productsApi'
import { resolveApiAssetUrl } from '../../constants/config'
import { CATEGORIES } from '../../data/brands'

const CategoryCard = ({ category, index, count }) => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        to={category.landing_page}
        className="block relative overflow-hidden rounded-2xl group h-64 md:h-72"
      >
        {/* Background image */}
        {category.image && <img src={resolveApiAssetUrl(category.image)} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-600 to-brand-400 opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
            {count}+ items
          </p>
          <h3 className="text-white font-display font-bold text-xl mb-3 group-hover:translate-x-1 transition-transform duration-300">
            {category.name}
          </h3>
          <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium overflow-hidden">
            <span className="group-hover:mr-1 transition-all duration-300">{t('header.shopNow')}</span>
            <ArrowRight
              size={15}
              className="translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const CategorySection = () => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })
  const { data: products = [] } = useProducts()
  const { data: apiCategories = [] } = useGetCategoriesQuery()

  // Fallback to static categories if API returns none
  const categories = apiCategories.length >= 2 ? apiCategories : CATEGORIES

  // Count products per category
  const categoryCounts = categories.reduce((acc, category) => {
    const count = products.filter(p => p.category === category.name).length
    acc[category.id] = count
    return acc
  }, {})

  return (
    <section className="py-20 bg-surface-secondary dark:bg-surface-dark-secondary">
      <div className="container">
        {/* Header */}
        <div ref={ref} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={hasIntersected ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              {t('home.category.subtitle')}
            </p>
            <h2 className="section-title">{t('home.category.title')}</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={hasIntersected ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link
              to="/shop"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors group"
            >
              {t('header.viewAllCategories')}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.slice(0, 6).map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} count={categoryCounts[category.id] || 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategorySection
