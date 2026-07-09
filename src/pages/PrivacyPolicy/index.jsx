import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import txData from './translations'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const PrivacyPolicy = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('ms') ? 'ms' : 'en'
  const tx = txData[lang] || txData.en

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <section className="bg-gray-950 py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <Shield size={12} />
              {tx.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">{tx.title}</h1>
            <p className="text-gray-400">{tx.lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="text-lg leading-relaxed mb-8">{tx.intro1}</p>
            <p className="leading-relaxed mb-8">{tx.intro2}</p>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s1Title}</h2>
                <p className="leading-relaxed">{tx.s1p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s2Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s2p}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s2li.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s3Title}</h2>
                <p className="leading-relaxed">{tx.s3p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s4Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s4p1}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s4li.map((item, i) => <li key={i}>{item}</li>)}</ul>
                <p className="leading-relaxed mt-4">{tx.s4p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s5Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s5p1}</p>
                <p className="leading-relaxed mb-4">{tx.s5p2}</p>
                <p className="leading-relaxed">{tx.s5p3}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s6Title}</h2>
                <p className="leading-relaxed">{tx.s6p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s7Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s7p1}</p>
                <p className="leading-relaxed">{tx.s7p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s8Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s8p1}</p>
                <p className="leading-relaxed">{tx.s8p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s9Title}</h2>
                <p className="leading-relaxed">{tx.s9p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s10Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s10p1}</p>
                <p className="leading-relaxed">{tx.s10p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s11Title}</h2>
                <p className="leading-relaxed">{tx.s11p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s12Title}</h2>
                <p className="leading-relaxed">{tx.s12p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s13Title}</h2>
                <p className="leading-relaxed">{tx.s13p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s14Title}</h2>
                <p className="leading-relaxed">{tx.s14p}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s15Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s15p1}</p>
                <p className="leading-relaxed">{tx.s15p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s16Title}</h2>
                <p className="leading-relaxed mb-6">{tx.s16p}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <p className="font-bold text-gray-900 dark:text-white">{tx.dpo}</p>
                  <p className="font-bold text-gray-900 dark:text-white">Camela Group Pte. Ltd.</p>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="mailto:info@camela.com.sg" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">info@camela.com.sg</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="tel:+6580641997" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">+65 8064 1997</a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">14 Arumugam Road, #06-05A LTC Building C, Singapore 409959</p>
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

export default PrivacyPolicy
