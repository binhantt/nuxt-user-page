<template>
  <div class="profile-header">
    <div class="avatar-wrapper">
      <figure class="image is-128x128">
        <img
          class="is-rounded"
          src="https://bulma.io/images/placeholders/128x128.png"
          alt="Avatar"
        >
      </figure>
      <button v-if="isOwnProfile" class="button is-small is-warning" @click="$emit('upload-avatar')">
        <span class="icon">
          <i class="fas fa-camera"></i>
        </span>
        <span>Đổi ảnh</span>
      </button>
    </div>
    <div class="profile-info">
      <h1 class="title is-3">{{ userData.name }}</h1>
      <p class="subtitle is-5">@{{ username }}</p>
      <p class="joined-date">
        Tham gia từ: {{ formatDate(userData.created_at) }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userData: {
    type: Object,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['upload-avatar'])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.avatar-wrapper {
  text-align: center;
}

.avatar-wrapper button {
  margin-top: 1rem;
}

.profile-info {
  flex-grow: 1;
}

.joined-date {
  color: #3273dc;
  font-size: 0.9rem;
}
</style> 