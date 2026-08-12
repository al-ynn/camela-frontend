import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setCartItems,
  clearCartState,
  removeCoupon,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCoupon,
} from '../features/cart/cartSlice'
import { commerceService } from '../services/commerceApi'
import toast from 'react-hot-toast'
import { useCurrency } from '../contexts/CurrencyContext'
import { calculateShipping, useShippingSettings } from './useShippingSettings'

export const useCart = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const coupon = useSelector(selectCoupon)
  const shippingSettings = useShippingSettings()
  const { selectedCurrency: currency, rate, formatPrice: formatCartPrice, setCurrency } = useCurrency()
  const token = useSelector((state) => state.auth.token)
  const totals = useMemo(() => {
    let discount = 0
    if (coupon.type === 'percent') {
      discount = subtotal * coupon.discount
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.discount, subtotal)
    }

    const shipping = calculateShipping(shippingSettings, items)
    const tax = subtotal * (Number(shippingSettings?.tax_rate) || 0) / 100
    const total = subtotal - discount + shipping + tax

    return { subtotal, discount, shipping, tax, total }
  }, [coupon, items, shippingSettings, subtotal])

  const resolveCartItemId = (key) =>
    items.find((item) => String(item.cartItemId ?? item.key) === String(key))?.cartItemId ?? key

  const handleAddToCart = async (product, quantity = 1) => {
    if (!token) return toast.error('Please log in to add items to your cart')
    const safeQuantity = Number(quantity) || 1
    if (safeQuantity <= 0) {
      toast.error('Please choose a valid quantity')
      return false
    }
    try {
      const updatedCart = await commerceService.addToCart(token, product.id, safeQuantity)
      dispatch(setCartItems(updatedCart))
      toast.success('Added to cart!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update cart')
      return false
    }
  }

  const handleRemoveFromCart = async (key) => {
    if (!token) return
    const cartItemId = resolveCartItemId(key)

    try {
      const updatedCart = await commerceService.removeCartItem(token, cartItemId)
      dispatch(setCartItems(updatedCart))
      return true
    } catch (error) {
      if (error.response?.status === 404) {
        dispatch(setCartItems(items.filter((item) => String(item.key) !== String(key))))
        return true
      }

      toast.error(error.response?.data?.message || 'Unable to remove cart item')
      return false
    }
  }

  const handleUpdateQuantity = async (key, quantity) => {
    if (!token) return
    if (quantity <= 0) return handleRemoveFromCart(key)
    const cartItemId = resolveCartItemId(key)

    try {
      const updatedCart = await commerceService.updateCartItem(token, cartItemId, quantity)
      dispatch(setCartItems(updatedCart))
      return true
    } catch (error) {
      if (error.response?.status === 404) {
        dispatch(setCartItems(items.filter((item) => String(item.key) !== String(key))))
        return true
      }

      toast.error(error.response?.data?.message || 'Unable to update cart')
      return false
    }
  }

  const handleClearCart = async () => {
    try {
      if (token) await commerceService.clearCart(token)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to clear cart')
      return
    }
    dispatch(clearCartState())
    return true
  }

  const handleApplyCoupon = () => toast.error('Coupons are not available')

  const handleRemoveCoupon = () => dispatch(removeCoupon())

  const isInCart = (productId) => items.some((item) => item.id === productId)

  return {
    items,
    count,
    subtotal,
    totals,
    shippingSettings,
    coupon,
    currency,
    rate,
    formatCartPrice,
    setCurrency,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    isInCart,
  }
}
