import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ShoppingBag, Users, DollarSign, BarChart2 } from 'lucide-react'
import LineChart from '../../components/admin/LineChart'
import BarChart from '../../components/admin/BarChart'
import DonutChart from '../../components/admin/DonutChart'
import { formatPrice } from '../../utils/formatters'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const MetricCard = ({ label, value, change, icon: Icon, color }) => {
  const pos = change >= 0
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}><Icon size={17} /></div>
        <span className={`text-xs font-semibold flex items-center gap-1 ${pos ? 'text-green-500' : 'text-brand-500'}`}>
          {pos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{Math.abs(change)}%
        </span>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </motion.div>
  )
}

const AdminAnalytics = () => {
  const [period, setPeriod] = useState('monthly')
  const token = useSelector(selectAuth).token
  const [dashboard, setDashboard] = useState({ stats: {}, revenue: [], weekly_revenue: [], categories: [] })

  useEffect(() => {
    if (token) commerceService.getAdminDashboard(token).then(setDashboard)
  }, [token])

  const chartData = period === 'weekly' ? dashboard.weekly_revenue : dashboard.revenue
  const stats = dashboard.stats
  const bestMonth = [...chartData].sort((a, b) => b.revenue - a.revenue)[0]
  const worstMonth = [...chartData].sort((a, b) => a.revenue - b.revenue)[0]
  const highlights = [
    bestMonth && { label: 'Best Month', value: bestMonth.month, sub: formatPrice(bestMonth.revenue), color: 'text-green-500' },
    worstMonth && { label: 'Weakest Month', value: worstMonth.month, sub: formatPrice(worstMonth.revenue), color: 'text-brand-500' },
  ].filter(Boolean)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Detailed performance insights for the last 12 months</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={formatPrice(stats.totalRevenue?.value || 0)} change={stats.totalRevenue?.change || 0} icon={DollarSign} color="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400" />
        <MetricCard label="Total Orders" value={(stats.totalOrders?.value || 0).toLocaleString()} change={stats.totalOrders?.change || 0} icon={ShoppingBag} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
        <MetricCard label="Total Customers" value={(stats.totalCustomers?.value || 0).toLocaleString()} change={stats.totalCustomers?.change || 0} icon={Users} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
        <MetricCard label="Avg. Order Value" value={formatPrice(stats.avgOrderValue?.value || 0)} change={stats.avgOrderValue?.change || 0} icon={BarChart2} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div><h3 className="font-semibold text-gray-900 dark:text-white">Revenue Trend</h3><p className="text-xs text-gray-400 mt-0.5">Track revenue performance over time</p></div>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            {[['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([val, label]) => <button key={val} onClick={() => setPeriod(val)} className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${period === val ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>{label}</button>)}
          </div>
        </div>
        <LineChart data={chartData} dataKey="revenue" isCurrency />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6"><h3 className="font-semibold text-gray-900 dark:text-white mb-1">Orders per Month</h3><p className="text-xs text-gray-400 mb-5">Volume of orders placed each month</p><BarChart data={chartData} dataKey="orders" color="#3b82f6" /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6"><h3 className="font-semibold text-gray-900 dark:text-white mb-1">New Customers</h3><p className="text-xs text-gray-400 mb-5">Monthly new customer acquisition</p><BarChart data={chartData} dataKey="customers" color="#8b5cf6" /></motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6 lg:col-span-1"><h3 className="font-semibold text-gray-900 dark:text-white mb-1">Category Breakdown</h3><p className="text-xs text-gray-400 mb-5">Product count by category</p><DonutChart data={dashboard.categories} /></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-6 lg:col-span-2"><h3 className="font-semibold text-gray-900 dark:text-white mb-1">Performance Highlights</h3><p className="text-xs text-gray-400 mb-5">Key indicators for the period</p><div className="grid grid-cols-2 gap-4">{highlights.map(({ label, value, sub, color }) => <div key={label} className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl"><p className="text-xs text-gray-400 mb-1">{label}</p><p className={`text-xl font-bold ${color}`}>{value}</p><p className="text-[11px] text-gray-400 mt-0.5">{sub}</p></div>)}</div></motion.div>
      </div>
    </div>
  )
}

export default AdminAnalytics
