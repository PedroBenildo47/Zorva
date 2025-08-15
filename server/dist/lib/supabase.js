import { createClient } from "@supabase/supabase-js";
let cachedAdminClient = null;
export function getSupabaseAdmin() {
    if (cachedAdminClient)
        return cachedAdminClient;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Supabase env vars not set (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
    }
    cachedAdminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
    return cachedAdminClient;
}
