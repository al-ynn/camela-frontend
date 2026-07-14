import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Droplets, 
  Award, 
  Globe, 
  Factory, 
  FileText, 
  Download, 
  CheckCircle, 
  ChevronDown, 
  MapPin, 
  Phone, 
  Mail, 
  BookOpen, 
  Microscope, 
  Dna, 
  ShieldCheck, 
  Star, 
  Scroll,
  Brain,
  Heart,
  Zap,
  Users,
  AlertTriangle
} from 'lucide-react'
import txData from './translations'
import { useGetCategoryQuery } from '../../services/productsApi'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})







const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false)
  return (
    <motion.div layout className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white pr-4">{q}</span>
        <ChevronDown size={18} className={`text-blue-500 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 py-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const Peptide = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('ms') ? 'ms' : 'en'
  const tx = txData[lang] || txData.en
  const { data: categoryLanding } = useGetCategoryQuery('peptide')
  const category = categoryLanding?.category

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gray-950 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/20 to-purple-900/20" />
        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Dna size={12} />
            {tx.badge}
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
            {tx.heroTitle}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
              {tx.heroTitleHighlight}
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {category?.description || tx.heroDesc}
          </motion.p>
        </div>
      </section>

      {/* Understanding Peptides */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.whatTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.whatDesc}
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="prose prose-lg max-w-none text-gray-600 dark:text-gray-400 leading-relaxed mb-12">
            <p className="mb-6">
              {tx.whatIntro}
            </p>
            <ul className="space-y-3 mb-6">
              {tx.whatList.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-500 flex-shrink-0 mt-1" />
                  <span><strong>{item.strong}</strong> {item.text}</span>
                </li>
              ))}
            </ul>
            <p>
              {tx.whatOutro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four Vital Roles */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.rolesTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.rolesDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tx.roles.map((role, i) => (
              <motion.div key={role.title} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{role.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{role.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-16 bg-brand-50 dark:bg-brand-900/10">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <img
                src="/Medical Breakthroughs & Scientifically proven.png"
                alt="Medical Breakthroughs & Scientifically Proven"
                className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
              />
            </div>
            <motion.div {...fadeUp(0.15)} className="flex-1">
              <h2 className="text-2xl md:text-3xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                {tx.scienceTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {tx.scienceDesc}
              </p>
              <ul className="space-y-2">
                {tx.scienceList.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle size={16} className="text-brand-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Walnut Peptides Introduction */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.walnutTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.walnutDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div {...fadeUp(0)} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-3xl blur-xl" />
                <div className="relative w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden">
                  <img
                    src="/Peptide product - Dark Blue color.png"
                    alt="Peptide Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.15)}>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-5">
                {tx.walnutLabel}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {tx.walnutSubtitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {tx.walnutDesc1}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                {tx.walnutQuote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Five Advantages */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.advantagesTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.advantagesDesc}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tx.advantages.map((adv, i) => (
              <motion.div key={adv.title} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-brand-500/10 flex items-center justify-center mb-4">
                  <Zap size={24} className="text-brand-500" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{adv.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{adv.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Benefits */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.healthTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.healthDesc}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tx.healthBenefits.map((benefit, i) => (
              <motion.div key={benefit.title} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Benefit */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.whoTitle}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {tx.whoBenefits.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.1)} className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                  <Brain size={24} className="text-brand-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.3)} className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
            <div className="flex items-start gap-4">
              <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-bold text-amber-800 dark:text-amber-300 mb-2">{tx.allergyTitle}</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {tx.allergyDesc}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Summary */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.researchTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.researchDesc}
            </p>
          </motion.div>

          <div className="space-y-4">
            {tx.researchItems.map((item, i) => (
              <motion.div key={item.title} {...fadeUp(i * 0.08)} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp(0.4)} className="text-center text-xs text-gray-500 dark:text-gray-500 mt-8 italic">
            {tx.researchNote}
          </motion.p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-3xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.faqTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {tx.faqDesc}
            </p>
          </motion.div>

          <div className="space-y-3">
            {tx.faqs.map((faq, i) => (
              <motion.div key={faq.q} {...fadeUp(i * 0.08)}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* References */}
      <section className="py-20 bg-gray-950">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
              {tx.referencesTitle}
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="space-y-2">
            {tx.references.map((ref, i) => (
              <p key={i} className="text-sm text-gray-400 leading-relaxed">
                [{i + 1}] {ref}
              </p>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Peptide
