import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Award } from 'lucide-react'
import { ROUTES } from '../../constants/routes'
import { useState } from 'react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const HeroSection = () => {
  const { t } = useTranslation()
  const [hoveredCert, setHoveredCert] = useState(null)

  const certificates = {
    'HACCP': ["/Camela's HACCP Management System Certificate.jpeg"],
    'HALAL': [
      "/Camela's HALAL CERTIFICATE.jpeg",
      "/Camela's HALAL CERTIFICATE2.jpeg"
    ],
    'ISO 22000': ["/Camela's Food Safety Management System Certificate.jpeg"],
  }

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gray-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&q=90"
          alt="Hero background"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[15%] top-[20%] hidden xl:block w-24 h-24 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-[8%] bottom-[30%] hidden xl:block w-16 h-16 rounded-full bg-brand-500/20 backdrop-blur-sm"
      />

      <div className="container relative z-10 pt-20 pb-44 md:pb-28">
        <div className="max-w-2xl">
          {/* Pill label */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            {t('home.hero.pillLabel')}
          </motion.div>

          {/* Headline — Lora serif for authoritative brand statement */}
          <motion.h1
            {...fadeUp(0.1)}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6"
          >
            {t('home.hero.title1')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-300">
              {t('home.hero.title2')}
            </span>
            {' '}{t('home.hero.title3')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.2)}
            className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed"
          >
            {t('home.hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-3">
            <Link
              to={ROUTES.SHOP}
              className="btn-brand btn-xl gap-3 shadow-glow"
            >
              <ShoppingBag size={20} />
              {t('home.hero.shopNow')}
              <ArrowRight size={18} />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-0 inset-x-0 border-t border-white/10 bg-black/40 backdrop-blur-sm overflow-visible z-50"
      >
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-white/10">
            {[
              { value: 'ISO 22000', label: t('home.hero.stat1') },
              { value: 'HALAL', label: t('home.hero.stat2') },
              { value: '6 Markets', label: t('home.hero.stat3') },
              { value: 'HACCP', label: t('home.hero.stat4') },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="text-center px-4 cursor-pointer hover:bg-white/5 transition-colors relative"
                onMouseEnter={() => setHoveredCert(value)}
                onMouseLeave={() => setHoveredCert(null)}
              >
                <p className="text-lg font-display font-extrabold text-brand-400 tracking-tight">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                {certificates[value] && hoveredCert === value && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-white rounded-lg shadow-2xl overflow-hidden z-[9999]"
                  >
                    {Array.isArray(certificates[value]) ? (
                      <div className="space-y-2 p-2">
                        {certificates[value].map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${value} Certificate ${idx + 1}`}
                            className="w-full h-auto object-contain rounded"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={certificates[value]}
                        alt={`${value} Certificate`}
                        className="w-full h-auto object-contain"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
