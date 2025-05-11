import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

interface UserData {
  id: number
  email: string
  name: string
  phone: string
  address: string
  balance: string
  is_active: number
  created_at: string
  updated_at: string
}

interface AuthState {
  token: string | null
  refreshToken: string | null
  expiresIn: number | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  userData: UserData | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    expiresIn: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    userData: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getToken: (state) => {
      console.log('[AuthStore] Getting token from state:', state.token)
      return state.token
    },
    getError: (state) => state.error,
    isLoading: (state) => state.loading,
    getUserData: (state) => state.userData
  },

  actions: {
    async login(email: string, password: string) {
      console.log('[AuthStore] Attempting login for email:', email)
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.auth.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        console.log('[AuthStore] Login response:', data)

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Đăng nhập thất bại')
        }

        // Store tokens and user data
        this.token = data.data.token
        this.refreshToken = data.data.refreshToken
        this.expiresIn = data.data.expiresIn
        this.userData = data.data.user
        this.isAuthenticated = true

        // Save to localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('refreshToken', data.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        console.log('[AuthStore] Login successful, data stored')
        return true
      } catch (err) {
        console.error('[AuthStore] Login error:', err)
        this.error = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      console.log('[AuthStore] Starting logout process')
      try {
        if (this.token) {
          console.log('[AuthStore] Sending logout request to server')
          await fetch(API_ENDPOINTS.auth.logout, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          })
        }
      } catch (err) {
        console.error('[AuthStore] Logout error:', err)
      } finally {
        console.log('[AuthStore] Clearing auth state and localStorage')
        this.token = null
        this.refreshToken = null
        this.expiresIn = null
        this.isAuthenticated = false
        this.userData = null
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        console.log('[AuthStore] Logout complete')
      }
    },

    initializeAuth() {
      console.log('[AuthStore] Initializing auth state')
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      const userData = localStorage.getItem('user')
      
      if (token && refreshToken) {
        console.log('[AuthStore] Found tokens in localStorage')
        this.token = token
        this.refreshToken = refreshToken
        this.isAuthenticated = true
      } else {
        console.log('[AuthStore] No tokens found in localStorage')
      }
      
      if (userData) {
        try {
          this.userData = JSON.parse(userData)
          console.log('[AuthStore] Loaded user data from localStorage:', this.userData)
        } catch (err) {
          console.error('[AuthStore] Error parsing user data from localStorage:', err)
          localStorage.removeItem('user')
        }
      } else {
        console.log('[AuthStore] No user data found in localStorage')
      }
    },

    setUserData(data: UserData) {
      console.log('[AuthStore] Setting user data:', data)
      this.userData = data
      localStorage.setItem('user', JSON.stringify(data))
      console.log('[AuthStore] User data saved to localStorage')
    },

    clearError() {
      console.log('[AuthStore] Clearing error state')
      this.error = null
    }
  }
}) 