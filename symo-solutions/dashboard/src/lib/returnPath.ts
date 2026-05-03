/** Chemin SPA « tableau de bord utilisateur » (racine de l’app React). */
const DEFAULT_USER_PATH = "/";

/** Évite les redirections ouvertes (URL absolue, //, etc.). */
export function safeReturnPath(raw: unknown, fallback = DEFAULT_USER_PATH): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) return fallback;
  if (raw === "/login") return fallback;
  return raw;
}

export { DEFAULT_USER_PATH };
