import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, Droplets, Battery, Activity, Award } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const FIGHTS = [
  { icon: Activity, tKey: 'about.hydrogen.fights.bp',       iconBg: 'bg-red-500/10',   iconColor: 'text-red-400' },
  { icon: Droplets, tKey: 'about.hydrogen.fights.diabetes', iconBg: 'bg-blue-500/10',  iconColor: 'text-blue-400' },
  { icon: Battery,  tKey: 'about.hydrogen.fights.fatigue',  iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
  { icon: Heart,    tKey: 'about.hydrogen.fights.stroke',   iconBg: 'bg-rose-500/10',  iconColor: 'text-rose-400' },
]

const PATENTS = [
  { label: 'Korea',  year: '2015', detail: 'Patent Registered' },
  { label: 'USA',    year: '2016', detail: 'Patent License' },
  { label: 'Japan',  year: '2018', detail: 'Patent License' },
  { label: 'Geneva', year: '2015', detail: 'Invention Award' },
]

const HydrogenSection = () => {
  const { t } = useTranslation()

  return (
    <section id="hydrogen-machine" className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container max-w-5xl px-4 sm:px-6">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-bold tracking-widest mb-4 md:mb-5">
            <Droplets size={10} md:size={12} />
            {t('about.hydrogen.tag')}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 md:mb-4">
            {t('about.hydrogen.title')}
          </h2>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
            {t('about.hydrogen.subtitle')}
          </p>
        </motion.div>

        {/* YouTube Embed */}
        <motion.div
          {...fadeUp(0.1)}
          className="rounded-2xl md:rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl mb-10 md:mb-14"
        >
          <div className="flex items-center gap-2 md:gap-3 px-4 py-2.5 md:px-5 md:py-3 bg-gray-900 border-b border-gray-800">
            <Droplets size={14} md:size={15} className="text-blue-400 flex-shrink-0" />
            <p className="text-xs md:text-sm font-semibold text-white flex-1 truncate">{t('about.hydrogen.videoTitle')}</p>
            <span className="px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full bg-red-600 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
              YouTube
            </span>
          </div>
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

        {/* What Molecular Hydrogen Can Help Fight */}
        <motion.div {...fadeUp(0.15)} className="mb-10 md:mb-12">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-center text-gray-400 mb-4 md:mb-6">
            {t('about.hydrogen.fights.heading')}
          </p>
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            {FIGHTS.map(({ icon: Icon, tKey, iconBg, iconColor }, i) => (
              <motion.div
                key={tKey}
                {...fadeUp(i * 0.07)}
                className="flex gap-3 md:gap-4 p-4 md:p-5 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={16} md:size={18} className={iconColor} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs md:text-sm mb-1">
                    {t(`${tKey}.title`)}
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t(`${tKey}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* World Patents */}
        <motion.div {...fadeUp(0.3)} className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-gray-950 border border-white/10">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
            <Award size={16} md:size={18} className="text-amber-400" />
            <p className="text-xs md:text-sm font-bold text-white uppercase tracking-widest">
              {t('about.hydrogen.patents.heading')}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4">
            {PATENTS.map(({ label, year, detail }) => (
              <div key={label} className="text-center p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors">
                <p className="text-base md:text-lg font-extrabold text-amber-400">{label}</p>
                <p className="text-[10px] md:text-xs font-bold text-white mt-0.5">{year}</p>
                <p className="text-[9px] md:text-[10px] text-gray-500 mt-1">{detail}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] md:text-[11px] text-gray-500 text-center leading-relaxed px-2">
            {t('about.hydrogen.patents.footnote')}
          </p>
        </motion.div>

      </div>
    </section>
  )
}

export default HydrogenSection
