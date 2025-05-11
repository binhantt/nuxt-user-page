<template>
  <div class="product-detail">
    <!-- Product Information Section -->
    <section v-if="product" class="hero is-light">
      <div class="hero-body">
        <div class="container">
          <div class="is-vcentered">
            <div class="">
              <div class="image-gallery">
                <figure class="image main-image">
                  <img :src="product.main_image_url" :alt="product.name">
                </figure>
                <div class="thumbnails" v-if="product.images && product.images.length">
                  <figure 
                    v-for="image in product.images" 
                    :key="image.id" 
                    class="image thumbnail"
                    @click="selectImage(image)"
                  >
                    <img :src="image.image_url" :alt="product.name">
                  </figure>
                </div>
              </div>
            </div>
            <!-- Product Details -->
            <div class="py-2">
              <div class="product-info">
                <h1 class="title is-2 has-text-primary">{{ product.name }}</h1>
                <p class="subtitle is-4 has-text-grey">{{ product.description }}</p>
                
                <div class="tags are-medium mb-4">
                  <span v-if="product.category" class="tag is-primary is-light">
                    <span class="icon">
                      <i class="fas fa-tag"></i>
                    </span>
                    <span>{{ product.category.name }}</span>
                  </span>
                </div>

                <div class="price-box">
                  <p class="price has-text-primary">{{ formatPrice(product.price) }}</p>
                  <div class="stock-info mt-3">
                    <span class="tag is-medium" :class="product.stock > 0 ? 'is-primary is-light' : 'is-warning is-light'">
                      <span class="icon">
                        <i class="fas" :class="product.stock > 0 ? 'fa-check-circle' : 'fa-times-circle'"></i>
                      </span>
                      <span>{{ product.stock > 0 ? 'Còn hàng' : 'Hết hàng' }}</span>
                    </span>
                    <span class="tag is-primary is-light is-medium ml-2" v-if="product.stock > 0">
                      <span class="icon">
                        <i class="fas fa-box"></i>
                      </span>
                      <span>Còn {{ product.stock }} sản phẩm</span>
                    </span>
                  </div>

                  <button 
                    class="button is-warning is-large is-fullwidth mt-5" 
                    :disabled="product.stock <= 0"
                    :class="{'is-loading': isLoading}"
                  >
                    <span class="icon">
                      <i class="fas fa-shopping-cart"></i>
                    </span>
                    <span>{{ product.stock > 0 ? 'Mua Ngay' : 'Hết Hàng' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Product Images -->
           
          </div>
        </div>
      </div>
    </section>

    <!-- Product Details Section -->
    <section v-if="product" class="section">
      <div class="container">
        <div class="columns">
          <!-- Main Content -->
          <div class="column is-8">
            <div class="content">
              <!-- Technical Specifications -->
              <div class="specs-section card">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon-text">
                      <span class="icon has-text-primary">
                        <i class="fas fa-microchip"></i>
                      </span>
                      <span>Thông Số Kỹ Thuật</span>
                    </span>
                  </p>
                </header>
                <div class="card-content">
                  <div class="specs-table" v-if="product.details && product.details.length">
                    <div v-for="detail in product.details" :key="detail.id" class="spec-item">
                      <strong>{{ detail.spec_name }}:</strong>
                      <span>{{ detail.spec_value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Warranty Information -->
              <div class="warranty-section card mt-6">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon-text">
                      <span class="icon has-text-primary">
                        <i class="fas fa-shield-alt"></i>
                      </span>
                      <span>Thông Tin Bảo Hành</span>
                    </span>
                  </p>
                </header>
                <div class="card-content">
                  <div class="warranty-info" v-if="product.warranties && product.warranties.length">
                    <div v-for="warranty in product.warranties" :key="warranty.id" class="warranty-item">
                      <div class="warranty-detail">
                        <span class="icon has-text-primary">
                          <i class="fas fa-check-circle"></i>
                        </span>
                        <div>
                          <p><strong>Thời gian bảo hành:</strong> {{ warranty.warranty_period }} tháng</p>
                          <p><strong>Nhà cung cấp:</strong> {{ warranty.warranty_provider }}</p>
                          <p><strong>Điều kiện:</strong> {{ warranty.warranty_conditions }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product Information -->
              <div class="product-info-section card mt-6">
                <header class="card-header">
                  <p class="card-header-title">
                    <span class="icon-text">
                      <span class="icon has-text-warning">
                        <i class="fas fa-info-circle"></i>
                      </span>
                      <span>Thông Tin Sản Phẩm</span>
                    </span>
                  </p>
                </header>
                <div class="card-content">
                  <div class="columns is-multiline">
                    <div class="column is-6">
                      <div class="info-item">
                        <span class="icon has-text-grey">
                          <i class="fas fa-barcode"></i>
                        </span>
                        <div>
                          <strong>SKU:</strong>
                          <p>{{ product.sku }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="info-item">
                        <span class="icon has-text-grey">
                          <i class="fas fa-weight"></i>
                        </span>
                        <div>
                          <strong>Trọng lượng:</strong>
                          <p>{{ product.weight }}kg</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="info-item">
                        <span class="icon has-text-grey">
                          <i class="fas fa-ruler-combined"></i>
                        </span>
                        <div>
                          <strong>Kích thước:</strong>
                          <p>{{ product.dimensions }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="info-item">
                        <span class="icon has-text-grey">
                          <i class="fas fa-boxes"></i>
                        </span>
                        <div>
                          <strong>Số lượng còn:</strong>
                          <p>{{ product.stock }} sản phẩm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="column is-4">
            <div class="box support-box">
              <h3 class="title is-4">
                <span class="icon-text">
                  <span class="icon has-text-primary">
                    <i class="fas fa-headset"></i>
                  </span>
                  <span>Thông Tin Hỗ Trợ</span>
                </span>
              </h3>
              
              <div class="support-info">
                <div class="support-item">
                  <span class="icon has-text-primary">
                    <i class="fas fa-headset"></i>
                  </span>
                  <div>
                    <strong>Hỗ trợ kỹ thuật</strong>
                    <p>24/7 qua email và chat</p>
                  </div>
                </div>

                <div class="support-item">
                  <span class="icon has-text-warning">
                    <i class="fas fa-sync"></i>
                  </span>
                  <div>
                    <strong>Bảo hành</strong>
                    <p>Theo chính sách nhà sản xuất</p>
                  </div>
                </div>

                <div class="support-item">
                  <span class="icon has-text-primary">
                    <i class="fas fa-shipping-fast"></i>
                  </span>
                  <div>
                    <strong>Vận chuyển</strong>
                    <p>Miễn phí nội thành</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-else-if="productStore.isLoading" class="section">
      <div class="container has-text-centered">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
        <p class="mt-4 is-size-5">Đang tải thông tin sản phẩm...</p>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="section">
      <div class="container">
        <div class="notification is-danger">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-exclamation-triangle"></i>
            </span>
            <span>Không tìm thấy sản phẩm</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '~/stores/productStore'

const route = useRoute()
const productStore = useProductStore()
const isLoading = ref(false)
const selectedImage = ref(null)

// Format price to VND
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Get product data from store
const product = computed(() => {
  const products = productStore.getProducts.data
  console.log('[Product Detail] Available products:', products?.length || 0)
  console.log('[Product Detail] Current route:', { params: route.params })
  
  // Get product by name
  const productName = decodeURIComponent(route.params.name)
  console.log('[Product Detail] Looking for product:', productName)
  
  const foundProduct = products.find(p => p.name === productName) || null
  console.log('[Product Detail] Found product:', foundProduct ? foundProduct.name : 'Not found')
  
  return foundProduct
})

// Handle image selection
const selectImage = (image) => {
  selectedImage.value = image
  console.log('[Product Detail] Selected image:', image.id)
}

// Fetch products on component mount
onMounted(async () => {
  console.log('[Product Detail] Component mounted')
  if (!productStore.getProducts.data.length) {
    console.log('[Product Detail] No products in store, fetching data...')
    isLoading.value = true
    try {
      const result = await productStore.fetchProducts()
      console.log('[Product Detail] Fetch completed:', { 
        success: !!result,
        productsCount: result?.data?.length || 0 
      })
      
      // If no product found after fetching, redirect to products page
      if (!product.value) {
        console.log('[Product Detail] Product not found after fetch, redirecting to products page')
        navigateTo('/products')
      }
    } catch (error) {
      console.error('[Product Detail] Error fetching products:', error.message)
    } finally {
      isLoading.value = false
    }
  } else {
    console.log('[Product Detail] Products already in store:', productStore.getProducts.data.length)
  }
})

// Watch for route changes to refetch if needed
watch(() => route.params.name, async (newName) => {
  console.log('[Product Detail] Route changed:', { newName })
  if (!product.value) {
    console.log('[Product Detail] Product not found on route change, fetching data...')
    isLoading.value = true
    try {
      await productStore.fetchProducts()
      
      // If still no product found, redirect to products page
      if (!product.value) {
        console.log('[Product Detail] Product still not found after fetch, redirecting to products page')
        navigateTo('/products')
      }
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.hero.is-light {
  background: transparent;
}

.product-info {
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
}

.price-box {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #f5f5f5;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3273dc;
  margin-bottom: 1rem;
}

.image-gallery {
  position: relative;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
}

.main-image {
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.05);
}

.thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.thumbnail {
  flex: 0 0 80px;
  height: 80px;
  cursor: pointer;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(50, 115, 220, 0.1);
  transition: transform 0.2s ease;
}

.thumbnail:hover {
  transform: translateY(-2px);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-header {
  background: #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}

.card-header-title {
  font-size: 1.25rem;
}

.specs-table {
  margin: 1rem 0;
}

.spec-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.2s ease;
}

.spec-item:hover {
  background-color: #f5f5f5;
}

.spec-item:last-child {
  border-bottom: none;
}

.spec-item strong {
  width: 200px;
  color: #3273dc;
}

.warranty-info {
  padding: 1rem;
}

.warranty-item {
  margin-bottom: 1.5rem;
}

.warranty-detail {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  transition: transform 0.2s ease;
}

.warranty-detail:hover {
  transform: translateY(-2px);
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  transition: transform 0.2s ease;
}

.info-item:hover {
  transform: translateY(-2px);
}

.support-box {
  border-radius: 1rem;
  box-shadow: 0 8px 16px rgba(50, 115, 220, 0.1);
  background: white;
}

.support-info {
  margin-top: 2rem;
}

.support-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.support-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(50, 115, 220, 0.1);
}

.support-item:last-child {
  margin-bottom: 0;
}

.support-item .icon {
  font-size: 1.5rem;
}

.button.is-warning {
  background-color: #ffd700;
  color: #363636;
  transition: all 0.3s ease;
  height: 3.5rem;
  font-size: 1.25rem;
}

.button.is-warning:hover:not(:disabled) {
  transform: translateY(-2px);
  background-color: #ffed4a;
  box-shadow: 0 4px 8px rgba(50, 115, 220, 0.2);
}

.button.is-warning:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.has-text-primary {
  color: #3273dc !important;
}

.has-text-warning {
  color: #ffd700 !important;
}

.tag.is-primary {
  background-color: #3273dc;
  color: white;
}

.tag.is-warning {
  background-color: #ffd700;
  color: #363636;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .product-info,
  .image-gallery {
    margin-bottom: 2rem;
  }

  .price {
    font-size: 2rem;
  }

  .button.is-warning {
    height: 3rem;
    font-size: 1rem;
  }
}
</style>
