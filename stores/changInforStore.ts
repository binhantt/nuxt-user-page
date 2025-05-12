import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'
import { useAuthStore } from './authStore'

interface UpdateProfileData {
  name?: string
  phone?: string
  address?: string
}

export const useChangeInfoStore = defineStore('changeInfo', {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async updateProfile(userId: number, data: UpdateProfileData) {
      this.loading = true
      this.error = null
      const authStore = useAuthStore()
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${API_ENDPOINTS.auth.profile}${userId}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId,
            ...data
          })
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Failed to update profile')
        }

        // Update local storage and auth store with new user data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        const updatedUser = { 
          ...currentUser, 
          ...data,
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Update auth store user data
        authStore.setUserData(updatedUser)

        return {
          success: true,
          data: result.data
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An error occurred while updating profile'
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
