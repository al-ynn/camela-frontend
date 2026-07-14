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

    return response.data
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
}
