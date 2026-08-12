import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Shield, Moon, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import toast from 'react-hot-toast'
import Modal from '../../components/ui/Modal'
import { authService } from '../../services/authApi'
import { useSelector } from 'react-redux'

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
  const { theme, toggleTheme } = useTheme()
  const token = useSelector((state) => state.auth.token)

  const [deleteModal, setDeleteModal] = useState(false)
  const [passwordModal, setPasswordModal] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
  })

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/

  const handleDeleteAccount = () => {
    setDeleteModal(false)
    toast.error('Account deletion is not currently available. Please contact support.')
  }

  const handlePasswordChange = async () => {
    setPasswordError('')

    if (!passwordForm.current_password || !passwordForm.password || !passwordForm.password_confirmation) {
      setPasswordError('Please complete all password fields.')
      return
    }

    if (!passwordPattern.test(passwordForm.password)) {
      setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, and a special character.')
      return
    }

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError('Passwords do not match.')
      return
    }

    try {
      setPasswordLoading(true)
      await authService.changePassword(token, {
        current_password: passwordForm.current_password,
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
      })
      toast.success('Password updated successfully')
      setPasswordModal(false)
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.current_password?.[0] ||
        error?.response?.data?.errors?.password?.[0] ||
        'Failed to update password.'
      setPasswordError(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.settings')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <Section icon={Moon} title="Appearance">
          <SettingRow label="Dark Mode" description="Switch between light and dark theme">
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </SettingRow>
        </Section>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Section icon={Bell} title="Notifications">
          {Object.entries(notifications).map(([key, value]) => (
            <SettingRow
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
              description="Receive email notifications"
            >
              <Toggle checked={value} onChange={(v) => setNotifications((p) => ({ ...p, [key]: v }))} />
            </SettingRow>
          ))}
        </Section>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <Section icon={Shield} title="Security">
          <SettingRow label="Change Password" description="Update your account password">
            <button
              onClick={() => setPasswordModal(true)}
              className="btn-outline btn-sm"
            >
              Change
            </button>
          </SettingRow>
        </Section>
      </motion.div>

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

      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label-base">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.current_password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, current_password: e.target.value }))}
                className="input-base pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showCurrentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-base">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                className="input-base pr-12"
                placeholder="At least 8 chars, uppercase, lowercase, special"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label-base">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.password_confirmation}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                className="input-base pr-12"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            Password must be at least 8 characters and include uppercase, lowercase, and one special character.
          </p>

          {passwordError && (
            <p className="text-sm text-brand-600 dark:text-brand-400">{passwordError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setPasswordModal(false)}
              className="btn-outline btn-md flex-1 justify-center"
              disabled={passwordLoading}
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              className="btn bg-brand-600 text-white hover:bg-brand-700 btn-md flex-1 justify-center"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Settings
