<template>
  <div class="orders-content">
    <div v-if="isLoading" class="has-text-centered py-6">
      <span class="icon is-large">
        <i class="fas fa-spinner fa-pulse fa-2x"></i>
      </span>
    </div>
    
    <div v-else-if="!orders.length" class="has-text-centered py-6">
      <span class="icon is-large has-text-grey">
        <i class="fas fa-shopping-bag fa-3x"></i>
      </span>
      <p class="title is-4 mt-4">Chưa có đơn hàng nào</p>
      <p class="subtitle is-6">Bạn chưa có đơn hàng nào trong lịch sử mua sắm</p>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="card mb-4">
        <header class="card-header">
          <p class="card-header-title">
            Đơn hàng #{{ order.id }}
          </p>
          <span class="card-header-icon">
            {{ formatDate(order.created_at) }}
          </span>
        </header>

        <div class="card-content">
          <div class="content">
            <div class="order-items">
              <div v-for="item in order.items" :key="item.product_id" class="order-item">
                <figure class="image is-64x64">
                  <img :src="item.main_image_url" :alt="item.product_name">
                </figure>
                <div class="item-details">
                  <p class="item-name">{{ item.product_name }}</p>
                  <p class="item-price">
                    {{ formatPrice(item.price) }} x {{ item.quantity }}
                  </p>
                </div>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-total">
                <strong>Tổng cộng:</strong>
                <span>{{ formatPrice(order.total_amount) }}</span>
              </div>
              <div class="order-status">
                <span class="tag" :class="getStatusClass(order.status)">
                  {{ getStatusText(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer v-if="order.status === 'pending'" class="card-footer">
          <a 
            class="card-footer-item has-text-danger" 
            :class="{ 'is-loading': cancellingOrders[order.id] }"
            @click="handleCancelOrder(order.id)"
          >
            <span class="icon">
              <i class="fas fa-times"></i>
            </span>
            <span>Hủy đơn hàng</span>
          </a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Order } from '~/types'

const props = defineProps<{
  orders: Order[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel-order', orderId: number): void
}>()

// Track cancelling state for each order
const cancellingOrders = reactive<Record<number, boolean>>({})

// Handle order cancellation with loading state
const handleCancelOrder = async (orderId: number) => {
  if (cancellingOrders[orderId]) return // Prevent double-clicks
  
  cancellingOrders[orderId] = true
  try {
    await emit('cancel-order', orderId)
  } finally {
    cancellingOrders[orderId] = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numPrice)
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    'pending': 'is-warning',
    'processing': 'is-info',
    'shipped': 'is-primary',
    'delivered': 'is-success',
    'cancelled': 'is-danger'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'is-light'
}

const getStatusText = (status: string) => {
  const statusTexts = {
    'pending': 'Chờ xử lý',
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
}
</script>

<style scoped>
.orders-list {
  max-width: 800px;
  margin: 0 auto;
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.item-price {
  color: #666;
  font-size: 0.9rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f5f5f5;
}

.order-total {
  font-size: 1.1rem;
}

.order-total strong {
  margin-right: 0.5rem;
}

.card-footer-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-footer-item:hover {
  background-color: #fff5f5;
}

.card-footer-item.is-loading {
  pointer-events: none;
  opacity: 0.7;
}

.card-footer-item.is-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1em;
  height: 1em;
  border: 2px solid #f14668;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinAround 500ms infinite linear;
}

@keyframes spinAround {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style> 