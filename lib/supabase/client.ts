import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Memeriksa apakah Supabase URL dan Key sudah dikonfigurasi di environment
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseAnonKey !== "your-anon-key-here"
  );
}

/**
 * Singleton Supabase Client untuk Browser / Client Components
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!);
  }

  return browserClient;
}
