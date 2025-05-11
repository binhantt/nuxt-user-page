import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'
import type { CaptchaResponse, CaptchaVerifyRequest, CaptchaVerifyResponse } from '~/types/captcha'

// Define API response type
interface ApiCaptchaResponse {
  success: boolean;
  data: {
    captchaId: string;
    captchaSvg: string;
  };
}

export const useCaptchaStore = defineStore('captcha', {
  state: () => ({
    captchaData: null as CaptchaResponse | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getCaptchaImage: (state) => state.captchaData?.captchaImage || '',
    getCaptchaId: (state) => state.captchaData?.captchaId || '',
    isExpired: (state) => {
      if (!state.captchaData?.expiresAt) return true
      return Date.now() > state.captchaData.expiresAt
    }
  },

  actions: {
    // Lấy captcha mới
    async generateCaptcha() {
      if (this.loading) return

      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.captcha.generate)
        if (!response.ok) {
          throw new Error('Không thể tạo captcha')
        }
        
        const apiResponse = await response.json() as ApiCaptchaResponse
        
        // Validate response structure
        if (!apiResponse.success || !apiResponse.data || !apiResponse.data.captchaId || !apiResponse.data.captchaSvg) {
          throw new Error('Invalid captcha response format')
        }

        // Transform API response to match our internal format
        this.captchaData = {
          captchaId: apiResponse.data.captchaId,
          captchaImage: apiResponse.data.captchaSvg,
          expiresAt: Date.now() + 5 * 60 * 1000 // Set expiry to 5 minutes from now
        }
        
        console.log('[CaptchaStore] Generated new captcha:', {
          id: this.captchaData.captchaId,
          expires: new Date(this.captchaData.expiresAt).toLocaleString()
        })
      } catch (error) {
        console.error('[CaptchaStore] Generate error:', error)
        this.error = error instanceof Error ? error.message : 'Lỗi khi tạo captcha'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Xác thực captcha
    async verifyCaptcha(captchaValue: string): Promise<boolean> {
      if (!this.captchaData?.captchaId) {
        throw new Error('Không có captcha để xác thực')
      }

      try {
        const verifyData: CaptchaVerifyRequest = {
          captchaId: this.captchaData.captchaId,
          captchaValue: captchaValue
        }

        const response = await fetch(API_ENDPOINTS.captcha.verify, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(verifyData)
        })

        const result: CaptchaVerifyResponse = await response.json()
        
        console.log('[CaptchaStore] Verify result:', result)
        
        if (!response.ok) {
          throw new Error(result.message || 'Xác thực captcha thất bại')
        }

        return result.success
      } catch (error) {
        console.error('[CaptchaStore] Verify error:', error)
        throw error
      }
    },

    // Reset state
    resetCaptcha() {
      this.captchaData = null
      this.error = null
      this.loading = false
    }
  }
})