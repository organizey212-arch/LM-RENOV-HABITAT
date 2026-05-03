import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute } from "./components/AdminRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserOnlyRoute } from "./components/UserOnlyRoute";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserDashLayout } from "./layouts/UserDashLayout";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { LoginPage } from "./pages/LoginPage";
import { UserAccountPage } from "./pages/user/UserAccountPage";
import { UserOverviewPage } from "./pages/user/UserOverviewPage";
import { UserProjectsPage } from "./pages/user/UserProjectsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        {/* / = espace client (après connexion utilisateur). Admin est redirigé vers /admin par UserOnlyRoute. */}
        <Route element={<UserOnlyRoute />}>
          <Route element={<UserDashLayout />}>
            <Route index element={<UserOverviewPage />} />
            <Route path="compte" element={<UserAccountPage />} />
            <Route path="projets" element={<UserProjectsPage />} />
          </Route>
        </Route>

        {/* Administration (même app, URL …/dashboard/admin sur symo.solutions) */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminUsersPage />} />
            <Route path="parametres" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        {/* Anciens liens (tout ramené à la racine / de l’app) */}
        <Route path="/Userdash" element={<Navigate to="/" replace />} />
        <Route path="/Userdash/*" element={<Navigate to="/" replace />} />
        <Route path="/userdash" element={<Navigate to="/" replace />} />
        <Route path="/userdash/*" element={<Navigate to="/" replace />} />
      </Route>

      {/* Inconnu → accueil de l’app (admin/user filtrés par les gardes ci-dessus) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
