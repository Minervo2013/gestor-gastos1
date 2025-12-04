import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Crear clientes con valores por defecto para el build
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso en el servidor con service role
export const supabaseAdmin = supabaseServiceRoleKey && supabaseUrl !== 'https://placeholder.supabase.co'
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null