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
  loading: boolean
  error: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    userProfile: (state) => state.profile,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    currentUsername: (state) => state.profile?.username || null
  },

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token');
        console.log('[UserStore] Token:', token);
        
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch(API_ENDPOINTS.auth.profile, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Lỗi máy chủ: ' + response.status);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error('Dữ liệu người dùng không hợp lệ');
        }
        
        this.profile = data.data;
        return data.data;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Lỗi không xác định';
        console.error('[UserStore] Error:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(updateData: Partial<UserProfile>) {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token');
        console.log('[UserStore] Update Profile - Token:', token ? 'Exists' : 'Not found');
        
        if (!token) {
          throw new Error('Không tìm thấy token xác thực');
        }

        const response = await fetch(API_ENDPOINTS.auth.profile, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể cập nhật thông tin người dùng');
        }

        const data = await response.json();
        
        if (!data.success || !data.data) {
          throw new Error('Dữ liệu cập nhật không hợp lệ');
        }
        
        this.profile = data.data;
        console.log('[UserStore] Profile updated successfully');
        return true;
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Lỗi không xác định';
        console.error('[UserStore] Update error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    clearProfile() {
      console.log('[UserStore] Clearing profile data');
      this.profile = null;
      this.error = null;
      console.log('[UserStore] Profile data cleared');
    }
  }
})