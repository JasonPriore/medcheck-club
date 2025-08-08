import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Default demo values for development - replace with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export function createClient() {
  // Check if we have valid Supabase credentials
  if (supabaseUrl === 'https://demo.supabase.co' || supabaseAnonKey === 'demo-key') {
    console.warn('⚠️ Using demo Supabase credentials. Please configure your environment variables.')
    // Return a mock client for demo purposes
    return createMockClient()
  }
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Mock client for demo purposes when Supabase isn't configured
function createMockClient() {
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode: Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: { user: null }, error: { message: 'Demo mode: Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null })
        }),
        or: () => Promise.resolve({ data: [], error: null }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Supabase not configured' } }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Supabase not configured' } })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Demo mode: Supabase not configured' } })
      })
    })
  }
}
