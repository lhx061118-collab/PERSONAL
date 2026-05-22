import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nxxbjqslyvfpyktzwoqv.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Qemv7O3ZN7NU2UMwnIkLZw_PyPXVk1o'

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
