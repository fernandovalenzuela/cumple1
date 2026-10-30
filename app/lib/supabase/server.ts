import { createClient } from "@supabase/supabase-js";

export function getSupabaseServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL."
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}