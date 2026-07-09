import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import txData from './translations'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const ContactUs = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('ms') ? 'ms' : 'en'
  const tx = txData[lang] || txData.en

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <section className="bg-gray-950 py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-6">
              <MessageCircle size={12} />
              {tx.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
              {tx.title}
            </h1>
            <p className="text-gray-400">{tx.lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400">
            <p className="text-lg leading-relaxed mb-12">{tx.intro1}</p>
            <p className="leading-relaxed mb-12">{tx.intro2}</p>

            <div className="space-y-16">
              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s1Title}</motion.h2>
                <p className="leading-relaxed mb-6">{tx.s1Desc}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <p className="font-bold text-gray-900 dark:text-white">Camela Group Pte. Ltd.</p>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      14 Arumugam Road<br />#06-05A LTC Building C<br />Singapore 409959
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="mailto:info@camela.com.sg" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">info@camela.com.sg</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="tel:+6580641997" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">+65 8064 1997</a>
                  </div>
                </div>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s2Title}</motion.h2>
                <p className="leading-relaxed mb-4">{tx.s2Desc}</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  {tx.s2li.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <p className="leading-relaxed">{tx.s2Note}</p>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s3Title}</motion.h2>
                <p className="leading-relaxed">{tx.s3Desc}</p>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s4Title}</motion.h2>
                <p className="leading-relaxed mb-4">{tx.s4p1}</p>
                <p className="leading-relaxed mb-4">{tx.s4p2}</p>
                <p className="leading-relaxed">{tx.s4p3}</p>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s5Title}</motion.h2>
                <p className="leading-relaxed mb-4">{tx.s5p1}</p>
                <p className="leading-relaxed mb-4">{tx.s5p2}</p>
                <p className="leading-relaxed">{tx.s5p3}</p>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s6Title}</motion.h2>
                <p className="leading-relaxed mb-4">{tx.s6Desc}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={18} className="text-brand-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{tx.monFri}</p>
                      <p className="text-gray-600 dark:text-gray-400">{tx.hoursTime}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{tx.hoursClosed}</p>
                </div>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s7Title}</motion.h2>
                <p className="leading-relaxed">{tx.s7Desc}</p>
              </section>

              <section>
                <motion.h2 {...fadeUp(0)} className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">{tx.s8Title}</motion.h2>
                <p className="leading-relaxed mb-4">{tx.s8p1}</p>
                <p className="leading-relaxed">{tx.s8p2}</p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactUs
