<template>
  <section class="section products-section">
    <div class="container">
      <h2 class="title is-2 has-text-centered mb-6">Sản Phẩm Nổi Bật</h2>
      
      <div class="tabs is-centered mb-5">
        <ul>
          <li :class="{ 'is-active': activeCategory === 'all' }">
            <a @click="setCategory('all')">Tất Cả</a>
          </li>
          <li v-for="category in categories" :key="category.id"
              :class="{ 'is-active': activeCategory === category.id }">
            <a @click="setCategory(category.id)">{{ category.name }}</a>
          </li>
        </ul>
      </div>

      <!-- Loading State -->
      <div v-if="productStore.isLoading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-2x"></i>
        </span>
      </div>

      <!-- Error State -->
      <div v-else-if="productStore.getError" class="notification is-warning">
        {{ productStore.getError }}
      </div>

      <!-- Products Grid -->
      <div v-else class="columns is-multiline">
        <div v-for="product in products" 
             :key="product.id" 
             class="column is-4-tablet is-3-desktop">
          <div class="product-card">
            <div class="product-image">
              <img :src="product.main_image_url" :alt="product.name">
              <div class="product-overlay">
                <NuxtLink :to="`/product/${formatProductUrl(product.name)}`" class="button is-warning is-rounded">
                  <span class="icon">
                    <i class="fas fa-eye"></i>
                  </span>
                  <span>Xem Chi Tiết</span>
                </NuxtLink>
              </div>
              <div v-if="product.category" class="product-badge">
                {{ product.category.name }}
              </div>
            </div>
            <div class="product-content">
              <h3 class="title is-5">
                <NuxtLink :to="`/product/${formatProductUrl(product.name)}`" class="has-text-dark">
                  {{ product.name }}
                </NuxtLink>
              </h3>
              <p class="subtitle is-6 has-text-grey">{{ product.description }}</p>
              <div class="price-tag">
                {{ formatPrice(product.price) }}
              </div>
              <div class="stock-info mt-2">
                <span class="tag" :class="product.stock > 0 ? 'is-success' : 'is-danger'">
                  {{ product.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                </span>
                <span class="tag is-info ml-2" v-if="product.stock > 0">
                  Còn {{ product.stock }} sản phẩm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="pagination.totalPages > 1" 
           class="pagination is-centered mt-6" 
           role="navigation" 
           aria-label="pagination">
        <a class="pagination-previous" 
           :disabled="currentPage === 1"
           @click="changePage(currentPage - 1)">
          Trang trước
        </a>
        <a class="pagination-next" 
           :disabled="currentPage === pagination.totalPages"
           @click="changePage(currentPage + 1)">
          Trang sau
        </a>
        <ul class="pagination-list">
          <li v-for="page in pagination.totalPages" :key="page">
            <a class="pagination-link" 
               :class="{ 'is-current': page === currentPage }"
               @click="changePage(page)">
              {{ page }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useProductStore } from '~/stores/productStore'
import { useCategoryStore } from '~/stores/categoryStore'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const activeCategory = ref('all')
const currentPage = ref(1)

const categories = computed(() => categoryStore.categories?.data || [])
const products = computed(() => {
  console.log('Store products:', productStore.getProducts)
  return productStore.getProducts?.data || []
})
const pagination = computed(() => productStore.getProducts?.pagination || {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12
})

// Format price to VND
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Format product URL for SEO
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

// Set category and fetch products
const setCategory = async (categoryId) => {
  console.log('Setting category:', categoryId)
  activeCategory.value = categoryId
  currentPage.value = 1
  await fetchProducts()
}

// Change page
const changePage = async (page) => {
  console.log('Changing to page:', page)
  currentPage.value = page
  await fetchProducts()
}

// Fetch products with filters
const fetchProducts = async () => {
  console.log('Fetching products with category:', activeCategory.value)
  const filters = {
    ...(activeCategory.value !== 'all' && { category_id: activeCategory.value })
  }
  const result = await productStore.fetchProducts(currentPage.value, filters)
  console.log('Fetch result:', result)
}

// Initialize component
onMounted(async () => {
  console.log('Component mounted, fetching initial data')
  await Promise.all([
    categoryStore.fetchCategories(),
    fetchProducts()
  ])
})
</script>

<style scoped>
.products-section {
  background: #f5f5f5;
  padding: 6rem 1.5rem;
}

.product-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(50, 115, 220, 0.1);
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(50, 115, 220, 0.2);
}

.product-image {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(50, 115, 220, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  background: #3273dc;
}

.product-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.price-tag {
  background: #3273dc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  align-self: flex-start;
  font-weight: bold;
  margin-top: auto;
}

.stock-info {
  margin-top: 1rem;
}

.tag.is-success {
  background-color: #3273dc;
  color: white;
}

.tag.is-danger {
  background-color: #ffd700;
  color: #363636;
}

.tag.is-info {
  background-color: #f5f5f5;
  color: #363636;
}

.tabs li.is-active a {
  border-bottom-color: #3273dc;
  color: #3273dc;
}

.title.is-2 {
  color: #3273dc;
}

.pagination-link.is-current {
  background-color: #3273dc;
  border-color: #3273dc;
  color: white;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #ffed4a;
}
</style> 