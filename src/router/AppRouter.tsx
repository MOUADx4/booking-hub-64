import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../components/ui/Loader";
import ProtectedRoute from "./ProtectedRoute";

// Lazy loading pour de meilleures performances
const ResourcesListPage = lazy(() => import("../pages/Resources/ResourcesListPage"));
const ResourceDetailsPage = lazy(() => import("../pages/Resources/ResourceDetailsPage"));
const MyBookingsPage = lazy(() => import("../pages/Bookings/MyBookingsPage"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Redirect racine vers la liste des ressources */}
        <Route path="/" element={<Navigate to="/resources" replace />} />

        {/* Pages publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Pages protégées (utilisateur connecté) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/resources" element={<ResourcesListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
