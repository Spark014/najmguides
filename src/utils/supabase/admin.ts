import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) console.error("❌ MISSING NEXT_PUBLIC_SUPABASE_URL in admin.ts")
if (!supabaseServiceRoleKey) console.error("❌ MISSING SUPABASE_SERVICE_ROLE_KEY in admin.ts")
else console.log("✅ SUPABASE_SERVICE_ROLE_KEY loaded in admin.ts (starts with " + supabaseServiceRoleKey.substring(0, 5) + "...)")

export const createAdminClient = () => {
    return createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
