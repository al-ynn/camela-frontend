import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { BRANDS } from '../../data/brands'

const BrandsSection = () => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })

  if (!BRANDS.length) return null

  return (
    <section className="py-16 border-y border-gray-100 dark:border-gray-800">
      <div className="container">
        <div ref={ref} className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={hasIntersected ? { opacity: 1 } : {}}
            className="text-sm text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest"
          >
            {t('brands.title')}
          </motion.p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 md:h-9 object-contain dark:invert"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandsSection
