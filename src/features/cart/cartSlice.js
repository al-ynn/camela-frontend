import { createSelector, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const initialState = {
  items: [],
  couponCode: '',
  couponDiscount: 0,
  couponType: null,
  couponDescription: '',
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

  },
})

export const { setCartItems, clearCartState, removeCoupon } =
  cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

const selectCartState = (state) => state.cart

export const selectCoupon = createSelector([selectCartState], (cart) => ({
  code: cart.couponCode,
  discount: cart.couponDiscount,
  type: cart.couponType,
  description: cart.couponDescription,
}))

export default cartSlice.reducer
