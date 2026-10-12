import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { isSupabaseConfigured } from "./client";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

/**
 * Supabase Client untuk Server / Next.js Route Handlers
 * Menggunakan Service Role Key jika tersedia untuk operasi server berhak penuh,
 * atau Anon Key jika Service Role Key belum diisi.
 */
export function getSupabaseServerClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const apiKey = (supabaseServiceRoleKey && supabaseServiceRoleKey !== "your-service-role-key")
    ? supabaseServiceRoleKey
    : supabaseAnonKey;

  if (!supabaseUrl || !apiKey) return null;

  return createClient<Database>(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
