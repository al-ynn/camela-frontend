import { SORT_OPTIONS } from '../constants/config'

export const sortProducts = (products, sortBy) => {
  const arr = [...products]
  switch (sortBy) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price)
    case 'highest-rated':
      return arr.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    case 'newest':
      return arr.sort((a, b) => b.id - a.id)
    case 'best-selling':
      return arr.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
    default:
      return arr
  }
}

export const filterProducts = (products, filters) => {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false
    if (filters.rating > 0 && (product.rating?.rate || 0) < filters.rating) return false
    return true
  })
}

export const searchProducts = (products, query) => {
  if (!query.trim()) return products
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
  )
}

export const paginateProducts = (products, page, perPage) => {
  const start = (page - 1) * perPage
  return products.slice(start, start + perPage)
}

export const getRelatedProducts = (products, product, count = 4) => {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, count)
}

export const generateStars = (rating) => {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return { full, half, empty }
}

export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const getSortLabel = (value) => {
  return SORT_OPTIONS.find((o) => o.value === value)?.label || 'Featured'
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

