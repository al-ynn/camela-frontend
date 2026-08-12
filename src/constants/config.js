export const API_BASE_URL =
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api'

export const resolveApiAssetUrl = (path) => {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path

  const apiOrigin = API_BASE_URL.replace(/\/api\/?$/, '')
  const normalizedPath = path.replace(/^\/+/, '')

  return apiOrigin ? `${apiOrigin}/${normalizedPath}` : `/${normalizedPath}`
}

export const APP_CONFIG = {
  name: 'Camela Group',
  tagline: 'Science-Backed Wellness for Every Family',
  description: 'Bioactive peptide nutrition & functional health foods — improving lives through scientifically proven wellness solutions across Southeast Asia.',
  email: 'info@camela.com.sg',
  phone: '+65-80641997',
  address: 'Singapore',
  social: {
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    pinterest: 'https://pinterest.com',
    tiktok: 'https://tiktok.com',
  },
}

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    price: 5.99,
    freeOver: 75,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    price: 12.99,
    freeOver: null,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    price: 24.99,
    freeOver: null,
  },
]

export const TAX_RATE = 0.1

export const FREE_SHIPPING_THRESHOLD = 75

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

export const PRODUCTS_PER_PAGE = 12

export const VALID_COUPONS = {
  SAVE10: { discount: 0.1, type: 'percent', description: '10% off your order' },
  SAVE20: { discount: 0.2, type: 'percent', description: '20% off your order' },
  FLAT15: { discount: 15, type: 'fixed', description: '$15 off your order' },
  WELCOME: { discount: 0.15, type: 'percent', description: '15% off for new customers' },
}

export const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: 'CreditCard' },
  { id: 'paypal', name: 'PayPal', icon: 'Wallet' },
  { id: 'apple-pay', name: 'Apple Pay', icon: 'Smartphone' },
  { id: 'google-pay', name: 'Google Pay', icon: 'Smartphone' },
]

export const SUPPORTED_CURRENCIES = [
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'BND', name: 'Brunei Dollar' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'KHR', name: 'Cambodian Riel' },
  { code: 'LAK', name: 'Lao Kip' },
  { code: 'MMK', name: 'Myanmar Kyat' },
  { code: 'USD', name: 'United States Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
]

export const DEFAULT_CURRENCY = 'SGD'

export const IMAGE_SIZES = {
  thumbnail: '64px',
  small: '200px',
  medium: '400px',
  large: '800px',
  hero: '1920px',
}
