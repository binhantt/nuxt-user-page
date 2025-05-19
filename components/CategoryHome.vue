<template>
  <section class="section category-section">
    <div class="container">
      <h2 class="title is-2 has-text-centered mb-6">Danh Mục</h2>
      <div class="tabs is-centered mb-5">
        <ul>
         
          <li v-for="mainCategory in categories" :key="mainCategory.id" :class="{ 'is-active': activeCategory === mainCategory.id }">
            <a @click="setCategory(mainCategory.id)">{{ mainCategory.name }}</a>
          </li>
        </ul>
      </div>
      <div v-if="isLoading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-2x"></i>
        </span>
      </div>
      <div v-else class="columns is-multiline">
        <div v-if="selectedCategory" class="column is-12">
          <div class="category-group">
            <h3 class="category-title">{{ selectedCategory.name }}</h3>
            <div v-if="selectedCategory.categories && selectedCategory.categories.length" class="subcategory-grid">
              <NuxtLink
                v-for="subCategory in selectedCategory.categories"
                :key="subCategory.id"
                :to="`/category/${subCategory.name}`"
                class="subcategory-card"
              >
                <img v-if="subCategory.image" :src="subCategory.image" :alt="subCategory.name" class="subcategory-image" />
                <span class="subcategory-name">{{ subCategory.name }}</span>
              </NuxtLink>
            </div>
            <div v-else class="no-subcategories">
              <span class="icon"><i class="fas fa-info-circle"></i></span> Không có danh mục con
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '~/stores/categoryStore'
import { useRouter, useRoute, useNuxtApp } from '#imports'

const categoryStore = useCategoryStore()
const isLoading = ref(false)
const activeCategory = ref('all')
const categories = computed(() => categoryStore.categories?.data || [])

const selectedCategory = computed(() => {
  if (activeCategory.value === 'all') {
    return categories.value[0] || null
  }
  return categories.value.find(cat => cat.id === activeCategory.value) || null
})

const setCategory = (id) => {
  activeCategory.value = id
}

// Format subcategory name to URL-friendly (no dấu, thường, -)


onMounted(async () => {
  if (!categoryStore.categories || !categoryStore.categories.data || !categoryStore.categories.data.length) {
    isLoading.value = true
    await categoryStore.fetchCategories()
    isLoading.value = false
  }
})
</script>

<style scoped>
.category-section {
  background: #f5f5f5;
  padding: 4rem 1.5rem;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.category-group {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(50, 115, 220, 0.08);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-bottom: 2.5rem;
}
.category-title {
  font-size: 1.25rem;
  color: #3273dc;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e0e7ef;
  padding-bottom: 0.5rem;
  width: 100%;
  background: linear-gradient(90deg, #e0e7ef 60%, transparent 100%);
  border-radius: 6px 6px 0 0;
}
.subcategory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 0.5rem;
}
.subcategory-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 12px;
  background: #f3f6fa;
  box-shadow: 0 2px 8px 0 rgba(37,99,235,0.06);
  transition: background 0.2s, box-shadow 0.2s, transform 0.18s;
  cursor: pointer;
  border: 1.5px solid #e0e7ef;
  text-decoration: none;
}
.subcategory-card:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 16px 0 rgba(37,99,235,0.13);
  transform: translateY(-2px) scale(1.03);
}
.subcategory-image {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
  border: 1.5px solid #e0e7ef;
  background: #fff;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.04);
  transition: transform 0.18s;
}
.subcategory-card:hover .subcategory-image {
  transform: scale(1.08) rotate(-2deg);
}
.subcategory-name {
  font-size: 1.05rem;
  color: #334155;
  font-weight: 600;
  letter-spacing: 0.1px;
}
.no-subcategories {
  color: #64748b;
  font-style: italic;
  margin-top: 10px;
  text-align: center;
  background: #f8fafc;
  border-radius: 6px;
  padding: 12px 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.tabs li.is-active a {
  border-bottom-color: #3273dc;
  color: #3273dc;
}
.title.is-2 {
  color: #3273dc;
}
@media (max-width: 900px) {
  .subcategory-grid {
    grid-template-columns: 1fr;
  }
  .columns.is-multiline {
    flex-direction: column;
  }
  .column.is-4-tablet, .column.is-3-desktop, .column.is-12 {
    width: 100%;
    max-width: 100%;
  }
}
</style>
