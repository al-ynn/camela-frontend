import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Search, AlertTriangle, Package, Plus, Minus, Check } from 'lucide-react'
import { formatPrice } from '../../utils/formatters'
import toast from 'react-hot-toast'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const AdminInventory = () => {
  const { t } = useTranslation()
  const token = useSelector(selectAuth).token
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [tempStock, setTempStock] = useState('')
  const [filter, setFilter] = useState('all')

  const getStock = (p) => p.stock ?? 0
  const threshold = 5

  const loadProducts = async () => {
    if (!token) return
    try { setProducts(await commerceService.getAdminProducts(token)) } catch { toast.error('Unable to load inventory') }
  }

  useEffect(() => { loadProducts() }, [token])

  const filtered = products.filter((p) => {
    const stock = getStock(p)
    const q = search.toLowerCase()
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    const matchesFilter = filter === 'all' || (filter === 'low' && stock <= threshold) || (filter === 'ok' && stock > threshold)
    return matchesSearch && matchesFilter
  })

  const lowStockCount = products.filter((p) => getStock(p) <= threshold).length

  const handleUpdateStock = async (id, newVal) => {
    const parsed = parseInt(newVal, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      const product = products.find((item) => item.id === id)
      const difference = parsed - getStock(product)
      if (difference !== 0) {
        try {
          await commerceService.adjustInventory(token, id, difference > 0 ? 'STOCK_IN' : 'STOCK_OUT', Math.abs(difference))
          await loadProducts()
          toast.success(t('admin.stockUpdated'))
        } catch { toast.error('Unable to update stock') }
      }
    }
    setEditingId(null)
    setTempStock('')
  }

  const adjust = async (product, delta) => {
    const next = Math.max(0, getStock(product) + delta)
    if (next === getStock(product)) return
    try {
      await commerceService.adjustInventory(token, product.id, delta > 0 ? 'STOCK_IN' : 'STOCK_OUT', Math.abs(delta))
      await loadProducts()
      toast.success(`${t('admin.stockAdjusted')} ${next}`)
    } catch { toast.error('Unable to adjust stock') }
  }

  const stockColor = (stock) => {
    if (stock === 0) return 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
    if (stock <= threshold) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
    return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
  }

  const stockLabel = (stock) => {
    if (stock === 0) return t('admin.outOfStock')
    if (stock <= threshold) return t('admin.lowStock')
    return t('admin.inStock')
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('admin.inventory')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('admin.inventoryDesc')}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t('admin.totalProducts'), value: products.length, icon: Package, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
          { label: t('admin.lowStock'), value: lowStockCount, icon: AlertTriangle, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
          { label: t('admin.outOfStock'), value: products.filter((p) => getStock(p) === 0).length, icon: AlertTriangle, color: 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' },
          { label: t('admin.healthyStock'), value: products.filter((p) => getStock(p) > threshold).length, icon: Check, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('admin.searchProducts')} className="input-base pl-10 h-9" />
        </div>
        <div className="flex gap-2">
          {[['all', t('admin.all')], ['low', `⚠ ${t('admin.lowStock')}`], ['ok', `✓ ${t('admin.inStock')}`]].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${filter === val ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
              <tr>
                {[t('admin.product'), t('admin.category'), t('admin.price'), t('admin.stockLevel'), t('admin.status'), t('admin.adjust')].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center text-sm text-gray-400 dark:text-gray-500">
                    {products.length === 0 ? t('admin.noProducts') : t('admin.noFilterMatch')}
                  </td>
                </tr>
              ) : filtered.map((product) => {
                const stock = getStock(product)
                const isEditing = editingId === product.id
                return (
                  <tr key={product.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image
                            ? <img src={product.image} alt="" className="w-full h-full object-contain p-1" />
                            : <Package size={14} className="text-gray-300 m-auto" />
                          }
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[180px]">{product.title}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500 dark:text-gray-400 capitalize">{product.category}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input autoFocus value={tempStock} onChange={(e) => setTempStock(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUpdateStock(product.id, tempStock)} className="w-16 px-2 py-1 text-xs border border-brand-400 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
                          <button onClick={() => handleUpdateStock(product.id, tempStock)} className="p-1 bg-brand-600 text-white rounded-lg">
                            <Check size={11} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingId(product.id); setTempStock(String(stock)) }} className="flex items-center gap-2 group">
                          <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${stock === 0 ? 'bg-brand-500' : stock <= threshold ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min((stock / 30) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400">{stock}</span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${stockColor(stock)}`}>{stockLabel(stock)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => adjust(product, -1)} disabled={stock === 0} className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 text-gray-600 dark:text-gray-300">
                          <Minus size={11} />
                        </button>
                        <button onClick={() => adjust(product, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300">
                          <Plus size={11} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminInventory
