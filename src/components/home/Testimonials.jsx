import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../data/brands'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { formatDateShort } from '../../utils/formatters'

const TestimonialCard = ({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="card p-7 flex flex-col gap-5 hover:shadow-card-hover transition-all duration-300"
  >
    {/* Quote icon */}
    <Quote size={28} className="text-brand-200 dark:text-brand-800 -mt-1" fill="currentColor" />

    {/* Stars */}
    <div className="flex gap-1">
      {Array.from({ length: testimonial.rating }).map((_, i) => (
        <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
      ))}
    </div>

    {/* Comment */}
    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1">
      "{testimonial.comment}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
      <img
        src={testimonial.avatar}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-900"
      />
      <div>
        <p className="font-semibold text-sm text-gray-900 dark:text-white">{testimonial.name}</p>
        <p className="text-xs text-gray-400">{testimonial.role} · {formatDateShort(testimonial.date)}</p>
      </div>
    </div>
  </motion.div>
)

const Testimonials = () => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })

  if (!TESTIMONIALS.length) return null

  return (
    <section className="py-20 bg-surface-secondary dark:bg-surface-dark-secondary">
      <div className="container">
        <div ref={ref} className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
              {t('testimonials.sectionTag')}
            </p>
            <h2 className="section-title">{t('testimonials.title')}</h2>
            <p className="section-subtitle mx-auto text-center">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          {/* Aggregate rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={hasIntersected ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-card border border-gray-100 dark:border-gray-800"
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={15} className="text-amber-400" fill="currentColor" />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{t('testimonials.ratingScore')}</span>
            <span className="text-sm text-gray-400">{t('testimonials.ratingCount')}</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((testimonial, i) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
