import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const StatsCard = ({ icon: Icon, label, value, change, prefix = '', suffix = '', color = 'brand', index = 0 }) => {
  const isPositive = change >= 0
  const colorMap = {
    brand: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="card p-5 hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive
            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            : 'bg-brand-50 dark:bg-brand-900/20 text-brand-500 dark:text-brand-400'
        }`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {prefix}{typeof value === 'number' && value >= 1000
          ? value >= 1000000
            ? `${(value / 1000000).toFixed(1)}M`
            : `${(value / 1000).toFixed(1)}K`
          : value}{suffix}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-brand-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(change)}% vs last month
      </p>
    </motion.div>
  )
}

export default StatsCard
