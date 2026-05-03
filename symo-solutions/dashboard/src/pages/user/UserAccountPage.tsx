import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function UserAccountPage() {
  const { user, profile } = useAuth();

  return (
    <>
      <h1 className="h1">Mon compte</h1>
      <p className="lead">Informations issues du profil Supabase (table <code>profiles</code>).</p>

      <div className="card" style={{ maxWidth: 480 }}>
        <p className="meta" style={{ marginTop: 0 }}>
          E-mail (auth)
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "0.94rem", wordBreak: "break-all" }}>{user?.email}</p>

        <p className="meta" style={{ marginTop: 20, marginBottom: 0 }}>
          Identifiant utilisateur
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "0.78rem", fontFamily: "monospace", wordBreak: "break-all", color: "var(--muted)" }}>
          {user?.id}
        </p>

        <p className="meta" style={{ marginTop: 20, marginBottom: 0 }}>
          Nom affiché
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "0.94rem" }}>{profile?.full_name ?? "—"}</p>

        <p className="meta" style={{ marginTop: 20, marginBottom: 0 }}>
          Rôle
        </p>
        <p style={{ margin: "8px 0 0" }}>
          <span className="badge badge-user">{profile?.role ?? "—"}</span>
        </p>
      </div>

      <p className="meta" style={{ marginTop: 24 }}>
        Pour modifier le nom ou le rôle, utilisez une politique métier dans Supabase ou l’outil admin.
      </p>
      <Link to="/" className="meta" style={{ display: "inline-block", marginTop: 12 }}>
        ← Tableau de bord
      </Link>
    </>
  );
}
