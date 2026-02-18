import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../components/ui/Loader";
import { AdminProtectedRoute } from "./ProtectedRoute";

const AdminLoginPage = lazy(() => import("../admin/Login/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../admin/Dashboard/AdminDashboardPage"));
const AdminResourcesPage = lazy(() => import("../admin/Resources/AdminResourcesPage"));
const AdminBookingsPage = lazy(() => import("../admin/Bookings/AdminBookingsPage"));
const AdminUsersPage = lazy(() => import("../admin/Users/AdminUsersPage"));

// Toutes les routes /admin/* sont gérées ici
export function AdminRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Routes protégées admin */}
        <Route element={<AdminProtectedRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
