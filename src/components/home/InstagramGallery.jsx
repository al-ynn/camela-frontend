import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Instagram, Heart } from 'lucide-react'
import { INSTAGRAM_GALLERY } from '../../data/brands'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const InstagramGallery = () => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })

  return (
    <section className="py-16 bg-surface-secondary dark:bg-surface-dark-secondary">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram size={20} className="text-brand-500" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              @camelahealth
            </p>
          </div>
          <h2 className="section-title">{t('instagram.title')}</h2>
          <p className="section-subtitle mx-auto text-center">
            {t('instagram.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {INSTAGRAM_GALLERY.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasIntersected ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <Heart
                  size={22}
                  className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
                  fill="currentColor"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstagramGallery
