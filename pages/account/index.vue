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
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </div>
              </div>

              <!-- Show Password Checkbox -->
              <div class="field">
                <label class="checkbox">
                  <input type="checkbox" v-model="showPassword">
                  Hiện mật khẩu
                </label>
              </div>

              <!-- Submit Button -->
              <div class="field">
                <div class="control">
                  <button
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': authStore.isLoading }"
                    type="submit"
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

const authStore = useAuthStore()
const userStore = useUserStore()

// Handle login form submission
const handleLogin = async () => {
  console.log('Attempting login with:', { email: email.value, password: password.value })
  
  const success = await authStore.login(email.value, password.value)
  console.log('Login result:', { success, token: authStore.getToken })
  
  if (success) {
    console.log('Login successful, fetching profile...')
    const profileData = await userStore.fetchProfile()
    console.log('Profile fetched:', profileData)

    if (profileData) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(profileData))
      console.log('User data stored in localStorage')
      
      // Navigate to home page
      navigateTo('/')
    } else {
      console.error('Failed to fetch profile data')
    }
  } else {
    console.error('Login failed:', authStore.getError)
  }
}

// Clear any existing errors when component mounts
onMounted(() => {
  console.log('Login page mounted, clearing previous state')
  authStore.clearError()
  userStore.clearProfile()
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

.captcha-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.captcha-image {
  background: linear-gradient(45deg, #1a1c2c, #2a3c54);
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 1.2rem;
  letter-spacing: 0.5rem;
  cursor: pointer;
  user-select: none;
}
</style> 