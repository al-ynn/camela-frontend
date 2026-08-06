import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { commerceService } from '../../services/commerceApi'
import { useAuth } from '../../hooks/useAuth'
import { formatDateShort, formatPrice, getOrderStatusColor, getOrderStatusLabel } from '../../utils/formatters'

const ALL_STATUSES = ['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const StatusBadge = ({ status }) => (
  <span className={`${getOrderStatusColor(status)} text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize`}>
    {getOrderStatusLabel(status)}
  </span>
)

const AdminOrders = () => {
  const { t } = useTranslation()
  const { token } = useAuth()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [statusOrder, setStatusOrder] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('confirmed')
  const [combinedOrders, setCombinedOrders] = useState([])

  const PER_PAGE = 8

  const filteredOrders = combinedOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE)
  const paginated = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const updateStatus = async (orderId, newStatus) => {
    try {
      const updated = await commerceService.updateOrderStatus(token, orderId, newStatus.toUpperCase())
      const normalized = String(updated?.order_status ?? updated?.status ?? newStatus).toLowerCase()

      setCombinedOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: normalized } : order))
      )

      setStatusOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: normalized } : prev))
      toast.success('Order status updated.')
      return normalized
    } catch (err) {
      console.error(err)
      toast.error('Failed to update order status.')
      throw err
    }
  }

  const statusCounts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = s === 'all' ? combinedOrders.length : combinedOrders.filter((o) => o.status === s).length
    return acc
  }, {})

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const orders = await commerceService.getAdminOrders(token)
        setCombinedOrders(orders)
      } catch (err) {
        console.error(err)
      }
    }

    loadOrders()
  }, [token])

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('admin.orders.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{combinedOrders.length} {t('admin.totalOrders')}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
              statusFilter === s
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-b border-yellow-500/30 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          >
            {s === 'all' ? t('admin.all') : getOrderStatusLabel(s)}
            <span className={`ml-1.5 text-[10px] ${statusFilter === s ? 'opacity-70' : 'text-gray-400'}`}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder={t('admin.searchOrders')}
          className="input-base pl-10 h-9"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                {[t('admin.orderId'), t('admin.customer'), t('admin.items'), t('admin.total'), t('admin.payment'), t('admin.date'), t('admin.status'), t('admin.actions')].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => (
                <motion.tr
                  key={order.orderNumber}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{order.orderNumber}</span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{order.customer}</p>
                    <p className="text-[11px] text-gray-400 truncate max-w-[140px]">{order.email}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{order.items}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-900 dark:text-white">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{order.payment}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {order.date ? formatDateShort(order.date) : '—'}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => {
                        setStatusOrder(order)
                        setSelectedStatus(order.status.toLowerCase())
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronDown size={13} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              {t('admin.showing')}
              {(page - 1) * PER_PAGE + 1}
              {' – '}
              {Math.min(page * PER_PAGE, filteredOrders.length)}
              {t('admin.of')}
              {filteredOrders.length}
            </p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">{t('admin.prev')}</button>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">{t('admin.next')}</button>
            </div>
          </div>
        )}
      </div>

      {statusOrder && (
        <Modal isOpen={!!statusOrder} onClose={() => setStatusOrder(null)} title="Update Order Status" size="sm">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Order ID</label>
              <p className="text-base font-semibold text-white">{statusOrder.orderNumber}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Customer</label>
              <p className="text-base text-white">{statusOrder.customer}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Current Status</label>
              <span className={`${getOrderStatusColor(statusOrder.status)} inline-flex text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize`}>
                {getOrderStatusLabel(statusOrder.status)}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Status</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-12 px-4 pr-10 rounded-2xl bg-[#111827] border border-yellow-500 text-white appearance-none outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => setStatusOrder(null)}
                className="px-7 py-3 rounded-full border-2 border-yellow-500 bg-transparent text-yellow-400 font-semibold transition-all duration-200 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateStatus(statusOrder.id, selectedStatus)
                  setStatusOrder(null)
                }}
                className="px-7 py-3 rounded-full border-2 border-yellow-500 bg-yellow-500 text-gray-900 font-semibold transition-all duration-200 hover:bg-transparent hover:text-yellow-400 hover:border-yellow-500 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminOrders
