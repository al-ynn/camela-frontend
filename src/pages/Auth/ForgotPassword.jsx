import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ROUTES } from '../../constants/routes'
import toast from 'react-hot-toast'
import { authService } from '../../services/authApi'
import { useSearchParams } from 'react-router-dom'

const ForgotPassword = () => {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState('')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const resetEmail = searchParams.get('email') || ''
  const resetMode = Boolean(token && resetEmail)
  const [resetSubmitting, setResetSubmitting] = useState(false)

  const schema = resetMode
    ? z.object({
        password: z.string().min(8, 'Password must be at least 8 characters.'),
        password_confirmation: z.string().min(8, 'Password confirmation is required.'),
      }).refine((d) => d.password === d.password_confirmation, {
        message: 'Passwords do not match.',
        path: ['password_confirmation'],
      })
    : z.object({
        email: z.string().email(t('auth.validation.validEmail')),
      })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    if (resetMode) {
      try {
        setResetSubmitting(true)
        await authService.resetPassword({
          token,
          email: resetEmail,
          password: data.password,
          password_confirmation: data.password_confirmation,
        })
        toast.success(t('auth.forgotPassword.passwordUpdated'))
        setTimeout(() => window.location.assign(ROUTES.LOGIN), 800)
      } catch (error) {
        toast.error(error.response?.data?.message || t('auth.forgotPassword.resetFailed'))
      } finally {
        setResetSubmitting(false)
      }
      return
    }

    try {
      await authService.sendPasswordResetLink(data.email)
      setEmail(data.email)
      setSent(true)
      toast.success(t('auth.forgotPassword.resetLinkSentToast'))
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.forgotPassword.sendFailed'))
    }
  }

  if (!resetMode && sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
          {t('auth.forgotPassword.checkInbox')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
          {t('auth.forgotPassword.sentResetLink')}
        </p>
        <p className="font-semibold text-gray-900 dark:text-white mb-8">{email}</p>
        <p className="text-xs text-gray-400 mb-6">
          {t('auth.forgotPassword.didntReceive')}{' '}
          <button onClick={() => setSent(false)} className="text-brand-600 dark:text-brand-400 hover:underline">
            {t('auth.forgotPassword.tryAgain')}
          </button>
        </p>
        <Link to={ROUTES.LOGIN} className="btn-outline btn-md inline-flex gap-2">
          <ArrowLeft size={15} />
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          {t('auth.forgotPassword.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {resetMode ? (
          <>
            <div className="card p-4 bg-brand-50/70 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 text-sm text-gray-600 dark:text-gray-300">
              {t('auth.forgotPassword.resettingFor')}{' '}
              <span className="font-semibold text-gray-900 dark:text-white">{resetEmail}</span>
            </div>
            <div>
              <label className="label-base">{t('auth.forgotPassword.newPassword')}</label>
              <input {...register('password')} type="password" className={`input-base ${errors.password ? 'border-brand-400' : ''}`} />
              {errors.password && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.password.message}</p>}
            </div>
            <div>
              <label className="label-base">{t('auth.forgotPassword.confirmNewPassword')}</label>
              <input {...register('password_confirmation')} type="password" className={`input-base ${errors.password_confirmation ? 'border-brand-400' : ''}`} />
              {errors.password_confirmation && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.password_confirmation.message}</p>}
            </div>
          </>
        ) : (
        <div>
          <label className="label-base">{t('auth.register.email')}</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className={`input-base pl-11 ${errors.email ? 'border-brand-400' : ''}`}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.email.message}</p>}
        </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || resetSubmitting}
          className="btn-brand btn-lg w-full justify-center gap-2"
        >
          {isSubmitting || resetSubmitting ? t('common.loading') : resetMode ? t('auth.forgotPassword.changePassword') : t('auth.forgotPassword.sendReset')}
        </button>
      </form>

      <Link
        to={ROUTES.LOGIN}
        className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={15} />
        {t('auth.forgotPassword.backToLogin')}
      </Link>
    </motion.div>
  )
}

export default ForgotPassword
