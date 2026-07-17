import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Check, ChevronRight, CreditCard, MapPin, Package, Pencil, Truck, User } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useSelector } from 'react-redux'
import { selectUser, selectAuth } from '../../features/auth/authSlice'
import { setCurrentOrder } from '../../features/orders/ordersSlice'
import { commerceService } from '../../services/commerceApi'
import { formatPrice } from '../../utils/formatters'
import { SHIPPING_METHODS } from '../../constants/config'

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia',
  'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos',
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi',
  'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau',
  'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar',
  'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
  'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka',
  'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen',
  'Zambia', 'Zimbabwe',
]

const Checkout = () => {
  const { t } = useTranslation()

  const steps = [
    { id: 1, label: t('checkout.steps.information'), icon: User },
    { id: 2, label: t('checkout.steps.delivery'), icon: Truck },
    { id: 3, label: t('checkout.steps.review'), icon: Package },
    { id: 4, label: t('checkout.steps.payment'), icon: CreditCard },
  ]

  const contactSchema = z.object({
    email: z.string().email(t('checkout.validation.validEmail')),
    phone: z.string().min(7, t('checkout.validation.validPhone')),
    firstName: z.string().min(2, t('checkout.validation.required')),
    lastName: z.string().min(2, t('checkout.validation.required')),
  })

  const addressSchema = z.object({
    address: z.string().min(5, t('checkout.validation.addressRequired')),
    city: z.string().min(2, t('checkout.validation.cityRequired')),
    state: z.string().min(2, t('checkout.validation.stateRequired')),
    zipCode: z.string().min(4, t('checkout.validation.zipRequired')),
    country: z.string().min(2, t('checkout.validation.countryRequired')),
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, totals } = useCart()
  const user = useSelector(selectUser)
  const token = useSelector(selectAuth).token

  const [step, setStep] = useState(1)
  const [contactData, setContactData] = useState(null)
  const [addressData, setAddressData] = useState(null)
  const [billingAddressData, setBillingAddressData] = useState(null)
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [addresses, setAddresses] = useState([])
  const [shippingAddressId, setShippingAddressId] = useState(null)
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0])
  const [placing, setPlacing] = useState(false)
  const [couponCode, setCouponCode] = useState('')

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      phone: '',
    },
  })

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'United States' },
  })

  const billingForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'United States' },
  })

  useEffect(() => {
    if (!token) return
    commerceService.getAddresses(token).then((savedAddresses) => {
      setAddresses(savedAddresses)
      const defaultAddress = savedAddresses.find((address) => address.isDefault)
      if (defaultAddress) {
        setShippingAddressId(defaultAddress.id)
        addressForm.reset({
          address: defaultAddress.address,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        })
      }
    })
  }, [token, addressForm])

  const handleInformationSubmit = async () => {
    const contact = contactForm.getValues()
    const shipping = addressForm.getValues()
    let billing = shipping
    if (!sameAsBilling) {
      const billingValid = await billingForm.trigger()
      if (!billingValid) return
      billing = billingForm.getValues()
    }

    setContactData(contact)

    let address = addresses.find((item) => item.id === shippingAddressId)
    const matchesSavedAddress = address &&
      address.address === shipping.address && address.city === shipping.city &&
      address.state === shipping.state && address.zipCode === shipping.zipCode && address.country === shipping.country

    try {
      if (!matchesSavedAddress) {
        address = await commerceService.createAddress(token, {
          label: 'Shipping',
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          zip_code: shipping.zipCode,
          country: shipping.country,
          is_default: addresses.length === 0,
        })
        setAddresses((current) => [...current, address])
      }
      setShippingAddressId(address.id)
      setAddressData(shipping)
      setBillingAddressData(billing)
      setStep(2)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save shipping address')
    }
  }

  const handleDeliverySubmit = () => { setStep(3) }

  const handlePlaceOrder = async () => {
    if (!items.length) {
      toast.error('Your cart is empty')
      return
    }

    setPlacing(true)
    try {
      const order = await commerceService.checkout(token, 'HITPAY', shippingAddressId)
      dispatch(setCurrentOrder(order))
      const payment = await commerceService.createHitPayPayment(token)
      if (payment.payment_url) {
        window.location.assign(payment.payment_url)
        return
      }
      navigate(`/order-confirmation/${order.id}`)
    } finally {
      setPlacing(false)
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center group">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                step > s.id
                  ? 'bg-green-500 text-white'
                  : step === s.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}
            >
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span
              className={`text-[10px] font-medium mt-1.5 hidden sm:block ${
                step === s.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-10 sm:w-16 mx-1 transition-colors ${step > s.id ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />
          )}
        </div>
      ))}
    </div>
  )

  const ReviewSection = ({ title, onEdit, children }) => (
    <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline">
          <Pencil size={12} /> {t('checkout.edit')}
        </button>
      </div>
      {children}
    </div>
  )

  const OrderSummary = () => (
    <div className="card p-5 space-y-4 lg:sticky lg:top-24">
      <h3 className="font-semibold text-gray-900 dark:text-white">{t('checkout.orderSummary')}</h3>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => (
          <div key={item.key} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div className="relative">
              <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt="" className="w-full h-full object-contain p-1.5" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.title}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white flex-shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{t('cart.subtotal')}</span>
          <span>{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{t('cart.discount')}</span>
            <span>-{formatPrice(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{t('cart.shipping')}</span>
          <span>{totals.shipping === 0 ? t('checkout.free') : formatPrice(totals.shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{t('checkout.tax')}</span>
          <span>{formatPrice(totals.tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
          <span>{t('checkout.grandTotal')}</span>
          <span>{formatPrice(totals.total)}</span>
        </div>
      </div>
    </div>
  )

  const CountrySelect = ({ register, name, error }) => (
    <div>
      <label className="label-base">{t('checkout.country')}</label>
      <select {...register(name)} className={`input-base ${error ? 'border-brand-400' : ''}`}>
        <option value="">{t('checkout.selectCountry')}</option>
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-brand-600">⚠ {error.message}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-surface-dark">
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <StepIndicator />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div>
              <AnimatePresence mode="wait">
                {/* Step 1 - Customer Information */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <User size={18} /> {t('checkout.customerInformation')}
                      </h2>

                      <form onSubmit={contactForm.handleSubmit(() => {})} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[['firstName', t('checkout.firstName'), 'John'], ['lastName', t('checkout.lastName'), 'Doe']].map(([name, label, ph]) => (
                            <div key={name}>
                              <label className="label-base">{label}</label>
                              <input {...contactForm.register(name)} placeholder={ph} className={`input-base ${contactForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                              {contactForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {contactForm.formState.errors[name].message}</p>}
                            </div>
                          ))}
                        </div>
                        {[['email', t('checkout.email'), 'you@example.com', 'email'], ['phone', t('checkout.phone'), '+1 (555) 000-0000', 'tel']].map(([name, label, ph, type]) => (
                          <div key={name}>
                            <label className="label-base">{label}</label>
                            <input {...contactForm.register(name)} type={type} placeholder={ph} className={`input-base ${contactForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                            {contactForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {contactForm.formState.errors[name].message}</p>}
                          </div>
                        ))}

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <MapPin size={16} /> {t('checkout.shippingAddress')}
                          </h3>

                          {addresses.length > 0 && (
                            <div className="mb-4 space-y-2">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('checkout.savedAddresses')}</p>
                              {addresses.map((address) => (
                                <label
                                  key={address.id}
                                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                    shippingAddressId === address.id
                                      ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="savedAddress"
                                    checked={shippingAddressId === address.id}
                                    onChange={() => {
                                      setShippingAddressId(address.id)
                                      addressForm.reset({
                                        address: address.address,
                                        city: address.city,
                                        state: address.state,
                                        zipCode: address.zipCode,
                                        country: address.country,
                                      })
                                    }}
                                    className="mt-0.5 accent-gray-900 dark:accent-white"
                                  />
                                  <div className="text-sm">
                                    <p className="font-medium text-gray-900 dark:text-white">{address.label || 'Address'}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{address.address}, {address.city}, {address.state} {address.zipCode}</p>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}

                          <div className="space-y-4">
                            {[['address', t('checkout.streetAddress'), '123 Main Street'], ['city', t('checkout.city'), 'New York']].map(([name, label, ph]) => (
                              <div key={name}>
                                <label className="label-base">{label}</label>
                                <input {...addressForm.register(name)} placeholder={ph} className={`input-base ${addressForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                                {addressForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {addressForm.formState.errors[name].message}</p>}
                              </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                              {[['state', t('checkout.state'), 'NY'], ['zipCode', t('checkout.zipCode'), '10001']].map(([name, label, ph]) => (
                                <div key={name}>
                                  <label className="label-base">{label}</label>
                                  <input {...addressForm.register(name)} placeholder={ph} className={`input-base ${addressForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                                  {addressForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {addressForm.formState.errors[name].message}</p>}
                                </div>
                              ))}
                            </div>
                            <CountrySelect register={addressForm.register} name="country" error={addressForm.formState.errors.country} />
                          </div>

                          <label className="flex items-center gap-2 mt-4 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sameAsBilling}
                              onChange={(e) => setSameAsBilling(e.target.checked)}
                              className="accent-gray-900 dark:accent-white"
                            />
                            {t('checkout.sameAsBilling')}
                          </label>

                          {!sameAsBilling && (
                            <div className="mt-4 space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin size={16} /> {t('checkout.billingAddress')}
                              </h3>
                              {[['address', t('checkout.streetAddress'), '123 Main Street'], ['city', t('checkout.city'), 'New York']].map(([name, label, ph]) => (
                                <div key={name}>
                                  <label className="label-base">{label}</label>
                                  <input {...billingForm.register(name)} placeholder={ph} className={`input-base ${billingForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                                  {billingForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {billingForm.formState.errors[name].message}</p>}
                                </div>
                              ))}
                              <div className="grid grid-cols-2 gap-3">
                                {[['state', t('checkout.state'), 'NY'], ['zipCode', t('checkout.zipCode'), '10001']].map(([name, label, ph]) => (
                                  <div key={name}>
                                    <label className="label-base">{label}</label>
                                    <input {...billingForm.register(name)} placeholder={ph} className={`input-base ${billingForm.formState.errors[name] ? 'border-brand-400' : ''}`} />
                                    {billingForm.formState.errors[name] && <p className="mt-1 text-xs text-brand-600">⚠ {billingForm.formState.errors[name].message}</p>}
                                  </div>
                                ))}
                              </div>
                              <CountrySelect register={billingForm.register} name="country" error={billingForm.formState.errors.country} />
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={contactForm.handleSubmit(handleInformationSubmit)}
                          className="btn-brand btn-lg w-full justify-center gap-2 mt-4"
                        >
                          {t('checkout.continue')} <ChevronRight size={17} />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 - Delivery */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <Truck size={18} /> {t('checkout.delivery')}
                      </h2>
                      <div className="space-y-3">
                        {SHIPPING_METHODS.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedShipping.id === method.id
                                ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping.id === method.id}
                              onChange={() => setSelectedShipping(method)}
                              className="accent-gray-900 dark:accent-white"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                              <p className="text-sm text-gray-400">{method.description}</p>
                              {method.freeOver && <p className="text-xs text-green-600 dark:text-green-400">{t('checkout.freeOver', { amount: method.freeOver })}</p>}
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {method.price === 0 ? t('checkout.free') : formatPrice(method.price)}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep(1)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                        <button onClick={handleDeliverySubmit} className="btn-brand btn-lg flex-1 justify-center gap-2">{t('checkout.continue')} <ChevronRight size={17} /></button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Review Order */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6 space-y-5">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package size={18} /> {t('checkout.reviewOrder')}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.reviewDescription')}</p>

                      <ReviewSection title={t('checkout.products')} onEdit={() => setStep(1)}>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={item.key} className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-contain p-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </ReviewSection>

                      {contactData && (
                        <ReviewSection title={t('checkout.customerInformation')} onEdit={() => setStep(1)}>
                          <p className="text-sm text-gray-900 dark:text-white">{contactData.firstName} {contactData.lastName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contactData.email}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contactData.phone}</p>
                        </ReviewSection>
                      )}

                      {addressData && (
                        <ReviewSection title={t('checkout.shippingAddress')} onEdit={() => setStep(1)}>
                          <p className="text-sm text-gray-900 dark:text-white">{contactData?.firstName} {contactData?.lastName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contactData?.phone}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{addressData.address}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{addressData.city}, {addressData.state} {addressData.zipCode}, {addressData.country}</p>
                        </ReviewSection>
                      )}

                      <ReviewSection title={t('checkout.delivery')} onEdit={() => setStep(2)}>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedShipping.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{selectedShipping.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('checkout.estimatedDelivery')}: {selectedShipping.estimated || '3–5 business days'}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                          {t('checkout.shippingFee')}: {selectedShipping.price === 0 ? t('checkout.free') : formatPrice(selectedShipping.price)}
                        </p>
                      </ReviewSection>

                      <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.orderSummary')}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>{t('cart.subtotal')}</span><span>{formatPrice(totals.subtotal)}</span>
                          </div>
                          {totals.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>{t('cart.discount')}</span><span>-{formatPrice(totals.discount)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>{t('cart.shipping')}</span><span>{totals.shipping === 0 ? t('checkout.free') : formatPrice(totals.shipping)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500 dark:text-gray-400">
                            <span>{t('checkout.tax')}</span><span>{formatPrice(totals.tax)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                            <span>{t('checkout.grandTotal')}</span><span>{formatPrice(totals.total)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.coupon')}</p>
                        <div className="flex gap-2">
                          <input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={t('checkout.couponPlaceholder')}
                            className="input-base flex-1"
                          />
                          <button className="btn-outline px-4">{t('cart.apply')}</button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border-2 border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.paymentMethod')}</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">HP</div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{t('checkout.hitPaySecureCheckout')}</p>
                            <p className="text-xs text-gray-500">{t('checkout.redirectToHitPay')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                        <button onClick={() => setStep(4)} className="btn-brand btn-lg flex-1 justify-center gap-2">{t('checkout.proceedToPayment')} <ChevronRight size={17} /></button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 - Payment */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6 space-y-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard size={18} /> {t('checkout.payment')}
                      </h2>

                      <div className="p-5 rounded-xl border-2 border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('checkout.paymentProvider')}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">HP</div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-lg">{t('checkout.hitPaySecureCheckout')}</p>
                            <p className="text-xs text-gray-500">Secure payment gateway</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{t('checkout.redirectToHitPay')}</p>
                      </div>

                      <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl space-y-2 text-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.orderSummary')}</p>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                          <span>{t('checkout.orderTotal')}</span><span>{formatPrice(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                          <span>{t('cart.shipping')}</span><span>{totals.shipping === 0 ? t('checkout.free') : formatPrice(totals.shipping)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-gray-400">
                          <span>{t('checkout.tax')}</span><span>{formatPrice(totals.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                          <span>{t('checkout.grandTotal')}</span><span>{formatPrice(totals.total)}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(3)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                        <button
                          onClick={handlePlaceOrder}
                          disabled={placing || items.length === 0}
                          className="btn-brand btn-lg flex-1 justify-center gap-2"
                        >
                          {placing ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                              </svg>
                              {t('common.loading')}
                            </>
                          ) : (
                            <>{t('checkout.proceedToPayment')} · {formatPrice(totals.total)}</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
