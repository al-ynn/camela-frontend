import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowRight, AlertTriangle } from 'lucide-react'
import StatsCard from '../../components/admin/StatsCard'
import LineChart from '../../components/admin/LineChart'
import DonutChart from '../../components/admin/DonutChart'
import { formatPrice, formatDateShort, getOrderStatusColor, getOrderStatusLabel } from '../../utils/formatters'
import { useSelector } from 'react-redux'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const STATS = [
  { key: 'totalRevenue', icon: DollarSign, color: 'brand', prefix: '$' },
  { key: 'totalOrders', icon: ShoppingBag, color: 'blue' },
  { key: 'totalCustomers', icon: Users, color: 'purple' },
  { key: 'avgOrderValue', icon: TrendingUp, color: 'amber', prefix: '$' },
]

const AdminOverview = () => {
  const { t } = useTranslation()
  const [revenueRange, setRevenueRange] = useState('12m')
  const token = useSelector(selectAuth).token
  const [dashboard, setDashboard] = useState({ stats: {}, revenue: [], categories: [], recent_orders: [], low_stock: [] })

  useEffect(() => {
    if (token) commerceService.getAdminDashboard(token).then(setDashboard)
  }, [token])

  const chartData = revenueRange === '7d'
    ? dashboard.revenue.slice(-7).map((d, i) => ({ ...d, month: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i] }))
    : dashboard.revenue

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.overview')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ key, icon, color, prefix }, i) => {
          const stat = dashboard.stats[key] || { label: key, value: 0, change: 0 }
          return (
            <StatsCard
              key={key}
              icon={icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              prefix={prefix || ''}
              color={color}
              index={i}
            />
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card p-5 xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.revenueOverview')}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Total earnings over time</p>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
              {['7d', '3m', '12m'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRevenueRange(r)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    revenueRange === r
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {r === '7d' ? '7 Days' : r === '3m' ? '3 Months' : '12 Months'}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={revenueRange === '3m' ? dashboard.revenue.slice(-3) : chartData} dataKey="revenue" isCurrency />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <div className="mb-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.salesByCategory')}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Revenue distribution</p>
          </div>
          <DonutChart data={dashboard.categories} />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="card xl:col-span-2"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('dashboard.recentOrders')}</h3>
            <Link to="/admin/orders" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              {t('dashboard.viewAllOrders')} <ArrowRight size={11} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  {['Order', 'Customer', 'Items', 'Total', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboard.recent_orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">{order.id}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-white text-xs">{order.customer}</p>
                      <p className="text-gray-400 text-[11px]">{order.email}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{order.items}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white text-xs">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <span className={`${getOrderStatusColor(order.status)} text-[10px] px-2.5 py-1 rounded-full font-semibold`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Low Stock Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">{t('admin.lowStockAlerts')}</h3>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
              <AlertTriangle size={10} />
              {dashboard.low_stock.length} items
            </span>
          </div>
          <div className="space-y-3">
            {dashboard.low_stock.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{item.stock}</p>
                  <p className="text-[10px] text-gray-400">left</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/inventory" className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-600 dark:text-brand-400 hover:underline">
            Manage Inventory <ArrowRight size={11} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminOverview
