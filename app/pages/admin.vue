<template>
  <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <!-- Header with User Info and Logout -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #4CAF50;">
      <div>
        <h1 style="font-size: clamp(24px, 5vw, 32px); margin: 0;">🔐 Admin Panel</h1>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
          Welcome, <strong>{{ adminUsername }}</strong> ({{ adminRole }})
        </p>
      </div>
      <button 
        @click="handleLogout"
        style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600; font-size: 14px;"
      >
        🚪 Logout
      </button>
    </div>
    
    <h2 style="font-size: 22px; margin-top: 20px;">➕ Add Product</h2>
    
    <!-- Success Message -->
    <div v-if="successMessage" style="padding: 15px; margin-bottom: 20px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
      ✅ {{ successMessage }}
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" style="padding: 15px; margin-bottom: 20px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px; word-wrap: break-word;">
      ❌ {{ errorMessage }}
    </div>
    
    <!-- Product Form -->
    <form @submit.prevent="uploadProduct" style="margin-top: 30px;">
      
      <!-- Type -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          Product Type:
        </label>
        <select 
          v-model="formData.type" 
          required
          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box; background: white; cursor: pointer;"
        >
          <option value="" disabled>Select product type</option>
          <option v-for="productType in productTypes" :key="productType.id" :value="productType.type">
            {{ productType.type }}
          </option>
        </select>
      </div>
      
      <!-- Description -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          Product Description:
        </label>
        <input 
          v-model="formData.description" 
          type="text" 
          required
          placeholder="Enter product description"
          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;"
        />
      </div>
      
      <!-- Price -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          Price (LAK):
        </label>
        <input 
          v-model.number="formData.price" 
          type="number" 
          required
          min="0"
          step="1"
          placeholder="Enter price"
          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; box-sizing: border-box;"
        />
      </div>
      
      <!-- Image Upload -->
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          Product Image:
        </label>
        <input 
          @change="handleFileSelect"
          type="file" 
          accept="image/*"
          required
          style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; box-sizing: border-box;"
        />
        <small style="color: #666; display: block; margin-top: 5px;">
          Supported formats: JPG, PNG, JPEG
        </small>
      </div>
      
      <!-- Image Preview -->
      <div v-if="imagePreview" style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">
          Preview:
        </label>
        <img 
          :src="imagePreview" 
          alt="Preview"
          style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px;"
        />
      </div>
      
      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="uploading"
        style="width: 100%; padding: 15px; background: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; font-weight: bold;"
        :style="uploading ? 'opacity: 0.6; cursor: not-allowed;' : ''"
      >
        {{ uploading ? 'Uploading...' : 'Add Product' }}
      </button>
    </form>
    
    <!-- Navigation Links -->
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
      <NuxtLink to="/products" style="color: #4CAF50; text-decoration: none;">
        📦 View All Products
      </NuxtLink>
      <NuxtLink to="/" style="color: #4CAF50; text-decoration: none;">
        🏠 Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Protect this page with auth middleware
definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const router = useRouter()

// Get admin user info
const adminUsername = ref('')
const adminRole = ref('')

// Product types from database
const productTypes = ref([])

onMounted(() => {
  const adminUser = localStorage.getItem('adminUser')
  if (adminUser) {
    const user = JSON.parse(adminUser)
    adminUsername.value = user.username
    adminRole.value = user.role
  }
  
  // Fetch product types
  fetchProductTypes()
})

const fetchProductTypes = async () => {
  try {
    const { data, error } = await supabase
      .from('product_type')
      .select('*')
      .order('type', { ascending: true })
    
    if (error) {
      console.error('Error fetching product types:', error)
    } else {
      productTypes.value = data || []
    }
  } catch (error) {
    console.error('Error fetching product types:', error)
  }
}

const handleLogout = () => {
  localStorage.removeItem('adminUser')
  router.push('/login')
}

const formData = ref({
  type: '',
  description: '',
  price: null
})

const selectedFile = ref(null)
const imagePreview = ref(null)
const uploading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadProduct = async () => {
  try {
    uploading.value = true
    successMessage.value = ''
    errorMessage.value = ''
    
    // Validate
    if (!selectedFile.value) {
      throw new Error('Please select an image')
    }
    
    if (!formData.value.description || !formData.value.price) {
      throw new Error('Please fill in all fields')
    }
    
    // 1. Upload image to Supabase Storage
    const fileExt = selectedFile.value.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName
    
    console.log('Uploading image to storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, selectedFile.value, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error(`Image upload failed: ${uploadError.message}`)
    }
    
    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath)
    
    const imageUrl = urlData.publicUrl
    console.log('Image uploaded successfully:', imageUrl)
    
    // 3. Insert product into database
    console.log('Inserting product into database...')
    const { data: productData, error: insertError } = await supabase
      .from('products')
      .insert([
        {type: formData.value.type,
          
          description: formData.value.description,
          price: formData.value.price,
          image_url: imageUrl
        }
      ])
      .select()
    
    if (insertError) {
      console.error('Insert error:', insertError)
      if (insertError.message.includes('row-level security') || insertError.message.includes('policy')) {
        throw new Error('Row Level Security blocking insert. Go to Supabase Dashboard → products table → Add RLS policy for INSERT with "true" condition.')
      }
      throw new Error(`Failed to save product: ${insertError.message}`)
    }
    
    console.log('Product added successfully:', productData)
    
    // Success!
    successMessage.value = 'Product added successfully!'
    
    // Reset form
    formData.value = {
      type: '',
      description: '',
      price: null
    }
    selectedFile.value = null
    imagePreview.value = null
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
    
  } catch (error) {
    console.error('Error uploading product:', error)
    errorMessage.value = error.message || 'Failed to upload product'
  } finally {
    uploading.value = false
  }
}
</script>
