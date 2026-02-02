<template>
  <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto;">
    <!-- Logo and Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="/images/logo.png" alt="ຮ້ານຕາແພງ Baby Logo" style="width: 150px; height: 150px; margin-bottom: 15px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
      <h1 style="font-size: clamp(24px, 5vw, 32px); margin: 10px 0; font-family: 'Phetsarath-OT', Arial, sans-serif; color: #4CAF50;">📦 ຮ້ານຕາແພງ Baby</h1>
      <p style="font-size: clamp(16px, 3vw, 18px); color: #4CAF50; font-weight: bold; margin: 10px 0;">
        ແບບລາຍການສິນຄ້າ ຮ້ານຕາແພງ Baby
      </p>
      <!-- Visitor Counter -->
      <div style="margin-top: 10px; font-size: 14px; color: #666;">
        👁️ ຜູ້ເຂົ້າເບິ່ງ: <strong style="color: #4CAF50;">{{ visitorCount.toLocaleString() }}</strong>
      </div>
    </div>
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
    
    <!-- Products Grouped by Type -->
    <div v-else-if="Object.keys(groupedProducts).length > 0">
      <div 
        v-for="(items, type) in groupedProducts" 
        :key="type"
        style="margin-bottom: 50px;"
      >
        <!-- Type Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #4CAF50;">
          <h2 style="margin: 0; font-size: clamp(20px, 4vw, 28px); color: #333;">
            {{ type }}
          </h2>
          <span style="color: #666; font-size: 14px;">
            {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
          </span>
        </div>
        
        <!-- Product Grid -->
        <div class="product-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          <div 
            v-for="(product, index) in getVisibleProducts(type, items)" 
            :key="product.id"
            class="product-card"
          >
            <!-- Product Image -->
            <div style="width: 100%; aspect-ratio: 1; overflow: hidden; border-radius: 8px; background: #f5f5f5; cursor: pointer;" @click="openImageModal(product.image_url)">
              <img 
                :src="product.image_url" 
                :alt="product.description"
                style="width: 100%; height: 100%; object-fit: cover;"
                @error="handleImageError"
              />
            </div>
            
            <!-- Product Details -->
            <div style="margin-top: 10px; flex-grow: 1;">
              <h3 style="margin: 0 0 10px 0; color: #333; font-size: 12px; line-height: 1.4;">{{ product.description }}</h3>
              
              <div style="margin-top: auto;">
                <span style="font-size: clamp(15px, 4vw, 12px); color: #4CAF50; font-weight: bold; display: block;">
                 ລາຄາ : {{ formatPrice(product.price) }} LAK
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- See More Button -->
        <div v-if="items.length > 8" style="text-align: center; margin-top: 25px;">
          <button 
            @click="toggleShowMore(type)"
            class="see-more-btn"
          >
            <span v-if="showMoreMap[type]">▲ Show Less</span>
            <span v-else>▼ See More ({{ items.length - 8 }} more)</span>
          </button>
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
    
    <!-- Image Modal -->
    <div 
      v-if="selectedImage"
      @click="closeImageModal"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;"
    >
      <div style="position: relative; max-width: 90%; max-height: 90vh; display: flex; flex-direction: column; align-items: center;">
        <!-- Close Button -->
        <button
          @click.stop="closeImageModal"
          class="modal-close-btn"
        >
          ×
        </button>
        
        <!-- Large Image -->
        <img 
          :src="selectedImage"
          @click.stop
          style="max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);"
        />
      </div>
    </div>
    
    <!-- Footer -->
    <div style="margin-top: 50px; padding: 30px 20px; text-align: center; border-top: 2px solid #eee; background: #f9f9f9; border-radius: 10px;">
      <!-- Social Media Links -->
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">📱 Connect With Us</h3>
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <!-- Facebook Button -->
          <a 
            href="https://www.facebook.com/profile.php?id=100040215446408" 
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn facebook-btn"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </a>
          
          <!-- WhatsApp Button -->
          <a 
            href="https://wa.me/8562077930597" 
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn whatsapp-btn"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>
      
      <!-- Admin Link -->
      <div style="padding-top: 15px; border-top: 1px solid #ddd;">
        <NuxtLink to="/login" style="color: #9C27B0; text-decoration: none; font-weight: bold;">🔐 Admin Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const products = ref([])
const loading = ref(true)
const error = ref('')
const errorDetails = ref(null)
const showMoreMap = ref({})
const selectedImage = ref(null)
const visitorCount = ref(0)

// Computed property to group products by type
const groupedProducts = computed(() => {
  const grouped = {}
  products.value.forEach(product => {
    const type = product.type || 'Other'
    if (!grouped[type]) {
      grouped[type] = []
    }
    grouped[type].push(product)
  })
  return grouped
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US').format(price)
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E'
}

const toggleShowMore = (type) => {
  showMoreMap.value[type] = !showMoreMap.value[type]
}

const getVisibleProducts = (type, items) => {
  if (showMoreMap.value[type]) {
    return items
  }
  return items.slice(0, 8)
}
const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
}

const closeImageModal = () => {
  selectedImage.value = null
}

const trackVisitor = async () => {
  try {
    // Check if user has visited in this session
    const hasVisited = sessionStorage.getItem('hasVisited')
    
    if (!hasVisited) {
      // Increment visitor count in database
      const { data, error } = await supabase.rpc('increment_visitor_count')
      
      if (error) {
        console.error('Error tracking visitor:', error)
      } else {
        sessionStorage.setItem('hasVisited', 'true')
      }
    }
    
    // Get current visitor count
    const { data: countData, error: countError } = await supabase
      .from('site_stats')
      .select('visitor_count')
      .single()
    
    if (!countError && countData) {
      visitorCount.value = countData.visitor_count
    }
  } catch (e) {
    console.error('Error in trackVisitor:', e)
  }
}

onMounted(async () => {
  // Track visitor
  trackVisitor()
  
  try {
    console.log('Fetching products from Supabase...')
    
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .order('type', { ascending: true })
      .order('id', { ascending: false })
    
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

<style scoped>
.product-card {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.see-more-btn {
  padding: 12px 30px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.see-more-btn:hover {
  background: #45a049;
  transform: scale(1.05);
}

.modal-close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: white;
  color: #333;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  transition: transform 0.2s, background 0.2s;
}

.modal-close-btn:hover {
  background: #f44336;
  color: white;
  transform: scale(1.1);
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.facebook-btn {
  background: #1877f2;
}

.facebook-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(24,119,242,0.4);
}

.whatsapp-btn {
  background: #25d366;
}

.whatsapp-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(37,211,102,0.4);
}

/* Mobile: 2 columns */
@media (max-width: 767px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
  }
  
  .product-card {
    padding: 10px !important;
  }
}

/* Tablet: 4 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 15px !important;
  }
}

/* Desktop: auto-fill with min 280px */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
    gap: 20px !important;
  }
}
</style>
