import { Link } from "react-router-dom";

export function UserProjectsPage() {
  return (
    <>
      <h1 className="h1">Mes projets</h1>
      <p className="lead">
        Liste des dossiers chantiers sera branchée sur vos tables (ex.&nbsp;: <code>projects</code>, <code>dossiers</code>).
      </p>

      <div className="card">
        <p className="lead" style={{ marginBottom: 12 }}>
          Aucun projet chargé pour l’instant.
        </p>
        <p className="meta" style={{ margin: 0 }}>
          Créez une table avec RLS dans Supabase, puis remplacez ce bloc par un <code>select</code> filtré sur
          l’utilisateur connecté.
        </p>
      </div>

      <div className="grid-cards" style={{ marginTop: 20 }}>
        <div className="card card-placeholder">
          <p className="meta" style={{ marginTop: 0 }}>
            À venir
          </p>
          <p className="lead" style={{ marginBottom: 0 }}>
            Livrables &amp; jalons
          </p>
        </div>
        <div className="card card-placeholder">
          <p className="meta" style={{ marginTop: 0 }}>
            À venir
          </p>
          <p className="lead" style={{ marginBottom: 0 }}>
            Factures &amp; devis
          </p>
        </div>
      </div>

      <Link to="/" className="meta" style={{ display: "inline-block", marginTop: 24 }}>
        ← Tableau de bord
      </Link>
    </>
  );
}
