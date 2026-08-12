import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Store, Truck, Percent, Bell, Shield, Save, RefreshCw } from 'lucide-react'
import { APP_CONFIG, SHIPPING_METHODS, TAX_RATE } from '../../constants/config'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { commerceService } from '../../services/commerceApi'

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
)

const Section = ({ icon: Icon, title, subtitle, children, id }) => (
  <motion.div id={id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-5">
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
      <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <Icon size={17} className="text-gray-500" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.div>
)

const AdminSettings = () => {
  const { t } = useTranslation()
  const token = useSelector((state) => state.auth.token)

  const [storeInfo, setStoreInfo] = useState({
    name: APP_CONFIG.name,
    tagline: APP_CONFIG.tagline,
    email: APP_CONFIG.email,
    phone: APP_CONFIG.phone,
    address: APP_CONFIG.address,
  })
  const [taxRate, setTaxRate] = useState(TAX_RATE * 100)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75)
  const [notifications, setNotifications] = useState({
    newOrder: true, lowStock: true, newCustomer: true, orderDelivered: false,
  })
  const [security, setSecurity] = useState({
    twoFactor: false, loginAlerts: true, maintenanceMode: false,
  })
  const [shippingRates, setShippingRates] = useState(
    SHIPPING_METHODS.reduce((acc, m) => ({ ...acc, [m.id]: m.price }), {})
  )

  useEffect(() => {
    if (!token) return

    const loadSettings = async () => {
      try {
        const settings = await commerceService.getStoreSettings(token)

        setStoreInfo({
          name: settings.store_name,
          tagline: settings.tagline,
          email: settings.support_email,
          phone: settings.phone,
          address: settings.address,
        })
        setShippingRates({
          standard: Number(settings.standard_shipping),
          express: Number(settings.express_shipping),
          overnight: Number(settings.overnight_shipping),
        })
        setFreeShippingThreshold(Number(settings.free_shipping_threshold))
        setTaxRate(Number(settings.tax_rate))
        setNotifications({
          newOrder: Boolean(settings.notify_new_order),
          lowStock: Boolean(settings.notify_low_stock),
          newCustomer: Boolean(settings.notify_new_customer),
          orderDelivered: Boolean(settings.notify_order_delivered),
        })
        setSecurity((prev) => ({
          ...prev,
          maintenanceMode: Boolean(Number(settings.maintenance_mode ?? 0)),
        }))
      } catch (e) {
        console.error(e)
      }
    }

    loadSettings()
  }, [token])

  const handleSave = async (section) => {
    try {
      await commerceService.updateStoreSettings(token, {
        store_name: storeInfo.name,
        tagline: storeInfo.tagline,
        support_email: storeInfo.email,
        phone: storeInfo.phone,
        address: storeInfo.address,
        standard_shipping: shippingRates.standard,
        express_shipping: shippingRates.express,
        overnight_shipping: shippingRates.overnight,
        free_shipping_threshold: freeShippingThreshold,
        tax_rate: taxRate,
        notify_new_order: notifications.newOrder,
        notify_low_stock: notifications.lowStock,
        notify_new_customer: notifications.newCustomer,
        notify_order_delivered: notifications.orderDelivered,
        maintenance_mode: security.maintenanceMode,
      })

      toast.success(`${section} settings saved`)
    } catch (e) {
      console.error(e)
      toast.error('Failed to save settings.')
    }
  }

  const handleMaintenanceModeChange = async (nextValue) => {
    const previousValue = security.maintenanceMode
    setSecurity((p) => ({ ...p, maintenanceMode: nextValue }))

    try {
      await commerceService.updateStoreSettings(token, {
        maintenance_mode: nextValue,
      })
      toast.success(nextValue ? 'Store is now offline for maintenance.' : 'Store is back online.')
    } catch (e) {
      console.error(e)
      setSecurity((p) => ({ ...p, maintenanceMode: previousValue }))
      toast.error('Failed to update maintenance mode.')
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('adminSettings.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('adminSettings.subtitle')}</p>
      </div>

      <Section icon={Store} title={t('adminSettings.storeInfo.title')} subtitle={t('adminSettings.storeInfo.subtitle')}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-base">{t('adminSettings.storeInfo.name')}</label><input value={storeInfo.name} onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })} className="input-base" /></div>
            <div><label className="label-base">{t('adminSettings.storeInfo.tagline')}</label><input value={storeInfo.tagline} onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })} className="input-base" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-base">{t('adminSettings.storeInfo.supportEmail')}</label><input type="email" value={storeInfo.email} onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })} className="input-base" /></div>
            <div><label className="label-base">{t('adminSettings.storeInfo.phone')}</label><input value={storeInfo.phone} onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })} className="input-base" /></div>
          </div>
          <div><label className="label-base">{t('adminSettings.storeInfo.address')}</label><input value={storeInfo.address} onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })} className="input-base" /></div>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={() => handleSave(t('adminSettings.storeInfo.title'))} className="btn-brand btn-sm gap-2"><Save size={13} /> {t('common.save')}</button>
        </div>
      </Section>

      <Section icon={Truck} title={t('adminSettings.shipping.title')} subtitle={t('adminSettings.shipping.subtitle')}>
        <div className="space-y-4">
          {SHIPPING_METHODS.map((method) => (
            <div key={method.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{method.name} Rate (per item)</p>
                <p className="text-xs text-gray-400">{method.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">$</span>
                <input
                  type="number"
                  value={shippingRates[method.id]}
                  onChange={(e) => setShippingRates((p) => ({ ...p, [method.id]: parseFloat(e.target.value) || 0 }))}
                  className="input-base w-20 py-2 text-sm"
                  step="0.01"
                />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('adminSettings.shipping.threshold')}</p>
              <p className="text-xs text-gray-400">{t('adminSettings.shipping.thresholdDesc')}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">$</span>
              <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value))} className="input-base w-20 py-2 text-sm" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={() => handleSave(t('adminSettings.shipping.title'))} className="btn-brand btn-sm gap-2"><Save size={13} /> {t('common.save')}</button>
        </div>
      </Section>

      <Section icon={Percent} title={t('adminSettings.tax.title')} subtitle={t('adminSettings.tax.subtitle')}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('adminSettings.tax.rate')}</p>
            <p className="text-xs text-gray-400">{t('adminSettings.tax.rateDesc')}</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(parseFloat(e.target.value))} className="input-base w-20 py-2 text-sm" step="0.1" min="0" max="50" />
            <span className="text-xs text-gray-400">%</span>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={() => handleSave(t('adminSettings.tax.title'))} className="btn-brand btn-sm gap-2"><Save size={13} /> {t('common.save')}</button>
        </div>
      </Section>

      <Section id="admin-notifications" icon={Bell} title={t('adminSettings.notifications.title')} subtitle={t('adminSettings.notifications.subtitle')}>
        <div className="space-y-3">
          {[
            ['newOrder', 'New Order Placed', 'Alert when a customer places an order'],
            ['lowStock', 'Low Stock Warning', 'Alert when product stock drops below threshold'],
            ['newCustomer', 'New Customer Registered', 'Alert on new account creation'],
            ['orderDelivered', 'Order Delivered', 'Alert when orders are marked delivered'],
          ].map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-1.5">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Toggle checked={notifications[key]} onChange={(v) => setNotifications((p) => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Shield} title={t('adminSettings.security.title')} subtitle={t('adminSettings.security.subtitle')}>
        <div className="space-y-3">
          <div className={`flex items-center justify-between gap-4 py-1.5 ${security.maintenanceMode ? 'p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/30' : ''}`}>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Mode</p>
              <p className="text-xs text-gray-400">Take store offline for maintenance</p>
            </div>
            <Toggle checked={security.maintenanceMode} onChange={handleMaintenanceModeChange} />
          </div>
        </div>
      </Section>

      <div className="card p-6 border-red-100 dark:border-red-900/40">
        <h3 className="font-semibold text-brand-600 dark:text-brand-400 mb-4">{t('adminSettings.dangerZone')}</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{t('adminSettings.resetAllSettings')}</p>
            <p className="text-xs text-gray-400">{t('adminSettings.resetAllSettingsDesc')}</p>
          </div>
          <button onClick={() => toast.error(t('adminSettings.resetRequiresConfirmation'))} className="btn bg-brand-600 text-white hover:bg-brand-700 btn-sm gap-2 flex-shrink-0">
            <RefreshCw size={13} /> {t('adminSettings.resetAllSettings')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings
