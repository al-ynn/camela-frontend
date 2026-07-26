import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react'
import { selectCurrentOrder } from '../../features/orders/ordersSlice'
import { formatPrice } from '../../utils/formatters'
import { ROUTES } from '../../constants/routes'

const OrderConfirmation = () => {
  const { t } = useTranslation()
  const order = useSelector(selectCurrentOrder)

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Success icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle size={40} className="text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              {t('orderConfirmation.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t('orderConfirmation.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Order details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6 mb-5"
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400 mb-1">{t('orderConfirmation.orderNumber')}</p>
              <p className="font-mono font-bold text-gray-900 dark:text-white text-lg">{order?.id}</p>
            </div>
            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-brand-600 dark:text-brand-400" />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {[
              { label: t('orderConfirmation.timeline.placed'), desc: t('orderConfirmation.timeline.justNow'), done: true },
              { label: t('orderConfirmation.timeline.paymentConfirmed'), desc: t('orderConfirmation.timeline.processing'), done: true },
              { label: t('orderConfirmation.timeline.orderProcessing'), desc: t('orderConfirmation.timeline.est12'), done: false },
              { label: t('orderConfirmation.timeline.shipped'), desc: t('orderConfirmation.timeline.est35'), done: false },
              { label: t('orderConfirmation.timeline.delivered'), desc: t('orderConfirmation.timeline.est57'), done: false },
            ].map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  step.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {step.done && <CheckCircle size={14} className="text-white" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${step.done ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order items summary */}
          {order?.items && order.items.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {t('orderConfirmation.itemsOrdered')} ({order.items.length})
              </p>
              {order.items.slice(0, 3).map((item) => (
                <div key={item.key} className="flex items-center gap-3 py-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-10 object-contain bg-gray-50 dark:bg-gray-800 rounded-lg p-1"
                  />
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 line-clamp-1">{item.title}</p>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
              {order.items.length > 3 && (
                <p className="text-xs text-gray-400 mt-1">+{order.items.length - 3} {t('orderConfirmation.moreItems')}</p>
              )}
              {order?.totals && (
                <div className="flex justify-between font-bold text-gray-900 dark:text-white mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(order.totals.total)}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link to={ROUTES.DASHBOARD_ORDERS} className="btn-primary btn-lg flex-1 justify-center gap-2">
            <Package size={17} />
            {t('orderConfirmation.trackOrder')}
          </Link>
          <Link to={ROUTES.SHOP} className="btn-outline btn-lg flex-1 justify-center gap-2">
            <ShoppingBag size={17} />
            {t('orderConfirmation.continueShopping')}
          </Link>
        </motion.div>

        <Link
          to={ROUTES.HOME}
          className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Home size={14} />
          {t('apply.backToHome')}
        </Link>
      </motion.div>
    </div>
  )
}

export default OrderConfirmation
