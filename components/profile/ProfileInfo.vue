<template>
  <div class="tab-content">
    <form v-if="isOwnProfile" @submit.prevent="handleSubmit">
      <div class="field">
        <label class="label">Họ và Tên</label>
        <div class="control">
          <input
            class="input"
            type="text"
            v-model="form.name"
            placeholder="Họ và tên"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">Số Điện Thoại</label>
        <div class="control">
          <input
            class="input"
            type="tel"
            v-model="form.phone"
            placeholder="Số điện thoại"
          >
        </div>
      </div>
      <div class="field">
        <label class="label">Địa Chỉ</label>
        <div class="control">
          <textarea
            class="textarea"
            v-model="form.address"
            placeholder="Địa chỉ"
          ></textarea>
        </div>
      </div>
      <div class="field">
        <div class="control">
          <button
            class="button is-warning"
            :class="{ 'is-loading': isSubmitting }"
            type="submit"
          >
            Cập Nhật
          </button>
        </div>
      </div>
    </form>
    <div v-else class="user-info">
      <div class="info-item">
        <strong>Họ và Tên:</strong>
        <span>{{ userData.name }}</span>
      </div>
      <div class="info-item">
        <strong>Email:</strong>
        <span>{{ userData.email }}</span>
      </div>
      <div v-if="userData.phone" class="info-item">
        <strong>Số Điện Thoại:</strong>
        <span>{{ userData.phone }}</span>
      </div>
      <div v-if="userData.address" class="info-item">
        <strong>Địa Chỉ:</strong>
        <span>{{ userData.address }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useChangeInfoStore } from '~/stores/changInforStore'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update'])
const changeInfoStore = useChangeInfoStore()

const isSubmitting = ref(false)
const form = reactive({
  name: '',
  phone: '',
  address: ''
})

onMounted(() => {
  form.name = props.userData.name || ''
  form.phone = props.userData.phone || ''
  form.address = props.userData.address || ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const result = await changeInfoStore.updateProfile(props.userData.id, {
      name: form.name,
      phone: form.phone,
      address: form.address
    })

    if (result.success) {
      emit('update', {
        name: form.name,
        phone: form.phone,
        address: form.address
      })
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Update failed:', error)
    alert('Cập nhật thông tin thất bại. Vui lòng thử lại.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.user-info .info-item {
  margin-bottom: 1rem;
}

.user-info .info-item strong {
  display: inline-block;
  width: 120px;
  color: #3273dc;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #ffed4a;
}

.field {
  margin-bottom: 1.5rem;
}

.label {
  color: #363636;
  font-weight: 600;
}
</style> 