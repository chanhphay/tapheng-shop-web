export default defineNuxtRouteMiddleware((to, from) => {
  // Check if running on client side
  if (process.client) {
    const adminUser = localStorage.getItem('adminUser')
    
    if (!adminUser) {
      // No admin user found, redirect to login
      return navigateTo('/login')
    }
    
    try {
      const user = JSON.parse(adminUser)
      
      // Check if user has admin role
      if (user.role !== 'supper_admin' && user.role !== 'admin') {
        // Not an admin, redirect to login
        localStorage.removeItem('adminUser')
        return navigateTo('/login')
      }
    } catch (error) {
      // Invalid data in localStorage
      localStorage.removeItem('adminUser')
      return navigateTo('/login')
    }
  }
})
