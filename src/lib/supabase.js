import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxxbjqslyvfpyktzwoqv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eGJqcXNseXZmcHlrdHp3b3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTE2MTYsImV4cCI6MjA5NTAyNzYxNn0.jQZ3frM9TnTUkII9bT54I_CNk5Y9NA-MaNB9NEsjSKU'

/**
 * Checks if Supabase credentials are valid and provided.
 * @returns {boolean}
 */
export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim() !== '' &&
    !supabaseUrl.includes('your_supabase_project_url') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseAnonKey.includes('your_supabase_anon_public_key')
  );
}

// Initialize the Supabase client if configured, otherwise export null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
