import { defineStore } from 'pinia'
import { API_ENDPOINTS ,BASE_URL } from '~/config/Api'
import type { Product, ProductState } from '~/types/product'

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: {
      success: true,
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 12
      }
    },
    loading: false,
    error: null,
    filters: {}
  }),

  getters: {
    getProducts: (state) => state.products,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getPagination: (state) => state.products.pagination,
    getFilters: (state) => state.filters
  },

  actions: {
    async getProduct() {
      try {
        const response = await fetch(BASE_URL+'/users/products/category/1')
        const data = await response.json()
        console.log('data', data)
        this.products = data.data
      } catch (error) {
        console.error('[ProductStore] Error fetching products:', error)
      }
    },
    // Fetch products with pagination and filters
    async fetchProducts(page: number = 1, filters = {}) {
      this.loading = true
      this.error = null
      
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: this.products.pagination.itemsPerPage.toString(),
          ...filters
        })

        const response = await fetch(`${API_ENDPOINTS.products.list}?${queryParams}`)
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm')
        }

        const data = await response.json()
        
        this.products = data
        this.filters = filters
        
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error fetching products:', error)
        return null
      } finally {
        this.loading = false
      }
    },
    async fetchProductsByCategory(name: string) {
      try {
        const response = await fetch(`${API_ENDPOINTS.products.list}/${name}`)
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm')
        }
        const data = await response.json()
        this.products = data
        return data
      } catch (error) {
        console.error('Error fetching products:', error)
        throw error
      }
    },
    // Get product by ID
    async getProductById(id: string | number) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.detail(id))
        if (!response.ok) {
          throw new Error('Không tìm thấy sản phẩm')
        }

        const data = await response.json()
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error fetching product:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Search products
    async searchProducts(query: string) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${API_ENDPOINTS.products.search}?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error('Không thể tìm kiếm sản phẩm')
        }

        const data = await response.json()
        this.products = data.items
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error searching products:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Get products by category
    async getProductsByCategory(categoryId: string | number) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.byCategory(categoryId))
        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm theo danh mục')
        }

        const data = await response.json()
        this.products = data.items
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error fetching products by category:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Get products by platform
    async getProductsByPlatform(platform: string) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.byPlatform(platform))
        if (!response.ok) {
          throw new Error('Không thể tải sản phẩm theo nền tảng')
        }

        const data = await response.json()
        this.products = data.items
        return data
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error fetching products by platform:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Create new product
    async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        })

        if (!response.ok) {
          throw new Error('Không thể tạo sản phẩm mới')
        }

        const newProduct = await response.json()
        this.products.data.unshift(newProduct)
        return newProduct
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error creating product:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    // Update product
    async updateProduct(id: number, product: Partial<Product>) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.update(id), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        })

        if (!response.ok) {
          throw new Error('Không thể cập nhật sản phẩm')
        }

        const updatedProduct = await response.json()
        const index = this.products.data.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products.data[index] = updatedProduct
        }
        return { success: true, data: updatedProduct }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error updating product:', error)
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    // Toggle product active status
    async toggleProductStatus(id: number, currentStatus: number) {
      console.log('[ProductStore] Toggling product status:', { id, currentStatus })
      return await this.updateProduct(id, {
        is_active: currentStatus === 1 ? 0 : 1
      })
    },

    // Delete product
    async deleteProduct(id: number) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(API_ENDPOINTS.products.delete(id), {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Không thể xóa sản phẩm')
        }

        this.products.data = this.products.data.filter(p => p.id !== id)
        return true
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Đã xảy ra lỗi'
        console.error('[ProductStore] Error deleting product:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    // Reset store state
    resetState() {
      this.products = {
        success: true,
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 12
        }
      }
      this.loading = false
      this.error = null
      this.filters = {}
    }
  }
})