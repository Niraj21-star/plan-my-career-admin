import axios from 'axios'
import authService from './authService'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

const api = axios.create({ baseURL })

api.interceptors.request.use(config => {
  const token = authService.getToken()
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export default api
