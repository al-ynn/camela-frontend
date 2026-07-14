import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  loginUser,
  registerUser,
  logout,
  updateUser,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from '../features/auth/authSlice'
import { clearCartState, setCartItems } from '../features/cart/cartSlice'
import { authService } from '../services/authApi'
import { clearWishlist } from '../features/wishlist/wishlistSlice'
import { ROUTES } from '../constants/routes'
import { commerceService } from '../services/commerceApi'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)

  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) {
      dispatch(setCartItems(await commerceService.getCart(result.payload.token)))
      navigate(ROUTES.DASHBOARD)
      return { success: true }
    }
    return { success: false, error: result.payload }
  }

  const handleRegister = async (userData) => {
    const result = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(result)) {
      dispatch(setCartItems(await commerceService.getCart(result.payload.token)))
      navigate(ROUTES.DASHBOARD)
      return { success: true }
    }
    return { success: false, error: result.payload }
  }

  const handleLogout = async () => {
    if (auth.token) {
      try { await authService.logout(auth.token) } catch { /* local cleanup still ends the session */ }
    }
    dispatch(logout())
    dispatch(clearCartState())
    dispatch(clearWishlist())
    navigate(ROUTES.HOME)
  }

  const handleUpdateUser = (data) => dispatch(updateUser(data))

  return {
    user,
    isAuthenticated,
    loading,
    error: auth.error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateUser: handleUpdateUser,
  }
}
