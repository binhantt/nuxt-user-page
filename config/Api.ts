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
  categories: `${BASE_URL}/users/categroy`
}

export default API_ENDPOINTS

