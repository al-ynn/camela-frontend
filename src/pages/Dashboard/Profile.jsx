import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, Save, CheckCircle2 } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectAuth, updateUser } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'
import { commerceService } from '../../services/commerceApi'
import AvatarImage from '../../components/common/AvatarImage'
import axios from 'axios'
import { API_BASE_URL } from '../../constants/config'
import { authService } from '../../services/authApi'

const schema = z.object({
  firstname: z.string().min(2, 'First name is required'),
  lastname: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

const Profile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(selectUser)
  const token = useSelector(selectAuth).token
  const verificationRef = useRef(null)
  const [verificationSending, setVerificationSending] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: user?.name?.split(' ')[0] || '',
      lastname: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
    },
  })

  useEffect(() => {
    if (location.state?.focusVerification && verificationRef.current) {
      verificationRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [location.state])

  const onSubmit = async (data) => {
    try {
      dispatch(updateUser(await commerceService.updateProfile(token, data)))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile')
    }
  }

  const verified = !!user?.email_verified_at

  const handleVerifyEmail = async () => {
    try {
      setVerificationSending(true)
      const authAxios = axios.create({
        baseURL: API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
      })

      const res = await authAxios.post(
        '/email/verification/send',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success(res?.data?.message || 'Verification email sent successfully.')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send verification email.')
    } finally {
      setVerificationSending(false)
    }
  }

  const handleResendVerification = async () => {
    try {
      setVerificationSending(true)
      const res = await authService.resendVerification(token, user?.email)
      toast.success(res?.message || 'Verification email sent successfully.')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to send verification email.')
    } finally {
      setVerificationSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.profile')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.personalInfo')}</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-5 min-w-0">
          <div className="relative">
            <AvatarImage
              src={user?.avatar}
              name={user?.name}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-800"
              fallbackClassName="w-20 h-20 rounded-2xl text-lg ring-4 ring-gray-100 dark:ring-gray-800"
            />
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow-md hover:bg-brand-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{user?.name}</p>
            <p className="text-sm text-gray-400">@{user?.username}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
          {verified && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300 flex-shrink-0">
              <CheckCircle2 size={13} className="text-white fill-green-600 dark:fill-green-400 dark:text-gray-950" />
              Verified
            </span>
          )}
        </div>
        {!verified && (
          <motion.div
            ref={verificationRef}
            id="email-verification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-brand-100 dark:border-brand-900/40 bg-brand-50/60 dark:bg-brand-900/10 p-4"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">Email not verified</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Please verify your email address to unlock shopping and checkout features.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleVerifyEmail}
                  disabled={verificationSending}
                  className="btn-brand btn-sm gap-2 flex-shrink-0"
                >
                  {verificationSending ? 'Sending...' : 'Verify Email'}
                </button>
                <button
                  onClick={handleResendVerification}
                  disabled={verificationSending}
                  className="btn-outline btn-sm gap-2 flex-shrink-0"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('dashboard.personalInfo')}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">{t('auth.register.firstName')}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('firstname')} className={`input-base pl-10 ${errors.firstname ? 'border-brand-400' : ''}`} />
              </div>
              {errors.firstname && <p className="mt-1 text-xs text-brand-600">{errors.firstname.message}</p>}
            </div>
            <div>
              <label className="label-base">{t('auth.register.lastName')}</label>
              <input {...register('lastname')} className={`input-base ${errors.lastname ? 'border-brand-400' : ''}`} />
              {errors.lastname && <p className="mt-1 text-xs text-brand-600">{errors.lastname.message}</p>}
            </div>
            <div>
              <label className="label-base">Username</label>
              <input {...register('username')} className={`input-base ${errors.username ? 'border-brand-400' : ''}`} />
              {errors.username && <p className="mt-1 text-xs text-brand-600">{errors.username.message}</p>}
            </div>
            <div>
              <label className="label-base">{t('auth.register.email')}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('email')} type="email" className={`input-base pl-10 ${errors.email ? 'border-brand-400' : ''}`} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-brand-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label-base">{t('checkout.phone')} <span className="text-gray-400 font-normal">({t('common.optional')})</span></label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" className="input-base pl-10" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="btn-brand btn-md gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? t('common.loading') : t('dashboard.saveChanges')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Profile
