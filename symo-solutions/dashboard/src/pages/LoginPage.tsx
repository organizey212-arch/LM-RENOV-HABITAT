import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { safeReturnPath } from "../lib/returnPath";
import { isSupabaseConfigured } from "../lib/supabase";

export function LoginPage() {
  const { session, profile, profileResolved, signIn, authLoading } = useAuth();
  const location = useLocation();
  const from = safeReturnPath((location.state as { from?: string } | null)?.from);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (authLoading) {
    return (
      <div className="shell">
        <p className="lead">Chargement…</p>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="shell">
        <div className="topbar">
          <span className="logo">
            symo <span>solutions</span>
          </span>
        </div>
        <h1 className="h1">Configuration manquante</h1>
        <p className="lead">
          Ce tableau de bord n’a pas reçu <code>VITE_SUPABASE_URL</code> ni <code>VITE_SUPABASE_ANON_KEY</code> au moment
          du build. En local, créez <code>dashboard/.env.local</code> puis relancez <code>npm run dashboard:dev</code>. Sur
          Vercel, ajoutez les mêmes variables au projet et redéployez.
        </p>
      </div>
    );
  }

  if (session && !profileResolved) {
    return (
      <div className="shell">
        <p className="lead">Synchronisation du profil…</p>
      </div>
    );
  }

  if (session && profileResolved) {
    if (profile?.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
  }

  return (
    <div className="shell">
      <div className="topbar">
        <span className="logo">
          symo <span>solutions</span>
        </span>
      </div>
      <h1 className="h1">Connexion</h1>
      <div className="card" style={{ maxWidth: 400 }}>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err ? (
            <p className="err" role="alert">
              {err}
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="meta" style={{ marginTop: 18, marginBottom: 0 }}>
          Comptes créés dans Supabase Auth : activez ensuite un profil avec le SQL fourni (<code>role</code>
          &nbsp;= user ou admin).
        </p>
      </div>
    </div>
  );
}
