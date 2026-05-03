/**
 * Copie dashboard/dist → symo-site/dashboard (app React servie sous https://www.symo.solutions/dashboard/)
 * Appelé après `npm run build` dans dashboard — utilisé par sync-symo et Vercel (build symo-site).
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dashboard", "dist");
const dest = join(root, "symo-site", "dashboard");

if (!existsSync(dist)) {
  console.error("dashboard/dist introuvable — lancez npm run build dans dashboard/ d’abord.");
  process.exit(1);
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
mkdirSync(dest, { recursive: true });
cpSync(dist, dest, { recursive: true });
console.log("Dashboard copié vers symo-site/dashboard/");
