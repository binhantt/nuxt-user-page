import { ref } from '#imports'
import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'
import type { Category } from '~/types/category'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(API_ENDPOINTS.categories)
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      
      const data = await response.json()
      categories.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error fetching categories:', err)
    } finally {
      loading.value = false
    }
  }

  const addCategory = async (category: Omit<Category, 'id'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(API_ENDPOINTS.categories, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
      })

      if (!response.ok) {
        throw new Error('Failed to add category')
      }

      const newCategory = await response.json()
      categories.value.push(newCategory)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error adding category:', err)
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, category: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_ENDPOINTS.categories}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      const updatedCategory = await response.json()
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error updating category:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${API_ENDPOINTS.categories}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      categories.value = categories.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error deleting category:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }
}) 