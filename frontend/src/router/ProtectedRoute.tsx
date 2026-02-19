// src/router/ProtectedRoute.tsx

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/ui/Loader";

/**
 * ✅ Route protégée JWT
 * On vérifie seulement le token
 */
function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  // Loader pendant initialisation
  if (isLoading) {
    return <Loader />;
  }

  // ❌ Pas de token → login obligatoire
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Token présent → accès autorisé
  return <Outlet />;
}

/**
 * ✅ Admin route guard
 */
export function AdminProtectedRoute() {
  const { token, user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Si user pas encore chargé, on laisse passer temporairement
  if (!user) {
    return <Outlet />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
