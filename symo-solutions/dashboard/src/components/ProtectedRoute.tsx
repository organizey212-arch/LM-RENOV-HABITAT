import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { session, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="shell">
        <p className="lead">Chargement…</p>
      </div>
    );
  }

  if (!session)
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return <Outlet />;
}
