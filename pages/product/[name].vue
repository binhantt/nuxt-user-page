<template>
  <div v-if="product" class="product-detail-container">
    <div class="product-card">
      <div class="product-images">
        <img
          :src="product.main_image_url || defaultImage"
          :alt="product.product_name"
          class="main-image"
        />
        <div class="thumbnails" v-if="uniqueImages.length">
          <img
            v-for="(img, idx) in uniqueImages"
            :key="idx"
            :src="img.image_url || defaultImage"
            class="thumb"
            :alt="product.product_name"
          />
        </div>
      </div>
      <div class="product-info">
        <h1 class="title is-3">{{ product.product_name }}</h1>
        <div class="price">{{ formatPrice(product.price) }}</div>
        <div class="stock">Tồn kho: <b>{{ product.stock }}</b></div>
        <div class="category">
          <b>Danh mục:</b> {{ product.category_name }} ({{ product.parent_category_name }})
        </div>
        <div class="manufacturer">
          <b>Nhà sản xuất:</b> {{ product.manufacturer_name }} - {{ product.manufacturer_phone }}
        </div>
        <div class="manufacturer-address">
          <b>Địa chỉ NSX:</b> {{ product.manufacturer_address }}
        </div>
        <div v-if="product.warranties && product.warranties.length">
          <b>Bảo hành:</b>
          <ul>
            <li v-for="(w, idx) in product.warranties" :key="idx">
              {{ w.warranty_period }} - {{ w.warranty_provider }} ({{ w.warranty_conditions }})
            </li>
          </ul>
        </div>
        <div class="field" style="max-width: 160px; margin-bottom: 12px;">
          <label for="mainQuantity" style="font-weight:600;">Số lượng</label>
          <input
            id="mainQuantity"
            v-model="orderQuantity"
            type="number"
            min="1"
            :max="product.stock"
            required
            class="input"
          />
        </div>
        <button class="button is-warning is-large order-btn" @click="orderProduct">
          <span class="icon"><i class="fas fa-shopping-cart"></i></span>
          <span>Đặt đơn hàng</span>
        </button>
      </div>
    </div>
    <div v-if="uniqueSpecs.length">
      <h2 class="subtitle is-5">Thông số kỹ thuật</h2>
      <ul>
        <li v-for="(spec, idx) in uniqueSpecs" :key="idx">
          <b>{{ spec.spec_name }}:</b> {{ spec.spec_value }}
        </li>
      </ul>
    </div>
    <!-- Modal Order Form -->
    <div v-if="showOrderForm" class="modal-overlay" @click.self="showOrderForm = false">
      <div class="modal-content">
        <button class="modal-close" @click="showOrderForm = false">&times;</button>
        <form @submit.prevent="submitOrderForm">
          <h3 class="modal-title">Thông tin giao hàng</h3>
          <div class="field">
            <label>Họ tên</label>
            <input v-model="orderName" required class="input" />
          </div>
          <div class="field">
            <label>Số điện thoại</label>
            <input v-model="orderPhone" required class="input" />
          </div>
          <div class="field">
            <label>Địa chỉ giao hàng</label>
            <input v-model="orderAddress" required class="input" />
          </div>
          <div class="field">
            <label>Số lượng</label>
            <input 
              v-model="orderQuantity" 
              type="number" 
              min="1" 
              :max="product.stock" 
              required 
              class="input"
            />
          </div>
          <div class="modal-actions">
            <button class="button is-warning" type="submit">Xác nhận đặt hàng</button>
            <button class="button" type="button" @click="showOrderForm = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Không tìm thấy sản phẩm.</p>
  </div>
</template>

<script setup>
import { useProductStore } from '~/stores/productStore'
import { computed, onMounted, ref } from 'vue'
const route = useRoute()
const productStore = useProductStore()
const defaultImage = 'https://via.placeholder.com/350x350?text=No+Image'
const products = computed(() => {
  const data = productStore.products.data
  return Array.isArray(data) ? data : []
})
const product = computed(() => products.value[0] || null)
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
const orderProduct = () => {
  if (!isLoggedIn.value) {
    showOrderForm.value = true
  } else {
    alert('Bạn đã đặt đơn hàng thành công!')
  }
}
const uniqueSpecs = computed(() => {
  if (!product.value || !product.value.product_details) return []
  const seen = new Set()
  return product.value.product_details.filter(spec => {
    if (!spec.spec_name) return false
    const key = `${spec.spec_name}:${spec.spec_value}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})
const uniqueImages = computed(() => {
  if (!product.value || !product.value.product_images) return []
  const seen = new Set()
  return product.value.product_images.filter(img => {
    if (!img.image_url) return false
    if (seen.has(img.image_url)) return false
    seen.add(img.image_url)
    return true
  })
})
const isLoggedIn = ref(false)
const showOrderForm = ref(false)
const orderName = ref('')
const orderPhone = ref('')
const orderAddress = ref('')
// Add to existing refs
const orderQuantity = ref(1)

// Update submitOrderForm to include quantity
const submitOrderForm = () => {
  alert(
    `Đặt hàng thành công!\nTên: ${orderName.value}\nSĐT: ${orderPhone.value}\nĐịa chỉ: ${orderAddress.value}\nSố lượng: ${orderQuantity.value}`
  )
  showOrderForm.value = false
  orderName.value = ''
  orderPhone.value = ''
  orderAddress.value = ''
  orderQuantity.value = 1
}
onMounted(async () => {
  try {
    const productName = route.params.name
    await productStore.fetchProductsByCategory(productName)
    isLoggedIn.value = !!localStorage.getItem('user')
  } catch (error) {
    console.error('Error loading product:', error)
  }
})
</script>

<style scoped>
.product-detail-container {
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07), 0 1.5px 4px 0 rgba(0,0,0,0.03);
  padding: 32px 24px;
}
.product-card {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}
.product-images {
  flex: 1 1 320px;
  min-width: 280px;
}
.main-image {
  width: 100%;
  max-width: 350px;
  border-radius: 10px;
  box-shadow: 0 2px 8px #ccc;
  background: #f5f5f5;
  object-fit: cover;
}
.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
  cursor: pointer;
  transition: box-shadow 0.2s;
  background: #f5f5f5;
}
.thumb:hover {
  box-shadow: 0 2px 8px #3273dc55;
}
.product-info {
  flex: 2 1 350px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.price {
  color: #3273dc;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.stock {
  color: #48c774;
  font-weight: 500;
}
.category, .manufacturer, .manufacturer-address {
  color: #555;
}
.order-btn {
  margin-top: 24px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px #ffd70055;
  transition: background 0.2s, box-shadow 0.2s;
}
.order-btn:hover {
  background: #ffed4a;
  box-shadow: 0 4px 16px #ffd70099;
}
.subtitle.is-5 {
  margin-top: 32px;
  color: #3273dc;
}
.order-form {
  max-width: 400px;
  margin: 32px auto 0 auto;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ccc;
  padding: 24px 18px;
}
.order-form .field {
  margin-bottom: 14px;
}
.order-form label {
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}
.order-form .input {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #eee;
  padding: 8px 10px;
}
@media (max-width: 700px) {
  .product-card {
    flex-direction: column;
    gap: 18px;
  }
}
.modal-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(50, 115, 220, 0.18);
  padding: 32px 24px 24px 24px;
  min-width: 340px;
  max-width: 95vw;
  position: relative;
  animation: modalPop 0.25s;
}
@keyframes modalPop {
  from { transform: scale(0.95) translateY(30px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #3273dc;
  margin-bottom: 18px;
  text-align: center;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #3273dc;
}
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 18px;
}
</style>

/* Add if needed for quantity input styling */
.input[type="number"] {
  max-width: 120px;
}