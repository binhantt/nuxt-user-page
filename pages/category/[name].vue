<template>
  <div class="container py-6">
    <div v-if="loading" class="has-text-centered py-6">
      <span class="icon is-large">
        <i class="fas fa-spinner fa-pulse fa-2x"></i>
      </span>
    </div>
    
    <div v-else-if="error" class="notification is-warning">
      {{ error }}
    </div>
    
    <div v-else>
      <h1 class="title is-2 has-text-centered mb-6">{{ category?.name }}</h1>
      
      <div v-if="category?.categories?.length">
        <div v-for="mainCategory in category.categories" :key="mainCategory.id" class="mb-6">
          <h2 class="title is-4  mb-5">{{ mainCategory.name }}</h2>
          
          <div class="columns is-multiline">
            <div 
              v-for="product in mainCategory.products" 
              :key="product.id" 
              class="column is-4-tablet is-3-desktop"
            >
              <div class="product-card box">
                <div class="product-image mb-4">
                  <img 
                    :src="product.main_image_url || product.image" 
                    :alt="product.name"
                    class="image is-square"
                  >
                  <NuxtLink 
                    :to="`/product/${formatProductUrl(product.name)}`" 
                    class="button is-warning is-rounded mt-3 is-fullwidth"
                  >
                    <span class="icon">
                      <i class="fas fa-eye"></i>
                    </span>
                    <span>Xem Chi Tiết</span>
                  </NuxtLink>
                </div>
                
                <div class="product-content">
                  <h3 class="title is-5 mb-2">
                    <NuxtLink 
                      :to="`/product/${formatProductUrl(product.name)}`" 
                      class="has-text-dark"
                    >
                      {{ product.name }}
                    </NuxtLink>
                  </h3>
                  
                  <div class="price-tag has-text-weight-bold mb-3">
                    {{ formatPrice(product.price) }}
                  </div>
                  
                  <div class="tags">
                    <span 
                      class="tag" 
                      :class="product.stock > 0 ? 'is-success' : 'is-danger'"
                    >
                      {{ product.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="notification is-light has-text-centered">
        Không tìm thấy danh mục nào
      </div>
    </div>
  </div>
</template>

<script setup>
// Add these to the script section of [name].vue
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(price)
}

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
const route = useRoute()
const { name } = route.params
const categoryStore = useCategoryStore()

const category = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await categoryStore.getCategoryByName(name)
    if (!response) {
      throw new Error('Empty response from API')
    }
    category.value = response.data?.[0] || response // Handle both array and direct object responses
    console.log('Category:', category.value)
  } catch (err) {
    error.value = err.message
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.price-tag {
  color: #e53935;
  font-size: 1.2rem;
}
</style>