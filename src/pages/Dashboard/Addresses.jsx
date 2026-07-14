import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Pencil, Trash2, Check } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { selectAuth } from '../../features/auth/authSlice'
import { commerceService } from '../../services/commerceApi'

const schema = z.object({
  label: z.string().min(1, 'Label required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  zipCode: z.string().min(4, 'ZIP required'),
  country: z.string().min(2, 'Country required'),
})

const Addresses = () => {
  const { t } = useTranslation()
  const token = useSelector(selectAuth).token
  const [addresses, setAddresses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const loadAddresses = async () => {
    if (!token) return
    try { setAddresses(await commerceService.getAddresses(token)) } catch { toast.error('Unable to load addresses') }
  }

  useEffect(() => { loadAddresses() }, [token])

  const onSubmit = async (data) => {
    const payload = { ...data, zip_code: data.zipCode, is_default: addresses.length === 0 }
    delete payload.zipCode
    try {
      if (editId) {
        await commerceService.updateAddress(token, editId, payload)
        toast.success('Address updated!')
      } else {
        await commerceService.createAddress(token, payload)
        toast.success('Address added!')
      }
      await loadAddresses()
      reset()
      setShowForm(false)
      setEditId(null)
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to save address') }
  }

  const handleDelete = async (id) => {
    try {
      await commerceService.deleteAddress(token, id)
      await loadAddresses()
      toast.success('Address removed')
    } catch { toast.error('Unable to remove address') }
  }

  const handleSetDefault = async (id) => {
    try {
      await commerceService.setDefaultAddress(token, id)
      await loadAddresses()
      toast.success('Default address updated')
    } catch { toast.error('Unable to update default address') }
  }

  const handleEdit = (addr) => {
    setEditId(addr.id)
    reset(addr)
    setShowForm(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.addresses')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your saved addresses</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); reset({}) }}
          className="btn-primary btn-sm gap-2"
        >
          <Plus size={15} />
          {t('dashboard.addAddress')}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-5">
                {editId ? t('dashboard.editAddress') : t('dashboard.addAddress')}
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label-base">Label (e.g. Home, Work)</label>
                  <input {...register('label')} placeholder="Home" className={`input-base ${errors.label ? 'border-brand-400' : ''}`} />
                  {errors.label && <p className="mt-1 text-xs text-brand-600">{errors.label.message}</p>}
                </div>
                <div>
                  <label className="label-base">{t('checkout.streetAddress')}</label>
                  <input {...register('address')} placeholder="123 Main Street" className={`input-base ${errors.address ? 'border-brand-400' : ''}`} />
                  {errors.address && <p className="mt-1 text-xs text-brand-600">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['city', t('checkout.city'), 'New York'], ['state', t('checkout.state'), 'NY']].map(([name, label, ph]) => (
                    <div key={name}>
                      <label className="label-base">{label}</label>
                      <input {...register(name)} placeholder={ph} className={`input-base ${errors[name] ? 'border-brand-400' : ''}`} />
                      {errors[name] && <p className="mt-1 text-xs text-brand-600">{errors[name].message}</p>}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['zipCode', t('checkout.zipCode'), '10001'], ['country', t('checkout.country'), 'United States']].map(([name, label, ph]) => (
                    <div key={name}>
                      <label className="label-base">{label}</label>
                      <input {...register(name)} placeholder={ph} className={`input-base ${errors[name] ? 'border-brand-400' : ''}`} />
                      {errors[name] && <p className="mt-1 text-xs text-brand-600">{errors[name].message}</p>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} className="btn-outline btn-md flex-1 justify-center">{t('common.cancel')}</button>
                  <button type="submit" className="btn-brand btn-md flex-1 justify-center">{editId ? t('common.save') : t('common.save')} Address</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {addresses.length === 0 ? (
        <div className="card p-10 text-center">
          <MapPin size={40} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No saved addresses yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr, i) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`card p-5 flex items-start justify-between gap-4 ${addr.isDefault ? 'border-brand-200 dark:border-brand-800 bg-brand-50/30 dark:bg-brand-900/10' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${addr.isDefault ? 'bg-brand-100 dark:bg-brand-900/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <MapPin size={16} className={addr.isDefault ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full font-medium">{t('dashboard.defaultAddress')}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{addr.address}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                  <p className="text-sm text-gray-400">{addr.country}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(addr)} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                    <Check size={11} /> {t('dashboard.setDefault')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Addresses
