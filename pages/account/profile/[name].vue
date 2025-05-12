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
                <button v-if="isOwnProfile" class="button is-small is-warning" @click="uploadAvatar">
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
                        class="button is-warning"
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
                <!-- Loading State -->
                <div v-if="isLoadingOrders" class="has-text-centered py-6">
                  <span class="icon is-large">
                    <i class="fas fa-spinner fa-pulse fa-3x"></i>
                  </span>
                </div>

                <!-- No Orders -->
                <div v-else-if="!orders.length" class="notification is-light">
                  <div class="has-text-centered">
                    <span class="icon is-large">
                      <i class="fas fa-shopping-bag fa-3x"></i>
                    </span>
                    <p class="title is-4 mt-4">Chưa có đơn hàng nào</p>
                    <p class="subtitle is-6">Hãy mua sắm để có đơn hàng đầu tiên</p>
                    <NuxtLink to="/" class="button is-primary mt-2">
                      Mua sắm ngay
                    </NuxtLink>
                  </div>
                </div>

                <!-- Orders List -->
                <div v-else class="orders-list">
                  <div v-for="order in orders" :key="order.id" class="card mb-4">
                    <header class="card-header">
                      <p class="card-header-title">
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fas fa-shopping-bag"></i>
                          </span>
                          <span>Đơn hàng #{{ order.id }}</span>
                        </span>
                      </p>
                      <div class="card-header-icon">
                        <span class="tag" :class="getOrderStatus(order.status).class">
                          {{ getOrderStatus(order.status).text }}
                        </span>
                      </div>
                    </header>

                    <div class="card-content">
                      <!-- Order Info -->
                      <div class="order-info mb-4">
                        <div class="columns is-multiline">
                          <div class="column is-6">
                            <p><strong>Ngày đặt:</strong> {{ formatDate(order.created_at) }}</p>
                          </div>
                          <div class="column is-6">
                            <p><strong>Tổng tiền:</strong> {{ formatPrice(order.total_amount) }}đ</p>
                          </div>
                          <div class="column is-12">
                            <p><strong>Địa chỉ giao hàng:</strong> {{ order.shipping_address }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Order Items -->
                      <div class="order-items">
                        <div v-for="item in order.items" :key="item.product_id" class="columns is-mobile is-vcentered mb-2">
                          <div class="column is-2">
                            <figure class="image is-64x64">
                              <img :src="item.main_image_url" :alt="item.product_name">
                            </figure>
                          </div>
                          <div class="column">
                            <p class="has-text-weight-medium">{{ item.product_name }}</p>
                            <p class="has-text-grey">
                              {{ formatPrice(item.price) }}đ x {{ item.quantity }}
                            </p>
                          </div>
                          <div class="column is-3 has-text-right">
                            <p class="has-text-weight-bold">
                              {{ formatPrice(Number(item.price) * item.quantity) }}đ
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <footer class="card-footer">
                      <a class="card-footer-item">
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fas fa-eye"></i>
                          </span>
                          <span>Chi tiết</span>
                        </span>
                      </a>
                      <a v-if="order.status === 'pending'" class="card-footer-item has-text-danger" @click="orderStore.cancelOrder(order.id)">
                        <span class="icon-text">
                          <span class="icon">
                            <i class="fas fa-times"></i>
                          </span>
                          <span>Hủy đơn</span>
                        </span>
                      </a>
                    </footer>
                  </div>
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
                        class="button is-warning"
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

interface OrderItem {
  product_id: number
  product_name: string
  quantity: number
  price: string | number
  main_image_url: string
}

interface Order {
  id: number
  user_id: number
  total_amount: string | number
  status: string
  shipping_address: string
  created_at: string
  user_name: string
  user_email: string
  items: OrderItem[]
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const orderStore = useOrderStore()

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

const orders = ref<Order[]>([])
const isLoadingOrders = ref(false)

// Format price helper
const formatPrice = (price: string | number) => {
  return new Intl.NumberFormat('vi-VN').format(Number(price))
}

// Get order status text and color
const getOrderStatus = (status: string) => {
  const statusMap = {
    'pending': { text: 'Chờ xử lý', class: 'is-warning' },
    'processing': { text: 'Đang xử lý', class: 'is-info' },
    'shipping': { text: 'Đang giao', class: 'is-primary' },
    'completed': { text: 'Hoàn thành', class: 'is-success' },
    'cancelled': { text: 'Đã hủy', class: 'is-danger' }
  } as const

  return statusMap[status as keyof typeof statusMap] || { text: status, class: 'is-light' }
}

// Load orders
const loadOrders = async () => {
  if (!userData.value?.id) return
  
  isLoadingOrders.value = true
  try {
    const result = await orderStore.getOrders()
    console.log('Raw API Response:', result)

    // Kiểm tra response
    if (!result) {
      console.error('No response from API')
      orders.value = []
      return
    }

    // Kiểm tra success
    if (!result.success) {
      console.error('API request failed:', result.error || 'Unknown error')
      orders.value = []
      return
    }

    // Xử lý data lồng nhau
    let orderData: Order[] = []
    
    // Trường hợp 1: result.data là mảng trực tiếp
    if (Array.isArray(result.data)) {
      orderData = result.data
    }
    // Trường hợp 2: result.data.data là mảng
    else if (result.data?.data && Array.isArray(result.data.data)) {
      orderData = result.data.data
    }
    // Trường hợp 3: result.data có thuộc tính orders là mảng
    else if (result.data?.orders && Array.isArray(result.data.orders)) {
      orderData = result.data.orders
    }
    // Log để debug
    console.log('Extracted orderData:', orderData)

    // Kiểm tra và xử lý dữ liệu
    if (orderData && orderData.length > 0) {
      console.log('Processed Orders:', {
        total: orderData.length,
        orders: orderData.map((order: Order) => ({
          id: order.id,
          user: order.user_name,
          email: order.user_email,
          date: new Date(order.created_at).toLocaleString('vi-VN'),
          total: formatPrice(order.total_amount) + 'đ',
          status: getOrderStatus(order.status).text,
          items: Array.isArray(order.items) ? order.items.map(item => ({
            name: item.product_name,
            quantity: item.quantity,
            price: formatPrice(item.price) + 'đ',
            total: formatPrice(Number(item.price) * item.quantity) + 'đ'
          })) : []
        }))
      })
      orders.value = orderData
    } else {
      console.log('No orders found in response')
      orders.value = []
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
  color: #3273dc;
  font-size: 0.9rem;
}

.tab-content {
  padding: 1rem 0;
}

.order-card {
  border: 1px solid #f5f5f5;
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
  background-color: #3273dc;
  color: white;
}

.total {
  font-weight: bold;
  color: #3273dc;
}

.user-info .info-item {
  margin-bottom: 1rem;
}

.user-info .info-item strong {
  display: inline-block;
  width: 120px;
  color: #3273dc;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #ffed4a;
}

.notification.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.orders-list .card {
  transition: transform 0.2s ease;
}

.orders-list .card:hover {
  transform: translateY(-2px);
}

.order-items {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
}

.order-items .image {
  border-radius: 0.25rem;
  overflow: hidden;
}

.order-items .columns {
  margin-bottom: 0.5rem;
}

.order-items .columns:last-child {
  margin-bottom: 0;
}

.card-footer-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.card-footer-item:hover {
  background-color: #f5f5f5;
}

.card-footer-item.has-text-danger:hover {
  background-color: #feecf0;
}
</style> 