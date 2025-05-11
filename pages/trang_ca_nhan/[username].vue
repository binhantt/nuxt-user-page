<template>
  <div class="profile-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8">
          <div v-if="!isLoading && user" class="box profile-box">
            <!-- Profile Header -->
            <div class="profile-header">
              <div class="avatar-wrapper">
                <figure class="image is-128x128">
                  <img
                    class="is-rounded"
                    :src="user.avatar || 'https://bulma.io/images/placeholders/128x128.png'"
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
                <h1 class="title is-3">{{ user.fullName }}</h1>
                <p class="subtitle is-5">@{{ route.params.username }}</p>
                <p class="joined-date">
                  Tham gia từ: {{ formatDate(user.joinedDate) }}
                </p>
              </div>
            </div>

            <!-- Profile Tabs - Only show all tabs for own profile -->
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
                <form v-if="isOwnProfile" @submit.prevent="updateProfile">
                  <div class="field">
                    <label class="label">Họ và Tên</label>
                    <div class="control">
                      <input
                        class="input"
                        type="text"
                        v-model="user.fullName"
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
                        v-model="user.phone"
                        placeholder="Số điện thoại"
                      >
                    </div>
                  </div>

                  <div class="field">
                    <label class="label">Địa Chỉ</label>
                    <div class="control">
                      <textarea
                        class="textarea"
                        v-model="user.address"
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
                    <span>{{ user.fullName }}</span>
                  </div>
                  <div class="info-item">
                    <strong>Email:</strong>
                    <span>{{ user.email }}</span>
                  </div>
                </div>
              </div>

              <!-- Orders Tab - Only for own profile -->
              <div v-if="isOwnProfile && activeTab === 'orders'" class="tab-content">
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

              <!-- Security Tab - Only for own profile -->
              <div v-if="isOwnProfile && activeTab === 'security'" class="tab-content">
                <form @submit.prevent="changePassword">
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
          <!-- Loading and Error States -->
          <div v-else-if="isLoading" class="has-text-centered py-6">
            <span class="icon is-large">
              <i class="fas fa-spinner fa-pulse fa-2x"></i>
            </span>
          </div>
          <div v-else class="notification is-danger">
            Không tìm thấy người dùng
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const isLoading = ref(true)
const isUpdating = ref(false)
const activeTab = ref('info')

// Simulated user data - In real app, fetch from API based on username
const user = ref(null)
const currentUser = ref({
  username: 'nguyenvana',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com'
})

// Check if viewing own profile
const isOwnProfile = computed(() => {
  return currentUser.value.username === route.params.username
})

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
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

// Simulate fetching user data
const fetchUserData = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simulate API response
    if (route.params.username === 'nguyenvana') {
      user.value = {
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
        avatar: null,
        joinedDate: new Date('2024-01-01')
      }
    } else {
      user.value = null
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
    user.value = null
  } finally {
    isLoading.value = false
  }
}

// Handle profile update
const updateProfile = async () => {
  isUpdating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Cập nhật thông tin thành công!')
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    isUpdating.value = false
  }
}

// Handle password change
const changePassword = async () => {
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

// Fetch user data when route changes
watch(() => route.params.username, fetchUserData, { immediate: true })
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