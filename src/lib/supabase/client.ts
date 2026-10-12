import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks whether Supabase is configured with real non-placeholder credentials.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes("your-project-ref") ||
    supabaseAnonKey.includes("placeholder")
  ) {
    return false;
  }
  return true;
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns a singleton client-side Supabase client if configured, or null otherwise.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return clientInstance;
}
