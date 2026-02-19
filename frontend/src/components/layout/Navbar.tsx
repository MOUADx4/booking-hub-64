import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Calendar, LogOut, User, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-gray-900 no-underline"
        >
          <Calendar size={20} className="text-blue-600" />
          <span>BookingHub</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <Link
                to="/resources"
                className="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Ressources
              </Link>

              <Link
                to="/bookings"
                className="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Mes réservations
              </Link>

              <Link
                to="/profile"
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                aria-label="Profil"
              >
                <User size={18} />
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                  aria-label="Administration"
                >
                  <LayoutDashboard size={18} />
                </Link>
              )}

              <button
                onClick={logout}
                className="p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                aria-label="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              >
                Connexion
              </Link>

              <Link
                to="/register"
                className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                S'inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
