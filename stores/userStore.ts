import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

interface UserProfile {
  id: number
  email: string
  fullName: string
  username: string
  avatar?: string
  phoneNumber?: string
  address?: string
  createdAt: string
  updatedAt: string
}

interface UserState {
  profile: UserProfile | null
  currentViewedUser: UserProfile | null
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    currentViewedUser: null,
    loading: false,
    error: null
  }),

  getters: {
    userProfile: (state) => state.profile,
    viewedUser: (state) => state.currentViewedUser,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    isOwnProfile: (state) => {
      if (!state.profile || !state.currentViewedUser) return false
      return state.profile.username === state.currentViewedUser.username
    },
    currentUsername: (state) => state.profile?.username || null
  },

  actions: {
    async fetchUserByUsername(username: string) {
      if (!username) {
        console.error('[UserStore] No username provided to fetchUserByUsername')
        return null
      }

      this.loading = true
      this.error = null
      
      try {
        console.log('[UserStore] Fetching user data for username:', username)
        const token = localStorage.getItem('token')
        console.log('[UserStore] Token from localStorage:', token ? 'Token exists' : 'No token found')
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        }
        
        if (token) {
          console.log('[UserStore] Adding token to request headers')
          headers['Authorization'] = `Bearer ${token}`
        }

        console.log('[UserStore] Request headers:', headers)
        const response = await fetch(`${API_ENDPOINTS.users}/${username}`, {
          headers
        })
        const data = await response.json()
        console.log('[UserStore] User API Response:', data)
        
        if (!response.ok) {
          console.error('[UserStore] API error response:', data)
          throw new Error(data.message || 'Không thể tải thông tin người dùng')
        }

        const userData = data.data || data
        if (!userData) {
          console.error('[UserStore] No user data in response')
          throw new Error('Không tìm thấy thông tin người dùng')
        }

        if (!userData.username) {
          console.error('[UserStore] Missing username in user data:', userData)
          throw new Error('Dữ liệu người dùng không hợp lệ')
        }

        this.currentViewedUser = userData
        console.log('[UserStore] Current viewed user set:', this.currentViewedUser)
        return userData
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin người dùng'
        console.error('[UserStore] Error fetching user:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchProfile() {
      this.loading = true
      this.error = null
      
      try {
        const token = localStorage.getItem('token')
        console.log('[UserStore] Token check for fetchProfile:', token ? 'Token exists' : 'No token')
        
        if (!token) {
          console.error('[UserStore] No authentication token found')
          throw new Error('Không tìm thấy token xác thực')
        }

        console.log('[UserStore] Making authenticated request to profile endpoint')
        const response = await fetch(API_ENDPOINTS.auth.profile, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        console.log('[UserStore] Profile API Response:', data)

        if (!response.ok) {
          console.error('[UserStore] Profile API error:', data)
          throw new Error(data.message || 'Không thể tải thông tin người dùng')
        }

        const profileData = data.data || data
        if (!profileData) {
          console.error('[UserStore] No profile data in response')
          throw new Error('Không nhận được dữ liệu người dùng từ máy chủ')
        }

        if (!profileData.username) {
          console.error('[UserStore] Missing username in profile data:', profileData)
          throw new Error('Dữ liệu người dùng không hợp lệ')
        }

        this.profile = profileData
        console.log('[UserStore] Profile successfully set:', this.profile)
        return profileData
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin người dùng'
        console.error('[UserStore] Error fetching profile:', err)
        return null
      } finally {
        this.loading = false
      }
    },

    async updateProfile(updateData: Partial<UserProfile>) {
      this.loading = true
      this.error = null
      
      try {
        const token = localStorage.getItem('token')
        console.log('[UserStore] Token check for updateProfile:', token ? 'Token exists' : 'No token')
        
        if (!token) {
          console.error('[UserStore] No authentication token found for update')
          throw new Error('Không tìm thấy token xác thực')
        }

        console.log('[UserStore] Sending profile update request with data:', updateData)
        const response = await fetch(API_ENDPOINTS.auth.profile, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        })
      
        if (!response.ok) {
          const errorData = await response.json()
          console.error('[UserStore] Profile update error:', errorData)
          throw new Error(errorData.message || 'Không thể cập nhật thông tin người dùng')
        }

        const data = await response.json()
        this.profile = data
        console.log('[UserStore] Profile successfully updated:', this.profile)
        return true
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin người dùng'
        console.error('[UserStore] Error updating profile:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    clearProfile() {
      console.log('[UserStore] Clearing profile data')
      this.profile = null
      this.currentViewedUser = null
      this.error = null
      console.log('[UserStore] Profile data cleared')
    }
  }
})