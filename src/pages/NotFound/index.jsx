import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative mb-8"
        >
          <p className="text-[160px] md:text-[200px] font-display font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-card flex items-center justify-center">
              <Search size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {t('notFound.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            {t('notFound.message')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-outline btn-lg gap-2 w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={17} />
              {t('notFound.goBack')}
            </button>
            <Link to="/" className="btn-brand btn-lg gap-2 w-full sm:w-auto justify-center">
              <Home size={17} />
              {t('notFound.backToHome')}
            </Link>
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-400 mb-4">{t('notFound.popularPages')}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Shop', href: '/shop' },
              { label: "Men's", href: "/shop/men's clothing" },
              { label: "Women's", href: "/shop/women's clothing" },
              { label: 'Electronics', href: '/shop/electronics' },
              { label: 'Jewelry', href: '/shop/jewelery' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound
