<template>
  <div class="register-page">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop">
          <div class="box">
            <h1 class="title has-text-centered">Đăng Ký</h1>
            
            <!-- Error Messages -->
            <div v-if="registerStore.error || captchaStore.error" class="notification is-danger">
              {{ registerStore.error || captchaStore.error }}
            </div>

            <!-- Success Message -->
            <div v-if="registerStore.success" class="notification is-success">
              Đăng ký thành công! Đang chuyển hướng...
            </div>

            <form @submit.prevent="handleRegister">
              <!-- Full Name Field -->
              <div class="field">
                <label class="label">Họ và Tên</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="text"
                    v-model="formData.name"
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
                    v-model="formData.email"
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
                    v-model="formData.password"
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

              <!-- Phone Field -->
              <div class="field">
                <label class="label">Số Điện Thoại</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="tel"
                    v-model="formData.phone"
                    placeholder="0123456789"
                    required
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-phone"></i>
                  </span>
                </div>
              </div>

              <!-- Address Field -->
              <div class="field">
                <label class="label">Địa Chỉ</label>
                <div class="control has-icons-left">
                  <input
                    class="input"
                    type="text"
                    v-model="formData.address"
                    placeholder="Địa chỉ của bạn"
                    required
                  >
                  <span class="icon is-small is-left">
                    <i class="fas fa-home"></i>
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
                  <div v-if="!captchaStore.getCaptchaImage" class="captcha-placeholder">
                    <button 
                      type="button" 
                      class="button is-info" 
                      @click="refreshCaptcha"
                      :disabled="captchaStore.loading"
                    >
                      <span class="icon">
                        <i class="fas" :class="{'fa-sync': !captchaStore.loading, 'fa-spinner fa-spin': captchaStore.loading}"></i>
                      </span>
                      <span>{{ captchaStore.loading ? 'Đang tải...' : 'Lấy mã Captcha' }}</span>
                    </button>
                  </div>
                  <template v-else>
                    <div class="captcha-image">
                      <img 
                        :src="captchaStore.getCaptchaImage" 
                        alt="CAPTCHA"
                        @error="handleCaptchaImageError"
                      >
                    </div>
                    <button 
                      type="button" 
                      class="button is-small" 
                      @click="refreshCaptcha"
                      :disabled="captchaStore.loading"
                    >
                      <span class="icon">
                        <i class="fas" :class="{'fa-sync': !captchaStore.loading, 'fa-spinner fa-spin': captchaStore.loading}"></i>
                      </span>
                    </button>
                  </template>
                </div>
                <div class="control">
                  <input
                    class="input"
                    type="text"
                    v-model="formData.captcha"
                    placeholder="Nhập mã CAPTCHA"
                    required
                    :disabled="!captchaStore.getCaptchaImage"
                  >
                </div>
                <p v-if="captchaStore.error" class="help is-danger">
                  {{ captchaStore.error }}
                </p>
              </div>

              <!-- Submit Button -->
              <div class="field">
                <div class="control">
                  <button
                    class="button is-primary is-fullwidth"
                    :class="{ 'is-loading': isLoading }"
                    type="submit"
                    :disabled="!isFormValid || isLoading"
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
import { useCaptchaStore } from '~/stores/captchaStore'
import { useRegisterStore } from '~/stores/registerStore'

const captchaStore = useCaptchaStore()
const registerStore = useRegisterStore()

const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  phone: '',
  address: '',
  captcha: ''
})

// Handle registration form submission
const handleRegister = async () => {
  // Validate form data
  if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
    registerStore.error = 'Vui lòng nhập đầy đủ thông tin'
    return
  }

  if (formData.password.length < 8) {
    registerStore.error = 'Mật khẩu phải có ít nhất 8 ký tự'
    return
  }

  if (!captchaStore.getCaptchaId) {
    registerStore.error = 'Vui lòng lấy mã CAPTCHA'
    return
  }

  if (!formData.captcha) {
    registerStore.error = 'Vui lòng nhập mã CAPTCHA'
    return
  }

  isLoading.value = true
  try {
    await registerStore.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
      captcha: formData.captcha
    })

    // If registration successful
    if (registerStore.success) {
      // Clear form data
      formData.name = ''
      formData.email = ''
      formData.password = ''
      formData.phone = ''
      formData.address = ''
      formData.captcha = ''
      showPassword.value = false
      
      // Reset CAPTCHA
      captchaStore.resetCaptcha()

      // Navigate to home after delay
      setTimeout(() => {
        navigateTo('/')
      }, 2000)
    }
  } catch (error) {
    console.error('Registration failed:', error)
    // Get new CAPTCHA if registration fails
    refreshCaptcha()
  } finally {
    isLoading.value = false
  }
}

// Form validation
const isFormValid = computed(() => {
  return (
    formData.name.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length >= 8 &&
    formData.phone.length > 0 &&
    formData.address.length > 0 &&
    formData.captcha.length > 0 &&
    captchaStore.getCaptchaId !== '' // Just check if we have a CAPTCHA ID
  )
})

// Handle CAPTCHA refresh
const refreshCaptcha = async () => {
  try {
    formData.captcha = '' // Clear previous input
    await captchaStore.generateCaptcha()
  } catch (error) {
    console.error('Failed to refresh captcha:', error)
  }
}

// Handle CAPTCHA image error
const handleCaptchaImageError = () => {
  captchaStore.error = 'Không thể tải hình CAPTCHA'
  refreshCaptcha()
}

// Clean up on mount/unmount
onMounted(() => {
  registerStore.resetState()
  captchaStore.resetCaptcha()
})

onUnmounted(() => {
  registerStore.resetState()
  captchaStore.resetCaptcha()
  // Clear form data
  formData.name = ''
  formData.email = ''
  formData.password = ''
  formData.phone = ''
  formData.address = ''
  formData.captcha = ''
  showPassword.value = false
})
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
  background: white;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #dbdbdb;
  overflow: hidden;
  min-width: 200px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.captcha-image img {
  max-width: 100%;
  height: auto;
  display: block;
}

.captcha-placeholder {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.button.is-info {
  background-color: #3273dc;
  color: white;
  transition: all 0.3s ease;
}

.button.is-info:hover:not(:disabled) {
  background-color: #2366d1;
  transform: translateY(-1px);
}

.notification {
  margin-bottom: 1.5rem;
}

.button.is-primary {
  background-color: #3273dc;
  transition: all 0.3s ease;
}

.button.is-primary:hover:not(:disabled) {
  background-color: #2366d1;
  transform: translateY(-1px);
}

.input:focus {
  border-color: #3273dc;
  box-shadow: 0 0 0 1px rgba(50, 115, 220, 0.2);
}

.help.is-danger {
  color: #f14668;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.button.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 