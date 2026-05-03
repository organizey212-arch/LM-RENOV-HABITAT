export function AdminSettingsPage() {
  return (
    <>
      <h1 className="h1">Paramètres</h1>
      <p className="lead">Réglages de l’espace administration (extensions possibles).</p>

      <div className="card">
        <p className="meta" style={{ marginTop: 0 }}>
          Invitation &amp; rôles
        </p>
        <p className="lead" style={{ marginBottom: 12 }}>
          Gérez les comptes via Supabase Auth et la table <code>profiles</code> (voir SQL dans <code>/supabase</code>
          ).
        </p>
        <ul className="dash-list dash-list-muted">
          <li>Création d’utilisateurs réservée admin à implémenter ici ou dans le tableau SQL.</li>
          <li>Activez Row Level Security cohérente pour éviter les fuites de données.</li>
        </ul>
      </div>

      <div className="card card-placeholder" style={{ marginTop: 20 }}>
        <p className="meta" style={{ marginTop: 0 }}>
          Intégrations
        </p>
        <p className="lead" style={{ marginBottom: 0 }}>
          Webhooks, notifications, exports — à ajouter selon vos besoins.
        </p>
      </div>
    </>
  );
}
