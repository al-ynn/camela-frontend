import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowRight } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../product/ProductCard'
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver'

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const diff = targetDate - now
      if (diff <= 0) return
      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
      <span className="text-2xl font-display font-bold text-white">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[10px] text-white/60 font-medium mt-1.5 uppercase tracking-widest">
      {label}
    </span>
  </div>
)

const FlashSale = () => {
  const { t } = useTranslation()
  const { ref, hasIntersected } = useIntersectionObserver({ once: true })
  const { data: products = [] } = useProducts()

  const saleEndRef = useRef(null)
  if (!saleEndRef.current) {
    const d = new Date()
    d.setHours(d.getHours() + 11)
    d.setMinutes(d.getMinutes() + 45)
    saleEndRef.current = d
  }
  const { hours, minutes, seconds } = useCountdown(saleEndRef.current)

  const saleProducts = products.filter((_, i) => i % 2 === 0).slice(0, 4)

  return (
    <section className="py-20 bg-gray-950 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-800/10 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                  <Zap size={18} className="text-white" fill="currentColor" />
                </div>
                <span className="text-brand-400 font-semibold text-sm uppercase tracking-widest">
                  {t('flashSale.tag')}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
                {t('flashSale.title')}
              </h2>
              <p className="text-gray-400 mt-2">{t('flashSale.subtitle')}</p>
            </div>

            {/* Countdown */}
            <div className="flex flex-col items-start md:items-end gap-3">
              <p className="text-sm text-gray-400">{t('flashSale.endsIn')}</p>
              <div className="flex items-center gap-3">
                <TimeUnit value={hours} label={t('flashSale.hours')} />
                <span className="text-2xl font-bold text-white/40 mb-4">:</span>
                <TimeUnit value={minutes} label={t('flashSale.mins')} />
                <span className="text-2xl font-bold text-white/40 mb-4">:</span>
                <TimeUnit value={seconds} label={t('flashSale.secs')} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {saleProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={hasIntersected ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={hasIntersected ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            to="/shop"
            className="btn-brand btn-lg inline-flex gap-2"
          >
            {t('flashSale.viewAll')}
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FlashSale
