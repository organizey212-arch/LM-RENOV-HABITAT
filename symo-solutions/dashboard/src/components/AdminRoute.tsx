import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/** Accès réservé au rôle admin ; les sous-routes utilisent Outlet. */
export function AdminRoute() {
  const { profile, profileLoading, profileResolved, session } = useAuth();

  if (!session) return null;

  if (!profileResolved || profileLoading) {
    return (
      <div className="shell">
        <p className="lead">Chargement du profil…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="shell">
        <div className="card">
          <p className="lead" style={{ marginBottom: 0 }}>
            Profil introuvable. Exécutez le SQL du dossier <code style={{ color: "var(--accent)" }}>supabase/</code>{" "}
            puis créez une ligne <code style={{ color: "var(--accent)" }}>profiles</code> pour l’utilisateur{" "}
            <code style={{ color: "var(--accent)" }}>{session.user.email}</code>.
          </p>
        </div>
      </div>
    );
  }

  if (profile.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
