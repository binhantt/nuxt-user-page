<template>
  <div class="section cart-section">
    <div class="container">
      <h1 class="title is-2">Giỏ hàng của bạn</h1>

      <!-- Loading State -->
      <div v-if="loading" class="has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-spinner fa-pulse fa-3x"></i>
        </span>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!cartItems.length" class="empty-cart has-text-centered py-6">
        <span class="icon is-large">
          <i class="fas fa-shopping-cart fa-3x"></i>
        </span>
        <p class="is-size-4 mt-4">Giỏ hàng của bạn đang trống</p>
        <NuxtLink to="/" class="button is-primary mt-4">
          Tiếp tục mua sắm
        </NuxtLink>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="columns">
          <!-- Cart Items List -->
          <div class="column is-8">
            <div class="cart-items">
              <div v-for="item in cartItems" :key="item.id" class="cart-item">
                <div class="card">
                  <div class="card-content">
                    <div class="columns is-mobile is-vcentered">
                      <!-- Product Image -->
                      <div class="column is-3">
                        <figure class="image is-square">
                          <img :src="item.image" :alt="item.name">
                        </figure>
                      </div>

                      <!-- Product Info -->
                      <div class="column is-5">
                        <h3 class="title is-5 mb-2">{{ item.name }}</h3>
                        <p class="subtitle is-6 mb-2">{{ item.category }}</p>
                        <p class="price has-text-primary has-text-weight-bold">
                          {{ formatPrice(item.price) }}đ
                        </p>
                      </div>

                      <!-- Quantity Controls -->
                      <div class="column is-2">
                        <div class="quantity-control">
                          <button 
                            class="button is-small"
                            @click="decreaseQuantity(item)"
                            :disabled="item.quantity <= 1"
                          >
                            <span class="icon">
                              <i class="fas fa-minus"></i>
                            </span>
                          </button>
                          <span class="quantity mx-2">{{ item.quantity }}</span>
                          <button 
                            class="button is-small"
                            @click="increaseQuantity(item)"
                          >
                            <span class="icon">
                              <i class="fas fa-plus"></i>
                            </span>
                          </button>
                        </div>
                      </div>

                      <!-- Total & Remove -->
                      <div class="column is-2">
                        <div class="has-text-right">
                          <p class="total-price has-text-weight-bold mb-2">
                            {{ formatPrice(item.price * item.quantity) }}đ
                          </p>
                          <button 
                            class="button is-small is-danger is-light"
                            @click="removeItem(item)"
                          >
                            <span class="icon">
                              <i class="fas fa-trash"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="column is-4">
            <div class="card order-summary">
              <div class="card-content">
                <h3 class="title is-4">Tổng đơn hàng</h3>
                
                <div class="summary-item">
                  <span>Tạm tính</span>
                  <span>{{ formatPrice(subtotal) }}đ</span>
                </div>

                <div class="summary-item">
                  <span>Phí vận chuyển</span>
                  <span>{{ formatPrice(shippingFee) }}đ</span>
                </div>

                <div class="summary-item discount" v-if="discount">
                  <span>Giảm giá</span>
                  <span>-{{ formatPrice(discount) }}đ</span>
                </div>

                <hr class="my-4">

                <div class="summary-item total">
                  <span>Tổng cộng</span>
                  <span class="has-text-primary has-text-weight-bold">
                    {{ formatPrice(total) }}đ
                  </span>
                </div>

                <!-- Promo Code -->
                <div class="promo-code mt-4">
                  <div class="field has-addons">
                    <div class="control is-expanded">
                      <input 
                        class="input" 
                        type="text" 
                        v-model="promoCode"
                        placeholder="Nhập mã giảm giá"
                      >
                    </div>
                    <div class="control">
                      <button 
                        class="button is-primary"
                        @click="applyPromoCode"
                        :disabled="!promoCode"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Checkout Button -->
                <button 
                  class="button is-primary is-fullwidth mt-4"
                  @click="proceedToCheckout"
                >
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth']
})

const loading = ref(true)
const promoCode = ref('')
const shippingFee = ref(30000) // Fixed shipping fee
const discount = ref(0)

// Mock cart data - Replace with actual cart store
const cartItems = ref([
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Điện thoại',
    price: 34990000,
    quantity: 1,
    image: 'https://picsum.photos/200'
  },
  {
    id: 2,
    name: 'Apple Watch Series 9',
    category: 'Đồng hồ thông minh',
    price: 11990000,
    quantity: 1,
    image: 'https://picsum.photos/201'
  }
])

// Computed properties
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const total = computed(() => {
  return subtotal.value + shippingFee.value - discount.value
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const increaseQuantity = (item) => {
  item.quantity++
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (item) => {
  const index = cartItems.value.indexOf(item)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const applyPromoCode = () => {
  // Mock promo code logic - Replace with actual API call
  if (promoCode.value === 'DISCOUNT10') {
    discount.value = subtotal.value * 0.1
    promoCode.value = ''
  }
}

const proceedToCheckout = () => {
  navigateTo('/checkout')
}

// Simulate loading
onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
})
</script>

<style scoped>
.cart-section {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.cart-item {
  margin-bottom: 1rem;
}

.cart-item .card {
  transition: transform 0.2s ease;
}

.cart-item .card:hover {
  transform: translateY(-2px);
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity {
  min-width: 2rem;
  text-align: center;
}

.order-summary {
  position: sticky;
  top: 2rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.summary-item.total {
  font-size: 1.25rem;
}

.summary-item.discount {
  color: #00c853;
}

.empty-cart {
  color: #666;
}

.empty-cart .icon {
  color: #ccc;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .cart-item .columns {
    flex-direction: column;
  }

  .cart-item .column {
    padding: 0.5rem;
  }

  .cart-item .column.is-3 {
    width: 50%;
    margin: 0 auto;
  }

  .quantity-control {
    margin: 1rem 0;
  }

  .order-summary {
    position: relative;
    top: 0;
    margin-top: 2rem;
  }
}
</style> 