import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Calendar, LogOut, User, LayoutDashboard } from "lucide-react";

// Navbar principale pour les utilisateurs connectés et visiteurs
export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground no-underline">
          <Calendar size={20} className="text-primary" />
          <span>BookingHub</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/resources"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors no-underline"
              >
                Ressources
              </Link>
              <Link
                to="/bookings"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors no-underline"
              >
                Mes réservations
              </Link>
              <Link
                to="/profile"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                aria-label="Profil"
              >
                <User size={18} />
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  aria-label="Administration"
                >
                  <LayoutDashboard size={18} />
                </Link>
              )}
              <button
                onClick={logout}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                aria-label="Se déconnecter"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors no-underline"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-sm bg-primary text-primary-foreground hover:bg-primary-dark rounded-md transition-colors no-underline"
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
