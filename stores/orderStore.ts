import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

interface OrderItem {
  product_id: number
  quantity: number
  price: number
}

interface OrderData {
  user_id: number
  items: OrderItem[]
  shipping_address: string
}

interface OrderState {
  orders: any[]
  currentOrder: any | null
  loading: boolean
  error: string | null
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  actions: {
    async createOrder(orderData: OrderData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('[Order Store] Creating order:', orderData)
        
        const response = await fetch(API_ENDPOINTS.orders.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('[Order Store] Order created successfully:', result)
        
        this.currentOrder = result
        return { success: true, data: result }
      } catch (error) {
        console.error('[Order Store] Error creating order:', error)
        this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi tạo đơn hàng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getOrders() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.orders.list)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        this.orders = result
        return { success: true, data: result }
      } catch (error) {
        console.error('[Order Store] Error fetching orders:', error)
        this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy danh sách đơn hàng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async getOrderDetail(orderId: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.orders.detail(orderId))
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        this.currentOrder = result
        return { success: true, data: result }
      } catch (error) {
        console.error('[Order Store] Error fetching order detail:', error)
        this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi lấy chi tiết đơn hàng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async cancelOrder(orderId: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.orders.cancel(orderId), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ orderId })
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        // Immediately update the local state
        this.orders = this.orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled', updated_at: new Date().toISOString() }
            : order
        )
        
        // If this is the current order, update it too
        if (this.currentOrder?.id === orderId) {
          this.currentOrder = {
            ...this.currentOrder,
            status: 'cancelled',
            updated_at: new Date().toISOString()
          }
        }
        
        return { success: true, data: result }
      } catch (error) {
        console.error('[Order Store] Error canceling order:', error)
        this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi hủy đơn hàng'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error,
    getAllOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder,
    getOrderById: (state) => (id: number) => state.orders.find(order => order.id === id)
  }
}) 