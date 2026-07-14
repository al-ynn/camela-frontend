import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { apiSlice } from '../services/api'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import wishlistReducer from '../features/wishlist/wishlistSlice'
import uiReducer from '../features/ui/uiSlice'
import productsReducer from '../features/products/productsSlice'
import ordersReducer from '../features/orders/ordersSlice'

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  ui: uiReducer,
  products: productsReducer,
  orders: ordersReducer,
})

const persistConfig = {
  key: 'camela-root',
  version: 1,
  storage,
  whitelist: ['wishlist', 'auth', 'ui'],
  blacklist: [apiSlice.reducerPath, 'products'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

export const persistor = persistStore(store)
