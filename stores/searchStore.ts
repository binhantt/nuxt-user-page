import { defineStore } from 'pinia'
import { API_ENDPOINTS } from '~/config/Api'

// Utility function to remove Vietnamese diacritics
function removeDiacritics(str: string | undefined | null): string {
  console.log('[removeDiacritics] Input:', str)
  if (!str) return ''
  const result = str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
  console.log('[removeDiacritics] Output:', result)
  return result
}

interface Product {
  id: number
  name: string
  price: string
  main_image_url: string
}

interface Category {
  id: number
  name: string
  products: Product[]
}

interface SearchState {
  categories: Category[]
  loading: boolean
  error: string | null
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    hasResults: (state) => {
      console.log('[SearchStore] Checking categories:', state.categories)
      if (!Array.isArray(state.categories)) return false
      const hasProducts = state.categories.some(cat => Array.isArray(cat?.products) && cat.products.length > 0)
      console.log('[SearchStore] Has results:', hasProducts)
      return hasProducts
    },
    normalizedProducts: (state) => {
      console.log('[SearchStore] Starting product normalization. Categories:', state.categories)
      if (!Array.isArray(state.categories)) return []
      
      const normalized = state.categories.map(category => {
        if (!category) return null
        
        try {
          const result = {
            category: {
              id: category.id || 0,
              name: category.name || ''
            },
            products: Array.isArray(category.products) ? category.products : [],
            normalizedName: removeDiacritics(category.name),
            normalizedCategory: removeDiacritics(category.name)
          }
          console.log('[SearchStore] Normalized category:', result)
          return result
        } catch (error) {
          console.error('[SearchStore] Error normalizing category:', error)
          return null
        }
      }).filter(Boolean) // Remove null entries
      
      console.log('[SearchStore] All normalized categories:', normalized)
      return normalized
    }
  },

  actions: {
    async searchProducts(query: string) {
      console.log('[SearchStore] Starting search with query:', query)
      this.loading = true
      this.error = null
      try {
        const url = `${API_ENDPOINTS.products.list}/${encodeURIComponent(query || '')}`
        const response = await fetch(url)
        const data = await response.json()
        this.categories = data.data
        this.loading = false
      } catch (error) {
        console.error('[SearchStore] Search error:', error)
      }
    },

    resetState() {
      console.log('[SearchStore] Resetting state')
      this.categories = []
      this.loading = false
      this.error = null
    }
  }
}) 