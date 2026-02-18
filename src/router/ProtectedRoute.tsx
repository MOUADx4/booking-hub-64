import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/ui/Loader";

// Routes protégées pour les utilisateurs connectés
function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Routes réservées aux administrateurs
export function AdminProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
