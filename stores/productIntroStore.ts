import { ref } from '#imports'
import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'
import type { ProductIntro, ProductIntroResponse } from '~/types/productIntro'

export const useProductIntroStore = defineStore('productIntro', () => {
  const productIntros = ref<ProductIntro[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const fetchProductIntros = async () => {
    loading.value = true
    error.value = null
    
    try {
    
      const response = await fetch(API_ENDPOINTS.productIntro.list)
      if (!response.ok) {
        throw new Error('Failed to fetch product introductions')
      }
      
      const result: ProductIntroResponse = await response.json()
      if (result.success && result.data) {
        productIntros.value = result.data.items
        pagination.value = result.data.pagination
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('[ProductIntroStore] Error fetching product intros:', err)
    } finally {
      loading.value = false
    }
  }

  const addProductIntro = async (productIntro: Omit<ProductIntro, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(API_ENDPOINTS.productIntro.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productIntro)
      })

      if (!response.ok) {
        throw new Error('Failed to add product introduction')
      }

      const result = await response.json()
      if (result.success && result.data) {
        const newProductIntro = result.data
        productIntros.value.push(newProductIntro)
        return newProductIntro
      }
      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('[ProductIntroStore] Error adding product intro:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProductIntro = async (id: number, productIntro: Partial<Omit<ProductIntro, 'id' | 'created_at' | 'updated_at'>>) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(API_ENDPOINTS.productIntro.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productIntro)
      })

      if (!response.ok) {
        throw new Error('Failed to update product introduction')
      }

      const result = await response.json()
      if (result.success && result.data) {
        const updatedProductIntro = result.data
        const index = productIntros.value.findIndex((p: ProductIntro) => p.id === id)
        if (index !== -1) {
          productIntros.value[index] = updatedProductIntro
        }
        return updatedProductIntro
      }
      return null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('[ProductIntroStore] Error updating product intro:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProductIntro = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(API_ENDPOINTS.productIntro.delete(id), {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product introduction')
      }

      const result = await response.json()
      if (result.success) {
        productIntros.value = productIntros.value.filter((p: ProductIntro) => p.id !== id)
        return true
      }
      return false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('[ProductIntroStore] Error deleting product intro:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const getProductIntroById = (id: number) => {
    return productIntros.value.find((p: ProductIntro) => p.id === id) || null
  }

  return {
    productIntros,
    loading,
    error,
    pagination,
    fetchProductIntros,
    addProductIntro,
    updateProductIntro,
    deleteProductIntro,
    getProductIntroById
  }
}) 