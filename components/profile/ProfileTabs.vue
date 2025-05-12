<template>
  <div class="tabs is-boxed mb-5">
    <ul>
      <li :class="{ 'is-active': modelValue === 'info' }">
        <a @click="$emit('update:modelValue', 'info')">
          <span class="icon"><i class="fas fa-user"></i></span>
          <span>Thông Tin</span>
        </a>
      </li>
      <li v-if="isOwnProfile" :class="{ 'is-active': modelValue === 'orders' }">
        <a @click="$emit('update:modelValue', 'orders')">
          <span class="icon"><i class="fas fa-shopping-bag"></i></span>
          <span>Đơn Hàng</span>
        </a>
      </li>
      <li v-if="isOwnProfile" :class="{ 'is-active': modelValue === 'security' }">
        <a @click="$emit('update:modelValue', 'security')">
          <span class="icon"><i class="fas fa-shield-alt"></i></span>
          <span>Bảo Mật</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs ul {
  border-bottom-color: #dbdbdb;
}

.tabs li.is-active a {
  border-bottom-color: #3273dc;
  color: #3273dc;
}

.tabs a {
  cursor: pointer;
}
</style> 