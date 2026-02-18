import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Users,
  LogOut,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/resources", icon: BookOpen, label: "Ressources" },
  { to: "/admin/bookings", icon: CalendarCheck, label: "Réservations" },
  { to: "/admin/users", icon: Users, label: "Utilisateurs" },
];

// Sidebar admin avec liens actifs mis en évidence
export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-sidebar text-sidebar-foreground flex flex-col min-h-screen">
      {/* En-tête */}
      <div className="h-14 flex items-center gap-2 px-5 border-b border-sidebar-foreground/10 font-bold text-sidebar-foreground">
        <Calendar size={18} className="text-sidebar-active" />
        <span className="text-sm">BookingHub</span>
        <span className="text-xs text-sidebar-foreground/50 ml-1">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors no-underline",
                isActive
                  ? "bg-sidebar-active text-white font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-foreground/10",
              ].join(" ")
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Déconnexion */}
      <div className="px-3 py-4 border-t border-sidebar-foreground/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 transition-colors"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
