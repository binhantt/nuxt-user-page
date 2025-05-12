<template>
  <div class="section search-results">
    <div class="container">
      <!-- Loading State -->
      <div v-if="searchStore.loading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
      </div>

      <!-- Error State -->
      <div v-else-if="searchStore.error" class="notification is-danger">
        {{ searchStore.error }}
      </div>

      <!-- Search Results -->
      <div v-else>
        <!-- Search Query -->
        <div class="search-header mb-6">
          <h1 class="title is-3">Kết quả tìm kiếm cho "{{ searchQuery }}"</h1>
        </div>

        <!-- Results by Category -->
        <div v-if="searchStore.hasResults" class="search-categories">
          <div v-for="category in searchStore.normalizedProducts" :key="category.category.id" class="category-section mb-6">
            <h2 class="title is-4 mb-4">{{ category.category.name }}</h2>
            
            <div class="columns is-multiline">
              <div v-for="product in category.products" :key="product.id" class="column is-3">
                <div class="card product-card">
                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img 
                        :src="product.main_image_url" 
                        :alt="product.name"
                        :class="{ 'is-zoomed': zoomedImage === product.id }"
                        @click="toggleZoom(product.id)"
                      >
                      <button 
                        class="zoom-button" 
                        @click.stop="toggleZoom(product.id)"
                      >
                        <span class="icon">
                          <i class="fas" :class="zoomedImage === product.id ? 'fa-search-minus' : 'fa-search-plus'"></i>
                        </span>
                      </button>
                    </figure>
                  </div>
                  <div class="card-content">
                    <p class="title is-5">{{ product.name }}</p>
                    <p class="subtitle is-6">{{ formatPrice(product.price) }}đ</p>
                  </div>
                  <footer class="card-footer">
                    <NuxtLink :to="'/product/' + formatProductUrl(product.name)" class="card-footer-item">
                      Chi tiết
                    </NuxtLink>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="has-text-centered py-6">
          <p class="is-size-4">Không tìm thấy sản phẩm phù hợp</p>
          <NuxtLink to="/" class="button is-primary mt-4">
            Quay lại trang chủ
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '~/stores/searchStore'

const route = useRoute()
const searchStore = useSearchStore()
const searchQuery = computed(() => route.params.query || '')
const zoomedImage = ref(null)

// Toggle zoom on image
const toggleZoom = (productId) => {
  zoomedImage.value = zoomedImage.value === productId ? null : productId
}

// Format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Format product URL
const formatProductUrl = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Fetch results when query changes
watch(() => route.params.query, async (newQuery) => {
  if (newQuery) {
    await searchStore.searchProducts(newQuery)
  }
}, { immediate: true })

// Clean up when component unmounts
onUnmounted(() => {
  searchStore.resetState()
})
</script>

<style scoped>
.search-results {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;
}

.product-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.card-content {
  flex-grow: 1;
}

.card-image {
  position: relative;
  overflow: hidden;
}

.card-image figure {
  padding: 1rem;
  margin: 0;
  transition: all 0.3s ease;
}

.card-image img {
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: zoom-in;
}

.card-image img.is-zoomed {
  transform: scale(1.5);
  cursor: zoom-out;
}

.zoom-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.zoom-button:hover {
  background: white;
  transform: scale(1.1);
}

.zoom-button .icon {
  color: #3273dc;
  font-size: 1rem;
}

/* Hover effect for product card */
.product-card:hover .zoom-button {
  opacity: 1;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .column.is-3 {
    width: 50%;
  }
  
  .card-image img.is-zoomed {
    transform: scale(1.3);
  }
}

@media screen and (max-width: 480px) {
  .column.is-3 {
    width: 100%;
  }
  
  .card-image img.is-zoomed {
    transform: scale(1.2);
  }
}
</style> 