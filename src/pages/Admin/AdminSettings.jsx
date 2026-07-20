import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Store, CreditCard, Truck, Percent, Bell, Shield, Save, RefreshCw } from 'lucide-react'
import { APP_CONFIG, SHIPPING_METHODS, TAX_RATE } from '../../constants/config'
import toast from 'react-hot-toast'

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={`relative w-10 h-5.5 h-[22px] rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}>
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
)

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6 space-y-5">
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
  const [storeInfo, setStoreInfo] = useState({
    name: APP_CONFIG.name,
    tagline: APP_CONFIG.tagline,
    email: APP_CONFIG.email,
    phone: APP_CONFIG.phone,
    address: APP_CONFIG.address,
  })

  const [taxRate, setTaxRate] = useState(TAX_RATE * 100)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(75)

  const [paymentMethods, setPaymentMethods] = useState({
    card: true, paypal: true, applePay: true, googlePay: false, bankTransfer: false,
  })

  const [notifications, setNotifications] = useState({
    newOrder: true, lowStock: true, newCustomer: true, orderDelivered: false, refundRequest: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false, loginAlerts: true, maintenanceMode: false,
  })

  const [shippingRates, setShippingRates] = useState(
    SHIPPING_METHODS.reduce((acc, m) => ({ ...acc, [m.id]: m.price }), {})
  )

  const handleSave = (section) => {
    toast.success(`${section} settings saved!`)
  }

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('adminSettings.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('adminSettings.subtitle')}</p>
      </div>

      {/* Store Info */}
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

      {/* Payment */}
      <Section icon={CreditCard} title={t('adminSettings.payment.title')} subtitle={t('adminSettings.payment.subtitle')}>
        <div className="space-y-3">
          {[
            ['card', 'Credit / Debit Card', 'Visa, Mastercard, Amex'],
            ['paypal', 'PayPal', 'PayPal checkout integration'],
            ['applePay', 'Apple Pay', 'Safari & iOS devices'],
            ['googlePay', 'Google Pay', 'Chrome & Android devices'],
            ['bankTransfer', 'Bank Transfer', 'Manual payment processing'],
          ].map(([key, label, desc]) => (
            <div key={key} className="flex items-center justify-between gap-4 py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Toggle checked={paymentMethods[key]} onChange={(v) => setPaymentMethods((p) => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <button onClick={() => handleSave(t('adminSettings.payment.title'))} className="btn-brand btn-sm gap-2"><Save size={13} /> {t('common.save')}</button>
        </div>
      </Section>

      {/* Shipping */}
      <Section icon={Truck} title={t('adminSettings.shipping.title')} subtitle={t('adminSettings.shipping.subtitle')}>
        <div className="space-y-4">
          {SHIPPING_METHODS.map((method) => (
            <div key={method.id} className="flex items-center justify-between gap-4">
              <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</p>
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

      {/* Tax */}
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

      {/* Notifications */}
      <Section icon={Bell} title={t('adminSettings.notifications.title')} subtitle={t('adminSettings.notifications.subtitle')}>
        <div className="space-y-3">
          {[
            ['newOrder', 'New Order Placed', 'Alert when a customer places an order'],
            ['lowStock', 'Low Stock Warning', 'Alert when product stock drops below threshold'],
            ['newCustomer', 'New Customer Registered', 'Alert on new account creation'],
            ['orderDelivered', 'Order Delivered', 'Alert when orders are marked delivered'],
            ['refundRequest', 'Refund Requests', 'Alert on customer refund requests'],
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

      {/* Security */}
      <Section icon={Shield} title={t('adminSettings.security.title')} subtitle={t('adminSettings.security.subtitle')}>
        <div className="space-y-3">
          {[
            ['twoFactor', 'Two-Factor Authentication', 'Require 2FA for admin login'],
            ['loginAlerts', 'Login Alerts', 'Email notification on new login'],
            ['maintenanceMode', 'Maintenance Mode', 'Take store offline for maintenance'],
          ].map(([key, label, desc]) => (
            <div key={key} className={`flex items-center justify-between gap-4 py-1.5 ${key === 'maintenanceMode' && security.maintenanceMode ? 'p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-900/30' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Toggle checked={security[key]} onChange={(v) => { setSecurity((p) => ({ ...p, [key]: v })); if (key === 'maintenanceMode') toast(v ? '⚠ Store is now offline' : '✅ Store is back online', { duration: 4000 }) }} />
            </div>
          ))}
        </div>
      </Section>

      {/* Danger Zone */}
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
