import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import { Instagram, Twitter, Facebook, Youtube, ArrowRight, Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { APP_CONFIG } from '../../constants/config'
import { ROUTES } from '../../constants/routes'

const SOCIALS = [
  { icon: Instagram, href: APP_CONFIG.social.instagram, label: 'Instagram' },
  { icon: Twitter, href: APP_CONFIG.social.twitter, label: 'Twitter' },
  { icon: Facebook, href: APP_CONFIG.social.facebook, label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const Footer = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const FOOTER_LINKS = {
    Company: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('footer.blog'), href: '/' },
      { label: t('footer.affiliates'), href: '/' },
    ],
    Support: [
      { label: t('footer.contactUs'), href: ROUTES.CONTACT_US },
      { label: t('footer.helpCenter'), href: ROUTES.HELP_CENTER },
      { label: t('footer.orderStatus'), href: ROUTES.ORDER_STATUS },
      { label: t('footer.returns'), href: ROUTES.RETURNS_POLICY },
      { label: t('footer.productSafety'), href: ROUTES.PRODUCT_SAFETY },
    ],
    Legal: [
      { label: t('footer.privacyPolicy'), href: ROUTES.PRIVACY_POLICY },
      { label: t('footer.termsOfService'), href: ROUTES.TERMS_OF_SERVICE },
      { label: t('footer.cookiePolicy'), href: ROUTES.COOKIE_POLICY },
      { label: t('footer.accessibility'), href: ROUTES.ACCESSIBILITY },
    ],
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
      </div>

      {/* Main Links */}
      <div className="container py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="mb-5 inline-flex">
              <Logo
                size="md"
                nameClass="text-white"
                subClass="text-brand-400"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              {t('footer.brandDesc')}
            </p>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{t(`footer.${category.toLowerCase()}`)}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Camela Group. {t('allRightsReserved')}</p>
          <div className="flex items-center gap-6">
            <span>{t('tagline')}</span>
          </div>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
              <span
                key={method}
                className="px-2 py-1 bg-gray-800 rounded text-[10px] font-medium text-gray-300"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
