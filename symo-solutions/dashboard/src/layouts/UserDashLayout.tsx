import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function UserDashLayout() {
  const { signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link nav-link-active" : "nav-link";

  return (
    <div className="shell dash-shell">
      <header className="topbar dash-topbar">
        <NavLink to="/" className="logo" end={false}>
          symo <span>solutions</span>
        </NavLink>
        <div className="topbar-actions">
          <nav className="dash-nav" aria-label="Espace utilisateur">
            <NavLink to="/" end className={linkClass}>
              Tableau de bord
            </NavLink>
            <NavLink to="compte" className={linkClass}>
              Compte
            </NavLink>
            <NavLink to="projets" className={linkClass}>
              Projets
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
