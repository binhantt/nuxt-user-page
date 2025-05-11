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
          <NuxtLink to="/" class="button is-warning">
            Quay lại trang chủ
          </NuxtLink>
        </p>
      </div>

      <!-- Search Results -->
      <div v-else class="content">
        <div v-for="category in safeDisplayProducts" :key="category?.category?.id || 'unknown'" class="mb-6">
          <h2 class="title is-4">{{ category?.category?.name || 'Không có danh mục' }}</h2>
          <div class="columns is-multiline">
            <div v-for="product in category?.products || []" :key="product?.id || 'unknown'" class="column is-3">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img :src="product?.main_image_url" :alt="product?.name">
                  </figure>
                </div>
                <div class="card-content">
                  <p class="title is-5">{{ product?.name || 'Không có tên' }}</p>
                  <p class="has-text-primary has-text-weight-bold">
                    {{ formatPrice(product?.price) }}đ
                  </p>
                </div>
                <footer class="card-footer">
                  <NuxtLink :to="'/product/' + (product?.id || '')" class="card-footer-item has-background-primary has-text-white">
                    Chi tiết
                  </NuxtLink>
                  <a @click="addToCart(product)" class="card-footer-item has-background-warning">
                    Thêm vào giỏ
                  </a>
                </footer>
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