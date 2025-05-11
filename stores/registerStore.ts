import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'
import type { RegisterRequest, RegisterResponse } from '~/types/captcha'
import { useCaptchaStore } from './captchaStore'

export const useRegisterStore = defineStore('register', {
  state: () => ({
    loading: false,
    error: null as string | null,
    success: false,
    userData: null as RegisterResponse['user'] | null
  }),

  actions: {
    async register(data: Omit<RegisterRequest, 'captchaId'> & { captcha: string }) {
      this.loading = true
      this.error = null
      this.success = false
      
      const captchaStore = useCaptchaStore()
      
      try {
        // Prepare registration data
        const registerData: RegisterRequest = {
          ...data,
          captchaId: captchaStore.getCaptchaId
        }

        // Send registration request
        const response = await fetch(API_ENDPOINTS.auth.register, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(registerData)
        })

        const result: RegisterResponse = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Đăng ký thất bại')
        }

        // Update state on success
        this.success = true
        this.userData = result.user || null

        // Reset captcha after successful registration
        captchaStore.resetCaptcha()

        console.log('[RegisterStore] Registration successful:', {
          user: result.user?.email,
          message: result.message
        })

        return result
      } catch (error) {
        console.error('[RegisterStore] Registration error:', error)
        this.error = error instanceof Error ? error.message : 'Lỗi đăng ký tài khoản'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Reset registration state
    resetState() {
      this.loading = false
      this.error = null
      this.success = false
      this.userData = null
    }
  }
}) 