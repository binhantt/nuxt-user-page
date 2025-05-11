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
      <div v-else-if="!hasAnyProducts" class="content has-text-centered py-6">
        <p class="is-size-4">Không tìm thấy sản phẩm nào phù hợp.</p>
        <p class="mt-4">
          <NuxtLink to="/" class="button is-primary is-outlined">
            Quay lại trang chủ
          </NuxtLink>
        </p>
      </div>

      <!-- Search Results -->
      <div v-else class="content">
        <div v-for="category in safeDisplayProducts" :key="category?.category?.id || 'unknown'" class="mb-6">
          <div class="columns is-multiline">
            <div v-for="product in category?.products || []" :key="product?.id || 'unknown'" class="column is-3">
              <div class="product-card">
                <!-- Category Tag -->
                <div class="category-tag">
                  {{ category?.category?.name || 'Không có danh mục' }}
                </div>

                <!-- Product Image -->
                <div class="product-image">
                  <img :src="product?.main_image_url" :alt="product?.name">
                </div>

                <!-- Product Info -->
                <div class="product-info">
                  <h3 class="product-title">{{ product?.name || 'Không có tên' }}</h3>
                  <p class="product-description">{{ product?.description || 'Điện thoại cao cấp nhất của Apple' }}</p>
                  
                  <!-- Price and Stock -->
                  <div class="price-stock">
                    <div class="price">{{ formatPrice(product?.price) }}đ</div>
                    <div class="stock">
                      <span class="stock-label">Còn hàng</span>
                      <span class="stock-count">100 sản phẩm</span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="product-actions">
                    <NuxtLink 
                      :to="'/product/' + slugify(product?.name || '')" 
                      class="button is-primary is-fullwidth"
                    >
                      Chi tiết
                    </NuxtLink>
                    <button @click="addToCart(product)" class="button is-warning is-fullwidth mt-2">
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '~/stores/searchStore'

const route = useRoute()
const searchStore = useSearchStore()

// Function to convert product name to URL-friendly slug
function slugify(text) {
  if (!text) return ''
  
  // Convert Vietnamese characters to non-accented
  const from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ"
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiioooooooooooooooouuuuuuuuuuuyyyyy"
  
  let result = text.toLowerCase()
  
  // Replace Vietnamese characters
  for (let i = 0; i < from.length; i++) {
    result = result.replace(new RegExp(from[i], 'g'), to[i])
  }
  
  return result
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim() // Trim spaces from start and end
}

const searchQuery = computed(() => {
  const query = decodeURIComponent(route.params.query || '')
  console.log('[Search Page] Current search query:', query)
  return query
})

const { loading, error, normalizedProducts } = storeToRefs(searchStore)

// Safely check if we have any products
const hasAnyProducts = computed(() => {
  if (!Array.isArray(normalizedProducts.value)) return false
  return normalizedProducts.value.some(cat => 
    Array.isArray(cat?.products) && cat.products.length > 0
  )
})

// Ensure we always have a safe array to iterate over
const safeDisplayProducts = computed(() => {
  console.log('[Search Page] Starting display products computation')
  if (!Array.isArray(normalizedProducts.value)) {
    console.log('[Search Page] No normalized products array found')
    return []
  }
  
  const results = normalizedProducts.value
    .filter(category => category && category.products) // Filter out invalid categories
    .map(category => {
      console.log('[Search Page] Processing category:', category)
      try {
        const score = calculateMatchScore(category, searchQuery.value)
        const result = {
          ...category,
          matchScore: score
        }
        console.log('[Search Page] Category score calculation:', {
          categoryName: category?.category?.name,
          normalizedName: category?.normalizedName,
          query: searchQuery.value,
          score
        })
        return result
      } catch (error) {
        console.error('[Search Page] Error processing category:', error)
        return null
      }
    })
    .filter(Boolean) // Remove null results
    .sort((a, b) => (b?.matchScore || 0) - (a?.matchScore || 0))
  
  console.log('[Search Page] Final sorted categories:', results)
  return results
})

// Calculate how well a category matches the search query
function calculateMatchScore(category, query) {
  if (!category || !query) return 0
  
  console.log('[Search Page] Calculating match score for category:', {
    category: category?.category?.name,
    query: query
  })
  
  const normalizedQuery = (query || '').toLowerCase()
  let score = 0
  
  // Check category name match
  if (category?.normalizedCategory?.includes(normalizedQuery)) {
    score += 1
    console.log('[Search Page] Category match found, score +1')
  }
  
  console.log('[Search Page] Final score:', score)
  return score
}

watch(searchQuery, () => {
  console.log('[Search Page] Search query changed, triggering new search')
  searchStore.searchProducts(searchQuery.value)
})

onMounted(() => {
  console.log('[Search Page] Component mounted, initiating search')
  searchStore.searchProducts(searchQuery.value)
})

onUnmounted(() => {
  console.log('[Search Page] Component unmounting, resetting store')
  searchStore.resetState()
})

const formatPrice = (price) => {
  if (!price) return '0'
  try {
    const formatted = new Intl.NumberFormat('vi-VN').format(parseFloat(price))
    console.log('[Search Page] Formatting price:', { original: price, formatted })
    return formatted
  } catch (error) {
    console.error('[Search Page] Error formatting price:', error)
    return '0'
  }
}

const addToCart = (product) => {
  if (!product) return
  console.log('[Search Page] Adding to cart:', product)
  // TODO: Implement add to cart functionality
}
</script>

<style scoped>
.section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.category-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #4086f4;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 1;
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.5rem;
}

.product-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.product-description {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.price-stock {
  margin-bottom: 1.5rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4086f4;
  margin-bottom: 0.5rem;
}

.stock {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.stock-label {
  color: #27ae60;
  font-weight: 600;
}

.stock-count {
  color: #7f8c8d;
}

.product-actions {
  margin-top: 1rem;
}

.button.is-primary {
  background-color: #4086f4;
  border-color: transparent;
}

.button.is-primary:hover {
  background-color: #3476e4;
}

.button.is-warning {
  background-color: #ffd700;
  border-color: transparent;
  color: #363636;
}

.button.is-warning:hover {
  background-color: #f4ce00;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .column.is-3 {
    padding: 0.5rem;
  }
  
  .product-card {
    margin-bottom: 1rem;
  }
  
  .product-image {
    height: 180px;
  }
  
  .product-info {
    padding: 1rem;
  }
  
  .price {
    font-size: 1.25rem;
  }
}
</style>