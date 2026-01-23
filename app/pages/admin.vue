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
    
    <!-- Manage Products Section -->
    <div style="margin-top: 60px; padding-top: 30px; border-top: 2px solid #4CAF50;">
      <h2 style="font-size: 22px; margin-bottom: 20px;">📋 Manage Products</h2>
      
      <!-- Loading State -->
      <div v-if="loadingProducts" style="text-align: center; padding: 20px; color: #666;">
        Loading products...
      </div>
      
      <!-- Products List -->
      <div v-else-if="allProducts.length > 0" style="display: flex; flex-direction: column; gap: 15px;">
        <div 
          v-for="product in allProducts" 
          :key="product.id"
          style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; display: flex; gap: 15px; align-items: center; background: #f9f9f9;"
        >
          <!-- Product Image -->
          <img 
            :src="product.image_url" 
            :alt="product.description"
            style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; flex-shrink: 0;"
          />
          
          <!-- Product Details -->
          <div style="flex: 1; min-width: 0;">
            <p style="margin: 0; font-weight: bold; font-size: 14px; color: #4CAF50;">
              {{ product.type }}
            </p>
            <p style="margin: 5px 0; font-size: 14px; color: #333;">
              {{ product.description }}
            </p>
            <p style="margin: 5px 0 0 0; font-weight: bold; color: #f44336; font-size: 14px;">
              {{ product.price?.toLocaleString() }} LAK
            </p>
          </div>
          
          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
            <button
              @click="editProduct(product)"
              style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;"
            >
              ✏️ Edit
            </button>
            <button
              @click="deleteProduct(product.id)"
              style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; white-space: nowrap;"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
      
      <!-- No Products -->
      <div v-else style="text-align: center; padding: 40px; color: #999; background: #f9f9f9; border-radius: 8px;">
        No products found. Add your first product above! 📦
      </div>
    </div>
    
    <!-- Edit Product Modal -->
    <div 
      v-if="editingProduct"
      @click="closeEditModal"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;"
    >
      <div 
        @click.stop
        style="background: white; border-radius: 10px; padding: 30px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;"
      >
        <h3 style="margin-top: 0; margin-bottom: 20px; font-size: 20px;">✏️ Edit Product</h3>
        
        <!-- Edit Form -->
        <form @submit.prevent="updateProduct">
          <!-- Type -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px;">
              Product Type:
            </label>
            <select 
              v-model="editForm.type" 
              required
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;"
            >
              <option v-for="productType in productTypes" :key="productType.id" :value="productType.type">
                {{ productType.type }}
              </option>
            </select>
          </div>
          
          <!-- Description -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px;">
              Description:
            </label>
            <input 
              v-model="editForm.description" 
              type="text" 
              required
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box;"
            />
          </div>
          
          <!-- Price -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px;">
              Price (LAK):
            </label>
            <input 
              v-model.number="editForm.price" 
              type="number" 
              required
              min="0"
              style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box;"
            />
          </div>
          
          <!-- Current Image -->
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px;">
              Current Image:
            </label>
            <img 
              :src="editForm.image_url" 
              alt="Current"
              style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px;"
            />
          </div>
          
          <!-- New Image (Optional) -->
          <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px;">
              Update Image (Optional):
            </label>
            <input 
              @change="handleEditFileSelect"
              type="file" 
              accept="image/*"
              style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; box-sizing: border-box;"
            />
            <div v-if="editImagePreview" style="margin-top: 10px;">
              <img 
                :src="editImagePreview" 
                alt="New Preview"
                style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 5px;"
              />
            </div>
          </div>
          
          <!-- Buttons -->
          <div style="display: flex; gap: 10px;">
            <button 
              type="submit"
              :disabled="updating"
              style="flex: 1; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;"
              :style="updating ? 'opacity: 0.6; cursor: not-allowed;' : ''"
            >
              {{ updating ? 'Updating...' : 'Update Product' }}
            </button>
            <button 
              type="button"
              @click="closeEditModal"
              :disabled="updating"
              style="flex: 1; padding: 12px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 14px;"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    
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
  
  // Fetch product types and products
  fetchProductTypes()
  fetchAllProducts()
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
    // Refresh products list
    await fetchAllProducts()
    
  } catch (error) {
    console.error('Error uploading product:', error)
    errorMessage.value = error.message || 'Failed to upload product'
  } finally {
    uploading.value = false
  }
}

// Manage Products functionality
const allProducts = ref([])
const loadingProducts = ref(false)
const editingProduct = ref(null)
const editForm = ref({})
const editSelectedFile = ref(null)
const editImagePreview = ref(null)
const updating = ref(false)

const fetchAllProducts = async () => {
  try {
    loadingProducts.value = true
    errorMessage.value = ''
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) {
      console.error('Error fetching products:', error)
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        errorMessage.value = '⚠️ Cannot load products: Row Level Security is blocking access. Go to Supabase Dashboard → products table → Add RLS policy for SELECT with "true" condition.'
      } else {
        errorMessage.value = `Error loading products: ${error.message}`
      }
      allProducts.value = []
    } else {
      allProducts.value = data || []
      console.log('Loaded products:', data?.length || 0)
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    errorMessage.value = `Error loading products: ${error.message}`
    allProducts.value = []
  } finally {
    loadingProducts.value = false
  }
}

const editProduct = (product) => {
  editingProduct.value = product
  editForm.value = {
    id: product.id,
    type: product.type,
    description: product.description,
    price: product.price,
    image_url: product.image_url
  }
  editSelectedFile.value = null
  editImagePreview.value = null
}

const closeEditModal = () => {
  editingProduct.value = null
  editForm.value = {}
  editSelectedFile.value = null
  editImagePreview.value = null
}

const handleEditFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    editSelectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      editImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const updateProduct = async () => {
  try {
    updating.value = true
    successMessage.value = ''
    errorMessage.value = ''
    
    let imageUrl = editForm.value.image_url
    
    // If new image selected, upload it
    if (editSelectedFile.value) {
      const fileExt = editSelectedFile.value.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = fileName
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, editSelectedFile.value, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`)
      }
      
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)
      
      imageUrl = urlData.publicUrl
    }
    
    // Update product in database
    const { error: updateError } = await supabase
      .from('products')
      .update({
        type: editForm.value.type,
        description: editForm.value.description,
        price: editForm.value.price,
        image_url: imageUrl
      })
      .eq('id', editForm.value.id)
    
    if (updateError) {
      if (updateError.message.includes('row-level security') || updateError.message.includes('policy')) {
        throw new Error('Row Level Security blocking update. Add RLS policy for UPDATE.')
      }
      throw new Error(`Failed to update product: ${updateError.message}`)
    }
    
    successMessage.value = 'Product updated successfully!'
    closeEditModal()
    await fetchAllProducts()
    
  } catch (error) {
    console.error('Error updating product:', error)
    errorMessage.value = error.message || 'Failed to update product'
  } finally {
    updating.value = false
  }
}

const deleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }
  
  try {
    successMessage.value = ''
    errorMessage.value = ''
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (error) {
      if (error.message.includes('row-level security') || error.message.includes('policy')) {
        throw new Error('Row Level Security blocking delete. Add RLS policy for DELETE.')
      }
      throw new Error(`Failed to delete product: ${error.message}`)
    }
    
    successMessage.value = 'Product deleted successfully!'
    await fetchAllProducts()
    
  } catch (error) {
    console.error('Error deleting product:', error)
    errorMessage.value = error.message || 'Failed to delete product'
    uploading.value = false
  }
}
</script>
