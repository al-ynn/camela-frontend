import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, ArrowRight, ChevronDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectOrders, setOrders } from '../../features/orders/ordersSlice'
import { formatPrice } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const STATUS_STYLES = {
  confirmed: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Processing: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Shipped: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Delivered: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Cancelled: 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400',
}

const getStatusLabel = (status, t) => {
  const labels = {
    confirmed: t('orders.processing'),
    Processing: t('orders.processing'),
    Shipped: t('orders.shipped'),
    Delivered: t('orders.delivered'),
    Cancelled: t('orders.cancelled'),
  }
  return labels[status] || status
}

const OrderRow = ({ order, index }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const status = order.status || 'Processing'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
      >
        <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Package size={18} className="text-brand-600 dark:text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white text-sm">
              {order.id || `Order #${(index + 1).toString().padStart(4, '0')}`}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}>
              {getStatusLabel(status, t)}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''} · {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} · {formatPrice(order.totals?.total || 0)}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Items</h4>
                {order.items?.map((item) => (
                  <div key={item.key} className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-gray-50 dark:bg-gray-800 rounded-xl p-2 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{item.title}</p>
                      <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                        {item.category && <span>{item.category}</span>}
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(order.totals?.subtotal || 0)}</span>
                </div>
                {order.totals?.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className="text-gray-900 dark:text-white">
                    {order.totals?.shipping === 0 ? 'Free' : formatPrice(order.totals?.shipping || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(order.totals?.tax || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                  <span>Total</span>
                  <span>{formatPrice(order.totals?.total || 0)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {order.address && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.contact?.firstName} {order.contact?.lastName}
                    </p>
                    <p>{order.address.address}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                    <p>{order.address.country}</p>
                    <p>{order.contact?.email}</p>
                    <p>{order.contact?.phone}</p>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              {order.payment && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Payment Method</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {order.payment.method === 'hitpay' ? 'HitPay' : order.payment.method}
                    </p>
                    {order.payment.cardData && (
                      <p className="text-xs mt-1">
                        •••• •••• •••• {order.payment.cardData.number?.slice(-4) || '••••'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Order Date */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Order Date</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const Orders = () => {
  const { t } = useTranslation()
  const orders = useSelector(selectOrders)
  const token = useSelector(selectAuth).token
  const dispatch = useDispatch()

  useEffect(() => {
    if (!token) return
    commerceService.getOrders(token).then((data) => dispatch(setOrders(data)))
  }, [dispatch, token])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.orders')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <Package size={48} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.noOrders')}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            When you place your first order, it'll appear here.
          </p>
          <Link to={ROUTES.SHOP} className="btn-brand btn-md inline-flex gap-2">
            <ShoppingBag size={16} />
            {t('dashboard.startShopping')}
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <OrderRow key={i} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
