import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets, Award, Globe, Factory, FileText, Download, CheckCircle, ChevronDown, MapPin, Phone, Mail, BookOpen, Microscope, Dna, ShieldCheck, Star, Scroll } from 'lucide-react'
import txData from './translations'
import { useGetCategoryQuery } from '../../services/productsApi'

const iconMap = {
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
}

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

const CERT_STYLES = [
  { icon: Globe,      color: 'from-yellow-500 to-amber-400',  bg: 'bg-yellow-50 dark:bg-yellow-900/20',  border: 'border-yellow-200 dark:border-yellow-700' },
  { icon: Scroll,     color: 'from-red-500 to-rose-400',      bg: 'bg-red-50 dark:bg-red-900/20',        border: 'border-red-200 dark:border-red-700' },
  { icon: ShieldCheck,color: 'from-blue-600 to-blue-500',     bg: 'bg-blue-50 dark:bg-blue-900/20',      border: 'border-blue-200 dark:border-blue-700' },
  { icon: Scroll,     color: 'from-rose-600 to-pink-500',     bg: 'bg-rose-50 dark:bg-rose-900/20',      border: 'border-rose-200 dark:border-rose-700' },
  { icon: Award,      color: 'from-amber-500 to-yellow-400',  bg: 'bg-amber-50 dark:bg-amber-900/20',    border: 'border-amber-200 dark:border-amber-700' },
  { icon: Star,       color: 'from-purple-500 to-violet-400', bg: 'bg-purple-50 dark:bg-purple-900/20',  border: 'border-purple-200 dark:border-purple-700' },
]

const MolecularHydrogen = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language.startsWith('zh') ? 'zh' : i18n.language.startsWith('ms') ? 'ms' : 'en'
  const tx = txData[lang] || txData.en
  const { data: categoryLanding } = useGetCategoryQuery('molecular-hydrogen')
  const category = categoryLanding?.category

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gray-950 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-brand-900/20" />
        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
            <Droplets size={12} />
            {tx.badge}
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
            {tx.heroTitle}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-brand-400">
              {tx.heroTitleHighlight}
            </span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            {category?.description || tx.heroDesc}
          </motion.p>
        </div>
      </section>

      {/* Product Image + Intro */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp(0)} className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-brand-500/10 rounded-3xl blur-xl" />
                <img
                  src="/livepure-product.png"
                  alt="LivePure Hydrogen Water Generator"
                  className="relative w-full max-w-sm object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.15)}>
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-5">
                {tx.productLabel}
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                {tx.aboutTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {tx.aboutDesc}
              </p>
              <div className="space-y-3">
                {tx.features.map((item) => {
                  const Icon = iconMap[item.icon] || Droplets
                  return (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-blue-500" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.videoTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tx.videoDesc}
            </p>
          </motion.div>
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl"
          >
            <div className="aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/B4NcziNL46Q"
                title="LivePure Hydrogen Water Generator"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.benefitsTitle}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tx.benefits.map((benefit, i) => (
              <motion.div key={benefit.title} {...fadeUp(i * 0.1)} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Droplets size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* World Patented Technology */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.patentTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {tx.patentDesc}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {tx.patents.map((patent) => (
              <motion.div key={patent.country} {...fadeUp(0.1)} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <p className="text-2xl font-extrabold text-blue-500 mb-1">{patent.country}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{patent.year}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{patent.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PATENT CERTIFICATES */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 uppercase">
              {tx.certsTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {tx.certsDesc}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tx.certCerts.map((cert, i) => {
              const style = CERT_STYLES[i % CERT_STYLES.length]
              const CertIcon = style.icon
              return (
                <motion.div key={cert.title} {...fadeUp(i * 0.08)} className={`relative flex flex-col items-center text-center p-6 rounded-2xl border ${style.bg} ${style.border}`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.color} flex items-center justify-center mb-4 shadow-md`}>
                    <CertIcon size={26} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">{cert.label} · {cert.year}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">{cert.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{cert.detail}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Direct Factory Prices */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.factoryTitle}
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Factory size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {tx.factoryDesc}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white font-semibold">
                  <Globe size={16} />
                  {tx.madeInKorea}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Operating Manuals */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.manualTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{tx.manualSubtitle}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <motion.a
              {...fadeUp(0.1)}
              href="https://1ce47e66-436f-44b2-bb80-e507b6cc6663.filesusr.com/ugd/6aca01_d563a47c417043288e2dfbe553219da0.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <FileText size={24} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{tx.englishManual}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tx.pdfDownload}</p>
              </div>
              <Download size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </motion.a>

            <motion.a
              {...fadeUp(0.15)}
              href="https://1ce47e66-436f-44b2-bb80-e507b6cc6663.filesusr.com/ugd/6aca01_3aab7282ab0f421d986cb9703d74a2bf.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <FileText size={24} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white mb-1">{tx.chineseManual}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tx.pdfDownload}</p>
              </div>
              <Download size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* CLINICAL REPORTS */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container max-w-5xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight uppercase mb-3">
              {tx.clinicalTitle}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {tx.clinicalDesc}
            </p>
          </motion.div>

          {/* Study preview cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {tx.clinicalPreviews.map((study, i) => (
              <motion.div key={study.title} {...fadeUp(i * 0.1)} className="flex flex-col p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">{study.tag}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 leading-snug flex-1">{study.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{study.subtitle}</p>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp(0.1)} className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
            {tx.moreStudies}{' '}
            <a href="https://livepure.com.sg/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline underline-offset-2 hover:text-blue-600 transition-colors">
              {tx.clickHere}
            </a>
          </motion.p>

          {/* Collapsible study categories */}
          <div className="space-y-3">
            {tx.studyCategories.map((cat, i) => (
              <motion.div key={cat.label} {...fadeUp(i * 0.08)}>
                <FaqItem
                  q={<span className="flex items-center gap-3"><Dna size={18} className="text-blue-500 flex-shrink-0" />{cat.label}</span>}
                  a={
                    <ul className="space-y-2">
                      {cat.studies.map((study, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">{j + 1}</span>
                          {study}
                        </li>
                      ))}
                    </ul>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-3xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {tx.faqTitle}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              {tx.faqDesc}
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="space-y-3">
            {tx.faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clinical Reports CTA */}
      <section className="py-20 bg-blue-600">
        <div className="container max-w-4xl px-4 text-center">
          <motion.div {...fadeUp(0)}>
            <FileText size={48} className="text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
              {tx.clinicalCtaTitle}
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              {tx.clinicalCtaDesc}
            </p>
            <a
              href="https://livepure.com.sg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors"
            >
              {tx.viewReports}
              <Download size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-950">
        <div className="container max-w-4xl px-4">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
              {tx.contactTitle}
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: MapPin, label: tx.address, value: tx.addressValue },
              { icon: Phone, label: tx.phone, value: tx.phoneValue, href: 'tel:+6581775650' },
              { icon: Mail, label: tx.email, value: tx.emailValue, href: 'mailto:sales@livepure.com.sg' },
            ].map(({ icon: Icon, label, value, href }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.1)}>
                {href ? (
                  <a href={href} className="block text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/25 transition-colors">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </a>
                ) : (
                  <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-full bg-blue-500/15 flex items-center justify-center mx-auto mb-4">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MolecularHydrogen
