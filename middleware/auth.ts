import { useAuthStore } from '~/stores/authStore'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is not authenticated or no user data
  if (!authStore.isAuthenticated || !authStore.userData) {
    // Save the intended destination in localStorage
    localStorage.setItem('redirectPath', to.fullPath)
    
    // Redirect to login page with a message
    return navigateTo({
      path: 'account/login',
    })
  }
}) 