import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Admin client — uses the service-role/secret key and BYPASSES Row Level Security.
// Only import this in trusted server code (Route Handlers, Server Actions, cron jobs).
// The `server-only` import makes the build fail if this is ever pulled into a Client Component.
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
