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
                {{ authStore.getUserData?.fullName || 'Tài khoản' }}
              </a>
              <div class="navbar-dropdown is-right">
                <NuxtLink 
                  v-if="authStore.getUserData?.name"
                  :to="`/trang_ca_nhan/${authStore.getUserData.name}`" 
                  class="navbar-item"
                >
                  <span class="icon">
                    <i class="fas fa-user"></i>
                  </span>
                  <span>Thông tin tài khoản</span>
                </NuxtLink>
                <a 
                  v-else 
                  class="navbar-item has-text-danger"
                  @click="handleProfileError"
                >
                  <span class="icon">
                    <i class="fas fa-exclamation-triangle"></i>
                  </span>
                  <span>Lỗi tải thông tin</span>
                </a>
                <NuxtLink to="/orders" class="navbar-item">
                  <span class="icon">
                    <i class="fas fa-shopping-bag"></i>
                  </span>
                  <span>Đơn hàng của tôi</span>
                </NuxtLink>
                <hr class="navbar-divider">
                <a class="navbar-item" @click="handleLogout">
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

const { categories } = storeToRefs(categoryStore)

const handleProfileError = () => {
  // Reload user profile data and update auth store
  userStore.fetchProfile().then(profileData => {
    if (profileData) {
      authStore.setUserData(profileData)
    }
  })
}

const handleLogout = async () => {
  await authStore.logout()
  userStore.clearProfile()
  navigateTo('/')
}

onMounted(async () => {
  categoryStore.fetchCategories()
  // Initialize auth state
  authStore.initializeAuth()
  
  // If authenticated but no user data, fetch profile
  if (authStore.isLoggedIn && !authStore.getUserData) {
    console.log('Fetching profile data...')
    const profileData = await userStore.fetchProfile()
    if (profileData) {
      authStore.setUserData(profileData)
    }
  }
})
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

.input {
  border-radius: 4px 0 0 4px;
}

.button.is-info {
  border-radius: 0 4px 4px 0;
}
</style> 