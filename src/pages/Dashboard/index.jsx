import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Heart, MapPin, ArrowRight, ShoppingBag, TrendingUp, Star } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/auth/authSlice'
import { selectWishlistCount } from '../../features/wishlist/wishlistSlice'
import { selectOrders } from '../../features/orders/ordersSlice'
import { ROUTES } from '../../constants/routes'
import { formatPrice } from '../../utils/formatters'

const StatCard = ({ icon: Icon, label, value, href, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Link to={href} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all group">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all" />
    </Link>
  </motion.div>
)

const DashboardHome = () => {
  const { t } = useTranslation()
  const user = useSelector(selectUser)
  const wishlistCount = useSelector(selectWishlistCount)
  const orders = useSelector(selectOrders)

  const stats = [
    { icon: Package, label: t('dashboard.totalOrders'), value: orders.length, href: ROUTES.DASHBOARD_ORDERS, color: 'bg-brand-600', delay: 0 },
    { icon: Heart, label: t('nav.wishlist'), value: wishlistCount, href: ROUTES.DASHBOARD_WISHLIST, color: 'bg-brand-500', delay: 0.05 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900 text-white overflow-hidden relative"
      >
        <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10">
          <p className="text-gray-400 text-sm mb-1">{t('dashboard.welcome')}</p>
          <h2 className="text-2xl font-display font-bold">
            {user?.name} 👋
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            You have <span className="text-white font-semibold">{orders.length}</span> order{orders.length !== 1 ? 's' : ''} and{' '}
            <span className="text-white font-semibold">{wishlistCount}</span> saved item{wishlistCount !== 1 ? 's' : ''}.
          </p>
          <Link
            to={ROUTES.SHOP}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag size={15} />
            {t('cart.continueShopping')}
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.overview')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('dashboard.recentOrders')}</h3>
          <Link to={ROUTES.DASHBOARD_ORDERS} className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
            {t('dashboard.viewAllOrders')}
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="card p-8 text-center">
            <Package size={36} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{t('dashboard.noOrders')}</p>
            <Link to={ROUTES.SHOP} className="btn-brand btn-sm inline-flex gap-2">
              {t('dashboard.startShopping')}
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((order, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center">
                    <Package size={18} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Order #{(i + 1).toString().padStart(4, '0')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(order.totals?.total || 0)}
                  </p>
                  <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full font-medium">
                    Processing
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default DashboardHome
