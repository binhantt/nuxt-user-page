<template>
  <div class="security-content">
    <div class="box">
      <h3 class="title is-4">Đổi Mật Khẩu</h3>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">Mật khẩu hiện tại</label>
          <div class="control has-icons-left">
            <input
              v-model="form.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="input"
              required
              placeholder="Nhập mật khẩu hiện tại"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-lock"></i>
            </span>
            <button
              type="button"
              class="button is-small is-light show-password"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <span class="icon">
                <i :class="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </button>
          </div>
        </div>

        <div class="field">
          <label class="label">Mật khẩu mới</label>
          <div class="control has-icons-left">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="input"
              required
              placeholder="Nhập mật khẩu mới"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
              title="Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            <button
              type="button"
              class="button is-small is-light show-password"
              @click="showNewPassword = !showNewPassword"
            >
              <span class="icon">
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </button>
          </div>
          <p class="help">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số</p>
        </div>

        <div class="field">
          <label class="label">Xác nhận mật khẩu mới</label>
          <div class="control has-icons-left">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="input"
              required
              placeholder="Nhập lại mật khẩu mới"
            >
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
            <button
              type="button"
              class="button is-small is-light show-password"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <span class="icon">
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </button>
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>

        <div class="field">
          <div class="control">
            <button
              type="submit"
              class="button is-warning"
              :class="{ 'is-loading': isSubmitting }"
              :disabled="!isFormValid || isSubmitting"
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="box mt-5">
      <h3 class="title is-4">Bảo Mật Tài Khoản</h3>
      <div class="content">
        <p>
          <strong>Email:</strong> {{ user.email }}
          <span class="tag is-success is-light ml-2">Đã xác thực</span>
        </p>
        <p>
          <strong>Đăng nhập gần đây:</strong>
          {{ formatDate(user.updated_at) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UserData } from '~/types'

const props = defineProps<{
  user: UserData
}>()

const emit = defineEmits<{
  (e: 'update-password', data: { currentPassword: string; newPassword: string }): void
}>()

const form = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const isFormValid = computed(() => {
  return (
    form.value.currentPassword &&
    form.value.newPassword &&
    form.value.newPassword === form.value.confirmPassword &&
    form.value.newPassword.length >= 8 &&
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.value.newPassword)
  )
})

const handleSubmit = async () => {
  error.value = ''
  
  if (!isFormValid.value) {
    if (form.value.newPassword !== form.value.confirmPassword) {
      error.value = 'Mật khẩu mới không khớp'
    } else {
      error.value = 'Vui lòng kiểm tra lại thông tin nhập vào'
    }
    return
  }

  isSubmitting.value = true
  try {
    await emit('update-password', {
      currentPassword: form.value.currentPassword,
      newPassword: form.value.newPassword
    })
    
    // Reset form after successful submission
    form.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (err) {
    error.value = 'Có lỗi xảy ra, vui lòng thử lại sau'
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('vi-VN')
}
</script>

<style scoped>
.security-content {
  max-width: 600px;
  margin: 0 auto;
}

.control {
  position: relative;
}

.show-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: transparent !important;
  border: none;
}

.show-password:hover {
  background: #f5f5f5 !important;
}

.notification {
  margin-top: 1rem;
}

.help {
  font-size: 0.85rem;
  color: #666;
}
</style> 