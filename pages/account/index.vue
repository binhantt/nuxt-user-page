<template>
  <div class="login-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop">
          <div class="box">
            <h1 class="title has-text-centered">Đăng Nhập</h1>
            
            <!-- Error Message -->
            <div v-if="authStore.getError" class="notification is-danger">
              {{ authStore.getError }}
            </div>

            <form @submit.prevent="handleLogin">
              <!-- Email Field -->
              <div class="field">
                <label class="label">Email</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="email"
                    v-model="email"
                    placeholder="example@gmail.com"
                    required
                    :disabled="isLoading"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                  </span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="field">
                <label class="label">Mật Khẩu</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    placeholder="********"
                    required
                    :disabled="isLoading"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </div>
              </div>

              <!-- Show Password Checkbox -->
              <div class="field">
                <label class="checkbox">
                  <input 
                    type="checkbox" 
                    v-model="showPassword"
                    :disabled="isLoading"
                  >
                  Hiện mật khẩu
                </label>
              </div>

              <!-- Submit Button -->
              <div class="field">
                <div class="control">
                  <button
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    type="submit"
                    :disabled="isLoading"
                  >
                    Đăng Nhập
                  </button>
                </div>
              </div>

              <!-- Registration Link -->
              <div class="has-text-centered mt-5">
                <p>
                  Chưa có tài khoản?
                  <NuxtLink to="/register" class="has-text-primary">Đăng ký ngay</NuxtLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const authStore = useAuthStore()
const userStore = useUserStore()

// Handle login form submission
const handleLogin = async () => {
  try {
    isLoading.value = true
    console.log('[Login] Attempting login with:', { email: email.value })
    
    const success = await authStore.login(email.value, password.value)
    console.log('[Login] Auth result:', { success, token: authStore.getToken })
    
    if (success) {
      console.log('[Login] Auth successful, fetching profile...')
      const profileData = await userStore.fetchProfile()
      console.log('[Login] Profile fetched:', profileData)

      if (profileData) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(profileData))
        console.log('[Login] User data stored in localStorage')
        
        // Navigate to home page
         navigateTo('/')
      } else {
        console.error('[Login] Failed to fetch profile data')
        throw new Error('Không thể tải thông tin người dùng')
      }
    } else {
      console.error('[Login] Auth failed:', authStore.getError)
      throw new Error(authStore.getError || 'Đăng nhập thất bại')
    }
  } catch (error) {
    console.error('[Login] Error:', error)
    authStore.setError(error.message)
  } finally {
    isLoading.value = false
  }
}

// Clear any existing errors when component mounts
onMounted(() => {
  console.log('[Login] Page mounted, clearing previous state')
  authStore.clearError()
  userStore.clearProfile()
  
  // Clear stored data if not logged in
  if (!authStore.isLoggedIn) {
    localStorage.removeItem('user')
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 5rem 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.box {
  margin-top: 2rem;
  padding: 2rem;
}

.button.is-loading {
  pointer-events: none;
  color: transparent !important;
}

.button.is-loading::after {
  border-color: transparent transparent #fff #fff !important;
}
</style> 