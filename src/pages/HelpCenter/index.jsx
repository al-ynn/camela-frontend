import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import txData from './translations'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const FAQItem = ({ q, a }) => (
  <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{q}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
  </div>
)

const HelpCenter = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('ms') ? 'ms' : 'en'
  const tx = txData[lang] || txData.en

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <section className="bg-gray-950 py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <HelpCircle size={12} />
              {tx.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
              {tx.title}
            </h1>
            <p className="text-gray-400">{tx.lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="text-lg leading-relaxed mb-12">{tx.intro}</p>

            <div className="space-y-16">
              {tx.sections.map((section, si) => (
                <section key={si}>
                  <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{section.title}</motion.h2>
                  <div className="space-y-4">
                    {section.faqs.map((faq, fi) => (
                      <FAQItem key={fi} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </section>
              ))}

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.contactTitle}</motion.h2>
                <p className="leading-relaxed mb-6">{tx.contactDesc}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <p className="font-bold text-gray-900 dark:text-white">Camela Group Pte. Ltd.</p>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">14 Arumugam Road<br />#06-05A LTC Building C<br />Singapore 409959</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="mailto:info@camela.com.sg" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">info@camela.com.sg</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="tel:+6580641997" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">+65 8064 1997</a>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Clock size={18} className="text-brand-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{tx.bhLabel}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tx.bhTime}<br />{tx.bhClosed}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenter
