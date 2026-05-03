import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import type { Profile } from "../../types";

type Row = Profile & { email?: string };

export function AdminUsersPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadErr(null);
      const { data, error } = await supabase.from("profiles").select("id, role, full_name, updated_at").order("updated_at", {
        ascending: false,
      });
      if (cancelled) return;
      if (error) {
        setLoadErr(error.message);
        setRows([]);
      } else {
        setRows(((data ?? []) as Row[]).map((r) => ({ ...r, role: r.role === "admin" ? "admin" : "user" })));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const admins = rows.filter((r) => r.role === "admin").length;
    const standard = rows.filter((r) => r.role === "user").length;
    return { total: rows.length, admins, standard };
  }, [rows]);

  return (
    <>
      <h1 className="h1">Utilisateurs</h1>
      <p className="lead">
        Profils <code style={{ color: "var(--accent)" }}>profiles</code>. Connecté&nbsp;: {user?.email}
      </p>

      <div className="grid-cards grid-stats">
        <div className="card card-stat">
          <p className="meta" style={{ marginTop: 0 }}>
            Total
          </p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="card card-stat">
          <p className="meta" style={{ marginTop: 0 }}>
            Administrateurs
          </p>
          <p className="stat-value">{stats.admins}</p>
        </div>
        <div className="card card-stat">
          <p className="meta" style={{ marginTop: 0 }}>
            Utilisateurs
          </p>
          <p className="stat-value">{stats.standard}</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        {loadErr ? (
          <p className="err" role="alert">
            {loadErr}
          </p>
        ) : null}
        {loading ? (
          <p className="lead" style={{ marginBottom: 0 }}>
            Chargement…
          </p>
        ) : (
          <div className="table-wrap" style={{ marginTop: loadErr ? 16 : 0 }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rôle</th>
                  <th>Nom</th>
                  <th>Maj</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "monospace", fontSize: "0.72rem", wordBreak: "break-all" }}>{r.id}</td>
                    <td>
                      <span className={r.role === "admin" ? "badge badge-admin" : "badge badge-user"}>{r.role}</span>
                    </td>
                    <td>{r.full_name ?? "—"}</td>
                    <td style={{ whiteSpace: "nowrap", color: "var(--muted)" }}>
                      {r.updated_at ? new Date(r.updated_at).toLocaleString("fr-FR") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadErr && rows.length === 0 ? <p className="meta">Aucun profil — exécutez le SQL seed.</p> : null}
          </div>
        )}
      </div>
    </>
  );
}
