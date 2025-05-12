<template>
  <div class="profile-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-10">
          <div v-if="userData" class="profile-container">
            <!-- Profile Header with Cover Image -->
            <div class="profile-cover">
              <div class="profile-header-content">
                <div class="avatar-container">
                  <figure class="image is-128x128">
                    <img
                      class="is-rounded avatar-image"
                      src="https://bulma.io/images/placeholders/128x128.png"
                      alt="Avatar"
                    >
                    <div v-if="isOwnProfile" class="avatar-overlay" @click="uploadAvatar">
                      <span class="icon">
                        <i class="fas fa-camera"></i>
                      </span>
                    </div>
                  </figure>
                </div>
                <div class="profile-info">
                  <h1 class="title is-2 has-text-white">{{ userData.name }}</h1>
                  <p class="subtitle is-5 has-text-white-bis">@{{ route.params.name }}</p>
                  <p class="joined-date has-text-white-ter">
                    <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                    Tham gia từ: {{ formatDate(userData.created_at) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Profile Navigation -->
            <div class="profile-nav">
              <div class="tabs is-centered is-boxed">
                <ul>
                  <li :class="{ 'is-active': activeTab === 'info' }">
                    <a @click="activeTab = 'info'" class="tab-link">
                      <span class="icon"><i class="fas fa-user"></i></span>
                      <span>Thông Tin</span>
                    </a>
                  </li>
                  <li v-if="isOwnProfile" :class="{ 'is-active': activeTab === 'orders' }">
                    <a @click="activeTab = 'orders'" class="tab-link">
                      <span class="icon"><i class="fas fa-shopping-bag"></i></span>
                      <span>Đơn Hàng</span>
                    </a>
                  </li>
                  <li v-if="isOwnProfile" :class="{ 'is-active': activeTab === 'security' }">
                    <a @click="activeTab = 'security'" class="tab-link">
                      <span class="icon"><i class="fas fa-shield-alt"></i></span>
                      <span>Bảo Mật</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Profile Content -->
            <div class="profile-content">
              <!-- Info Tab -->
              <div v-if="activeTab === 'info'" class="tab-content">
                <div class="card content-card">
                  <div class="card-content">
                    <form v-if="isOwnProfile" @submit.prevent="handleUpdateProfile" class="profile-form">
                      <div class="field">
                        <label class="label">Họ và Tên</label>
                        <div class="control has-icons-left">
                          <input
                            class="input is-medium"
                            type="text"
                            v-model="editForm.name"
                            placeholder="Họ và tên"
                          >
                          <span class="icon is-left">
                            <i class="fas fa-user"></i>
                          </span>
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Số Điện Thoại</label>
                        <div class="control has-icons-left">
                          <input
                            class="input is-medium"
                            type="tel"
                            v-model="editForm.phone"
                            placeholder="Số điện thoại"
                          >
                          <span class="icon is-left">
                            <i class="fas fa-phone"></i>
                          </span>
                        </div>
                      </div>
                      <div class="field">
                        <label class="label">Địa Chỉ</label>
                        <div class="control has-icons-left">
                          <textarea
                            class="textarea"
                            v-model="editForm.address"
                            placeholder="Địa chỉ"
                          ></textarea>
                          <span class="icon is-left">
                            <i class="fas fa-map-marker-alt"></i>
                          </span>
                        </div>
                      </div>
                      <div class="field">
                        <div class="control">
                          <button
                            class="button is-primary is-medium is-fullwidth"
                            :class="{ 'is-loading': isUpdating }"
                            type="submit"
                          >
                            <span class="icon">
                              <i class="fas fa-save"></i>
                            </span>
                            <span>Cập Nhật Thông Tin</span>
                          </button>
                        </div>
                      </div>
                    </form>
                    <div v-else class="user-info">
                      <div class="info-card">
                        <div class="info-item">
                          <span class="icon has-text-primary">
                            <i class="fas fa-user"></i>
                          </span>
                          <div class="info-content">
                            <strong>Họ và Tên</strong>
                            <p>{{ userData.name }}</p>
                          </div>
                        </div>
                        <div class="info-item">
                          <span class="icon has-text-primary">
                            <i class="fas fa-envelope"></i>
                          </span>
                          <div class="info-content">
                            <strong>Email</strong>
                            <p>{{ userData.email }}</p>
                          </div>
                        </div>
                        <div v-if="userData.phone" class="info-item">
                          <span class="icon has-text-primary">
                            <i class="fas fa-phone"></i>
                          </span>
                          <div class="info-content">
                            <strong>Số Điện Thoại</strong>
                            <p>{{ userData.phone }}</p>
                          </div>
                        </div>
                        <div v-if="userData.address" class="info-item">
                          <span class="icon has-text-primary">
                            <i class="fas fa-map-marker-alt"></i>
                          </span>
                          <div class="info-content">
                            <strong>Địa Chỉ</strong>
                            <p>{{ userData.address }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Orders Tab -->
              <div v-if="activeTab === 'orders'" class="tab-content">
                <div class="card content-card">
                  <div class="card-content has-text-centered">
                    <span class="icon is-large has-text-warning">
                      <i class="fas fa-tools fa-3x"></i>
                    </span>
                    <p class="title is-4 mt-4">Đang Phát Triển</p>
                    <p class="subtitle is-6">Tính năng này sẽ sớm được ra mắt</p>
                  </div>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-if="activeTab === 'security'" class="tab-content">
                <div class="card content-card">
                  <div class="card-content">
                    <form @submit.prevent="handlePasswordChange" class="security-form">
                      <div class="field">
                        <label class="label">Mật Khẩu Hiện Tại</label>
                        <div class="control has-icons-left">
                          <input
                            class="input is-medium"
                            type="password"
                            v-model="passwordForm.current"
                            required
                          >
                          <span class="icon is-left">
                            <i class="fas fa-lock"></i>
                          </span>
                        </div>
                      </div>

                      <div class="field">
                        <label class="label">Mật Khẩu Mới</label>
                        <div class="control has-icons-left">
                          <input
                            class="input is-medium"
                            type="password"
                            v-model="passwordForm.new"
                            required
                            minlength="8"
                          >
                          <span class="icon is-left">
                            <i class="fas fa-key"></i>
                          </span>
                        </div>
                      </div>

                      <div class="field">
                        <label class="label">Xác Nhận Mật Khẩu Mới</label>
                        <div class="control has-icons-left">
                          <input
                            class="input is-medium"
                            type="password"
                            v-model="passwordForm.confirm"
                            required
                          >
                          <span class="icon is-left">
                            <i class="fas fa-check-circle"></i>
                          </span>
                        </div>
                      </div>

                      <div class="field">
                        <div class="control">
                          <button
                            class="button is-primary is-medium is-fullwidth"
                            :class="{ 'is-loading': isUpdating }"
                            type="submit"
                          >
                            <span class="icon">
                              <i class="fas fa-shield-alt"></i>
                            </span>
                            <span>Cập Nhật Mật Khẩu</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-else-if="isUpdating" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-3x"></i>
            </span>
          </div>

          <!-- Not Found State -->
          <div v-else class="notification is-danger is-light">
            <div class="has-text-centered">
              <span class="icon is-large">
                <i class="fas fa-user-times fa-3x"></i>
              </span>
              <p class="title is-4 mt-4">Không Tìm Thấy</p>
              <p class="subtitle is-6">Người dùng không tồn tại hoặc đã bị xóa</p>
            </div>
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
  background: #f5f5f5;
  padding-bottom: 3rem;
}

.profile-container {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.profile-cover {
  background: linear-gradient(135deg, #3273dc, #209cee);
  height: 300px;
  position: relative;
  padding: 2rem;
  display: flex;
  align-items: flex-end;
}

.profile-header-content {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.avatar-container {
  position: relative;
  margin-bottom: -2rem;
}

.avatar-image {
  border: 4px solid white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.avatar-overlay:hover {
  opacity: 1;
}

.avatar-overlay .icon {
  color: white;
  font-size: 2rem;
}

.profile-info {
  padding-bottom: 2rem;
}

.profile-nav {
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.tabs.is-boxed li.is-active .tab-link {
  background-color: #3273dc;
  border-color: #3273dc;
  color: white;
}

.tab-link {
  transition: all 0.3s ease;
}

.tab-link:hover {
  background-color: #f5f5f5;
}

.profile-content {
  padding: 2rem;
}

.content-card {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.info-card {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-content {
  flex-grow: 1;
}

.info-content strong {
  display: block;
  color: #363636;
  margin-bottom: 0.5rem;
}

.info-content p {
  color: #4a4a4a;
  margin: 0;
}

.profile-form .field,
.security-form .field {
  margin-bottom: 1.5rem;
}

.button.is-primary {
  background-color: #3273dc;
  transition: all 0.3s ease;
}

.button.is-primary:hover {
  background-color: #2366d1;
  transform: translateY(-2px);
}

.notification.is-danger.is-light {
  background-color: #feecf0;
  color: #cc0f35;
}

@media screen and (max-width: 768px) {
  .profile-cover {
    height: auto;
    padding: 1rem;
  }

  .profile-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar-container {
    margin-bottom: 1rem;
  }

  .profile-info {
    padding-bottom: 1rem;
  }

  .profile-content {
    padding: 1rem;
  }
}
</style> 