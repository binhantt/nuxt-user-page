<template>
  <nav class="navbar is-fixed-top" style="background-color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div class="container">
      <div class="navbar-brand">
        <NuxtLink class="navbar-item has-text-primary" to="/">
          <span class="has-text-weight-bold is-size-4">TEMPLATESHOP</span>
        </NuxtLink>

        <a role="button" class="navbar-burger has-text-dark" aria-label="menu" aria-expanded="false" @click="isMenuActive = !isMenuActive">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <div class="navbar-start">
          <NuxtLink class="navbar-item has-text-dark" to="/">
            Trang Chủ
          </NuxtLink>
          
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link has-text-dark">
              Danh Mục
            </a>
            <div class="navbar-dropdown">
              <NuxtLink 
                v-for="category in categories.data" 
                :key="category.id"
                :to="`/search/${category.name}`"
                class="navbar-item has-text-dark"
              >
                <figure class="image is-24x24 mr-2" v-if="category.image">
                  <img :src="category.image" :alt="category.name">
                </figure>
                <span>{{ category.name }}</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink class="navbar-item has-text-dark" to="/blog">
            Blog
          </NuxtLink>

          <NuxtLink class="navbar-item has-text-dark" to="/guide">
            Hướng Dẫn
          </NuxtLink>

          <NuxtLink class="navbar-item has-text-dark" to="/cart">
            Giỏ Hàng
          </NuxtLink>

          <NuxtLink class="navbar-item has-text-dark" to="/payment">
            Thanh Toán
          </NuxtLink>

          <NuxtLink class="navbar-item has-text-dark" to="/account">
            Tài Khoản
          </NuxtLink>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <form @submit.prevent="handleSearch" class="field has-addons">
              <div class="control">
                <input 
                  v-model="searchQuery" 
                  class="input" 
                  type="text" 
                  placeholder="Tìm kiếm..."
                >
              </div>
              <div class="control">
                <button type="submit" class="button is-warning">
                  <span class="icon">
                    <i class="fas fa-search"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>

          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-warning">
                <span>0VNĐ</span>
                <span class="icon">
                  <i class="fas fa-shopping-cart"></i>
                </span>
              </a>
            </div>
          </div>

          <div class="navbar-item">
            <div class="buttons" v-if="!authStore.isLoggedIn">
              <NuxtLink to="/account" class="button is-warning">
                <strong>Đăng Nhập</strong>
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
                <a class="navbar-item has-text-warning" @click="handleLogout" :class="{ 'is-loading': isLoading }">
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
  border-bottom: 1px solid #f5f5f5;
}

.navbar-item {
  color: #363636;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar-item:hover {
  color: #3273dc !important;
  background-color: transparent !important;
}

.navbar-dropdown {
  border-top: 2px solid #3273dc;
  background-color: white;
  box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
}

.navbar-dropdown .navbar-item {
  color: #363636;
}

.navbar-link {
  color: #363636 !important;
}

.navbar-link:not(.is-arrowless)::after {
  border-color: #363636 !important;
}

.navbar-burger span {
  background-color: #363636;
}

.navbar-divider {
  background-color: #f5f5f5;
}

.input {
  border-radius: 4px 0 0 4px;
  border: 1px solid #f5f5f5;
  background-color: white;
  transition: all 0.3s ease;
}

.input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 1px rgba(50, 115, 220, 0.2);
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
  border: none;
  transition: all 0.3s ease;
}

.button.is-warning:hover {
  background-color: #ffed4a;
  transform: translateY(-1px);
}

.has-text-warning {
  color: #ffd700 !important;
}

.has-text-primary {
  color: #3273dc !important;
}

.navbar-dropdown .icon {
  color: #3273dc;
}

@media screen and (max-width: 1023px) {
  .navbar-menu {
    background-color: white;
    box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
  }
  
  .navbar-menu.is-active {
    animation: slideDown 0.3s ease;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 