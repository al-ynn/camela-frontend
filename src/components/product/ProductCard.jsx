import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Eye } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useSelector } from 'react-redux'
import { selectIsInWishlist } from '../../features/wishlist/wishlistSlice'
import Rating from '../ui/Rating'
import Badge from '../ui/Badge'
import { useCurrency } from '../../contexts/CurrencyContext'
import { cn, resolveProductImageUrl } from '../../utils/helpers'
import { ROUTES } from '../../constants/routes'

const ProductCard = ({ product, view = 'grid' }) => {
  const { t } = useTranslation()
  const { formatPrice } = useCurrency()
  const navigate = useNavigate()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const { addToCart } = useCart()
  const { toggleWishlist } = useWishlist()
  const isInWishlist = useSelector(selectIsInWishlist(product.id))
  const originalPrice = product.compare_price
  const isSale = Number(originalPrice) > Number(product.price)

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]
  const currentImage =
  hovered && productImages.length > 1
    ? productImages[1]
    : productImages[0]

  const displayImage =
  resolveProductImageUrl(currentImage) || resolveProductImageUrl(product.image)

  const handleBuyNow = async () => {
    const added = await addToCart(product)
    if (added) navigate(ROUTES.CHECKOUT)
  }

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex gap-5 p-4 group"
      >
        <Link to={`/product/${product.id}`} className="flex-shrink-0 w-28 h-28 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden">
          <img
            src={resolveProductImageUrl(productImages[0])}
            alt={product.title}
            className="w-full h-full object-contain p-2"
            onError={(e) => { e.currentTarget.src = '/livepure-product.png' }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 capitalize mb-1">{product.category}</p>
              <Link
                to={`/product/${product.id}`}
                className="font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 leading-snug"
              >
                {product.title}
              </Link>
            </div>
            <button
              onClick={() => toggleWishlist(product)}
              className={cn(
                'flex-shrink-0 p-2 rounded-xl transition-all',
                isInWishlist
                  ? 'text-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'text-gray-300 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          <Rating rating={product.rating?.rate} count={product.rating?.count} className="mt-2" />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {isSale && (
                <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="btn-brand btn-sm gap-2"
            >
              <ShoppingCart size={14} />
              {t('product.addToCart')}
            </button>
            <button
              onClick={handleBuyNow}
              className="btn-outline btn-sm gap-2"
            >
              <ShoppingCart size={14} />
              Buy Now
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="card overflow-hidden group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-product bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer dark:shimmer-dark" />
          )}
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = '/livepure-product.png'
            }}
            className={cn(
              'w-full h-full object-contain p-4 transition-all duration-500',
              hovered ? 'scale-105' : 'scale-100',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </Link>
        
        {/* Wishlist */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hovered || isInWishlist ? 1 : 0, scale: hovered || isInWishlist ? 1 : 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => toggleWishlist(product)}
          className={cn(
            'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all',
            isInWishlist
              ? 'bg-brand-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-400 hover:text-brand-500'
          )}
        >
          <Heart size={15} fill={isInWishlist ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Quick view overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-x-0 bottom-0 p-3"
        >
          <Link
            to={`/product/${product.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-900 dark:text-white shadow-md hover:bg-white dark:hover:bg-gray-900 transition-all"
          >
            <Eye size={14} />
            {t('product.quickView')}
          </Link>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 capitalize mb-1.5">
          {product.category}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="block font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 text-sm leading-snug mb-2"
        >
          {product.title}
        </Link>
        <Rating rating={product.rating?.rate} count={product.rating?.count} size="xs" className="mb-3" />

        <div className="space-y-3 mt-auto">
          <div className="flex items-center gap-2 flex-wrap min-h-[28px]">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => addToCart(product)}
            className="btn-primary btn-sm gap-1.5 w-full"
          >
            <ShoppingCart size={13} />
            <span>{t('product.addToCart')}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyNow}
            className="btn-outline btn-sm gap-1.5 w-full"
          >
            <ShoppingCart size={13} />
            <span>Buy Now</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
