import { createSlice } from '@reduxjs/toolkit'

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
  },
  reducers: {
    setOrders: (state, action) => { state.orders = action.payload },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload
    },
    updateOrderStatus: (state, action) => {
      const order = state.orders.find((item) => item.id === action.payload.id)
      if (order) order.status = action.payload.status
    },
  },
})

export const { setOrders, setCurrentOrder, updateOrderStatus } = ordersSlice.actions

export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder

export default ordersSlice.reducer
