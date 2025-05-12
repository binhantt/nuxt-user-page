<template>
  <div class="profile-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8">
          <div v-if="userData" class="box profile-box">
            <!-- Profile Header -->
            <ProfileHeader
              :user-data="userData"
              :username="typeof route.params.name === 'string' ? route.params.name : ''"
              :is-own-profile="isOwnProfile"
              @upload-avatar="uploadAvatar"
            />

            <!-- Profile Tabs -->
            <ProfileTabs
              v-model="activeTab"
              :is-own-profile="isOwnProfile"
            />

            <!-- Profile Content -->
            <div class="profile-content">
              <!-- Info Tab -->
              <ProfileInfo
                v-if="activeTab === 'info'"
                :user-data="userData"
                :is-own-profile="isOwnProfile"
                @update="handleUpdateProfile"
              />

              <!-- Orders Tab -->
              <ProfileOrders
                v-if="activeTab === 'orders'"
                :orders="orders"
                :is-loading="isLoadingOrders"
                @cancel-order="handleCancelOrder"
              />

              <!-- Security Tab -->
              <ProfileSecurity
                v-if="activeTab === 'security'"
                :user="userData"
                @update-password="handlePasswordChange"
              />
            </div>
          </div>

          <!-- Loading State -->
          <div v-else-if="isUpdating" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
          </div>

          <!-- Not Found State -->
          <div v-else class="notification is-warning">
            Không tìm thấy người dùng
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~/stores/userStore'
import { useAuthStore } from '~/stores/authStore'
import { useOrderStore } from '~/stores/orderStore'
import { API_ENDPOINTS } from '~/config/Api'
import type { UserData, Order } from '~/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()

const isUpdating = ref(false)
const activeTab = ref('info')
const userData = ref<UserData | null>(null)
const orders = ref<Order[]>([])
const isLoadingOrders = ref(false)

// Check if current user is viewing their own profile
const isOwnProfile = computed(() => {
  return authStore.isLoggedIn && userData.value?.name === route.params.name
})

// Initialize user data from localStorage
const initializeUserData = () => {
  try {
    const data = localStorage.getItem('user')
    if (data) {
      userData.value = JSON.parse(data)
      console.log('[Profile] User data:', userData.value)
      return userData.value
    }
  } catch (error) {
    console.error('[Profile] Error parsing user data:', error)
  }
  return null
}

// Watch localStorage for changes
watch(
  () => localStorage.getItem('user'),
  (newData) => {
    if (newData) {
      try {
        userData.value = JSON.parse(newData)
        console.log('[Profile] User data updated:', userData.value)
      } catch (error) {
        console.error('[Profile] Error parsing user data:', error)
      }
    } else {
      userData.value = null
      console.log('[Profile] User data cleared')
    }
  }
)

// Load initial data
onMounted(async () => {
  console.log('[Profile] Component mounted')
  console.log('[Profile] Route params:', route.params)
  
  // Initialize auth state first
  authStore.initializeAuth()
  
  if (!authStore.isLoggedIn) {
    console.log('[Profile] User not logged in, redirecting to login')
    await navigateTo('/account')
    return
  }

  const data = initializeUserData()
  if (!data) {
    console.log('[Profile] No stored user data')
    return
  }
  
  const username = route.params.name
  if (typeof username !== 'string' || username !== data.name) {
    console.log('[Profile] Username mismatch, redirecting')
    await navigateTo(`/account/profile/${data.name}`)
  }
})

// Handle profile update
const handleUpdateProfile = async (updatedInfo: Partial<UserData>) => {
  if (!userData.value) return
  
  isUpdating.value = true
  try {
    // Update local storage
    const updatedData = {
      ...userData.value,
      ...updatedInfo,
      updated_at: new Date().toISOString()
    }
    localStorage.setItem('user', JSON.stringify(updatedData))
    userData.value = updatedData
    
    alert('Cập nhật thông tin thành công!')
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    isUpdating.value = false
  }
}

// Handle password change
const handlePasswordChange = async (passwordData: { currentPassword: string; newPassword: string }) => {
  isUpdating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Đổi mật khẩu thành công!')
  } catch (error) {
    console.error('Password change failed:', error)
  } finally {
    isUpdating.value = false
  }
}

// Handle avatar upload
const uploadAvatar = () => {
  alert('Tính năng đang được phát triển')
}

// Load orders
const loadOrders = async () => {
  if (!userData.value?.id) return
  
  isLoadingOrders.value = true
  try {
    const result = await orderStore.getOrders()
    if (result?.success && result.data) {
      orders.value = Array.isArray(result.data) ? result.data : 
                    Array.isArray(result.data.data) ? result.data.data :
                    Array.isArray(result.data.orders) ? result.data.orders : []
    }
  } catch (error) {
    console.error('[Profile] Error loading orders:', error)
    orders.value = []
  } finally {
    isLoadingOrders.value = false
  }
}

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'orders') {
    loadOrders()
  }
})

// Check URL params for active tab
onMounted(() => {
  const tab = route.query.tab
  if (typeof tab === 'string') {
    activeTab.value = tab
  }
})

// Update the handleCancelOrder function
const handleCancelOrder = async (orderId: number) => {
  try {
    const result = await orderStore.cancelOrder(orderId)
    console.log(orderStore.cancelOrder(orderId) )
    if (result.success) {
      // Reload orders to get fresh data
      await loadOrders()
      alert('Đã hủy đơn hàng thành công')
    } else {
      throw new Error(result.error || 'Không thể hủy đơn hàng')
    }
  } catch (error) {
    console.error('[Profile] Error cancelling order:', error)
    alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.')
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 5rem 1.5rem;
  background: #f5f5f5;
}

.profile-box {
  padding: 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(50, 115, 220, 0.1);
}

.profile-content {
  padding: 1rem 0;
}
</style> 