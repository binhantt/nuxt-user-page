<template>
  <div class="section profile-section">
    <div class="container">
      <div class="columns">
        <!-- Profile Sidebar -->
        <div class="column is-3">
          <ProfileSidebar :user="user" />
        </div>

        <!-- Main Content -->
        <div class="column is-9">
          <div class="card">
            <div class="card-content">
              <div class="tabs">
                <ul>
                  <li :class="{ 'is-active': activeTab === 'info' }">
                    <a @click="activeTab = 'info'">Thông tin cá nhân</a>
                  </li>
                  <li :class="{ 'is-active': activeTab === 'orders' }">
                    <a @click="activeTab = 'orders'">Đơn hàng</a>
                  </li>
                  <li :class="{ 'is-active': activeTab === 'security' }">
                    <a @click="activeTab = 'security'">Bảo mật</a>
                  </li>
                </ul>
              </div>

              <!-- Tab Content -->
              <div class="tab-content">
                <ProfileInfo 
                  v-if="activeTab === 'info'" 
                  :user="user"
                  @update="updateUserInfo" 
                />
                <ProfileOrders 
                  v-if="activeTab === 'orders'" 
                  :orders="orders" 
                />
                <ProfileSecurity 
                  v-if="activeTab === 'security'" 
                  :user="user"
                  @update-password="updatePassword" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-nuxt'
import ProfileSidebar from '~/components/profile/ProfileSidebar.vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProfileOrders from '~/components/profile/ProfileOrders.vue'
import ProfileSecurity from '~/components/profile/ProfileSecurity.vue'

const route = useRoute()
const activeTab = ref('info')

// Mock user data - Replace with actual API call
const user = ref({
  id: 1,
  name: 'Nguyễn Văn A',
  email: 'nguyenvana@example.com',
  avatar: 'https://i.pravatar.cc/150',
  phone: '0123456789',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  created_at: '2024-01-01'
})

// Mock orders data - Replace with actual API call
const orders = ref([
  {
    id: 1,
    order_number: 'ORD001',
    date: '2024-03-15',
    total: 2500000,
    status: 'completed',
    items: [
      {
        id: 1,
        name: 'iPhone 15 Pro Max',
        quantity: 1,
        price: 2500000
      }
    ]
  }
])

// Methods
const updateUserInfo = async (updatedInfo) => {
  try {
    // API call to update user info
    user.value = { ...user.value, ...updatedInfo }
    // Show success message
  } catch (error) {
    console.error('Error updating user info:', error)
    // Show error message
  }
}

const updatePassword = async (passwordData) => {
  try {
    // API call to update password
    // Show success message
  } catch (error) {
    console.error('Error updating password:', error)
    // Show error message
  }
}

onMounted(async () => {
  // Fetch user data and orders
})
</script>

<style scoped>
.profile-section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 3rem 1.5rem;
}

.tab-content {
  padding-top: 2rem;
}

.tabs ul {
  border-bottom-color: #dbdbdb;
}

.tabs li.is-active a {
  border-bottom-color: #3273dc;
  color: #3273dc;
}
</style> 