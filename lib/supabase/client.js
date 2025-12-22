import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton instance
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export default supabase;

// Also export the factory function if needed
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
