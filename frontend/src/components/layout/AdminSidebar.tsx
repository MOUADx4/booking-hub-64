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

// Sidebar admin simple (style étudiant)
export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-gray-200 flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-14 flex items-center gap-2 px-5 border-b border-gray-700 font-bold">
        <Calendar size={18} className="text-blue-400" />
        <span className="text-sm">BookingHub</span>
        <span className="text-xs text-gray-400 ml-1">Admin</span>
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
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-gray-300 hover:bg-gray-800",
              ].join(" ")
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 transition"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
