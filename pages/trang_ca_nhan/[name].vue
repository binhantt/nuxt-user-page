<template>
  <div class="profile-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8">
          <div v-if="userData" class="box profile-box">
             <!-- Profile Header -->
            <div class="profile-header">
              <div class="avatar-wrapper">
                <figure class="image is-128x128">
                  <img
                    class="is-rounded"
                    src="https://bulma.io/images/placeholders/128x128.png"
                    alt="Avatar"
                  >
                </figure>
                <button v-if="isOwnProfile" class="button is-small is-primary" @click="uploadAvatar">
                  <span class="icon">
                    <i class="fas fa-camera"></i>
                  </span>
                  <span>Đổi ảnh</span>
                </button>
              </div>
              <div class="profile-info">
                <h1 class="title is-3">{{ userData.name }}</h1>
                <p class="subtitle is-5">@{{ route.params.name }}</p>
                <p class="joined-date">
                  Tham gia từ: {{ formatDate(userData.created_at) }}
                </p>
              </div>
            </div>

            <!-- Profile Tabs -->
            <div class="tabs is-boxed mb-5">
              <ul>
                <li :class="{ 'is-active': activeTab === 'info' }">
                  <a @click="activeTab = 'info'">
                    <span class="icon"><i class="fas fa-user"></i></span>
                    <span>Thông Tin</span>
                  </a>
                </li>
                <li v-if="isOwnProfile" :class="{ 'is-active': activeTab === 'orders' }">
                  <a @click="activeTab = 'orders'">
                    <span class="icon"><i class="fas fa-shopping-bag"></i></span>
                    <span>Đơn Hàng</span>
                  </a>
                </li>
                <li v-if="isOwnProfile" :class="{ 'is-active': activeTab === 'security' }">
                  <a @click="activeTab = 'security'">
                    <span class="icon"><i class="fas fa-shield-alt"></i></span>
                    <span>Bảo Mật</span>
                  </a>
                </li>
              </ul>
            </div>

            <!-- Profile Content -->
            <div class="profile-content">
              <!-- Info Tab -->
              <div v-if="activeTab === 'info'" class="tab-content">
                <form v-if="isOwnProfile" @submit.prevent="handleUpdateProfile">
                  <div class="field">
                    <label class="label">Họ và Tên</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        v-model="editForm.name"
                        placeholder="Họ và tên"
                      >
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Số Điện Thoại</label>
                    <div class="control">
                      <input
                        class="input"
                        type="tel"
                        v-model="editForm.phone"
                        placeholder="Số điện thoại"
                      >
                    </div>
                  </div>
                  <div class="field">
                    <label class="label">Địa Chỉ</label>
                    <div class="control">
                      <textarea
                        class="textarea"
                        v-model="editForm.address"
                        placeholder="Địa chỉ"
                      ></textarea>
                    </div>
                  </div>
                  <div class="field">
                    <div class="control">
                      <button
                        class="button is-primary"
                        :class="{ 'is-loading': isUpdating }"
                        type="submit"
                      >
                        Cập Nhật
                      </button>
                    </div>
                  </div>
                </form>
                <div v-else class="user-info">
                  <div class="info-item">
                    <strong>Họ và Tên:</strong>
                    <span>{{ userData.name }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Email:</strong>
                    <span>{{ userData.email }}</span>
                  </div>
                  <div v-if="userData.phone" class="info-item">
                    <strong>Số Điện Thoại:</strong>
                    <span>{{ userData.phone }}</span>
                  </div>
                  <div v-if="userData.address" class="info-item">
                    <strong>Địa Chỉ:</strong>
                    <span>{{ userData.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Orders Tab -->
              <div v-if="activeTab === 'orders'" class="tab-content">
                <div class="notification is-info">
                  Tính năng đang được phát triển
                </div>
              </div>

              <!-- Security Tab -->
              <div v-if="activeTab === 'security'" class="tab-content">
                <form @submit.prevent="handlePasswordChange">
                  <div class="field">
                    <label class="label">Mật Khẩu Hiện Tại</label>
                    <div class="control">
                      <input
                        class="input"
                        type="password"
                        v-model="passwordForm.current"
                        required
                      >
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Mật Khẩu Mới</label>
                    <div class="control">
                      <input
                        class="input"
                        type="password"
                        v-model="passwordForm.new"
                        required
                        minlength="8"
                      >
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Xác Nhận Mật Khẩu Mới</label>
                    <div class="control">
                      <input
                        class="input"
                        type="password"
                        v-model="passwordForm.confirm"
                        required
                      >
                    </div>
                  </div>

                  <div class="field">
                    <div class="control">
                      <button
                        class="button is-primary"
                        :class="{ 'is-loading': isUpdating }"
                        type="submit"
                      >
                        Đổi Mật Khẩu
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-else-if="isUpdating" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
          </div>

          <!-- Not Found State -->
          <div v-else class="notification is-danger">
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

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const isUpdating = ref(false)
const activeTab = ref('info')

// Store user data from localStorage
const userData = ref<UserData | null>(null)

// Get user data from localStorage
const initializeUserData = (): UserData | null => {
  try {
    const data = localStorage.getItem('user')
    if (data) {
      const parsedData = JSON.parse(data)
      userData.value = {
        id: parsedData.id,
        email: parsedData.email,
        name: parsedData.name,
        phone: parsedData.phone || '',
        address: parsedData.address || '',
        balance: parsedData.balance || '0.00',
        is_active: parsedData.is_active || 1,
        created_at: parsedData.created_at,
        updated_at: parsedData.updated_at
      }
      console.log('[Profile] User data:', userData.value)
      return userData.value
    }
  } catch (error) {
    console.error('[Profile] Error parsing user data:', error)
  }
  return null
}

// Form for editing profile
const editForm = reactive({
  name: '',
  phone: '',
  address: ''
})

// Initialize form with stored data first
onMounted(() => {
  const data = initializeUserData()
  if (data) {
    editForm.name = data.name || ''
    editForm.phone = data.phone || ''
    editForm.address = data.address || ''
    console.log('[Profile] Form initialized:', editForm)
  }
})

// Watch localStorage for changes
watch(
  () => localStorage.getItem('user'),
  (newData) => {
    if (newData) {
      try {
        const parsedData = JSON.parse(newData)
        userData.value = {
          id: parsedData.id,
          email: parsedData.email,
          name: parsedData.name,
          phone: parsedData.phone || '',
          address: parsedData.address || '',
          balance: parsedData.balance || '0.00',
          is_active: parsedData.is_active || 1,
          created_at: parsedData.created_at,
          updated_at: parsedData.updated_at
        }
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

// Check if current user is viewing their own profile
const isOwnProfile = computed(() => {
  return authStore.isLoggedIn && userData.value?.name === route.params.name
})

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
    await navigateTo(`/trang_ca_nhan/${data.name}`)
  }
})

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

// Handle profile update
const handleUpdateProfile = async () => {
  if (!userData.value) return
  
  isUpdating.value = true
  try {
    // Update local storage
    const updatedData = {
      ...userData.value,
      name: editForm.name,
      phone: editForm.phone,
      address: editForm.address,
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
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const handlePasswordChange = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  isUpdating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Đổi mật khẩu thành công!')
    passwordForm.value = { current: '', new: '', confirm: '' }
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
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 5rem 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-box {
  padding: 2rem;
}

.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  text-align: center;
}

.avatar-wrapper button {
  margin-top: 1rem;
}

.profile-info {
  flex-grow: 1;
}

.joined-date {
  color: #666;
  font-size: 0.9rem;
}

.tab-content {
  padding: 1rem 0;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.order-header {
  background: #f5f5f5;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-content {
  padding: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.order-footer {
  background: #f5f5f5;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag.is-success {
  background-color: #48c774;
  color: white;
}

.total {
  font-weight: bold;
}

.user-info .info-item {
  margin-bottom: 1rem;
}

.user-info .info-item strong {
  display: inline-block;
  width: 120px;
  color: #666;
}
</style> 