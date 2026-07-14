import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Eye, Moon, Globe, Trash2, AlertTriangle } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useTheme } from '../../hooks/useTheme'
import { logout } from '../../features/auth/authSlice'
import { clearCartState } from '../../features/cart/cartSlice'
import { clearWishlist } from '../../features/wishlist/wishlistSlice'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { useNavigate } from 'react-router-dom'

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
)

const Section = ({ icon: Icon, title, children }) => (
  <div className="card p-6 space-y-4">
    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
      <Icon size={17} className="text-gray-500" /> {title}
    </h3>
    {children}
  </div>
)

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 dark:border-gray-800/50 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
    {children}
  </div>
)

const Settings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const [deleteModal, setDeleteModal] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newArrivals: false,
    priceDrops: true,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityTracking: false,
  })

  const handleDeleteAccount = () => {
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    toast.success('Account deleted successfully')
    navigate('/')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.settings')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <Section icon={Moon} title="Appearance">
          <SettingRow label="Dark Mode" description="Switch between light and dark theme">
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </SettingRow>
          <SettingRow label="Language" description="Select your preferred language">
            <select className="input-base py-1.5 w-32 text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Section icon={Bell} title="Notifications">
          {Object.entries(notifications).map(([key, value]) => (
            <SettingRow
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              description="Receive email and push notifications"
            >
              <Toggle checked={value} onChange={(v) => setNotifications((p) => ({ ...p, [key]: v }))} />
            </SettingRow>
          ))}
        </Section>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Section icon={Eye} title="Privacy">
          {Object.entries(privacy).map(([key, value]) => (
            <SettingRow
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            >
              <Toggle checked={value} onChange={(v) => setPrivacy((p) => ({ ...p, [key]: v }))} />
            </SettingRow>
          ))}
        </Section>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <Section icon={Shield} title="Security">
          <SettingRow label="Change Password" description="Update your account password">
            <button
              onClick={() => toast('Password change via email link — feature coming soon!', { icon: '📧' })}
              className="btn-outline btn-sm"
            >
              Change
            </button>
          </SettingRow>
          <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
            <button
              onClick={() => toast('2FA setup coming soon!', { icon: '🔐' })}
              className="btn-outline btn-sm"
            >
              Enable
            </button>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="card p-6 border-brand-100 dark:border-brand-900/40">
          <h3 className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-2 mb-4">
            <AlertTriangle size={17} /> {t('dashboard.dangerZone')}
          </h3>
          <div className="flex items-center justify-between gap-4 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('dashboard.deleteAccount')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.deleteAccountDesc')}</p>
            </div>
            <button
              onClick={() => setDeleteModal(true)}
              className="btn bg-brand-600 text-white hover:bg-brand-700 btn-sm gap-2 flex-shrink-0"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Account" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={26} className="text-brand-600 dark:text-brand-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDeleteModal(false)} className="btn-outline btn-md flex-1 justify-center">Cancel</button>
            <button onClick={handleDeleteAccount} className="btn bg-brand-600 text-white hover:bg-brand-700 btn-md flex-1 justify-center">
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
