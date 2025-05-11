<template>
  <nav class="navbar is-fixed-top" style="background-color: rgb(127, 236, 255);">
    <div class="container">
      <div class="navbar-brand">
        <NuxtLink class="navbar-item" to="/">
          <span class="has-text-weight-bold is-size-4">TEMPLATESHOP</span>
        </NuxtLink>

        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="isMenuActive = !isMenuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <div class="navbar-start">
          <NuxtLink class="navbar-item" to="/">
            Trang Chủ
          </NuxtLink>
          
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              Danh Mục
            </a>
            <div class="navbar-dropdown">
              <NuxtLink 
                v-for="category in categories.data" 
                :key="category.id"
                :to="`/category/${category.id}`"
                class="navbar-item"
              >
                <figure class="image is-24x24 mr-2" v-if="category.image">
                  <img :src="category.image" :alt="category.name">
                </figure>
                <span>{{ category.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink class="navbar-item" to="/blog">
            Blog
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/guide">
            Hướng Dẫn
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/cart">
            Giỏ Hàng
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/payment">
            Thanh Toán
          </NuxtLink>

          <NuxtLink class="navbar-item" to="/account">
            Tài Khoản
          </NuxtLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="field has-addons">
              <div class="control">
                <input class="input" type="text" placeholder="Tìm kiếm...">
              </div>
              <div class="control">
                <a class="button is-info">
                  <span class="icon">
                    <i class="fas fa-search"></i>
                  </span>
                </a>
              </div>
            </div>
          </div>

          <div class="navbar-item">
            <div class="buttons">
              <a class="button">
                <span>0VNĐ</span>
                <span class="icon">
                  <i class="fas fa-shopping-cart"></i>
                </span>
              </a>
            </div>
          </div>

          <div class="navbar-item">
            <div class="buttons" v-if="!authStore.isLoggedIn">
              <NuxtLink to="/account" class="button is-primary">
                <strong>Đăng Nhập</strong>
              </NuxtLink>
              <NuxtLink to="/register" class="button is-light">
                Đăng Ký
              </NuxtLink>
            </div>
            <div class="navbar-item has-dropdown is-hoverable" v-else>
              <a class="navbar-link">
                <span class="icon">
                  <i class="fas fa-user"></i>
                </span>
                <span>{{ storedUser?.name || 'Tài khoản' }}</span>
              </a>
              <div class="navbar-dropdown is-right">
                <NuxtLink 
                  v-if="storedUser?.name"
                  :to="`/trang_ca_nhan/${storedUser.name}`" 
                  class="navbar-item"
                >
                  <span class="icon">
                    <i class="fas fa-user-circle"></i>
                  </span>
                  <span>Thông tin tài khoản</span>
                </NuxtLink>
                <NuxtLink to="/orders" class="navbar-item">
                  <span class="icon">
                    <i class="fas fa-shopping-bag"></i>
                  </span>
                  <span>Đơn hàng của tôi</span>
                </NuxtLink>
                <hr class="navbar-divider">
                <div class="navbar-item">
                  <span class="icon">
                    <i class="fas fa-wallet"></i>
                  </span>
                  <span>Số dư: {{ storedUser?.balance || '0' }}đ</span>
                </div>
                <hr class="navbar-divider">
                <a class="navbar-item has-text-danger" @click="handleLogout" :class="{ 'is-loading': isLoading }">
                  <span class="icon">
                    <i class="fas fa-sign-out-alt"></i>
                  </span>
                  <span>Đăng xuất</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isMenuActive = ref(false)
const categoryStore = useCategoryStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const isLoading = ref(false)

const { categories } = storeToRefs(categoryStore)

// Get stored user data
const storedUser = ref(null)

// Function to get user data from localStorage and parse it
const initializeUserData = () => {
  try {
    const userData = localStorage.getItem('user')
    if (userData) {
      storedUser.value = JSON.parse(userData)
      console.log('[Navbar] Stored user data:', storedUser.value)
    }
  } catch (error) {
    console.error('[Navbar] Error parsing stored user data:', error)
  }
}

const handleLogout = async () => {
  try {
    isLoading.value = true
    await authStore.logout()
    userStore.clearProfile()
    localStorage.removeItem('user')
    storedUser.value = null
    console.log('[Navbar] Logout successful')
    await navigateTo('/account')
  } catch (error) {
    console.error('[Navbar] Logout error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  console.log('[Navbar] Component mounted')
  await categoryStore.fetchCategories()
  
  // Initialize auth state and get user data
  authStore.initializeAuth()
  initializeUserData()
  
  // Log the current state
  console.log('[Navbar] Auth state:', {
    isLoggedIn: authStore.isLoggedIn,
    storedUser: storedUser.value
  })
})

// Watch for changes in localStorage and auth state
watch(
  [() => localStorage.getItem('user'), () => authStore.isLoggedIn],
  ([newData, isLoggedIn]) => {
    console.log('[Navbar] State change:', { newData: !!newData, isLoggedIn })
    
    if (newData && isLoggedIn) {
      try {
        storedUser.value = JSON.parse(newData)
        console.log('[Navbar] User data updated:', storedUser.value)
      } catch (error) {
        console.error('[Navbar] Error parsing user data:', error)
      }
    } else {
      storedUser.value = null
      console.log('[Navbar] User data cleared')
    }
  }
)
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.navbar-item {
  color: #363636;
  font-weight: 500;
}

.navbar-item:hover {
  color: #3273dc;
}

.navbar-dropdown {
  border-top: 2px solid #3273dc;
}

.navbar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-dropdown .navbar-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.navbar-dropdown .icon {
  width: 1.5rem;
}

.has-text-danger {
  color: #ff3860;
}

.input {
  border-radius: 4px 0 0 4px;
}

.button.is-info {
  border-radius: 0 4px 4px 0;
}
</style> 