<template>
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px;">
    <div style="background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-width: 400px; width: 100%;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 32px; color: #333; margin-bottom: 10px;">🔐 Admin Login</h1>
        <p style="color: #666; font-size: 14px;">Sign in to access the admin panel</p>
      </div>
      
      <div v-if="errorMessage" style="padding: 15px; margin-bottom: 20px; background: #fee; color: #c33; border: 1px solid #fcc; border-radius: 8px; font-size: 14px;">
        ❌ {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" style="padding: 15px; margin-bottom: 20px; background: #efe; color: #3c3; border: 1px solid #cfc; border-radius: 8px; font-size: 14px;">
        ✅ {{ successMessage }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px;">
            👤 Username
          </label>
          <input 
            v-model="username" 
            type="text" 
            required
            placeholder="Enter your username"
            style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; box-sizing: border-box; transition: border-color 0.3s;"
          />
        </div>
        
        <div style="margin-bottom: 25px;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 14px;">
            🔑 Password
          </label>
          <input 
            v-model="password" 
            type="password" 
            required
            placeholder="Enter your password"
            style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; box-sizing: border-box; transition: border-color 0.3s;"
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: 600; transition: transform 0.2s;"
          :style="loading ? 'opacity: 0.7; cursor: not-allowed;' : ''"
        >
          {{ loading ? '⏳ Logging in...' : '🚀 Login' }}
        </button>
      </form>
      
      <div style="margin-top: 25px; text-align: center;">
        <NuxtLink to="/" style="color: #667eea; text-decoration: none; font-size: 14px; font-weight: 500;">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  const adminUser = localStorage.getItem('adminUser')
  if (adminUser) {
    const user = JSON.parse(adminUser)
    if (user.role === 'supper_admin' || user.role === 'admin') {
      router.push('/admin')
    }
  }
})

const handleLogin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    if (!username.value || !password.value) {
      throw new Error('Please enter both username and password')
    }
    
    const { data: adminUsers, error } = await supabase
      .from('tb_admin')
      .select('*')
      .eq('user_name', username.value)
      .eq('password', password.value)
      .maybeSingle()
    
    if (error) {
      console.error('Supabase error:', error)
      if (error.code === 'PGRST116') {
        throw new Error('Invalid username or password')
      }
      if (error.message.includes('406') || error.message.includes('RLS') || error.message.includes('policy')) {
        throw new Error('Database access denied. Please enable RLS policy for tb_admin table. See console for details.')
      }
      throw new Error('Login failed: ' + error.message)
    }
    
    if (!adminUsers) {
      throw new Error('Invalid username or password')
    }
    
    if (adminUsers.role !== 'supper_admin' && adminUsers.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.')
    }
    
    localStorage.setItem('adminUser', JSON.stringify({
      id: adminUsers.id,
      username: adminUsers.user_name,
      role: adminUsers.role
    }))
    
    successMessage.value = 'Login successful! Redirecting...'
    
    setTimeout(() => {
      router.push('/admin')
    }, 1000)
    
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
