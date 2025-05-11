<template>
  <div class="section">
    <div class="container">
      <h1 class="title is-2 mb-6">
        Kết quả tìm kiếm cho "{{ searchQuery }}"
      </h1>

      <!-- Loading State -->
      <div v-if="loading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="notification is-danger">
        {{ error }}
      </div>

      <!-- No Results -->
      <div v-else-if="!products.length" class="content has-text-centered py-6">
        <p class="is-size-4">Không tìm thấy sản phẩm nào phù hợp.</p>
        <p class="mt-4">
          <NuxtLink to="/" class="button is-warning">
            Quay lại trang chủ
          </NuxtLink>
        </p>
      </div>

      <!-- Search Results -->
      <div v-else class="columns is-multiline">
        <div v-for="product in products" :key="product.id" class="column is-3">
          <div class="card">
            <div class="card-image">
              <figure class="image is-4by3">
                <img :src="product.image" :alt="product.name">
              </figure>
            </div>
            <div class="card-content">
              <p class="title is-5">{{ product.name }}</p>
              <p class="subtitle is-6">{{ product.category?.name }}</p>
              <p class="has-text-primary has-text-weight-bold">
                {{ formatPrice(product.price) }}đ
              </p>
            </div>
            <footer class="card-footer">
              <NuxtLink :to="'/product/' + product.id" class="card-footer-item has-background-primary has-text-white">
                Chi tiết
              </NuxtLink>
              <a @click="addToCart(product)" class="card-footer-item has-background-warning">
                Thêm vào giỏ
              </a>
            </footer>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="products.length" class="pagination is-centered mt-6" role="navigation" aria-label="pagination">
        <a 
          class="pagination-previous" 
          :disabled="currentPage === 1"
          @click="currentPage > 1 && (currentPage--)"
        >
          Trang trước
        </a>
        <a 
          class="pagination-next"
          :disabled="currentPage === totalPages"
          @click="currentPage < totalPages && (currentPage++)"
        >
          Trang sau
        </a>
        <ul class="pagination-list">
          <li v-for="page in totalPages" :key="page">
            <a 
              class="pagination-link"
              :class="{ 'is-current': page === currentPage }"
              @click="currentPage = page"
            >
              {{ page }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const searchQuery = computed(() => decodeURIComponent(route.params.query))
const loading = ref(true)
const error = ref(null)
const products = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const itemsPerPage = 12

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const fetchSearchResults = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch('/api/products/search?q=' + searchQuery.value + '&page=' + currentPage.value + '&limit=' + itemsPerPage)
    const data = await response.json()
    
    if (data.success) {
      products.value = data.data.items
      totalPages.value = Math.ceil(data.data.pagination.total / itemsPerPage)
    } else {
      throw new Error(data.message || 'Có lỗi xảy ra khi tìm kiếm')
    }
  } catch (err) {
    console.error('Search error:', err)
    error.value = 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const addToCart = (product) => {
  // TODO: Implement add to cart functionality
  console.log('Adding to cart:', product)
}

watch([searchQuery, currentPage], () => {
  fetchSearchResults()
})

onMounted(() => {
  fetchSearchResults()
})
</script>

<style scoped>
.section {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: white;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(50, 115, 220, 0.2);
}

.card-content {
  flex-grow: 1;
}

.card-footer-item {
  transition: all 0.2s ease;
}

.card-footer-item.has-background-primary:hover {
  background-color: #2366d1 !important;
}

.card-footer-item.has-background-warning:hover {
  background-color: #ffed4a !important;
}

.pagination-link.is-current {
  background-color: #3273dc;
  border-color: #3273dc;
  color: white;
}

.image img {
  object-fit: cover;
}

.has-text-primary {
  color: #3273dc !important;
}

.has-background-primary {
  background-color: #3273dc !important;
}

.has-background-warning {
  background-color: #ffd700 !important;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #ffed4a;
}
</style> 