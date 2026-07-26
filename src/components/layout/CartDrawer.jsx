import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Trash2, X } from 'lucide-react'
import { closeCartDrawer, selectCartDrawerOpen } from '../../features/ui/uiSlice'
import { clearCartState, selectCartItems, selectCartTotals } from '../../features/cart/cartSlice'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'

const CartDrawer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = useSelector(selectCartDrawerOpen)
  const items = useSelector(selectCartItems)
  const totals = useSelector(selectCartTotals)
  const { removeFromCart, updateQuantity } = useCart()

  const close = () => dispatch(closeCartDrawer())

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      close()
    }
    // Close any open drawer on navigation so overlays never stick around.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        close()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const goTo = (href) => {
    close()
    navigate(href)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onPointerDown={close}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-premium flex flex-col border-l border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shopping Cart
              </h2>

              <button
                type="button"
                onClick={close}
                className="ml-auto p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
                aria-label="Close cart drawer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length ? (
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40"
                    >
                      <Link
                        to={`/product/${item.id}`}
                        onClick={close}
                        className="w-16 h-16 flex-shrink-0 rounded-xl bg-white dark:bg-gray-900 overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={close}
                            className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="text-gray-300 dark:text-gray-600 hover:text-brand-500 dark:hover:text-brand-400 transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center px-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-5">
                    <ShoppingBag size={34} className="text-gray-200 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Add items from the shop to see them here.
                  </p>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800 p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-1">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => goTo(ROUTES.CART)}
                  className="btn-secondary btn-md w-full justify-center gap-2"
                >
                  Shopping Cart
                </button>
                <button
                  type="button"
                  onClick={() => goTo(ROUTES.CHECKOUT)}
                  className="btn-brand btn-md w-full justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  close()
                  dispatch(clearCartState())
                }}
                className="w-full text-sm text-gray-500 hover:text-brand-600 transition-colors"
              >
                Clear cart
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
