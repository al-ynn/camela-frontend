import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Eye,
  ChevronUp,
  ChevronDown,
  Phone,
  MapPin,
  Ban,
} from 'lucide-react'
import { formatPrice, formatDateShort } from '../../utils/formatters'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const AdminCustomers = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [sortField, setSortField] = useState('spent')
  const [sortDir, setSortDir] = useState('desc')
  const [viewCustomer, setViewCustomer] = useState(null)
  const [page, setPage] = useState(1)
  const [customers, setCustomers] = useState([])

  const { token } = useSelector(selectAuth)

  const PER_PAGE = 8

  const loadCustomers = async () => {

      try {

          const data = await commerceService.getAdminCustomers(token)

          setCustomers(data)

      } catch (error) {

          console.error(error)

          toast.error('Unable to load customers.')

      }

  }

  const filtered = customers
    .filter((c) => {
      const q = search.toLowerCase()
      const joined = new Date(c.joined)
      const from = fromDate ? new Date(fromDate) : null
      const to = toDate ? new Date(toDate) : null
      const withinDate = (!from || joined >= from) && (!to || joined <= to)
      return (
        (statusFilter === 'all' || c.status === statusFilter) &&
        (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q))) &&
        withinDate
      )
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'name') return a.name.localeCompare(b.name) * dir
      if (sortField === 'orders') return (a.orders - b.orders) * dir
      return (a.spent - b.spent) * dir
    })

  useEffect(() => {

      if (token) {

          loadCustomers()

      }

  }, [token])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const toggleStatus = (id) => {
    setCustomers((prev) =>
      prev.map((c) => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)
    )
    const customer = customers.find((c) => c.id === id)
    toast.success(`${customer.name} ${customer.status === 'active' ? t('admin.deactivated') : t('admin.activated')}`)
  }

  const SortIcon = ({ field }) =>
    sortField === field
      ? sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
      : <ChevronUp size={11} className="opacity-20" />

  const ThBtn = ({ field, children }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
      {children} <SortIcon field={field} />
    </button>
  )

  const summaryStats = [
    { label: t('admin.totalCustomers'), value: customers.length },
    { label: t('admin.active'), value: customers.filter((c) => c.status === 'active').length },
    { label: t('admin.inactive'), value: customers.filter((c) => c.status === 'inactive').length },
    { label: t('admin.avgLifetimeValue'), 
      value: customers.length
    ? formatPrice(
        customers.reduce((sum, c) => sum + (c.spent || 0), 0) /
        customers.length
      )
    : formatPrice(0),},
  ]

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('admin.customers.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{customers.length} {t('admin.registeredCustomers')}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map(({ label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-4">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder={t('admin.searchCustomers')} className="input-base pl-10 h-9" />
        </div>
        <div className="flex gap-2">
          {[t('admin.all'), t('admin.active'), t('admin.inactive')].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s.toLowerCase()); setPage(1) }} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all capitalize ${statusFilter === s.toLowerCase() ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
            className="input-base h-9 text-xs"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(1) }}
            className="input-base h-9 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer ID</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.phone')}</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.location')}</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total Spent</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.joined')}</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.status')}</th>
                <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((customer) => (
                <motion.tr key={customer.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-mono text-[11px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{customer.display_id}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&size=32&background=random&color=fff`}
                        alt={customer.name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{customer.name}</p>
                        <p className="text-[11px] text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{customer.phone || '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{customer.location}</td>
                  <td className="px-5 py-3 text-xs font-medium text-gray-900 dark:text-white">{customer.orders}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-900 dark:text-white">{formatPrice(customer.spent)}</td>
                  <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400">{formatDateShort(customer.joined)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${customer.status === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewCustomer(customer)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => toggleStatus(customer.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                        <Ban size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-400">{t('admin.page')} {page} {t('admin.of')} {totalPages}</p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">{t('admin.prev')}</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">{t('admin.next')}</button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {viewCustomer && (
        <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title={t('admin.customerProfile')}>
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewCustomer.name)}&size=56&background=random&color=fff`} alt="" className="w-14 h-14 rounded-2xl" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{viewCustomer.name}</p>
                <p className="text-sm text-gray-400">{viewCustomer.email}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 inline-block ${viewCustomer.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{viewCustomer.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                [t('admin.customerId'), viewCustomer.id],
                [t('admin.joined'), formatDateShort(viewCustomer.joined)],
                [t('admin.totalOrders'), viewCustomer.orders],
                [t('admin.totalSpent'), formatPrice(viewCustomer.spent)],
                [t('admin.avgOrderValue'), formatPrice(viewCustomer.spent / viewCustomer.orders)],
                [t('admin.status'), viewCustomer.status],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                  <p className="font-medium text-sm text-gray-900 dark:text-white capitalize">{v}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <Phone size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('admin.contactNumber')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{viewCustomer.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">{t('admin.fullAddress')}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{viewCustomer.address || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default AdminCustomers
