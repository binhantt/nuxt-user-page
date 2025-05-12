<template>
  <div class="columns is-vcentered mt-4">
    <div class="column is-6">
      <div class="field">
        <div class="control has-icons-left">
          <input 
            class="input" 
            type="text" 
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            placeholder="Tìm kiếm bài viết..."
          >
          <span class="icon is-left">
            <i class="fas fa-search"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="column is-3">
      <div class="select is-fullwidth">
        <select 
          :value="selectedCategory"
          @change="$emit('update:selectedCategory', $event.target.value)"
        >
          <option value="">Tất cả danh mục</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="column is-3">
      <div class="select is-fullwidth">
        <select 
          :value="sortBy"
          @change="$emit('update:sortBy', $event.target.value)"
        >
          <option value="latest">Mới nhất</option>
          <option value="popular">Phổ biến nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  selectedCategory: String,
  sortBy: String,
  categories: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:modelValue', 'update:selectedCategory', 'update:sortBy'])
</script> 