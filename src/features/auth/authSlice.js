import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../../services/authApi'
import toast from 'react-hot-toast'

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authService.login(credentials)
        return {
      token: data.token,
      user: data.user,
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Invalid credentials')
  }
})

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData)
      return {
        token: data.token,
        user: data.user,
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  rememberMe: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      toast.success('Logged out successfully')
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
        toast.success(`Welcome back, ${action.payload.user.name}!`)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || 'Login failed')
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
        toast.success('Account created successfully!')
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(action.payload || 'Registration failed')
      })
  },
})

export const { logout, clearError, updateUser, setRememberMe } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.loading
export const selectIsAdmin = (state) => state.auth.user?.is_admin === true

export default authSlice.reducer
