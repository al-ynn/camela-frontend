import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../constants/routes'
import Modal from '../../components/ui/Modal'

const TERMS_AND_CONDITIONS = `Terms and Condition for logging in at Camela Website
Terms & Conditions
Effective Date: 22 July 2026
Welcome to Camela Group Pte Ltd ("Camela", "we", "our", or "us"). These Terms & Conditions govern your access to and use of our website, products and services. By accessing this website, creating an account, or placing an order, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions, our Privacy Policy, and any other policies referenced on this website. If you do not agree, please discontinue using this website.
1. About Us
Camela Group Pte Ltd is a company registered in Singapore.
Company Name: Camela Group Pte Ltd
UEN: 202602066E
Website: [www.camela.com.sg](http://www.camela.com.sg/)
Email: info@camela.com.sg
2. Eligibility
You must be at least 18 years of age or have the consent of a parent or legal guardian to use this website or create an account. By registering an account, you represent that all information you provide is true, accurate, current and complete.
3. Account Registration
You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. You agree to provide accurate information and promptly update any changes to your account details. If you suspect unauthorized access to your account, you must notify Camela immediately.
4. Product Information
We make every reasonable effort to ensure that product descriptions, specifications, pricing, images and availability are accurate. However, product images are for illustration purposes only, colours may vary depending on your device, and manufacturers may change specifications or packaging without prior notice. We reserve the right to correct any typographical errors, inaccuracies or omissions at any time.
5. Product Availability
All products are subject to availability. Displaying a product on our website does not guarantee that it is in stock. We reserve the right to discontinue products, limit quantities purchased, or reject unusually large orders at our sole discretion.
6. Pricing
All prices displayed are in the applicable currency unless otherwise stated. Shipping charges, taxes and any applicable fees will be calculated during checkout where applicable. We reserve the right to change prices without prior notice. If a pricing error occurs, we reserve the right to cancel the affected order and issue a full refund where payment has already been received.
7. Orders
Placing an order constitutes an offer to purchase the products. Your order is only accepted when we issue an order confirmation and payment has been successfully verified. We reserve the right to refuse or cancel any order due to pricing errors, suspected fraud, product unavailability, payment issues, or other legitimate business reasons.
8. Payment
Payments are processed through secure third-party payment providers. Camela does not store your complete payment card information. By submitting payment, you represent that you are authorized to use the selected payment method and that all payment information provided is accurate.
9. Shipping and Delivery
Delivery estimates are provided for convenience only and are not guaranteed. Delivery times may vary due to courier delays, customs clearance, weather conditions, public holidays or circumstances beyond our reasonable control. Risk of loss passes to you upon successful delivery. Ownership of products transfers only after full payment has been received.
10. Returns and Refunds
Returns, exchanges and refunds are governed by our Return & Refund Policy. Certain products, including customized, made-to-order, clearance or hygiene-sensitive items, may not be eligible for return unless required by applicable law. Approved refunds will be processed using the original payment method where possible.
11. Promotions and Discount Codes
Promotions, vouchers and discount codes are subject to their respective terms and expiry dates. Unless expressly stated, promotions cannot be combined, transferred or exchanged for cash. Camela reserves the right to withdraw or cancel promotions that have been applied due to system errors, abuse or fraudulent activity.
12. Acceptable Use
You agree not to use this website for any unlawful or prohibited purpose. You must not interfere with the operation or security of the website, attempt unauthorized access to our systems, upload malicious software, create fraudulent accounts, manipulate pricing or promotions, or engage in activities that may disrupt the experience of other users.
13. Intellectual Property
All content available on this website, including logos, trademarks, product images, graphics, text, software, videos, icons and website design, is the property of Camela Group Pte Ltd or its licensors and is protected by applicable intellectual property laws. No content may be copied, reproduced, distributed or modified without our prior written consent.
14. Customer Reviews
Customers may submit reviews and feedback. By submitting content, you confirm that the information is truthful, does not infringe the rights of others, and is not unlawful, defamatory or offensive. Camela reserves the right to remove or moderate any content that violates these Terms.
15. Privacy
Your use of this website is also governed by our Privacy Policy. We collect, use, disclose and protect your personal information in accordance with the Personal Data Protection Act 2012 (Singapore) and our Privacy Policy. ([CCCS](https://www.ccs.gov.sg/media-and-events/newsroom/announcements-and-media-releases/enhanced-e-commerce-guidelines-to-safeguard-consumer-trust-and-foster-competitive-e-commerce-market/?utm_source=chatgpt.com))
16. Cookies
Our website uses cookies and similar technologies to improve functionality, remember your preferences, analyse website performance and enhance your shopping experience. You may disable cookies through your browser settings, although certain features of the website may not function properly.
17. Third-Party Services
Our website may contain links to third-party websites or integrate services provided by third parties, including payment gateways and logistics providers. Camela is not responsible for the content, availability or practices of these third-party services. Your use of such services is subject to their own terms and policies.
18. Website Availability
We strive to ensure that our website is available at all times but do not guarantee uninterrupted access. We may suspend, withdraw or modify the website temporarily for maintenance, upgrades or operational reasons without prior notice.
19. Limitation of Liability
To the fullest extent permitted by law, Camela Group Pte Ltd shall not be liable for any indirect, incidental, consequential, special or punitive damages, including loss of profits, business interruption or loss of data arising from your use of this website or any products purchased through it. Nothing in these Terms excludes or limits liability where such exclusion or limitation is prohibited by applicable law.
20. Indemnity
You agree to indemnify and hold harmless Camela Group Pte Ltd, its directors, employees and affiliates from any claims, liabilities, damages, losses or expenses arising out of your breach of these Terms or misuse of this website.
21. Force Majeure
Camela shall not be liable for any delay or failure to perform its obligations where such delay or failure results from events beyond our reasonable control, including natural disasters, pandemics, acts of government, labour disputes, internet outages, supplier failures or other force majeure events.
22. Amendments
We may update these Terms & Conditions from time to time. The latest version will always be published on this website. Your continued use of the website after any changes constitutes your acceptance of the revised Terms.
23. Governing Law
These Terms & Conditions shall be governed by and interpreted in accordance with the laws of the Republic of Singapore. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts of Singapore.
24. Contact Us
If you have any questions regarding these Terms & Conditions, please contact us:
Camela Group Pte Ltd
Website: [www.camela.com.sg](http://www.camela.com.sg/)
Email: info@camela.com.sg`

const Register = () => {
  const { t } = useTranslation()
  const { register: registerUser, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const schema = z.object({
    firstName: z.string().min(2, t('auth.validation.firstNameRequired')),
    lastName: z.string().min(2, t('auth.validation.lastNameRequired')),
    email: z.string().email(t('auth.validation.validEmail')),
    password: z.string().min(8, t('auth.validation.passwordMin')),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, t('auth.validation.acceptTerms')),
  }).refine((d) => d.password === d.confirmPassword, {
    message: t('auth.validation.passwordsMatch'),
    path: ['confirmPassword'],
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { terms: false },
  })
  const termsAccepted = watch('terms')

  const onSubmit = async (data) => {
    await registerUser(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          {t('auth.register.title')}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
          {t('auth.register.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-base">{t('auth.register.firstName')}</label>
            <input
              {...register('firstName')}
              placeholder=""
              className={`input-base ${errors.firstName ? 'border-brand-400' : ''}`}
            />
            {errors.firstName && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.firstName.message}</p>}
          </div>
          <div>
            <label className="label-base">{t('auth.register.lastName')}</label>
            <input
              {...register('lastName')}
              placeholder=""
              className={`input-base ${errors.lastName ? 'border-brand-400' : ''}`}
            />
            {errors.lastName && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className="label-base">{t('auth.register.email')}</label>
          <input
            {...register('email')}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={`input-base ${errors.email ? 'border-brand-400' : ''}`}
          />
          {errors.email && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.email.message}</p>}
        </div>

        <div>
          <label className="label-base">{t('auth.register.password')}</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={`input-base pr-12 ${errors.password ? 'border-brand-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.password.message}</p>}
        </div>

        <div>
          <label className="label-base">{t('auth.register.confirmPassword')}</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="Repeat password"
            autoComplete="new-password"
            className={`input-base ${errors.confirmPassword ? 'border-brand-400' : ''}`}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-brand-600 dark:text-brand-400">⚠ {errors.confirmPassword.message}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            {...register('terms')}
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 mt-0.5 flex-shrink-0"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            I agree to the{' '}
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
            >
              Terms &amp; Conditions
            </button>
          </span>
        </label>
        {errors.terms && <p className="text-xs text-brand-600 dark:text-brand-400">⚠ {errors.terms.message}</p>}

        <button
          type="submit"
          disabled={loading || isSubmitting || !isValid || !termsAccepted}
          className="btn-primary btn-lg w-full justify-center gap-2 mt-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('common.loading')}
            </span>
          ) : (
            <>
              <UserPlus size={17} />
              {t('auth.register.createAccount')}
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        {t('auth.register.hasAccount')}{' '}
        <Link to={ROUTES.LOGIN} className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
          {t('auth.register.signIn')}
        </Link>
      </p>

      <Modal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        title="Terms & Conditions"
        size="full"
        className="max-w-[800px]"
      >
        <div className="space-y-5">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">Effective Date:</p>
            <p>22 July 2026</p>
          </div>
          <div className="max-h-[65vh] overflow-y-auto pr-2">
            <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600 dark:text-gray-300 font-sans">
              {TERMS_AND_CONDITIONS}
            </pre>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsTermsOpen(false)} className="btn-outline btn-md sm:w-auto w-full justify-center">
              Close
            </button>
            <button type="button" onClick={() => setIsTermsOpen(false)} className="btn-primary btn-md sm:w-auto w-full justify-center">
              I Understand
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default Register
