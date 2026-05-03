import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function AdminLayout() {
  const { signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <div className="shell dash-shell dash-shell-wide">
      <header className="topbar dash-topbar">
        <div className="dash-brand">
          <NavLink to="/admin" className="logo">
            symo <span>solutions</span>
          </NavLink>
          <span className="dash-badge-env">Administration</span>
        </div>
        <div className="topbar-actions dash-topbar-actions">
          <nav className="dash-nav" aria-label="Administration">
            <NavLink to="/admin" end className={linkClass}>
              Utilisateurs
            </NavLink>
            <NavLink to="/admin/parametres" className={linkClass}>
              Paramètres
            </NavLink>
          </nav>
          <button type="button" className="btn btn-quiet" onClick={() => signOut()}>
            Déconnexion
          </button>
        </div>
      </header>

      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
