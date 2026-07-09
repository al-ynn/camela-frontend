import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, Award, Globe, Heart, Leaf, Brain, Zap,
  Users, Mail, Phone, MapPin, CheckCircle, ArrowRight, FlaskConical,
} from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import ProductsShowcase from './sections/ProductsShowcase'
import HydrogenSection from './sections/HydrogenSection'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const About = () => {
  const { t, i18n } = useTranslation()

  const PRODUCT_BENEFITS = [
    { icon: Brain,        text: t('about.benefits.brain') },
    { icon: Shield,       text: t('about.benefits.antioxidant') },
    { icon: Heart,        text: t('about.benefits.bloodSugar') },
    { icon: Zap,          text: t('about.benefits.immune') },
    { icon: Leaf,         text: t('about.benefits.liver') },
    { icon: Users,        text: t('about.benefits.sleep') },
  ]

  const CERTIFICATIONS = [
    { label: 'ISO 22000', desc: t('about.certs.iso') },
    { label: 'HACCP',     desc: t('about.certs.haccp') },
    { label: 'HALAL',     desc: t('about.certs.halal') },
  ]

  const FUTURE_PRODUCTS = [
    t('about.pipeline.soy'),
    t('about.pipeline.collagen'),
    t('about.pipeline.functional'),
    t('about.pipeline.therapeutic'),
    t('about.pipeline.beauty'),
  ]

  const MARKETS = [
    t('about.markets.singapore'),
    t('about.markets.malaysia'),
    t('about.markets.indonesia'),
    t('about.markets.thailand'),
    t('about.markets.vietnam'),
    t('about.markets.emerging'),
  ]

  const CONTACT = [
    { icon: Mail,    label: t('about.contact.email'),    value: 'info@camela.com',  href: 'mailto:info@camela.com' },
    { icon: Phone,   label: t('about.contact.phone'),    value: '+65-80641997',     href: 'tel:+6580641997' },
    { icon: MapPin,  label: t('about.contact.location'), value: t('about.markets.singapore'), href: '#' },
  ]

  return (
  <div className="bg-white dark:bg-gray-950">

    {/* ── Hero ── */}
    <section className="relative bg-gray-950 py-28 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=1920&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 to-gray-950" />
      <div className="container relative z-10 text-center max-w-3xl mx-auto">
        <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          {t('about.hero.badge')}
        </motion.div>
        <motion.h1 {...fadeUp(0.1)} className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
          {t('about.hero.title1')}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
            {t('about.hero.title2')}
          </span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="text-lg text-gray-400 leading-relaxed">
          {t('about.hero.subtitle')}
        </motion.p>
      </div>
    </section>

    <ProductsShowcase />

    {/* ── Marketing Video ── */}
    <section className="py-20 bg-gray-950 border-t border-white/5">
      <div className="container max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">{t('about.video.tag')}</p>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            {t('about.video.title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('about.video.subtitle')}
          </p>
        </motion.div>
        <motion.div
          {...fadeUp(0.15)}
          className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
        >
          <video
            src={i18n.language.startsWith('zh') ? '/camela-marketing-zh.mp4' : '/camela-marketing.mp4'}
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full aspect-video object-cover"
            aria-label="Camela Group marketing video"
          />
        </motion.div>
      </div>
    </section>

    <HydrogenSection />

    {/* ── Manufacturing Powerhouse ── */}
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Factory image */}
          <motion.div
            {...fadeUp(0)}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/Lanli-factory.png"
              alt="Dezhou Lanli Biotechnology Factory"
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Right: Content */}
          <motion.div {...fadeUp(0.15)}>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-5">
              {t('about.factory.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              {t('about.factory.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {t('about.factory.description')}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: t('about.factory.stat1Value'), label: t('about.factory.stat1Label') },
                { value: t('about.factory.stat2Value'), label: t('about.factory.stat2Label') },
                { value: t('about.factory.stat3Value'), label: t('about.factory.stat3Label') },
              ].map(({ value, label }) => (
                <div key={label} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-center">
                  <p className="text-2xl font-extrabold text-amber-500 mb-1">{value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Mission & Vision ── */}
    <section className="py-20 bg-surface-secondary dark:bg-surface-dark-secondary">
      <div className="container max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">{t('about.mission.tag')}</p>
          <h2 className="section-title">{t('about.mission.heading')}</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.1)} className="card p-8">
            <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center mb-5">
              <Heart size={20} className="text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">{t('about.mission.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.mission.description')}
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.2)} className="card p-8">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
              <Globe size={20} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">{t('about.vision.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.vision.description')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Flagship Product ── */}
    <section className="py-20">
      <div className="container max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">{t('about.product.tag')}</p>
          <h2 className="section-title">{t('about.product.title')}</h2>
          <p className="section-subtitle mx-auto text-center">
            {t('about.product.subtitle')}
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {PRODUCT_BENEFITS.map(({ icon: Icon, text }, i) => (
            <motion.div key={text} {...fadeUp(i * 0.07)} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-brand-600 dark:text-brand-400" />
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</span>
            </motion.div>
          ))}
        </div>
        <motion.div {...fadeUp(0.5)} className="p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-center mb-8">
          <p className="text-sm text-brand-800 dark:text-brand-300 leading-relaxed">
            <strong>{t('about.product.natural')}</strong>
            <span className="block mt-1 text-brand-700 dark:text-brand-400 font-normal">
              {t('about.product.manufacturer')}
            </span>
          </p>
        </motion.div>
        <motion.div
          {...fadeUp(0.6)}
          className="relative rounded-3xl overflow-hidden border border-brand-200 dark:border-brand-800 shadow-2xl bg-black flex justify-center"
        >
          <video
            src="/peptide-video.mp4"
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-[600px] w-auto object-contain"
            aria-label="Camela Group Walnut Peptide video"
          />
        </motion.div>
      </div>
    </section>

    {/* ── Certifications ── */}
    <section className="py-16 md:py-20 bg-gray-950">
      <div className="container max-w-4xl px-4 sm:px-6">
        <motion.div {...fadeUp(0)} className="text-center mb-8 md:mb-12">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">{t('about.certs.tag')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">{t('about.certs.title')}</h2>
          <p className="text-sm md:text-base text-gray-400 mt-3 max-w-xl mx-auto px-2">
            {t('about.certs.subtitle')}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {CERTIFICATIONS.map(({ label, desc }, i) => (
            <motion.div key={label} {...fadeUp(i * 0.1)} className="text-center p-5 md:p-8 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/40 transition-colors">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-brand-500/15 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Award size={20} md:size={24} className="text-brand-400" />
              </div>
              <p className="text-lg md:text-2xl font-display font-extrabold text-brand-400 mb-1 md:mb-2">{label}</p>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Future Product Pipeline ── */}
    <section className="py-20 bg-surface-secondary dark:bg-surface-dark-secondary">
      <div className="container max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">{t('about.pipeline.tag')}</p>
            <h2 className="section-title mb-4">{t('about.pipeline.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {t('about.pipeline.description')}
            </p>
            <Link to={ROUTES.SHOP} className="btn-brand btn-md gap-2">
              {t('about.pipeline.cta')} <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.ul {...fadeUp(0.2)} className="space-y-3">
            {FUTURE_PRODUCTS.map((product) => (
              <li key={product} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <CheckCircle size={18} className="text-brand-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>

    {/* ── Regional Presence ── */}
    <section className="py-20">
      <div className="container max-w-4xl">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">{t('about.reach.tag')}</p>
          <h2 className="section-title">{t('about.reach.title')}</h2>
          <p className="section-subtitle mx-auto text-center">
            {t('about.reach.subtitle')}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MARKETS.map((market, i) => (
            <motion.div key={market} {...fadeUp(i * 0.08)} className="card p-5 flex items-center gap-3">
              <MapPin size={16} className="text-brand-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{market}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Strategic Partnerships ── */}
    <section className="py-20 bg-gray-950">
      <div className="container max-w-3xl text-center">
        <motion.div {...fadeUp(0)}>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">{t('about.partner.tag')}</p>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-4">{t('about.partner.title')}</h2>
          <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            {t('about.partner.description')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:info@camela.com" className="btn-brand btn-lg gap-2">
              <Mail size={18} /> {t('about.partner.getInTouch')}
            </a>
            <Link to={ROUTES.SHOP} className="btn bg-white/10 border border-white/20 text-white hover:bg-white/20 btn-lg gap-2">
              <FlaskConical size={18} /> {t('about.partner.viewProducts')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Contact ── */}
    <section className="py-20 border-t border-gray-100 dark:border-gray-800">
      <div className="container max-w-3xl">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">{t('about.contact.tag')}</p>
          <h2 className="section-title">{t('about.contact.title')}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6">
          {CONTACT.map(({ icon: Icon, label, value, href }, i) => (
            <motion.a key={label} {...fadeUp(i * 0.1)} href={href}
              className="card p-6 text-center hover:border-brand-300 dark:hover:border-brand-700 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Icon size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>

  </div>
  )
}

export default About
