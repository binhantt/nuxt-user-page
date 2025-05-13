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

            <!-- Account Status Message -->
            <div v-if="accountStatus.show" :class="['notification', accountStatus.type]">
              <button class="delete" @click="accountStatus.show = false"></button>
              {{ accountStatus.message }}
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
                  <NuxtLink to="/account/register" class="has-text-primary">Đăng ký ngay</NuxtLink>
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

// Account status notification
const accountStatus = reactive({
  show: false,
  type: 'is-danger',
  message: ''
})

// Handle login form submission
const handleLogin = async () => {
  if (!email.value || !password.value) {
    authStore.setError('Vui lòng nhập đầy đủ thông tin')
    return
  }

  try {
    isLoading.value = true
    accountStatus.show = false
    console.log('[Login] Attempting login with:', { email: email.value })
    
    const loginResponse = await authStore.login(email.value, password.value)
    console.log('[Login] Auth result:', loginResponse)
    
    if (loginResponse && loginResponse.user) {
      // Clear form
      email.value = ''
      password.value = ''
      showPassword.value = false
      
      // Navigate to home page
      navigateTo('/')
    }
  } catch (error) {
    console.error('[Login] Error:', error)
    authStore.setError(error.message)
    
    // Show account status message if account is locked
    if (error.message.includes('đã bị khóa')) {
      accountStatus.show = true
      accountStatus.type = 'is-danger'
      accountStatus.message = error.message
    }
  } finally {
    isLoading.value = false
  }
}

// Clear any existing errors when component mounts or unmounts
onMounted(() => {
  console.log('[Login] Page mounted, clearing previous state')
  authStore.clearError()
  userStore.clearProfile()
  accountStatus.show = false
  
  // Clear stored data if not logged in
  if (!authStore.isLoggedIn) {
    localStorage.removeItem('user')
  }
})

onUnmounted(() => {
  console.log('[Login] Page unmounted, clearing state')
  authStore.clearError()
  email.value = ''
  password.value = ''
  showPassword.value = false
  accountStatus.show = false
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

.notification {
  position: relative;
  margin-bottom: 1.5rem;
}

.notification .delete {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}
</style> 