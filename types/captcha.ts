export interface CaptchaResponse {
  captchaId: string;
  captchaImage: string; // Base64 encoded image
  expiresAt: number; // Unix timestamp
}

export interface CaptchaVerifyRequest {
  captchaId: string;
  captchaValue: string;
}

export interface CaptchaVerifyResponse {
  success: boolean;
  message?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  captcha: string;
  captchaId: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
  };
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    products: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 12
  }),

  getters: {
    hasResults: (state) => state.products.length > 0,
    isFirstPage: (state) => state.currentPage === 1,
    isLastPage: (state) => state.currentPage === state.totalPages
  },

  actions: {
    async searchProducts(query: string, page: number = 1) {
      // ... logic tìm kiếm ...
    },
    setPage(page: number) { ... },
    resetState() { ... }
  }
})

const searchStore = useSearchStore()
const { products, loading, error, currentPage, totalPages } = storeToRefs(searchStore)

// Xử lý chuyển trang
const handlePageChange = (page) => {
  searchStore.setPage(page)
  searchStore.searchProducts(searchQuery.value, page)
}

// Cleanup khi unmount
onUnmounted(() => {
  searchStore.resetState()
}) 