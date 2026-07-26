import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, UserPlus, Briefcase, Globe } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
})

const cardBase = {
  light: 'bg-white text-gray-900 border border-gray-200 shadow-lg',
  brand: 'bg-brand-500 text-white border-2 border-brand-400 shadow-2xl ring-4 ring-brand-500/20',
  dark: 'bg-gray-800 text-white border border-gray-700',
}

const tagBase = {
  light: 'bg-gray-100 text-gray-500',
  brand: 'bg-white/20 text-white',
  dark: 'bg-white/10 text-gray-300',
}

const descBase = {
  light: 'text-gray-500',
  brand: 'text-amber-100',
  dark: 'text-gray-400',
}

const perkBase = {
  light: 'text-gray-600',
  brand: 'text-white',
  dark: 'text-gray-300',
}

const checkBase = {
  light: 'text-brand-500',
  brand: 'text-white',
  dark: 'text-brand-400',
}

const btnBase = {
  light: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-500 hover:text-white',
  brand: 'bg-white text-brand-600 hover:bg-amber-50',
  dark: 'bg-brand-500 text-white hover:bg-brand-600',
}

const JoinFamilySection = () => {
  const { t } = useTranslation()

  const CARDS = [
    {
      icon: UserPlus,
      tag: t('joinFamily.member.tag'),
      title: t('joinFamily.member.title'),
      description: t('joinFamily.member.description'),
      perks: [t('joinFamily.member.perk1'), t('joinFamily.member.perk2'), t('joinFamily.member.perk3')],
      cta: { label: t('joinFamily.member.cta'), href: '/apply/member' },
      style: 'light',
    },
    {
      icon: Briefcase,
      tag: t('joinFamily.partner.tag'),
      title: t('joinFamily.partner.title'),
      description: t('joinFamily.partner.description'),
      perks: [t('joinFamily.partner.perk1'), t('joinFamily.partner.perk2'), t('joinFamily.partner.perk3')],
      cta: { label: t('joinFamily.partner.cta'), href: '/apply/distribution-partner' },
      style: 'brand',
    },
    {
      icon: Globe,
      tag: t('joinFamily.importer.tag'),
      title: t('joinFamily.importer.title'),
      description: t('joinFamily.importer.description'),
      perks: [t('joinFamily.importer.perk1'), t('joinFamily.importer.perk2'), t('joinFamily.importer.perk3')],
      cta: { label: t('joinFamily.importer.cta'), href: '/apply/importer' },
      style: 'dark',
    },
  ]

  return (
    <section className="py-24 bg-gray-950">
      <div className="container max-w-5xl">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">
            {t('joinFamily.sectionTag')}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight mb-4">
            {t('joinFamily.sectionTitle')}
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            {t('joinFamily.sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 items-stretch">
          {CARDS.map(({ icon: Icon, tag, title, description, perks, cta, style }, i) => (
            <motion.div
              key={title}
              {...fadeUp(i * 0.1)}
              className={`flex flex-col rounded-3xl p-7 ${cardBase[style]}`}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style === 'light' ? 'bg-brand-50' : 'bg-white/10'}`}>
                  <Icon size={17} className={style === 'light' ? 'text-brand-600' : 'text-white'} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${tagBase[style]}`}>
                  {tag}
                </span>
              </div>

              <h3 className="text-xl font-display font-extrabold mb-3">{title}</h3>

              <p className={`text-sm leading-relaxed mb-6 ${descBase[style]}`}>{description}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5">
                    <CheckCircle size={15} className={`flex-shrink-0 ${checkBase[style]}`} />
                    <span className={`text-sm font-medium ${perkBase[style]}`}>{perk}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={cta.href}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-bold transition-all duration-200 ${btnBase[style]}`}
              >
                {cta.label}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default JoinFamilySection
