 export const BASE_URL = 'http://localhost:3001/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${BASE_URL}/users/login`,
    register: `${BASE_URL}/users/register`,
    logout: `${BASE_URL}/users/logout`,
    profile: `${BASE_URL}/users/`
  },
  // Captcha endpoints
  captcha: {
    generate: `${BASE_URL}/users/generate`,
    verify: `${BASE_URL}/captcha/verify`
  },
  // User endpoints
  users: `${BASE_URL}/users`,
  // Category endpoints
  categories: `${BASE_URL}/users/categroy`,
  // Product Intro endpoints
  productIntro: {
    list: `${BASE_URL}/users/productIntro`,
    detail: (id: string | number) => `${BASE_URL}/users/productIntro/${id}`,
    create: `${BASE_URL}/users/productIntro`,
    update: (id: string | number) => `${BASE_URL}/users/productIntro/${id}`,
    delete: (id: string | number) => `${BASE_URL}/users/productIntro/${id}`
  },
  // Product endpoints
  products: {
    list: `${BASE_URL}/users/products`,
    detail: (id: string | number) => `${BASE_URL}/users/products/${id}`,
    create: `${BASE_URL}/users/products`,
    update: (id: string | number) => `${BASE_URL}/users/products/${id}`,
    delete: (id: string | number) => `${BASE_URL}/users/products/${id}`,
    search: `${BASE_URL}/users/products/search`,
    byCategory: (categoryId: string | number) => `${BASE_URL}/products/category/${categoryId}`,
    byPlatform: (platform: string) => `${BASE_URL}/products/platform/${platform}`
  },
  // Order endpoints
  orders: {
    create: `${BASE_URL}/users/order/creact`,
    list: (userId: number) => `${BASE_URL}/users/${userId}/orders`,
     detail: (id: string | number) => `${BASE_URL}/users/orders/${id}`,
    update: (id: string | number) => `${BASE_URL}/users/orders/${id}`,
    cancel: (id: string | number) => `${BASE_URL}/users/orders/${id}`,
    cancelDeadline: (id: string | number) => `${BASE_URL}/users/orders/${id}`,
    checkCancelEligibility: (id: string | number) => `${BASE_URL}/users/orders/${id}`
  }
}

export default API_ENDPOINTS

