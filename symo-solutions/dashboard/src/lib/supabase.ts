import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? "";

/** À false si le build n’a pas les variables Vite (ex. oubli sur Vercel). */
export const isSupabaseConfigured = Boolean(url.trim() && anon.trim());

if (!isSupabaseConfigured) {
  console.warn(
    "[Symo dashboard] VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes : la connexion ne peut pas fonctionner."
  );
}

/** Client désactivé côté persistance si projet non configuré (évite des écritures localStorage incohérentes). */
export const supabase = createClient(url || "https://invalid.local", anon || "invalid", {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
  },
});
