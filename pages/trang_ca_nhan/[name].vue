<template>
  <div class="profile-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8">
          <div v-if="!userStore.isLoading && userStore.viewedUser" class="box profile-box">
            <!-- Profile Header -->
            <div class="profile-header">
              <div class="avatar-wrapper">
                <figure class="image is-128x128">
                  <img
                    class="is-rounded"
                    :src="userStore.viewedUser.avatar || 'https://bulma.io/images/placeholders/128x128.png'"
                    alt="Avatar"
                  >
                </figure>
                <button v-if="userStore.isOwnProfile" class="button is-small is-primary" @click="uploadAvatar">
                  <span class="icon">
                    <i class="fas fa-camera"></i>
                  </span>
                  <span>Đổi ảnh</span>
                </button>
              </div>
              <div class="profile-info">
                <h1 class="title is-3">{{ userStore.viewedUser?.fullName }}</h1>
                <p class="subtitle is-5">@{{ route.params.name }}</p>
                <p class="joined-date">
                  Tham gia từ: {{ formatDate(userStore.viewedUser?.createdAt || '') }}
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
                <li v-if="userStore.isOwnProfile" :class="{ 'is-active': activeTab === 'orders' }">
                  <a @click="activeTab = 'orders'">
                    <span class="icon"><i class="fas fa-shopping-bag"></i></span>
                    <span>Đơn Hàng</span>
                  </a>
                </li>
                <li v-if="userStore.isOwnProfile" :class="{ 'is-active': activeTab === 'security' }">
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
                <form v-if="userStore.isOwnProfile" @submit.prevent="handleUpdateProfile">
                  <div class="field">
                    <label class="label">Họ và Tên</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        v-model="editForm.fullName"
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
                        v-model="editForm.phoneNumber"
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
                        Cập Nhật Thông Tin
                      </button>
                    </div>
                  </div>
                </form>
                <div v-else class="user-info">
                  <div class="info-item">
                    <strong>Họ và Tên:</strong>
                    <span>{{ userStore.viewedUser.fullName }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Email:</strong>
                    <span>{{ userStore.viewedUser.email }}</span>
                  </div>
                  <div v-if="userStore.viewedUser.phoneNumber" class="info-item">
                    <strong>Số Điện Thoại:</strong>
                    <span>{{ userStore.viewedUser.phoneNumber }}</span>
                  </div>
                  <div v-if="userStore.viewedUser.address" class="info-item">
                    <strong>Địa Chỉ:</strong>
                    <span>{{ userStore.viewedUser.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Orders Tab -->
              <div v-if="userStore.isOwnProfile && activeTab === 'orders'" class="tab-content">
                <div v-if="orders.length > 0">
                  <div class="order-card" v-for="order in orders" :key="order.id">
                    <div class="order-header">
                      <span class="order-id">#{{ order.id }}</span>
                      <span class="tag" :class="'is-' + order.status">
                        {{ order.statusText }}
                      </span>
                    </div>
                    <div class="order-content">
                      <div class="order-item" v-for="item in order.items" :key="item.id">
                        <img :src="item.image" :alt="item.name">
                        <div class="item-details">
                          <h4>{{ item.name }}</h4>
                          <p>{{ item.price }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="order-footer">
                      <p class="total">Tổng: {{ order.total }}</p>
                      <button class="button is-small is-primary">Chi Tiết</button>
                    </div>
                  </div>
                </div>
                <div v-else class="has-text-centered">
                  <p>Chưa có đơn hàng nào</p>
                </div>
              </div>

              <!-- Security Tab -->
              <div v-if="userStore.isOwnProfile && activeTab === 'security'" class="tab-content">
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
          <div v-else-if="userStore.isLoading" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
          </div>

          <!-- Error State -->
          <div v-else-if="userStore.getError" class="notification is-danger">
            {{ userStore.getError }}
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
import { useUserStore, useAuthStore } from '../stores'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const isUpdating = ref(false)
const activeTab = ref('info')

// Form for editing profile
const editForm = reactive({
  fullName: '',
  phoneNumber: '',
  address: ''
})

// Get stored user data
const storedUser = ref(null)
onMounted(() => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      storedUser.value = JSON.parse(userData)
      console.log('Stored user data:', storedUser.value)
    }
  } catch (error) {
    console.error('Error parsing stored user data:', error)
  }
})

// Initialize edit form when user data is loaded
watch(() => userStore.viewedUser, (newUser) => {
  if (newUser) {
    editForm.fullName = newUser.fullName
    editForm.phoneNumber = newUser.phoneNumber || ''
    editForm.address = newUser.address || ''
  }
}, { immediate: true })

// Simulated orders data
const orders = ref([
  {
    id: '1001',
    status: 'success',
    statusText: 'Hoàn thành',
    total: '299.000đ',
    items: [
      {
        id: 1,
        name: 'Template Shopee Basic',
        price: '299.000đ',
        image: 'https://img.freepik.com/free-vector/online-shopping-banner-mobile-app-templates-concept-flat-design_1150-34863.jpg'
      }
    ]
  }
])

// Password change form
const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

// Handle profile update
const handleUpdateProfile = async () => {
  isUpdating.value = true
  try {
    const success = await userStore.updateProfile({
      fullName: editForm.fullName,
      phoneNumber: editForm.phoneNumber,
      address: editForm.address
    })
    
    if (success) {
      alert('Cập nhật thông tin thành công!')
    }
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    isUpdating.value = false
  }
}

// Handle password change
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

// Load initial data
onMounted(async () => {
  const name = route.params.name
  if (!name || typeof name !== 'string') {
    console.error('Invalid name in route:', name)
    // If logged in, redirect to own profile
    const userData = authStore.getUserData
    if (authStore.isLoggedIn && userData?.name) {
      await navigateTo(`/trang_ca_nhan/${userData.name}`)
    } else {
      await navigateTo('/')
    }
    return
  }

  console.log('Fetching user data for name:', name)
  const userData = await userStore.fetchUserByUsername(name)
  if (!userData) {
    console.error('Failed to fetch user data for name:', name)
  }
})

// Watch for route changes
watch(() => route.params.name, async (newName) => {
  if (!newName || typeof newName !== 'string') {
    console.error('Invalid name in route:', newName)
    const userData = authStore.getUserData
    if (authStore.isLoggedIn && userData?.name) {
      await navigateTo(`/trang_ca_nhan/${userData.name}`)
    } else {
      await navigateTo('/')
    }
    return
  }

  console.log('Route name changed to:', newName)
  await userStore.fetchUserByUsername(newName)
})

// Clean up when component unmounts
onUnmounted(() => {
  userStore.clearProfile()
})
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