import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import txData from './translations'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const ReturnsPolicy = () => {
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
              <RotateCcw size={12} />
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
            <p className="text-lg leading-relaxed mb-8">{tx.intro1}</p>
            <p className="leading-relaxed mb-8">{tx.intro2}</p>

            <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s1Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s1p1}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s1li.map((item,i)=><li key={i}>{item}</li>)}</ul>
                <p className="leading-relaxed mt-4">{tx.s1p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s2Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s2p1}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s2li.map((item,i)=><li key={i}>{item}</li>)}</ul>
                <p className="leading-relaxed mt-4">{tx.s2p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s3Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s3p1}</p>
                <p className="leading-relaxed mb-4">{tx.s3p2}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s3li.map((item,i)=><li key={i}>{item}</li>)}</ul>
                <p className="leading-relaxed mt-4">{tx.s3p3}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s4Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s4p1}</p>
                <p className="leading-relaxed mb-4">{tx.s4p2}</p>
                <ul className="list-disc pl-6 space-y-2">{tx.s4li.map((item,i)=><li key={i}>{item}</li>)}</ul>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s5Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s5p1}</p>
                <p className="leading-relaxed mb-4">{tx.s5p2}</p>
                <p className="leading-relaxed">{tx.s5p3}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s6Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s6p1}</p>
                <p className="leading-relaxed mb-4">{tx.s6p2}</p>
                <p className="leading-relaxed">{tx.s6p3}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s7Title}</h2>
                <p className="leading-relaxed mb-4">{tx.s7p1}</p>
                <p className="leading-relaxed">{tx.s7p2}</p>
              </section>

              <section>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">{tx.s8Title}</h2>
                <p className="leading-relaxed mb-6">{tx.s8p1}</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
                  <p className="font-bold text-gray-900 dark:text-white">Camela Group Pte. Ltd.</p>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600 dark:text-gray-400">
                      14 Arumugam Road<br />
                      #06-05A LTC Building C<br />
                      Singapore 409959
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="mailto:info@camela.com.sg" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                      info@camela.com.sg
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-500 flex-shrink-0" />
                    <a href="tel:+6580641997" className="text-gray-600 dark:text-gray-400 hover:text-brand-500 transition-colors">
                      +65 8064 1997
                    </a>
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

export default ReturnsPolicy
