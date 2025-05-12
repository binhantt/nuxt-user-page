import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export const useChangePasswordStore = defineStore('changePassword', {
  state: () => ({
    loading: false,
    error: null as string | null,
    validationErrors: [] as string[],
  }),

  actions: {
    validatePassword(data: PasswordChangeData): ValidationResult {
      const errors: string[] = []

      // Check if passwords are provided
      if (!data.currentPassword) {
        errors.push('Vui lòng nhập mật khẩu hiện tại')
      } else if (data.currentPassword.length < 6) {
        errors.push('Mật khẩu hiện tại phải có ít nhất 6 ký tự')
      }

      if (!data.newPassword) {
        errors.push('Vui lòng nhập mật khẩu mới')
      } else if (data.newPassword.length < 6) {
        errors.push('Mật khẩu mới phải có ít nhất 6 ký tự')
      }

      if (!data.confirmPassword) {
        errors.push('Vui lòng xác nhận mật khẩu mới')
      } else if (data.confirmPassword !== data.newPassword) {
        errors.push('Mật khẩu xác nhận không khớp')
      }

      // Check if new password is different from current
      if (data.newPassword === data.currentPassword) {
        errors.push('Mật khẩu mới phải khác mật khẩu hiện tại')
      }

      return {
        isValid: errors.length === 0,
        errors
      }
    },

    async updatePassword(userId: number, data: PasswordChangeData) {
      this.loading = true
      this.error = null
      this.validationErrors = []
      
      try {
        // Validate password data
        const validation = this.validatePassword(data)
        if (!validation.isValid) {
          this.validationErrors = validation.errors
          return {
            success: false,
            error: validation.errors[0],
            validationErrors: validation.errors
          }
        }

        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${API_ENDPOINTS.auth.profile}/${userId}/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            old_password: data.currentPassword,
            new_password: data.newPassword
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update password')
        }

        return {
          success: true,
          message: 'Password updated successfully'
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An error occurred while updating password'
        return {
          success: false,
          error: this.error
        }
      } finally {
        this.loading = false
      }
    }
  }
})
