import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Même URL qu’en prod : http://localhost:5173/dashboard/login, /dashboard/admin, …
 * Sans middleware, Vite répond 404 sur ces chemins (pas de fichier physique).
 */
function dashboardSpaFallback(): Plugin {
  return {
    name: "dashboard-spa-fallback",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const url = req.url;
        if (!url) return next();
        const pathOnly = url.split("?")[0] ?? "";
        if (!pathOnly.startsWith("/dashboard")) return next();
        if (
          pathOnly.startsWith("/dashboard/@vite") ||
          pathOnly.startsWith("/dashboard/@fs") ||
          pathOnly.startsWith("/dashboard/node_modules") ||
          pathOnly.startsWith("/dashboard/src/") ||
          pathOnly.startsWith("/dashboard/assets/")
        ) {
          return next();
        }
        const last = pathOnly.split("/").pop() ?? "";
        if (last.includes(".") && last.length > 1) return next();

        req.url = "/dashboard/index.html" + (url.includes("?") ? `?${url.split("?")[1]}` : "");
        next();
      });
    },
  };
}

/** Dev + prod : même base que sur symo.solutions/dashboard/ */
export default defineConfig({
  plugins: [react(), dashboardSpaFallback()],
  base: "/dashboard/",
  appType: "spa",
  server: { port: 5173 },
  preview: { port: 4173 },
});
