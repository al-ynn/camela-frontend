import { createSelector, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { TAX_RATE, DEFAULT_CURRENCY, SUPPORTED_CURRENCIES } from '../../constants/config'

const initialState = {
  items: [],
  couponCode: '',
  couponDiscount: 0,
  couponType: null,
  couponDescription: '',
  currency: DEFAULT_CURRENCY,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => { state.items = action.payload },

    clearCartState: (state) => {
      state.items = []
      state.couponCode = ''
      state.couponDiscount = 0
      state.couponType = null
      state.couponDescription = ''
    },

    removeCoupon: (state) => {
      state.couponCode = ''
      state.couponDiscount = 0
      state.couponType = null
      state.couponDescription = ''
      toast.success('Coupon removed')
    },

    setCurrency: (state, action) => {
      state.currency = action.payload
    },
  },
})

export const { setCartItems, clearCartState, removeCoupon, setCurrency } =
  cartSlice.actions

export const selectCurrency = (state) => state.cart.currency

export const getCurrencyRate = (code) =>
  SUPPORTED_CURRENCIES.find((c) => c.code === code)?.rate ?? 1

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

const selectCartState = (state) => state.cart

export const selectCartTotals = createSelector([selectCartState], (cart) => {
  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const { couponDiscount, couponType } = cart
  let discount = 0
  if (couponType === 'percent') {
    discount = subtotal * couponDiscount
  } else if (couponType === 'fixed') {
    discount = Math.min(couponDiscount, subtotal)
  }
  const afterDiscount = subtotal - discount
  const shipping = afterDiscount >= 75 || afterDiscount === 0 ? 0 : 5.99
  const tax = afterDiscount * TAX_RATE
  const total = afterDiscount + shipping + tax
  return { subtotal, discount, shipping, tax, total }
})

export const selectCoupon = createSelector([selectCartState], (cart) => ({
  code: cart.couponCode,
  discount: cart.couponDiscount,
  type: cart.couponType,
  description: cart.couponDescription,
}))

export default cartSlice.reducer
