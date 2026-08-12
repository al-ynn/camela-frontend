import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Gift, Truck, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useCurrency } from '../../contexts/CurrencyContext'

const Newsletter = () => {
  const { t } = useTranslation()
  const { formatPrice } = useCurrency()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })

  const PERKS = [
    { icon: Gift, title: t('home.newsletter.perk1Title'), desc: t('home.newsletter.perk1Desc') },
    { icon: Truck, title: t('home.newsletter.perk2Title'), desc: t('home.newsletter.perk2Desc', { amount: formatPrice(75) }) },
    { icon: RotateCcw, title: t('home.newsletter.perk3Title'), desc: t('home.newsletter.perk3Desc') },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error(t('home.newsletter.validEmail'))
      return
    }
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success(t('home.newsletter.success'))
    setEmail('')
    setLoading(false)
  }

  return (
    <section className="py-20" ref={ref}>
      <div className="container">
        {/* Perks row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PERKS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-4 p-5 bg-surface-secondary dark:bg-surface-dark-secondary rounded-2xl"
            >
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={22} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-8 py-14 text-center"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-500/30">
              <Mail size={24} className="text-brand-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              {t('home.newsletter.title')}
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {t('home.newsletter.desc')}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('home.newsletter.placeholder')}
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-brand btn-lg flex-shrink-0 gap-2 whitespace-nowrap"
              >
                {loading ? t('common.loading') : t('footer.subscribe')}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              {t('home.newsletter.noSpam')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter
