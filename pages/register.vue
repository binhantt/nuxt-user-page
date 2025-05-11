<template>
  <div class="register-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop">
          <div class="box">
            <h1 class="title has-text-centered">Đăng Ký</h1>
            <form @submit.prevent="handleRegister">
              <!-- Full Name Field -->
              <div class="field">
                <label class="label">Họ và Tên</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="text"
                    v-model="fullName"
                    placeholder="Nguyễn Văn A"
                    required
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-user"></i>
                  </span>
                </div>
              </div>

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
                    minlength="8"
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                  </span>
                </div>
                <p class="help">Mật khẩu phải có ít nhất 8 ký tự</p>
              </div>

              <!-- Confirm Password Field -->
              <div class="field">
                <label class="label">Xác Nhận Mật Khẩu</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="confirmPassword"
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

              <!-- CAPTCHA -->
              <div class="field">
                <label class="label">CAPTCHA</label>
                <div class="captcha-container">
                  <div class="captcha-image" @click="refreshCaptcha">
                    {{ captchaText }}
                  </div>
                  <button type="button" class="button is-small" @click="refreshCaptcha">
                    <span class="icon">
                      <i class="fas fa-sync"></i>
                    </span>
                  </button>
                </div>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="captchaInput"
                    placeholder="Nhập mã CAPTCHA"
                    required
                  >
                </div>
              </div>

              <!-- Submit Button -->
              <div class="field">
                <div class="control">
                  <button
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    type="submit"
                    :disabled="!isFormValid"
                  >
                    Đăng Ký
                  </button>
                </div>
              </div>

              <!-- Login Link -->
              <div class="has-text-centered mt-5">
                <p>
                  Đã có tài khoản?
                  <NuxtLink to="/login" class="has-text-primary">Đăng nhập</NuxtLink>
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
const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const captchaText = ref('')
const captchaInput = ref('')
const isLoading = ref(false)

// Form validation
const isFormValid = computed(() => {
  return (
    fullName.value.length > 0 &&
    email.value.length > 0 &&
    password.value.length >= 8 &&
    password.value === confirmPassword.value
  )
})

// Generate random CAPTCHA text
const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Refresh CAPTCHA
const refreshCaptcha = () => {
  captchaText.value = generateCaptcha()
  captchaInput.value = ''
}

// Initialize CAPTCHA on component mount
onMounted(() => {
  refreshCaptcha()
})

// Handle registration form submission
const handleRegister = async () => {
  if (captchaInput.value !== captchaText.value) {
    alert('CAPTCHA không chính xác')
    return
  }

  if (password.value !== confirmPassword.value) {
    alert('Mật khẩu xác nhận không khớp')
    return
  }

  isLoading.value = true
  try {
    // Here you would typically make an API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
    console.log('Registration attempt:', {
      fullName: fullName.value,
      email: email.value,
      password: password.value
    })
    // Navigate to login page on success
    navigateTo('/login')
  } catch (error) {
    console.error('Registration failed:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.register-page {
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