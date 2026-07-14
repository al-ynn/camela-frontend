import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Info } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'

const Login = () => {
  const { t } = useTranslation()
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

    const schema = z.object({
      email: z.string().email("Please enter a valid email."),
      password: z.string().min(8, "Password must be at least 8 characters."),
      rememberMe: z.boolean().optional(),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (data) => {
      await login({
      email: data.email,
      password: data.password,
  })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          {t('auth.login.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="label-base">{t('auth.login.email')}</label>
          <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              className={`input-base ${errors.email ? 'border-brand-400 focus:border-brand-500 focus:ring-brand-500/20' : ''}`}
            />
          {errors.email && (
            <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="label-base">{t('auth.login.password')}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`input-base pr-12 ${errors.password ? 'border-brand-400 focus:border-brand-500 focus:ring-brand-500/20' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('auth.login.rememberMe')}</span>
          </label>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            {t('auth.login.forgotPassword')}
          </Link>
        </div>

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
              <LogIn size={17} />
              {t('auth.login.signIn')}
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('auth.login.noAccount')}{' '}
        <Link to={ROUTES.REGISTER} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          {t('auth.login.signUp')}
        </Link>
      </p>
    </motion.div>
  )
}

export default Login
