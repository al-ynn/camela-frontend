import { useDispatch, useSelector } from 'react-redux'
import {
  setCartItems,
  clearCartState,
  removeCoupon,
  selectCartItems,
  selectCartCount,
  selectCartSubtotal,
  selectCartTotals,
  selectCoupon,
} from '../features/cart/cartSlice'
import { openCartDrawer } from '../features/ui/uiSlice'
import { commerceService } from '../services/commerceApi'
import toast from 'react-hot-toast'
import { selectUser } from '../features/auth/authSlice'

export const useCart = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const totals = useSelector(selectCartTotals)
  const coupon = useSelector(selectCoupon)
  const token = useSelector((state) => state.auth.token)
  const user = useSelector(selectUser)

  const handleAddToCart = async (product, quantity = 1) => {
    if (!token) return toast.error('Please log in to add items to your cart')
    if (!user?.email_verified_at) {
      toast.error('Please verify your email before purchasing products.')
      return
    }
    const safeQuantity = Number(quantity) || 1
    if (safeQuantity <= 0) {
      toast.error('Please choose a valid quantity')
      return
    }
    try {
      const updatedCart = await commerceService.addToCart(token, product.id, safeQuantity)
      dispatch(setCartItems(updatedCart))
      dispatch(openCartDrawer())
      toast.success('Added to cart!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update cart')
    }
  }

  const handleRemoveFromCart = async (key) => {
    if (!token) return
    try {
      const updatedCart = await commerceService.removeCartItem(token, key)
      dispatch(setCartItems(updatedCart))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove cart item')
    }
  }

  const handleUpdateQuantity = async (key, quantity) => {
    if (!token) return
    if (quantity <= 0) return handleRemoveFromCart(key)
    try {
      const updatedCart = await commerceService.updateCartItem(token, key, quantity)
      dispatch(setCartItems(updatedCart))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update cart')
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
  }

  const handleApplyCoupon = () => toast.error('Coupons are not available')

  const handleRemoveCoupon = () => dispatch(removeCoupon())

  const isInCart = (productId) => items.some((item) => item.id === productId)

  return {
    items,
    count,
    subtotal,
    totals,
    coupon,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    isInCart,
  }
}
