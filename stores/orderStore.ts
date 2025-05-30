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
  optimisticUpdates: Map<number, { status: string; previousStatus: string }>
  cancelDeadlines: Map<number, { canCancel: boolean; deadline: string }>
}

export const useOrderStore = defineStore('order', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    optimisticUpdates: new Map(),
    cancelDeadlines: new Map()
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

    async getOrders(userId: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(API_ENDPOINTS.orders.list(userId), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Add debug logging
        console.log('[Order Store] Fetching orders for user:', userId);
        console.log('[Order Store] API Endpoint:', API_ENDPOINTS.orders.list(userId));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        // Ensure orders is always an array
        this.orders = Array.isArray(result.data) ? result.data : 
                     Array.isArray(result) ? result : []
        return { success: true, data: this.orders }
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

    async checkCancelEligibility(orderId: number) {
      try {
        const response = await fetch(API_ENDPOINTS.orders.checkCancelEligibility(orderId), 
        {
          method : "DELETE",
         
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        this.cancelDeadlines.set(orderId, {
          canCancel: result.canCancel,
          deadline: result.deadline
        })
        return result
      } catch (error) {
        console.error('[Order Store] Error checking cancel eligibility:', error)
        return { canCancel: false, deadline: null }
      }
    },

    async cancelOrder(orderId: number) {
      this.error = null
      
      // Ensure orders is an array before using find
      if (!Array.isArray(this.orders)) {
        console.error('[Order Store] Orders is not an array:', this.orders)
        this.orders = []
        return {
          success: false,
          error: 'Invalid orders data'
        }
      }

      const orderToUpdate = this.orders.find(order => order.id === orderId)
      if (!orderToUpdate) {
        return {
          success: false,
          error: 'Order not found'
        }
      }

      const previousStatus = orderToUpdate.status

      try {
        // Optimistically update the order status
        this.optimisticUpdates.set(orderId, {
          status: 'cancelled',
          previousStatus
        })
        
        // Update the orders list optimistically
        this.orders = this.orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'cancelled', updated_at: new Date().toISOString() }
            : order
        )

        // Make the API call
        const response = await fetch(API_ENDPOINTS.orders.cancel(orderId), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        // Clear the optimistic update on success
        this.optimisticUpdates.delete(orderId)
        
        return { success: true, data: result }
      } catch (error) {
        console.error('[Order Store] Error canceling order:', error)
        
        // Revert the optimistic update on failure
        if (this.optimisticUpdates.has(orderId)) {
          const { previousStatus } = this.optimisticUpdates.get(orderId)!
          this.orders = this.orders.map(order => 
            order.id === orderId 
              ? { ...order, status: previousStatus }
              : order
          )
          this.optimisticUpdates.delete(orderId)
        }
        
        this.error = error instanceof Error ? error.message : 'Có lỗi xảy ra khi hủy đơn hàng'
        return { success: false, error: this.error }
      }
    }
  },

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getError: (state) => state.error,
    getAllOrders: (state) => state.orders,
    getCurrentOrder: (state) => state.currentOrder,
    getOrderById: (state) => (id: number) => state.orders.find(order => order.id === id),
    isOptimisticallyUpdating: (state) => (orderId: number) => state.optimisticUpdates.has(orderId),
    canCancelOrder: (state) => (orderId: number) => {
      const deadlineInfo = state.cancelDeadlines.get(orderId)
      if (!deadlineInfo) return false
      return deadlineInfo.canCancel
    },
    
    getCancelDeadline: (state) => (orderId: number) => {
      const deadlineInfo = state.cancelDeadlines.get(orderId)
      return deadlineInfo?.deadline || null
    }
  }
})