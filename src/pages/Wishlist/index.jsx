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

const Wishlist = () => {
  const { t } = useTranslation()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    addToCart(item)
    removeFromWishlist(item.id)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
            <Heart size={38} className="text-gray-200 dark:text-gray-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {t('wishlist.empty')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {t('wishlist.emptyDesc')}
          </p>
          <Link to={ROUTES.SHOP} className="btn-brand btn-lg inline-flex gap-2">
            {t('wishlist.discover')}
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              {t('wishlist.title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {items.length} {t('wishlist.savedItems')}
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <Trash2 size={15} />
            {t('wishlist.clearAll')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
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
                <div className="p-4 space-y-2.5">
                  <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                  <Link
                    to={`/product/${item.id}`}
                    className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </Link>
                  <Rating rating={item.rating?.rate} showCount={false} size="xs" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="btn-primary btn-sm w-full justify-center gap-2"
                  >
                    <ShoppingCart size={13} />
                    {t('wishlist.moveToCart')}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
