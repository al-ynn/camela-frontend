import axios from 'axios'
import { API_BASE_URL } from '../constants/config'

const authAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const authService = {
  login: async (credentials) => {
    const response = await authAxios.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await authAxios.post('/auth/register', 
      {
        name: `${userData.firstName} ${userData.lastName}`,
        username: userData.username || userData.email.split('@')[0],
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
      }
    )
    return response.data
  },

  getProfile: async (token) => {
    const response = await authAxios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.data ?? response.data
  },

  logout: async (token) => {
    const response = await authAxios.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  },

  resendVerification: async (token, email) => {
    const response = await authAxios.post(
      '/email/verification/resend',
      { email },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    return response.data
  },

  sendPasswordResetLink: async (email) => {
    const response = await authAxios.post('/forgot-password', { email })
    return response.data
  },

  resetPassword: async (payload) => {
    const response = await authAxios.post('/reset-password', payload)
    return response.data
  },

  changePassword: async (token, payload) => {
    const response = await authAxios.patch(
      '/settings/password',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return response.data
  },
}

