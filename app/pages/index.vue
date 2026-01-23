<template>
  <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
    <h1 style="margin-bottom: 20px;">Welcome to Our Store</h1>
    <p style="color: #666; margin-bottom: 40px;">Browse our products or manage inventory</p>
    
    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <NuxtLink 
        to="/products" 
        style="display: inline-block; padding: 15px 30px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
        🛍️ View Products
      </NuxtLink>
      
      <NuxtLink 
        to="/login" 
        style="display: inline-block; padding: 15px 30px; background: #9C27B0; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
        🔐 Admin Login
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Auto redirect to products page on client side
onMounted(() => {
  navigateTo('/products')
})
</script>
