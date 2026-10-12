import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks whether Supabase server-side client is configured.
 */
export function isServerSupabaseConfigured(): boolean {
  if (!supabaseUrl || !serviceRoleKey) return false;
  if (
    supabaseUrl.includes("your-project-ref") ||
    serviceRoleKey.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

let serverClientInstance: SupabaseClient | null = null;

/**
 * Returns a server-side Supabase client with elevated or service role capabilities if configured.
 */
export function getServerSupabaseClient(): SupabaseClient | null {
  if (!isServerSupabaseConfigured()) {
    return null;
  }

  if (!serverClientInstance) {
    serverClientInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return serverClientInstance;
}
