import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, Tag, X, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { ROUTES } from '../../constants/routes'
import { resolveApiAssetUrl } from '../../constants/config'

const Cart = () => {
  const { t } = useTranslation()
  const { items, totals, formatCartPrice, coupon, removeFromCart, updateQuantity, applyCoupon, removeCoupon, clearCart } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const handleCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    applyCoupon(couponInput)
    setCouponInput('')
    setCouponLoading(false)
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
            <ShoppingBag size={38} className="text-gray-200 dark:text-gray-600" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {t('cart.empty')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            {t('cart.emptyDesc')}
          </p>
          <Link to={ROUTES.SHOP} className="btn-brand btn-lg inline-flex gap-2">
            <ShoppingBag size={18} />
            {t('cart.startShopping')}
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
              {t('cart.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {items.length} {t('cart.item')}{items.length !== 1 ? 's' : ''} {t('cart.inYourCart')}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 transition-colors"
          >
            <Trash2 size={15} />
            {t('cart.clear')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Cart items */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.key}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="card p-5 overflow-hidden"
                >
                  <div className="flex gap-5">
                    <Link
                      to={`/product/${item.id}`}
                      className="flex-shrink-0 w-24 h-24 bg-surface-secondary dark:bg-gray-800 rounded-xl overflow-hidden"
                    >
                      <img
                        src={resolveApiAssetUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-contain p-2"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-xs text-gray-400 capitalize mb-1">{item.category}</p>
                          <Link
                            to={`/product/${item.id}`}
                            className="font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2 text-sm"
                          >
                            {item.title}
                          </Link>
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex gap-3 mt-1 text-xs text-gray-400">
                              {item.selectedSize && <span>{t('product.size')}: {item.selectedSize}</span>}
                              {item.selectedColor && <span>{t('product.color')}: {item.selectedColor}</span>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-gray-300 dark:text-gray-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex-shrink-0 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {formatCartPrice(item.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-400">{formatCartPrice(item.price)} {t('cart.each')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              to={ROUTES.SHOP}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mt-2"
            >
              <ArrowLeft size={15} />
              {t('cart.continueShopping')}
            </Link>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag size={16} className="text-brand-500" />
                {t('cart.couponCode')}
              </h3>
              {coupon.code ? (
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">{coupon.code}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">{coupon.description}</p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-500 hover:text-green-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                    placeholder={t('cart.couponPlaceholder')}
                    className="input-base flex-1 py-2.5"
                  />
                  <button
                    onClick={handleCoupon}
                    disabled={couponLoading || !couponInput}
                    className="btn-primary btn-md flex-shrink-0"
                  >
                    {couponLoading ? '...' : t('cart.apply')}
                  </button>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="card p-5 space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('cart.orderSummary')}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.subtotal')} ({items.reduce((s, i) => s + i.quantity, 0)} {t('cart.items')})</span>
                  <span>{formatCartPrice(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{t('cart.discount')}</span>
                    <span>-{formatCartPrice(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.shipping')}</span>
                  <span>{totals.shipping === null ? '...' : formatCartPrice(totals.shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('cart.tax')}</span>
                  <span>{formatCartPrice(totals.tax)}</span>
                </div>
                <div className="divider" />
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                  <span>{t('cart.total')}</span>
                  <span>{formatCartPrice(totals.total)}</span>
                </div>
              </div>

              <Link
                to={ROUTES.CHECKOUT}
                className="btn-brand btn-lg w-full justify-center gap-2"
              >
                {t('cart.proceedToCheckout')}
                <ArrowRight size={17} />
              </Link>

              <div className="flex items-center justify-center gap-4 pt-2">
                <span className="text-[10px] text-gray-400 font-medium">HitPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
