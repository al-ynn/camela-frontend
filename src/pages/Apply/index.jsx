import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import toast from 'react-hot-toast'
import emailjs from '@emailjs/browser'

const Apply = () => {
  const { t } = useTranslation()
  const { type } = useParams()
  const [submitted, setSubmitted] = useState(false)

  const schema = z.object({
    fullName: z.string().min(2, t('apply.validation.fullName')),
    phone: z.string().min(8, t('apply.validation.phone')),
    email: z.string().email(t('apply.validation.email')),
    motivation: z.string().min(20, t('apply.validation.motivation')),
  })

  const CONFIGS = {
    member: {
      tag: t('joinFamily.member.tag'),
      title: t('apply.member.title'),
      subtitle: t('apply.member.subtitle'),
      motivationLabel: t('apply.member.motivationLabel'),
      motivationPlaceholder: t('apply.member.motivationPlaceholder'),
      submitLabel: t('apply.member.submitLabel'),
      successTitle: t('apply.member.successTitle'),
      successMessage: t('apply.member.successMessage'),
    },
    'distribution-partner': {
      tag: t('joinFamily.partner.tag'),
      title: t('apply.partner.title'),
      subtitle: t('apply.partner.subtitle'),
      motivationLabel: t('apply.partner.motivationLabel'),
      motivationPlaceholder: t('apply.partner.motivationPlaceholder'),
      submitLabel: t('apply.partner.submitLabel'),
      successTitle: t('apply.partner.successTitle'),
      successMessage: t('apply.partner.successMessage'),
    },
    importer: {
      tag: t('joinFamily.importer.tag'),
      title: t('apply.importer.title'),
      subtitle: t('apply.importer.subtitle'),
      motivationLabel: t('apply.importer.motivationLabel'),
      motivationPlaceholder: t('apply.importer.motivationPlaceholder'),
      submitLabel: t('apply.importer.submitLabel'),
      successTitle: t('apply.importer.successTitle'),
      successMessage: t('apply.importer.successMessage'),
    },
  }

  const config = CONFIGS[type]

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  if (!config) return <Navigate to={ROUTES.HOME} replace />

  const onSubmit = async (data) => {
    try {
      const templateParams = {
        to_email: 'camela.trading@gmail.com',
        from_name: data.fullName,
        from_email: data.email,
        phone: data.phone,
        application_type: config.title,
        motivation: data.motivation,
      }

      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setSubmitted(true)
      toast.success(t('apply.successToast'))
    } catch (error) {
      toast.error(`Failed to submit: ${error.text || error.message}`)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {config.successTitle}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            {config.successMessage}
          </p>
          <Link to={ROUTES.HOME} className="btn-brand btn-md">
            {t('apply.backToHome')}
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
        >
          <ArrowLeft size={15} /> {t('apply.backToHome')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-10 shadow-card border border-gray-100 dark:border-gray-800"
        >
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-5">
            {config.tag}
          </span>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            {config.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
            {config.subtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-base">{t('apply.fullName')}</label>
                <input
                  {...register('fullName')}
                  placeholder={t('apply.fullNamePlaceholder')}
                  className="input-base"
                />
                {errors.fullName && (
                  <p className="text-xs text-brand-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="label-base">{t('apply.phone')}</label>
                <input
                  {...register('phone')}
                  placeholder="+65 9123 4567"
                  className="input-base"
                />
                {errors.phone && (
                  <p className="text-xs text-brand-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label-base">{t('apply.email')}</label>
              <input
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                className="input-base"
              />
              {errors.email && (
                <p className="text-xs text-brand-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label-base">{config.motivationLabel}</label>
              <textarea
                {...register('motivation')}
                rows={5}
                placeholder={config.motivationPlaceholder}
                className="input-base resize-none"
              />
              {errors.motivation && (
                <p className="text-xs text-brand-600 mt-1">{errors.motivation.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand btn-lg w-full gap-2 mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                t('apply.submitting')
              ) : (
                <>
                  <Send size={15} />
                  {config.submitLabel}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Apply
