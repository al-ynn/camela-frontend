import { createSlice } from '@reduxjs/toolkit'

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    filters: {
      category: '',
      priceMin: 0,
      priceMax: 10000000000,
      rating: 0,
      inStock: false,
      onSale: false,
    },
    sort: 'featured',
    view: 'grid',
    page: 1,
    searchQuery: '',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
    },
    resetFilters: (state) => {
      state.filters = {
        category: '',
        priceMin: 0,
        priceMax: 10000000000,
        rating: 0,
        inStock: false,
        onSale: false,
      }
      state.page = 1
    },
    setSort: (state, action) => {
      state.sort = action.payload
      state.page = 1
    },
    setView: (state, action) => {
      state.view = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.page = 1
    },
  },
})

export const { setFilter, resetFilters, setSort, setView, setPage, setSearchQuery } =
  productsSlice.actions

export const selectFilters = (state) => state.products.filters
export const selectSort = (state) => state.products.sort
export const selectView = (state) => state.products.view
export const selectPage = (state) => state.products.page
export const selectSearchQuery = (state) => state.products.searchQuery

export default productsSlice.reducer
