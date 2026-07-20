import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

const Register = () => {
  const { t } = useTranslation()
  const { register: registerUser, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const schema = z.object({
    firstName: z.string().min(2, t('auth.validation.firstNameRequired')),
    lastName: z.string().min(2, t('auth.validation.lastNameRequired')),
    email: z.string().email(t('auth.validation.validEmail')),
    password: z.string().min(8, t('auth.validation.passwordMin')),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, t('auth.validation.acceptTerms')),
  }).refine((d) => d.password === d.confirmPassword, {
    message: t('auth.validation.passwordsMatch'),
    path: ['confirmPassword'],
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
    await registerUser(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-base">{t('auth.register.firstName')}</label>
            <input
              {...register('firstName')}
              placeholder=""
              className={`input-base ${errors.firstName ? 'border-brand-400' : ''}`}
            />
            {errors.firstName && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.firstName.message}</p>}
          </div>
          <div>
            <label className="label-base">{t('auth.register.lastName')}</label>
            <input
              {...register('lastName')}
              placeholder=""
              className={`input-base ${errors.lastName ? 'border-brand-400' : ''}`}
            />
            {errors.lastName && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-base">{t('auth.register.email')}</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`input-base ${errors.email ? 'border-brand-400' : ''}`}
          />
          {errors.email && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.email.message}</p>}
        </div>

        <div>
          <label className="label-base">{t('auth.register.password')}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`input-base pr-12 ${errors.password ? 'border-brand-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.password.message}</p>}
        </div>

        <div>
          <label className="label-base">{t('auth.register.confirmPassword')}</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            className={`input-base ${errors.confirmPassword ? 'border-brand-400' : ''}`}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.confirmPassword.message}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            {...register('terms')}
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('auth.register.agreeTerms')}
          </span>
        </label>
        {errors.terms && <p className="text-xs text-brand-600 dark:text-brand-400">⚠ {errors.terms.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary btn-lg w-full justify-center gap-2 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('common.loading')}
            </span>
          ) : (
            <>
              <UserPlus size={17} />
              {t('auth.register.createAccount')}
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('auth.register.hasAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          {t('auth.register.signIn')}
        </Link>
      </p>
    </motion.div>
  )
}

export default Register
