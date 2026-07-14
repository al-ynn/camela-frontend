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

export const useCart = () => {
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const count = useSelector(selectCartCount)
  const subtotal = useSelector(selectCartSubtotal)
  const totals = useSelector(selectCartTotals)
  const coupon = useSelector(selectCoupon)
  const token = useSelector((state) => state.auth.token)

  const handleAddToCart = async (product, quantity = 1) => {
    if (!token) return toast.error('Please log in to add items to your cart')
    try {
      dispatch(setCartItems(await commerceService.addToCart(token, product.id, quantity)))
      dispatch(openCartDrawer())
      toast.success('Added to cart!')
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to update cart') }
  }

  const handleRemoveFromCart = async (key) => {
    if (!token) return
    dispatch(setCartItems(await commerceService.removeCartItem(token, key)))
  }

  const handleUpdateQuantity = async (key, quantity) => {
    if (!token) return
    if (quantity <= 0) return handleRemoveFromCart(key)
    dispatch(setCartItems(await commerceService.updateCartItem(token, key, quantity)))
  }

  const handleClearCart = async () => {
    if (token) await commerceService.clearCart(token)
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
