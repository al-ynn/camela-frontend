import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartDrawerOpen: false,
    mobileMenuOpen: false,
    searchOpen: false,
    theme: 'light',
    recentSearches: [],
    compareList: [],
  },
  reducers: {
    openCartDrawer: (state) => {
      state.cartDrawerOpen = true
    },
    closeCartDrawer: (state) => {
      state.cartDrawerOpen = false
    },
    toggleCartDrawer: (state) => {
      state.cartDrawerOpen = !state.cartDrawerOpen
    },
    openMobileMenu: (state) => {
      state.mobileMenuOpen = true
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
    openSearch: (state) => {
      state.searchOpen = true
    },
    closeSearch: (state) => {
      state.searchOpen = false
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('camela-theme', action.payload)
    },
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      state.theme = newTheme
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('camela-theme', newTheme)
    },
    addRecentSearch: (state, action) => {
      const query = action.payload.trim()
      if (!query) return
      state.recentSearches = [
        query,
        ...state.recentSearches.filter((s) => s !== query),
      ].slice(0, 8)
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
    },
    addToCompare: (state, action) => {
      if (state.compareList.length < 4 && !state.compareList.find((p) => p.id === action.payload.id)) {
        state.compareList.push(action.payload)
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter((p) => p.id !== action.payload)
    },
  },
})

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openMobileMenu,
  closeMobileMenu,
  openSearch,
  closeSearch,
  setTheme,
  toggleTheme,
  addRecentSearch,
  clearRecentSearches,
  addToCompare,
  removeFromCompare,
} = uiSlice.actions

export const selectCartDrawerOpen = (state) => state.ui.cartDrawerOpen
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectSearchOpen = (state) => state.ui.searchOpen
export const selectTheme = (state) => state.ui.theme
export const selectRecentSearches = (state) => state.ui.recentSearches

export default uiSlice.reducer
