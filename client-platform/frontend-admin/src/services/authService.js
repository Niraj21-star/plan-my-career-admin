import api from './api'

const TOKEN_KEY = 'cp_admin_token'
const ROLE_KEY = 'cp_admin_role'

export default {
  async login({ email, password }) {
    const res = await api.post('/auth/login', { email, password })
    const { token, role } = res.data
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (role) localStorage.setItem(ROLE_KEY, role)
    return { token, role }
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },
  getRole() {
    return localStorage.getItem(ROLE_KEY)
  }
}
