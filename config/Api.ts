const BASE_URL = 'http://localhost:3001/api'

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${BASE_URL}/users/login`,
    register: `${BASE_URL}/users/register`,
    logout: `${BASE_URL}/users/logout`,
    profile: `${BASE_URL}/users/profile`
  },
  // User endpoints
  users: `${BASE_URL}/users`,
  // Category endpoints
  categories: `${BASE_URL}/users/categroy`,
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
  }
}

export default API_ENDPOINTS

