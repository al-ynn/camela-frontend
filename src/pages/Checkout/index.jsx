import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Check, ChevronRight, CreditCard, MapPin, Package, Truck, User } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useSelector } from 'react-redux'
import { selectUser, selectAuth } from '../../features/auth/authSlice'
import { setCurrentOrder } from '../../features/orders/ordersSlice'
import { commerceService } from '../../services/commerceApi'
import { formatPrice } from '../../utils/formatters'
import { SHIPPING_METHODS } from '../../constants/config'

const Checkout = () => {
  const { t } = useTranslation()

  const steps = [
    { id: 1, label: t('checkout.steps.information'), icon: User },
    { id: 2, label: t('checkout.steps.shipping'), icon: MapPin },
    { id: 3, label: t('checkout.steps.delivery'), icon: Truck },
    { id: 4, label: t('checkout.steps.payment'), icon: CreditCard },
    { id: 5, label: t('checkout.steps.review'), icon: Package },
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
  const [addresses, setAddresses] = useState([])
  const [shippingAddressId, setShippingAddressId] = useState(null)
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0])
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [placing, setPlacing] = useState(false)

  const contactForm = useForm({ resolver: zodResolver(contactSchema), defaultValues: {
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: '',
  }})

  const addressForm = useForm({ resolver: zodResolver(addressSchema), defaultValues: {
    country: 'United States',
  }})

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

  const handleContactSubmit = (data) => { setContactData(data); setStep(2) }
  const handleAddressSubmit = async (data) => {
    let address = addresses.find((item) => item.id === shippingAddressId)
    const matchesSavedAddress = address &&
      address.address === data.address && address.city === data.city &&
      address.state === data.state && address.zipCode === data.zipCode && address.country === data.country

    try {
      if (!matchesSavedAddress) {
        address = await commerceService.createAddress(token, {
          label: 'Shipping',
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          country: data.country,
          is_default: addresses.length === 0,
        })
        setAddresses((current) => [...current, address])
      }
      setShippingAddressId(address.id)
      setAddressData(data)
      setStep(3)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save shipping address')
    }
  }

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

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setCardData({ ...cardData, expiry: value })
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className={`flex flex-col items-center group`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              step > s.id ? 'bg-green-500 text-white' :
              step === s.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' :
              'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`text-[10px] font-medium mt-1.5 hidden sm:block ${
              step === s.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'
            }`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-10 sm:w-16 mx-1 transition-colors ${
              step > s.id ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
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
          <span>{t('cart.subtotal')}</span><span>{formatPrice(totals.subtotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-green-600"><span>{t('cart.discount')}</span><span>-{formatPrice(totals.discount)}</span></div>
        )}
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{t('cart.shipping')}</span><span>{totals.shipping === 0 ? t('checkout.free') : formatPrice(totals.shipping)}</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>{t('checkout.tax')}</span><span>{formatPrice(totals.tax)}</span>
        </div>
        <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
          <span>{t('cart.total')}</span><span>{formatPrice(totals.total)}</span>
        </div>
      </div>
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
                {/* Step 1 - Contact Info */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <User size={18} /> {t('checkout.contactInfo')}
                      </h2>
                      <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-4">
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
                        <button type="submit" className="btn-brand btn-lg w-full justify-center gap-2 mt-2">
                          {t('checkout.continue')} <ChevronRight size={17} />
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 - Shipping Address */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <MapPin size={18} /> {t('checkout.shippingAddress')}
                      </h2>
                      <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
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
                        <div>
                          <label className="label-base">{t('checkout.country')}</label>
                          <select {...addressForm.register('country')} className="input-base">
                            <option value="">Select Country</option>
                            <option value="Afghanistan">Afghanistan</option>
                            <option value="Albania">Albania</option>
                            <option value="Algeria">Algeria</option>
                            <option value="Andorra">Andorra</option>
                            <option value="Angola">Angola</option>
                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                            <option value="Argentina">Argentina</option>
                            <option value="Armenia">Armenia</option>
                            <option value="Australia">Australia</option>
                            <option value="Austria">Austria</option>
                            <option value="Azerbaijan">Azerbaijan</option>
                            <option value="Bahamas">Bahamas</option>
                            <option value="Bahrain">Bahrain</option>
                            <option value="Bangladesh">Bangladesh</option>
                            <option value="Barbados">Barbados</option>
                            <option value="Belarus">Belarus</option>
                            <option value="Belgium">Belgium</option>
                            <option value="Belize">Belize</option>
                            <option value="Benin">Benin</option>
                            <option value="Bhutan">Bhutan</option>
                            <option value="Bolivia">Bolivia</option>
                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                            <option value="Botswana">Botswana</option>
                            <option value="Brazil">Brazil</option>
                            <option value="Brunei">Brunei</option>
                            <option value="Bulgaria">Bulgaria</option>
                            <option value="Burkina Faso">Burkina Faso</option>
                            <option value="Burundi">Burundi</option>
                            <option value="Cambodia">Cambodia</option>
                            <option value="Cameroon">Cameroon</option>
                            <option value="Canada">Canada</option>
                            <option value="Cape Verde">Cape Verde</option>
                            <option value="Central African Republic">Central African Republic</option>
                            <option value="Chad">Chad</option>
                            <option value="Chile">Chile</option>
                            <option value="China">China</option>
                            <option value="Colombia">Colombia</option>
                            <option value="Comoros">Comoros</option>
                            <option value="Congo">Congo</option>
                            <option value="Costa Rica">Costa Rica</option>
                            <option value="Croatia">Croatia</option>
                            <option value="Cuba">Cuba</option>
                            <option value="Cyprus">Cyprus</option>
                            <option value="Czech Republic">Czech Republic</option>
                            <option value="Denmark">Denmark</option>
                            <option value="Djibouti">Djibouti</option>
                            <option value="Dominica">Dominica</option>
                            <option value="Dominican Republic">Dominican Republic</option>
                            <option value="East Timor">East Timor</option>
                            <option value="Ecuador">Ecuador</option>
                            <option value="Egypt">Egypt</option>
                            <option value="El Salvador">El Salvador</option>
                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                            <option value="Eritrea">Eritrea</option>
                            <option value="Estonia">Estonia</option>
                            <option value="Ethiopia">Ethiopia</option>
                            <option value="Fiji">Fiji</option>
                            <option value="Finland">Finland</option>
                            <option value="France">France</option>
                            <option value="Gabon">Gabon</option>
                            <option value="Gambia">Gambia</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Germany">Germany</option>
                            <option value="Ghana">Ghana</option>
                            <option value="Greece">Greece</option>
                            <option value="Grenada">Grenada</option>
                            <option value="Guatemala">Guatemala</option>
                            <option value="Guinea">Guinea</option>
                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                            <option value="Guyana">Guyana</option>
                            <option value="Haiti">Haiti</option>
                            <option value="Honduras">Honduras</option>
                            <option value="Hong Kong">Hong Kong</option>
                            <option value="Hungary">Hungary</option>
                            <option value="Iceland">Iceland</option>
                            <option value="India">India</option>
                            <option value="Indonesia">Indonesia</option>
                            <option value="Iran">Iran</option>
                            <option value="Iraq">Iraq</option>
                            <option value="Ireland">Ireland</option>
                            <option value="Israel">Israel</option>
                            <option value="Italy">Italy</option>
                            <option value="Ivory Coast">Ivory Coast</option>
                            <option value="Jamaica">Jamaica</option>
                            <option value="Japan">Japan</option>
                            <option value="Jordan">Jordan</option>
                            <option value="Kazakhstan">Kazakhstan</option>
                            <option value="Kenya">Kenya</option>
                            <option value="Kiribati">Kiribati</option>
                            <option value="Kuwait">Kuwait</option>
                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                            <option value="Laos">Laos</option>
                            <option value="Latvia">Latvia</option>
                            <option value="Lebanon">Lebanon</option>
                            <option value="Lesotho">Lesotho</option>
                            <option value="Liberia">Liberia</option>
                            <option value="Libya">Libya</option>
                            <option value="Liechtenstein">Liechtenstein</option>
                            <option value="Lithuania">Lithuania</option>
                            <option value="Luxembourg">Luxembourg</option>
                            <option value="Madagascar">Madagascar</option>
                            <option value="Malawi">Malawi</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Maldives">Maldives</option>
                            <option value="Mali">Mali</option>
                            <option value="Malta">Malta</option>
                            <option value="Marshall Islands">Marshall Islands</option>
                            <option value="Mauritania">Mauritania</option>
                            <option value="Mauritius">Mauritius</option>
                            <option value="Mexico">Mexico</option>
                            <option value="Micronesia">Micronesia</option>
                            <option value="Moldova">Moldova</option>
                            <option value="Monaco">Monaco</option>
                            <option value="Mongolia">Mongolia</option>
                            <option value="Montenegro">Montenegro</option>
                            <option value="Morocco">Morocco</option>
                            <option value="Mozambique">Mozambique</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="Namibia">Namibia</option>
                            <option value="Nauru">Nauru</option>
                            <option value="Nepal">Nepal</option>
                            <option value="Netherlands">Netherlands</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Nicaragua">Nicaragua</option>
                            <option value="Niger">Niger</option>
                            <option value="Nigeria">Nigeria</option>
                            <option value="North Korea">North Korea</option>
                            <option value="North Macedonia">North Macedonia</option>
                            <option value="Norway">Norway</option>
                            <option value="Oman">Oman</option>
                            <option value="Pakistan">Pakistan</option>
                            <option value="Palau">Palau</option>
                            <option value="Palestine">Palestine</option>
                            <option value="Panama">Panama</option>
                            <option value="Papua New Guinea">Papua New Guinea</option>
                            <option value="Paraguay">Paraguay</option>
                            <option value="Peru">Peru</option>
                            <option value="Philippines">Philippines</option>
                            <option value="Poland">Poland</option>
                            <option value="Portugal">Portugal</option>
                            <option value="Puerto Rico">Puerto Rico</option>
                            <option value="Qatar">Qatar</option>
                            <option value="Romania">Romania</option>
                            <option value="Russia">Russia</option>
                            <option value="Rwanda">Rwanda</option>
                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                            <option value="Saint Lucia">Saint Lucia</option>
                            <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                            <option value="Samoa">Samoa</option>
                            <option value="San Marino">San Marino</option>
                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                            <option value="Saudi Arabia">Saudi Arabia</option>
                            <option value="Senegal">Senegal</option>
                            <option value="Serbia">Serbia</option>
                            <option value="Seychelles">Seychelles</option>
                            <option value="Sierra Leone">Sierra Leone</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Slovakia">Slovakia</option>
                            <option value="Slovenia">Slovenia</option>
                            <option value="Solomon Islands">Solomon Islands</option>
                            <option value="Somalia">Somalia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="South Korea">South Korea</option>
                            <option value="South Sudan">South Sudan</option>
                            <option value="Spain">Spain</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="Sudan">Sudan</option>
                            <option value="Suriname">Suriname</option>
                            <option value="Sweden">Sweden</option>
                            <option value="Switzerland">Switzerland</option>
                            <option value="Syria">Syria</option>
                            <option value="Taiwan">Taiwan</option>
                            <option value="Tajikistan">Tajikistan</option>
                            <option value="Tanzania">Tanzania</option>
                            <option value="Thailand">Thailand</option>
                            <option value="Togo">Togo</option>
                            <option value="Tonga">Tonga</option>
                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                            <option value="Tunisia">Tunisia</option>
                            <option value="Turkey">Turkey</option>
                            <option value="Turkmenistan">Turkmenistan</option>
                            <option value="Tuvalu">Tuvalu</option>
                            <option value="Uganda">Uganda</option>
                            <option value="Ukraine">Ukraine</option>
                            <option value="United Arab Emirates">United Arab Emirates</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="United States">United States</option>
                            <option value="Uruguay">Uruguay</option>
                            <option value="Uzbekistan">Uzbekistan</option>
                            <option value="Vanuatu">Vanuatu</option>
                            <option value="Vatican City">Vatican City</option>
                            <option value="Venezuela">Venezuela</option>
                            <option value="Vietnam">Vietnam</option>
                            <option value="Yemen">Yemen</option>
                            <option value="Zambia">Zambia</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => setStep(1)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                          <button type="submit" className="btn-brand btn-lg flex-1 justify-center gap-2">{t('checkout.continue')} <ChevronRight size={17} /></button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 - Shipping Method */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <Truck size={18} /> {t('checkout.shipping')}
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
                        <button onClick={() => setStep(2)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                        <button onClick={() => setStep(4)} className="btn-brand btn-lg flex-1 justify-center gap-2">{t('checkout.continue')} <ChevronRight size={17} /></button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4 - Payment */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <CreditCard size={18} /> {t('checkout.paymentMethod')}
                      </h2>
                      <div className="mb-6">
                        <div className="py-4 px-5 rounded-xl border-2 border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              HP
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">HitPay</p>
                              <p className="text-xs text-gray-500">Secure payment gateway</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="label-base">{t('checkout.cardNumber')}</label>
                          <input
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="input-base"
                          />
                        </div>
                        <div>
                          <label className="label-base">{t('checkout.nameOnCard')}</label>
                          <input
                            value={cardData.name}
                            onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            placeholder="John Doe"
                            className="input-base"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label-base">{t('checkout.expiryDate')}</label>
                            <input
                              value={cardData.expiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="input-base"
                            />
                          </div>
                          <div>
                            <label className="label-base">{t('checkout.cvv')}</label>
                            <input
                              value={cardData.cvv}
                              onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                              placeholder="123"
                              maxLength={4}
                              className="input-base"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button onClick={() => setStep(3)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
                        <button onClick={() => setStep(5)} className="btn-brand btn-lg flex-1 justify-center gap-2">{t('checkout.orderSummary')} <ChevronRight size={17} /></button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 5 - Review */}
                {step === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="card p-6 space-y-5">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package size={18} /> {t('checkout.orderSummary')}
                      </h2>
                      {contactData && (
                        <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.contactInfo')}</p>
                          <p className="text-sm text-gray-900 dark:text-white">{contactData.firstName} {contactData.lastName}</p>
                          <p className="text-sm text-gray-500">{contactData.email} · {contactData.phone}</p>
                        </div>
                      )}
                      {addressData && (
                        <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.shippingAddress')}</p>
                          <p className="text-sm text-gray-900 dark:text-white">{addressData.address}</p>
                          <p className="text-sm text-gray-500">{addressData.city}, {addressData.state} {addressData.zipCode}, {addressData.country}</p>
                        </div>
                      )}
                      <div className="p-4 bg-surface-secondary dark:bg-surface-dark-secondary rounded-xl">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('checkout.shipping')}</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedShipping.name}</p>
                        <p className="text-sm text-gray-500">{selectedShipping.description}</p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setStep(4)} className="btn-outline btn-lg flex-1 justify-center">{t('checkout.back')}</button>
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
                            <>{t('checkout.placeOrder')} · {formatPrice(totals.total)}</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order summary sidebar */}
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
