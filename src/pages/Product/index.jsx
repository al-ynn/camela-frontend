import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
} from 'lucide-react'
import { useProduct, useProducts } from '../../hooks/useProducts'
import { DetailSkeleton } from '../../components/ui/Skeleton'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { selectIsInWishlist } from '../../features/wishlist/wishlistSlice'
import Rating from '../../components/ui/Rating'
import Badge from '../../components/ui/Badge'
import Tabs from '../../components/ui/Tabs'
import Accordion from '../../components/ui/Accordion'
import ProductCard from '../../components/product/ProductCard'
import Breadcrumb from '../../components/layout/Breadcrumb'
import { useCurrency } from '../../contexts/CurrencyContext'
import { getRelatedProducts, cn, resolveProductImageUrl } from '../../utils/helpers'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { t } = useTranslation()
  const { formatPrice } = useCurrency()
  const { id } = useParams()
  const { data: product, isLoading, error } = useProduct(id)
  const { data: allProducts = [] } = useProducts()

  const PRODUCT_FAQS = [
    { id: 'shipping', title: t('product.faqShipping'), content: t('product.faqShippingContent', { amount: formatPrice(75) }) },
    { id: 'returns', title: t('product.faqReturns'), content: t('product.faqReturnsContent') },
    { id: 'storage', title: t('product.faqStorage'), content: t('product.faqStorageContent') },
    { id: 'dosage', title: t('product.faqDosage'), content: t('product.faqDosageContent') },
  ]

  const { addToCart } = useCart()
  const { toggleWishlist } = useWishlist(product?.id)
  const isInWishlist = useSelector(selectIsInWishlist(Number(id)))

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [imageZoomed, setImageZoomed] = useState(false)
  const [failedImages, setFailedImages] = useState({})

  if (isLoading) return (
    <div className="container py-10">
      <DetailSkeleton />
    </div>
  )

  if (error || !product) return (
    <div className="container py-20 text-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t('product.notFound')}</h2>
      <Link to="/shop" className="btn-brand btn-md">{t('product.backToShop')}</Link>
    </div>
  )

  const originalPrice = product.compare_price
  const discountPercent = Number(originalPrice) > Number(product.price)
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0
  const sizes = []
  const colors = []
  const related = getRelatedProducts(allProducts, product, 4)

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image]
  const fallbackImage = '/livepure-product.png'
  const resolveImage = (img, index) => {
    if (!img) return fallbackImage
    if (failedImages[index]) return fallbackImage
    return resolveProductImageUrl(img) || fallbackImage
  }

  const handleAddToCart = () => {
    if (product.stock < 1) {
      toast.error(t('product.outOfStock'))
      return
    }
    if (sizes.length > 0 && !selectedSize) {
      toast.error(t('product.selectSize'))
      return
    }
    addToCart(product, quantity, selectedSize, selectedColor?.name)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t('product.linkCopied'))
  }

  const tabs = [
    {
      id: 'description',
      label: t('product.description'),
      content: (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
        </div>
      ),
    },
    {
      id: 'specs',
      label: t('product.specifications'),
      content: (
        <div className="space-y-3">
          {[ 
            { label: t('product.category'), value: product.category },
            { label: 'Product ID', value: `#${product.id}` },
            ...(product.rating ? [{ label: t('product.rating'), value: `${product.rating.rate}/5 (${product.rating.count} ${t('product.reviews').toLowerCase()})` }] : []),
            { label: t('product.availability'), value: product.stock > 0 ? t('product.inStock') : t('product.outOfStock') },
            { label: t('product.sku'), value: product.sku },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 text-sm">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">{value}</span>
            </div>
          ))}
        </div>
      ),
    },
    ...(product.rating
      ? [{
        id: 'reviews',
        label: t('product.reviews'),
        badge: product.rating.count,
        content: (
          <div className="space-y-5">
            <div className="flex items-center gap-6 p-5 bg-surface-secondary dark:bg-surface-dark-secondary rounded-2xl">
              <div className="text-center">
                <p className="text-5xl font-display font-bold text-gray-900 dark:text-white">
                  {product.rating.rate}
                </p>
                <Rating rating={product.rating.rate} showCount={false} size="sm" className="justify-center mt-1" />
                <p className="text-xs text-gray-400 mt-1">{product.rating.count} {t('product.reviews')}</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 w-3">{star}★</span>
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-gray-400 w-7">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {t('product.verifiedReviews')}
            </p>
          </div>
        ),
      }]
      : []),
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-surface-dark">
      <div className="container py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: t('nav.shop'), href: '/shop' },
            { label: product.category, href: product.category_landing_page || '/shop' },
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mt-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div
              className="relative aspect-square bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden cursor-zoom-in"
              onClick={() => setImageZoomed(!imageZoomed)}
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: imageZoomed ? 1.3 : 1 }}
                transition={{ duration: 0.3 }}
                src={resolveImage(productImages[selectedImage], selectedImage)}
                alt={product.title}
                onError={() => setFailedImages((current) => ({ ...current, [selectedImage]: true }))}
                className="w-full h-full object-contain p-8"
              />
              {discountPercent > 5 && (
                <div className="absolute top-4 left-4">
                </div>
              )}
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedImage(i); setImageZoomed(false) }}
                  className={cn(
                    'aspect-square bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImage === i
                      ? 'border-gray-900 dark:border-white'
                      : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                  )}
                >
                  <img
                    src={resolveImage(img, i)}
                    alt=""
                    onError={() => setFailedImages((current) => ({ ...current, [i]: true }))}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  {product.category}
                </span>
                <span className="text-gray-200 dark:text-gray-700">·</span>
                <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-brand-600 dark:text-brand-400'}`}>
                  {product.stock > 0 ? t('product.inStock') : t('product.outOfStock')}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white leading-tight">
                {product.title}
              </h1>
            </div>

            <Rating rating={product.rating?.rate} count={product.rating?.count} size="md" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-display font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {discountPercent > 5 && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(originalPrice)}</span>
                  <Badge variant="sale">{t('product.save')} {discountPercent}%</Badge>
                </>
              )}
            </div>

            <div className="divider" />

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('product.color')}</span>
                  {selectedColor && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">{selectedColor.name}</span>
                  )}
                </div>
                <div className="flex gap-2.5">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedColor?.name === color.name
                          ? 'border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-950'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('product.size')}</span>
                  <button className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                    {t('product.sizeGuide')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[44px] h-10 px-3 rounded-xl text-sm font-medium border-2 transition-all',
                        selectedSize === size
                          ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white block mb-3">
                {t('product.quantity')}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="btn-primary btn-lg flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                {t('product.addToCart')}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all',
                  isInWishlist
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-brand-300 hover:text-brand-500'
                )}
              >
                <Heart size={19} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
              >
                <Share2 size={17} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
            { icon: Truck, label: t('product.freeShipping'), desc: t('product.over75', { amount: formatPrice(75) }) },
                { icon: RotateCcw, label: t('product.easyReturns'), desc: t('product.30days') },
                { icon: Shield, label: t('product.securePay'), desc: t('product.ssl') },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl text-center">
                  <Icon size={18} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">{label}</span>
                  <span className="text-[10px] text-gray-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-16">
          <Tabs tabs={tabs} />
        </div>

        {/* FAQ */}
        <div className="mt-12 max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
            {t('product.faq')}
          </h3>
          <Accordion items={PRODUCT_FAQS} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                {t('product.relatedProducts')}
              </h2>
              <Link
                to={product.category_landing_page || '/shop'}
                className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                {t('common.viewAll')} <ChevronLeft size={14} className="rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
