import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  userData: any | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
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

        if (!response.ok) {
          throw new Error(data.message || 'Đăng nhập thất bại')
        }

        // Check if the token is in the correct location of the response
        const token = data.data?.token || data.token
        if (!token) {
          console.error('[AuthStore] No token received in response')
          throw new Error('Token không hợp lệ từ máy chủ')
        }

        console.log('[AuthStore] Setting token in state and localStorage')
        this.token = token
        this.isAuthenticated = true
        localStorage.setItem('token', token)
        console.log('[AuthStore] Token successfully stored')
        
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
        this.isAuthenticated = false
        this.userData = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        console.log('[AuthStore] Logout complete')
      }
    },

    initializeAuth() {
      console.log('[AuthStore] Initializing auth state')
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token) {
        console.log('[AuthStore] Found token in localStorage')
        this.token = token
        this.isAuthenticated = true
      } else {
        console.log('[AuthStore] No token found in localStorage')
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

    setUserData(data: any) {
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