import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Droplets, FlaskConical, Factory, ArrowRight } from 'lucide-react'
import { ROUTES } from '../../../constants/routes'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const ProductsShowcase = () => {
  const { t } = useTranslation()

  return (
    <section className="py-12 md:py-20 bg-gray-950 border-t border-white/5">
      <div className="container max-w-5xl px-4 sm:px-6">

        <motion.div {...fadeUp(0)} className="text-center mb-8 md:mb-12">
          <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-brand-400 mb-2">
            {t('about.products.tag')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-3 md:mb-4">
            {t('about.products.title')}
          </h2>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
            {t('about.products.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">

          {/* LivePure Hydrogen Machine */}
          <motion.div
            {...fadeUp(0.1)}
            className="group relative p-5 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-900/30 to-gray-900 border border-blue-500/20 hover:border-blue-400/40 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-5">
                {t('about.products.hydrogen.badge')}
              </span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 md:mb-5">
                <Droplets size={24} md:size={28} className="text-blue-400" />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-blue-400 mb-1">
                {t('about.products.hydrogen.tag')}
              </p>
              <h3 className="text-xl md:text-2xl font-display font-extrabold text-white mb-2 md:mb-3">
                {t('about.products.hydrogen.name')}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6">
                {t('about.products.hydrogen.desc')}
              </p>
              <a href="#hydrogen-machine" className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                {t('about.products.hydrogen.cta')} <ArrowRight size={14} md:size={15} />
              </a>
            </div>
          </motion.div>

          {/* Walnut Peptide */}
          <motion.div
            {...fadeUp(0.2)}
            className="group relative p-5 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-brand-900/30 to-gray-900 border border-brand-500/20 hover:border-brand-400/40 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-5">
                {t('about.products.peptide.badge')}
              </span>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brand-500/10 flex items-center justify-center mb-4 md:mb-5">
                <FlaskConical size={24} md:size={28} className="text-brand-400" />
              </div>
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">
                {t('about.products.peptide.tag')}
              </p>
              <h3 className="text-xl md:text-2xl font-display font-extrabold text-white mb-2 md:mb-3">
                {t('about.products.peptide.name')}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4 md:mb-6">
                {t('about.products.peptide.desc')}
              </p>
              <Link to={ROUTES.SHOP} className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors">
                {t('about.products.peptide.cta')} <ArrowRight size={14} md:size={15} />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Factory Direct Strip */}
        <motion.div
          {...fadeUp(0.3)}
          className="mt-4 md:mt-6 flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl bg-amber-500/5 border border-amber-500/20"
        >
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Factory size={16} md:size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xs md:text-sm font-bold text-amber-400">{t('about.products.factory.title')}</p>
            <p className="text-[10px] md:text-xs text-gray-400 mt-0.5 leading-relaxed">{t('about.products.factory.desc')}</p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default ProductsShowcase
