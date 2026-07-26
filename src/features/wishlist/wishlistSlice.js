import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload
      const index = state.items.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        state.items.splice(index, 1)
        toast.success('Removed from wishlist')
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          rating: product.rating,
          addedAt: new Date().toISOString(),
        })
        toast.success('Added to wishlist!')
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions

export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.items.some((item) => item.id === productId)

export default wishlistSlice.reducer
