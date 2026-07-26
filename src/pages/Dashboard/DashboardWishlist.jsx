import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'
import Rating from '../../components/ui/Rating'
import { ROUTES } from '../../constants/routes'
import { resolveApiAssetUrl } from '../../constants/config'

const DashboardWishlist = () => {
  const { t } = useTranslation()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('nav.wishlist')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {items.length} saved item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        {items.length > 0 && (
          <button onClick={clearWishlist} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors">
            <Trash2 size={14} /> {t('common.clear')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.noOrders')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Save products you love by clicking the heart icon on any product.
          </p>
          <Link to={ROUTES.SHOP} className="btn-brand btn-md inline-flex gap-2">
            {t('dashboard.startShopping')} <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card overflow-hidden group"
              >
                <div className="relative aspect-product bg-gray-50 dark:bg-gray-800">
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={resolveApiAssetUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-brand-500 shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Heart size={14} fill="currentColor" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2"
                  >
                    {item.title}
                  </Link>
                  <Rating rating={item.rating?.rate} showCount={false} size="xs" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price)}</span>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary btn-sm w-full justify-center gap-1.5"
                  >
                    <ShoppingCart size={13} /> {t('product.addToCart')}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default DashboardWishlist
