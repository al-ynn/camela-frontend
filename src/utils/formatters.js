export const formatPrice = (price, currency = 'SGD') => {
  const amount = Number(price)

  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
  }).format(Number.isFinite(amount) ? amount : 0)
}

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

export const formatDateShort = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const formatRating = (rating) => {
  return parseFloat(rating).toFixed(1)
}

export const formatDiscount = (original, discounted) => {
  const percent = ((original - discounted) / original) * 100
  return Math.round(percent)
}

export const truncate = (str, maxLength = 50) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
}

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const titleCase = (str) => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ')
}

export const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export const getOrderStatusColor = (status) => {
  const value = String(status || '').toLowerCase()
  const colors = {
    confirmed: 'badge-info',
    processing: 'badge-warning',
    shipped: 'badge-brand',
    delivered: 'badge-success',
    pending: 'badge-warning',
    paid: 'badge-success',
    failed: 'badge-error',
    cancelled: 'bg-brand-50 text-brand-700',
    canceled: 'bg-brand-50 text-brand-700',
    expired: 'badge-gray',
    returned: 'badge-gray',
  }
  return colors[value] || 'badge-gray'
}

export const getOrderStatusLabel = (status) => {
  const value = String(status || '').toLowerCase()
  const labels = {
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    cancelled: 'Cancelled',
    canceled: 'Cancelled',
    expired: 'Expired',
    returned: 'Returned',
  }
  return labels[value] || status
}
