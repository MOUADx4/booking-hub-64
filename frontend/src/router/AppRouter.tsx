import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader } from "../components/ui/Loader";
import ProtectedRoute from "./ProtectedRoute";

// Lazy loading to keep the app fast
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));

const ResourcesListPage = lazy(
  () => import("../pages/Resources/ResourcesListPage")
);
const ResourceDetailsPage = lazy(
  () => import("../pages/Resources/ResourceDetailsPage")
);

const MyBookingsPage = lazy(() => import("../pages/Bookings/MyBookingsPage"));
const ProfilePage = lazy(() => import("../pages/Profile/ProfilePage"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

export function AppRouter() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected user pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/resources" element={<ResourcesListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
