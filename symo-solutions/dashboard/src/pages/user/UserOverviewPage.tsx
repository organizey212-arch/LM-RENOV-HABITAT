import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function UserOverviewPage() {
  const { user, profile } = useAuth();

  return (
    <>
      <h1 className="h1">Bienvenue</h1>
      <p className="lead">
        Vue d’ensemble de votre espace client. Rôle&nbsp;:{" "}
        <span className="badge badge-user">{profile?.role ?? "—"}</span>
      </p>

      <div className="grid-cards">
        <div className="card">
          <p className="meta" style={{ marginTop: 0 }}>
            Prochaines étapes
          </p>
          <ul className="dash-list">
            <li>Vérifiez vos informations sur la page «&nbsp;Compte&nbsp;».</li>
            <li>Ajoutez vos chantiers ou dossiers depuis «&nbsp;Projets&nbsp;» (à brancher sur Supabase).</li>
          </ul>
          <Link to="projets" className="btn btn-primary" style={{ marginTop: 12 }}>
            Voir les projets
          </Link>
        </div>

        <div className="card card-compact">
          <p className="meta" style={{ marginTop: 0 }}>
            Connecté comme
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.95rem", wordBreak: "break-all" }}>{user?.email}</p>
          <p className="meta" style={{ marginTop: 16, marginBottom: 0 }}>
            Nom affiché
          </p>
          <p style={{ margin: "6px 0 0", fontSize: "0.95rem" }}>{profile?.full_name ?? "—"}</p>
          <Link to="compte" className="btn btn-quiet" style={{ marginTop: 16 }}>
            Modifier le compte
          </Link>
        </div>
      </div>
    </>
  );
}
