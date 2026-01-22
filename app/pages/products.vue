<template>
  <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto;">
    <h1 style="font-size: clamp(24px, 5vw, 32px); margin-bottom: 20px;">Products</h1>
    
    <div v-if="loading" style="color: blue; margin-top: 20px;">
      Loading products...
    </div>
    
    <div v-else-if="error" style="color: red; margin-top: 20px; padding: 15px; background: #fff0f0; border-radius: 5px;">
      <strong>Error:</strong> {{ error }}
      <div style="margin-top: 10px; font-size: 12px;">
        <strong>Debug Info:</strong><br>
        Products fetched: {{ products?.length || 0 }}<br>
        <details style="margin-top: 10px;">
          <summary style="cursor: pointer;">View full error details</summary>
          <pre style="margin-top: 10px; background: #f5f5f5; padding: 10px; overflow-x: auto;">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
    
    <div v-else-if="products && products.length > 0" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 30px;">
      <div 
        v-for="product in products" 
        :key="product.id"
        style="padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; flex-direction: column;">
        
        <!-- Product Image -->
        <div style="width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 8px; background: #f5f5f5;">
          <img 
            :src="product.image_url" 
            :alt="product.description"
            style="width: 100%; height: 100%; object-fit: cover;"
            @error="handleImageError"
          />
        </div>
        
        <!-- Product Details -->
        <div style="margin-top: 15px; flex-grow: 1;">
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 18px; line-height: 1.4;">{{ product.description }}</h2>
          
          <div style="margin-top: auto;">
            <span style="font-size: clamp(20px, 4vw, 24px); color: #4CAF50; font-weight: bold; display: block;">
              {{ formatPrice(product.price) }} MMK
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else style="margin-top: 20px; color: #666; padding: 20px; text-align: center;">
      No products found.
      <div style="margin-top: 15px; padding: 15px; background: #fff9e6; border: 1px solid #ffe082; border-radius: 5px; text-align: left;">
        <strong>Possible issues:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Table is empty</li>
          <li><strong>Row Level Security (RLS) is blocking access</strong> - Most common issue</li>
        </ul>
        <p style="margin-top: 10px;">
          <strong>To fix RLS:</strong> Go to Supabase Dashboard → Table Editor → products → 
          Click "Add RLS policy" → Enable read access for all users
        </p>
      </div>
    </div>
    
    <div style="margin-top: 30px; padding: 15px; text-align: center; border-top: 1px solid #eee;">
      <NuxtLink to="/admin" style="color: #9C27B0; text-decoration: none; font-weight: bold;">🔐 Admin Panel</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const products = ref([])
const loading = ref(true)
const error = ref('')
const errorDetails = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price)
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E'
}

onMounted(async () => {
  try {
    console.log('Fetching products from Supabase...')
    
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true })
    
    console.log('Supabase response:', { data, error: fetchError })
    
    if (fetchError) {
      errorDetails.value = JSON.stringify(fetchError, null, 2)
      throw fetchError
    }
    
    products.value = data || []
    console.log('Products loaded:', products.value.length)
    
  } catch (e) {
    console.error('Error fetching products:', e)
    error.value = e.message || 'Failed to fetch products'
    errorDetails.value = errorDetails.value || JSON.stringify(e, null, 2)
  } finally {
    loading.value = false
  }
})
</script>
