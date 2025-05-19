<template>
  <div v-if="product" class="product-detail-container">
    <div class="product-card">
      <div class="product-left">
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
              @click="setMainImage(img.image_url)"
            />
          </div>
        </div>
        <div class="product-basic">
          <div class="description" v-if="product.description">
            <h3>Mô tả sản phẩm</h3>
            <p>{{ product.description }}</p>
          </div>
          <div class="manufacturer">
            <b>Nhà sản xuất:</b> {{ product.manufacturer_name }} 
          </div>
          <div class="manufacturer-phone">
            <b>SĐT NSX:</b> {{ product.manufacturer_phone }}
          </div>
          <div class="manufacturer-address">
            <b>Địa chỉ NSX:</b> {{ product.manufacturer_address }}
          </div>
        </div>
      </div>
      <div class="product-info">
        <h1 class="title is-3">{{ product.product_name }}</h1>
        <div class="sku">Mã sản phẩm: <b>{{ product.sku }}</b></div>
        <div class="price">
          {{ formatPrice(product.price) }}
        </div>
        <div class="stock" :class="{ 'low-stock': product.stock < 10 }">
          Tồn kho: <b>{{ product.stock }}</b>
        </div>
        <div v-if="product.warranties && product.warranties.length" class="warranty-info">
          <h3>Thông tin bảo hành</h3>
          <ul>
            <li v-for="(w, idx) in product.warranties" :key="idx">
              <div class="warranty-item">
                <span class="warranty-period">Thời hạn: {{ w.warranty_period }}</span>
                <span class="warranty-provider">Nhà cung cấp: {{ w.warranty_provider }}</span>
                <span class="warranty-conditions">Điều kiện: {{ w.warranty_conditions }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="field" style="max-width: 200px; margin-bottom: 12px;">
          <div class="title is-6">
            <span>Tổng tiền: </span>
            {{ formatPrice(product.price * orderQuantity) }}
            <span v-if="orderQuantity > 1" style="font-size:0.95em; color:#888;">
              ({{ formatPrice(product.price) }} x {{ orderQuantity }})
            </span>
          </div>
          <label for="mainQuantity" style="font-weight:600;">Số lượng</label>
          <input
            id="mainQuantity"
            v-model="orderQuantity"
            type="number"
            min="1"
            :max="product.stock"
            required
            class="input"
            :disabled="!canOrder"
          />
        </div>
        <button
          class="button is-warning is-large order-btn"
          @click="orderProduct"
          :disabled="!canOrder"
        >
          <span class="icon"><i class="fas fa-shopping-cart"></i></span>
          <span>Đặt đơn hàng</span>
        </button>
        <div v-if="product && product.is_active == 0" class="order-warning">
          Sản phẩm này hiện không hoạt động, không thể đặt hàng.
        </div>
        <div v-else-if="product && product.stock == 0" class="order-warning">
          Sản phẩm đã hết hàng, không thể đặt hàng.
        </div>
      </div>
    </div>
    <div v-if="uniqueSpecs.length" class="specs-section">
      <h2 class="subtitle is-5">Thông số kỹ thuật</h2>
      <div class="specs-grid">
        <div v-for="(spec, idx) in uniqueSpecs" :key="idx" class="spec-item">
          <span class="spec-name">{{ spec.spec_name }}:</span>
          <span class="spec-value">{{ spec.spec_value }}</span>
        </div>
      </div>
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
    <div v-if="showToast" :class="['custom-toast', toastType === 'error' ? 'error-toast' : '']">
      {{ toastMessage }}
    </div>
  </div>
  <div v-else>
    <p>Không tìm thấy sản phẩm.</p>
  </div>
</template>

<script setup>
import { useProductStore } from '~/stores/productStore'
import { computed, onMounted, ref } from 'vue'
import { useOrderStore } from '~/stores/orderStore'
const route = useRoute()
const productStore = useProductStore()
const orderStore = useOrderStore()

const products = computed(() => {
  const data = productStore.products.data
  return Array.isArray(data) ? data : []
})
const product = computed(() => products.value[0] || null)
const currentMainImage = ref('')

const setMainImage = (imageUrl) => {
  currentMainImage.value = imageUrl
}

const formatPrice = (price) => {
  const numericPrice = parseFloat(price)
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericPrice)
}
const orderProduct = async () => {
  try {
    // Kiểm tra số lượng đặt hàng
    if (orderQuantity.value > product.value.stock) {
      showErrorToast(`Số lượng đặt hàng (${orderQuantity.value}) vượt quá số lượng tồn kho (${product.value.stock})`)
      return
    }

    const user = localStorage.getItem('user')
    if (!user) {
      // Chưa đăng nhập - hiện form
      showOrderForm.value = true
      orderName.value = ''
      orderPhone.value = ''
      orderAddress.value = ''
      orderQuantity.value = 1
      return
    }

    const userData = JSON.parse(user)
    // Đã đăng nhập - tạo đơn hàng trực tiếp
    const orderData = {
      user_id: userData.id,
      items: [
        {
          product_id: product.value.product_id,
          quantity: orderQuantity.value,
          price: product.value.price * orderQuantity.value,
          phone: userData.phone,
          name: userData.name,
        },
      ],
      payment_method: 'COD',
      shipping_address: userData.address,
      created_at: new Date().toISOString(), // Thêm thời gian tạo đơn
    }

    const result = await orderStore.createOrder(orderData)
    if (result.success) {
      const cancelTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 giờ từ thời điểm hiện tại
      const formattedCancelTime = cancelTime.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
      
      showSuccessToast(`Đặt hàng thành công!\nBạn có thể hủy đơn hàng trước ${formattedCancelTime}`)
      if (product.value) {
        product.value.stock -= orderQuantity.value
      }
    } else {
      alert('Đặt hàng thất bại: ' + (result.error || ''))
    }
  } catch (error) {
    // Nếu có lỗi khi parse JSON
    showOrderForm.value = true
    orderName.value = ''
    orderPhone.value = ''
    orderAddress.value = ''
    orderQuantity.value = 1
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

const canOrder = computed(() => {
  return product.value && product.value.is_active == 1 && product.value.stock > 0
})

// Update submitOrderForm to include quantity
const submitOrderForm = async () => {
  if (!product.value) {
    alert('Không tìm thấy sản phẩm!')
    return
  }

  // Kiểm tra số lượng đặt hàng
  if (orderQuantity.value > product.value.stock) {
    showErrorToast(`Số lượng đặt hàng (${orderQuantity.value}) vượt quá số lượng tồn kho (${product.value.stock})`)
    return
  }

  // Form này chỉ dùng cho người chưa đăng nhập
  const orderData = {
    items: [
      {
        product_id: product.value.product_id,
        quantity: orderQuantity.value,
        price: product.value.price * orderQuantity.value,
      },
    ],
    name: orderName.value,
    phone: orderPhone.value,
    payment_method: 'COD',
    shipping_address: orderAddress.value,
    created_at: new Date().toISOString(), // Thêm thời gian tạo đơn
  }

  const result = await orderStore.createOrder(orderData)
  if (result.success) {
    const cancelTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // 24 giờ từ thời điểm hiện tại
    const formattedCancelTime = cancelTime.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    showSuccessToast(
      `Đặt hàng thành công!\nTên: ${orderName.value}\nSĐT: ${orderPhone.value}\nĐịa chỉ: ${orderAddress.value}\nSố lượng: ${orderQuantity.value}\n\nBạn có thể hủy đơn hàng trước ${formattedCancelTime}`
    )
    showOrderForm.value = false
    if (product.value) {
      product.value.stock -= orderQuantity.value
    }
    // Reset form
    orderName.value = ''
    orderPhone.value = ''
    orderAddress.value = ''
    orderQuantity.value = 1
  } else {
    alert('Đặt hàng thất bại: ' + (result.error || ''))
  }
}

const getUserData = () => {
  try {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  } catch {
    return null
  }
}

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' hoặc 'error'

function showSuccessToast(message) {
  toastMessage.value = message
  toastType.value = 'success'
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

function showErrorToast(message) {
  toastMessage.value = message
  toastType.value = 'error'
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
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
  max-width: 1000px;
  margin: 24px auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07), 0 1.5px 4px 0 rgba(0,0,0,0.03);
  padding: 32px 24px;
}
.product-card {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  align-items: flex-start;
}
.product-left {
  flex: 0 0 260px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}
.product-images {
  width: 200px;
  margin-bottom: 8px;
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
  flex: 1 1 350px;
  min-width: 260px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sku {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
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
.description {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
.description p {
  color: #444;
  line-height: 1.6;
}
.warranty-info {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
.warranty-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
.warranty-item:last-child {
  border-bottom: none;
}
.warranty-period {
  color: #3273dc;
  font-weight: 600;
}
.warranty-provider {
  color: #666;
}
.warranty-conditions {
  color: #444;
  font-style: italic;
}
.specs-section {
  margin-top: 32px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
}
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}
.spec-item {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.spec-name {
  font-weight: 600;
  color: #3273dc;
}
.spec-value {
  color: #444;
}
.low-stock {
  color: #ff3860;
}
.order-warning {
  color: #ff3860;
  font-weight: 600;
  margin-top: 12px;
}
@media (max-width: 700px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}
.custom-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #48c774;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
  white-space: pre-line;
  max-width: 400px;
}

.error-toast {
  background: #ff3860;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
