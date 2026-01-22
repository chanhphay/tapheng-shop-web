<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>Supabase Connection Test</h1>
    
    <div v-if="loading" style="color: blue;">
      Testing connection...
    </div>
    
    <div v-else-if="connected" style="color: green; margin-top: 20px;">
      ✅ Successfully connected to Supabase!
      <div style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
        <strong>Database Status:</strong> Connected<br>
        <strong>Project URL:</strong> {{ supabaseUrl }}
      </div>
    </div>
    
    <div v-else style="color: red; margin-top: 20px;">
      ❌ Failed to connect to Supabase
      <div style="margin-top: 10px; padding: 10px; background: #fff0f0; border-radius: 5px;">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const loading = ref(true)
const connected = ref(false)
const error = ref('')
const supabaseUrl = ref('')

onMounted(async () => {
  try {
    // Get the Supabase URL from config
    supabaseUrl.value = supabase.supabaseUrl || 'Not configured'
    
    // Test connection by checking auth session (lightest API call)
    const { data, error: authError } = await supabase.auth.getSession()
    
    // If we get a response (even null session), connection works
    if (authError && authError.message.includes('fetch')) {
      // Network/connection error
      throw new Error('Cannot reach Supabase server. Check your URL and internet connection.')
    }
    
    // Connection successful!
    connected.value = true
    
  } catch (e) {
    connected.value = false
    error.value = e.message || 'Unknown error occurred'
  } finally {
    loading.value = false
  }
})
</script>
