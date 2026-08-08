import { createClient } from '@supabase/supabase-js'

// Cria um cliente com privilégios de Service Role.
// ATENÇÃO: NUNCA USE ESTE CLIENTE NO BROWSER.
// Ele ignora as políticas de RLS. Ideal para Server Actions que precisam de permissão total (ex: deletar usuários ou limpar bucket).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
