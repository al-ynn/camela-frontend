import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
  Search,
  Plus,
  Pencil,
  X,
  Check,
  ChevronUp,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  ImagePlus,
  Upload,
  Trash2,
} from 'lucide-react'
import { formatPrice } from '../../utils/formatters'
import Rating from '../../components/ui/Rating'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'
import { useGetCategoriesQuery } from '../../services/productsApi'
import { resolveApiAssetUrl } from '../../constants/config'

const EMPTY_FORM = { title: '', sku: '', price: '', category_id: '', description: '', image: '', stock: '', imagePreview: '', images: [], files: [] }

const AdminProducts = () => {
  const token = useSelector(selectAuth).token
  const { data: categories = [] } = useGetCategoriesQuery()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortField, setSortField] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [editProduct, setEditProduct] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const fileRef = useRef(null)

  const PER_PAGE = 8

  const allCategories = categories.map((category) => category.name)

  const loadProducts = async () => {
      if (!token) return

      try {
          const products = await commerceService.getAdminProducts(token)

          products.sort((a, b) => {
              if (a.active === b.active) {
                  return a.id - b.id
              }

              return a.active ? -1 : 1
          })

          setProducts(products)

      } catch {
          toast.error('Unable to load products')
      }
  }

  useEffect(() => { loadProducts() }, [token])

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase()
      return (
        (!q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
        (!categoryFilter || p.category === categoryFilter)
      )
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'price') return (a.price - b.price) * dir
      if (sortField === 'stock') return ((a.stock || 0) - (b.stock || 0)) * dir
      return (a.id - b.id) * dir
    })

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSort = (field) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setShowAdd(true)
  }

  const openEdit = (product) => {
    setForm({
      title: product.title || '',
      price: String(product.price || ''),
      category_id: String(product.category_id || ''),
      sku: product.sku || '',
      description: product.description || '',
      image: product.image || '',
      stock: String(product.stock || ''),
      imagePreview: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      files: [],
    })
    setEditProduct(product)
  }

  const handleImageFile = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach((file) => {
      const preview = URL.createObjectURL(file)
      setForm((f) => ({
        ...f,
        files: [...f.files, { file, preview }],
        images: [...f.images, preview],
        image: preview,
        imagePreview: preview,
      }))
    })
  }

  const handleImageUrl = (url) => {
    if (url) toast.error('Use Upload from Device to add product images')
  }

  const handleRemoveImage = (index) => {
    setForm((f) => {
      const newImages = f.images.filter((_, i) => i !== index)
      const removedImage = f.images[index]
      const fileIndex = f.files.findIndex((item) => item.preview === removedImage)
      return {
        ...f,
        images: newImages,
        files: fileIndex === -1 ? f.files : f.files.filter((_, i) => i !== fileIndex),
        image: newImages[0] || '',
        imagePreview: newImages[0] || '',
      }
    })
  }

  const validateForm = () => {
    if (!form.title.trim()) { toast.error('Product title is required'); return false }
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) { toast.error('Valid price is required'); return false }
    if (!form.category_id) { toast.error('Category is required'); return false }
    if (!form.sku.trim()) { toast.error('SKU is required'); return false }
    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return
    const payload = {
      title: form.title.trim(),
      price: parseFloat(form.price),
      category_id: Number(form.category_id),
      sku: form.sku.trim(),
      description: form.description.trim() || form.title.trim(),
      short_description: form.description.trim() || null,
      status: 'ACTIVE',
      stock: parseInt(form.stock, 10) || 0,
    }
    try {
      const savedProduct = editProduct
        ? await commerceService.updateAdminProduct(token, editProduct.id, payload)
        : await commerceService.createAdminProduct(token, payload)
      if (form.files.length) await commerceService.uploadProductImages(token, savedProduct.id, form.files)
      if (editProduct) {
        toast.success('Product updated!')
      } else {
        toast.success('Product added!')
      }
      await loadProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save product')
      return
    }
    setEditProduct(null)
    setShowAdd(false)
    setForm(EMPTY_FORM)
  }

  const handleToggleActive = async (product) => {
    try {
      await commerceService.updateAdminProduct(token, product.id, {
        category_id: product.category_id,
        status: product.active ? 'INACTIVE' : 'ACTIVE',
      })

      await loadProducts()

      toast.success(
        product.active
          ? 'Product deactivated successfully.'
          : 'Product activated successfully.'
      )

    } catch (error) {
      console.error(error)
      toast.error('Unable to update product status.')
    }
  }

  const handleDelete = async () => {
    try {
      await commerceService.deleteAdminProduct(token, deleteId)
      await loadProducts()
      setDeleteId(null)
      toast.success('Product deleted')
    } catch { toast.error('Unable to delete product') }
  }

  const closeModal = () => {
    setEditProduct(null)
    setShowAdd(false)
    setForm(EMPTY_FORM)
  }

  const SortIcon = ({ field }) =>
    sortField === field
      ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : <ChevronUp size={12} className="opacity-20" />

  const ThBtn = ({ field, children }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors">
      {children} <SortIcon field={field} />
    </button>
  )

  const isModalOpen = !!editProduct || showAdd

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-brand btn-md gap-2 self-start sm:self-auto">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search products..."
            className="input-base pl-10 h-9"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}
          className="input-base h w-full sm:w-52"
        >
          <option value="">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-16 flex flex-col items-center text-center gap-5">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
            <ImagePlus size={32} className="text-gray-300 dark:text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No products yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">Start building your catalog by adding your first product.</p>
          </div>
          <button onClick={openAdd} className="btn-brand btn-md gap-2">
            <Plus size={16} /> Add First Product
          </button>
        </motion.div>
      )}

      {/* Table */}
      {products.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <ThBtn field="id">#</ThBtn>
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      SKU
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Product
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <ThBtn field="price">Price</ThBtn>
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <ThBtn field="stock">Stock</ThBtn>
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <motion.tr
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs text-gray-400">
                        #{product.id}
                    </td>

                    <td className="px-5 py-3">
                        <span className="font-mono text-xs text-gray-400">
                            {product.sku}
                        </span>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                          {product.image
                            ? <img src={resolveApiAssetUrl(product.image)} alt="" className="w-full h-full object-contain p-1" />
                            : <div className="w-full h-full flex items-center justify-center"><ImagePlus size={14} className="text-gray-300" /></div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-medium line-clamp-1 ${product.active === false ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                            {product.title}
                          </p>
                          <p className="text-[11px] text-gray-400 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white text-xs">{formatPrice(product.price)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">

                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {product.stock ?? 0}
                          </span>

                          {product.low_stock === 1 && (
                              <span className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-[10px] font-semibold">
                                  LOW
                              </span>
                          )}

                      </div>
                  </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${product.active === false ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                        {product.active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleToggleActive(product)} title={product.active === false ? 'Activate' : 'Deactivate'} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                          {product.active === false ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
                        </button>
                        <button onClick={() => openEdit(product)} title="Edit" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Pencil size={13} />
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
              <p className="text-xs text-gray-400">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">Prev</button>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editProduct ? 'Edit Product' : 'Add New Product'} size="md">
        <div className="space-y-4">

          {/* Image Upload */}
          <div>
            <label className="label-base">Product Images <span className="text-gray-400 font-normal">(Multiple images supported)</span></label>
            <div className="space-y-3">
              {/* Image Gallery */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={resolveApiAssetUrl(img)} alt={`Product ${i + 1}`} className="w-full h-full object-contain p-1" />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Upload Controls */}
              <div className="flex gap-3 items-start">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                  {form.imagePreview
                    ? <img src={resolveApiAssetUrl(form.imagePreview)} alt="preview" className="w-full h-full object-contain p-1" onError={() => setForm((f) => ({ ...f, imagePreview: '' }))} />
                    : <ImagePlus size={22} className="text-gray-300 dark:text-gray-600" />
                  }
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn-outline btn-sm gap-2 w-full justify-center"
                  >
                    <Upload size={13} /> Upload from Device
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageFile} />
                  <div className="relative">
                    <input
                      value={form.image.startsWith('data:') ? '' : form.image}
                      onChange={(e) => handleImageUrl(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="input-base text-xs py-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="label-base">Product Title <span className="text-brand-500">*</span></label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="input-base"
              placeholder="e.g. Premium Cotton T-Shirt"
            />
          </div>

          <div>
            <label className="label-base">SKU <span className="text-brand-500">*</span></label>
            <input
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="input-base"
              placeholder="e.g. CAM-001"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-base">Price (USD) <span className="text-brand-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="input-base pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="label-base">Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                className="input-base"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="label-base">Category <span className="text-brand-500">*</span></label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              className="input-base"
            >
              <option value="">Select a category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label-base">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="input-base resize-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={closeModal} className="btn-outline btn-md flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} className="btn-brand btn-md flex-1 justify-center gap-2">
              <Check size={14} /> {editProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminProducts
