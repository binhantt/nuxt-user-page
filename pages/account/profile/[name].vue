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
import { useChangeInfoStore } from '~/stores/changInforStore'
import { useChangePasswordStore } from '~/stores/changPasswordStore'
import { API_ENDPOINTS } from '~/config/Api'
import type { UserData, Order } from '~/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()
const changeInfoStore = useChangeInfoStore()
const changePasswordStore = useChangePasswordStore()

const isUpdating = ref(false)
const activeTab = ref('info')
const userData = ref<UserData | null>(null)
const orders = ref<Order[]>([])
const isLoadingOrders = ref(false)

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Define emits with the correct type
const emit = defineEmits<{
  (e: 'update-password', data: PasswordChangeData): void
}>()

// Check if current user is viewing their own profile
const isOwnProfile = computed(() => {
  return authStore.isLoggedIn && userData.value?.name === route.params.name
})

// Initialize user data from localStorage and watch for changes
const initializeUserData = () => {
  try {
    const data = localStorage.getItem('user')
    if (data) {
      const parsedData = JSON.parse(data)
      userData.value = parsedData
      console.log('[Profile] User data initialized:', parsedData)
      return parsedData
    }
  } catch (error) {
    console.error('[Profile] Error parsing user data:', error)
  }
  return null
}

// Watch for changes in auth store user data
watch(() => authStore.getUserData, (newData) => {
  if (newData) {
    userData.value = newData
    console.log('[Profile] User data updated from auth store:', newData)
  }
}, { deep: true })

// Watch localStorage for changes
watch(
  () => localStorage.getItem('user'),
  (newData) => {
    if (newData) {
      try {
        const parsedData = JSON.parse(newData)
        userData.value = parsedData
        console.log('[Profile] User data updated from localStorage:', parsedData)
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
  if (!userData.value?.id) return
  
  isUpdating.value = true
  try {
    const result = await changeInfoStore.updateProfile(userData.value.id, updatedInfo)
    
    if (result.success) {
      // Updates will be handled automatically through watchers
      console.log('[Profile] Profile update successful')
      alert('Cập nhật thông tin thành công!')
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('[Profile] Update failed:', error)
    alert('Cập nhật thông tin thất bại. Vui lòng thử lại.')
  } finally {
    isUpdating.value = false
  }
}

// Handle password change
const handlePasswordChange = async (passwordData: PasswordChangeData) => {
  if (!userData.value?.id) return
  
  isUpdating.value = true
  try {
    const result = await changePasswordStore.updatePassword(userData.value.id, passwordData)
    
    if (result.success) {
      console.log('[Profile] Password update successful')
      alert('Đổi mật khẩu thành công!')
    } else {
      if (result.validationErrors) {
        // Display validation errors
        const errorMessage = result.validationErrors.join('\n')
        alert(errorMessage)
      } else {
        throw new Error(result.error)
      }
    }
  } catch (error) {
    console.error('[Profile] Password update failed:', error)
    alert('Đổi mật khẩu thất bại. Vui lòng thử lại.')
  } finally {
    isUpdating.value = false
  }
}

// Handle avatar upload
const uploadAvatar = () => {
  alert('Tính năng đang được phát triển')
}

// Handle order cancellation
const handleCancelOrder = async (orderId: number) => {
  try {
    const result = await orderStore.cancelOrder(orderId)
    if (result.success) {
      // Orders are already updated in the store
      console.log('[Profile] Order cancelled successfully:', orderId)
      // Update the local orders ref to trigger reactivity
      orders.value = [...orderStore.getAllOrders]
      alert('Đã hủy đơn hàng thành công')
    } else {
      throw new Error(result.error || 'Không thể hủy đơn hàng')
    }
  } catch (error) {
    console.error('[Profile] Error cancelling order:', error)
    alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.')
  }
}

// Load orders with reactive updates
const loadOrders = async () => {
  if (!userData.value?.id) return
  
  isLoadingOrders.value = true
  try {
    const result = await orderStore.getOrders()
    if (result?.success && result.data) {
      // Update local orders ref
      orders.value = Array.isArray(result.data) ? result.data : 
                    Array.isArray(result.data.data) ? result.data.data :
                    Array.isArray(result.data.orders) ? result.data.orders : []
      
      console.log('[Profile] Orders loaded:', orders.value.length)
    }
  } catch (error) {
    console.error('[Profile] Error loading orders:', error)
    orders.value = []
  } finally {
    isLoadingOrders.value = false
  }
}

// Watch for changes in the order store
watch(
  () => orderStore.getAllOrders,
  (newOrders) => {
    console.log('[Profile] Orders updated in store:', newOrders.length)
    orders.value = [...newOrders]
  },
  { deep: true }
)

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