import { useQuery } from "@tanstack/react-query";

import { fetchResources } from "../../api/resources";
import { fetchAllBookings } from "../../api/bookings";
import { fetchAllUsers } from "../../api/users";

import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";

import { BookOpen, Users, CalendarCheck, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
}

function StatCard({ label, value, icon, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>

      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
}

// Statistiques calculées côté front pour le moment.
// Elles seront générées côté serveur via Symfony (API admin).
export default function AdminDashboardPage() {
  const resources = useQuery({
    queryKey: ["admin-resources"],
    queryFn: fetchResources,
  });

  const bookings = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchAllBookings,
  });

  const users = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAllUsers,
  });

  const isLoading =
    resources.isLoading || bookings.isLoading || users.isLoading;

  const stats = {
    resources: resources.data?.length ?? 0,
    bookings: bookings.data?.length ?? 0,
    users: users.data?.length ?? 0,
    activeBookings:
      bookings.data?.filter((b) => b.status === "confirmed").length ?? 0,
  };

  const recentBookings = bookings.data
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Vue d'ensemble de BookingHub
        </p>
      </div>

      {/* Loading */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Ressources"
              value={stats.resources}
              icon={<BookOpen size={20} className="text-blue-600" />}
              bgColor="bg-blue-100"
            />

            <StatCard
              label="Utilisateurs"
              value={stats.users}
              icon={<Users size={20} className="text-green-600" />}
              bgColor="bg-green-100"
            />

            <StatCard
              label="Réservations"
              value={stats.bookings}
              icon={<CalendarCheck size={20} className="text-orange-600" />}
              bgColor="bg-orange-100"
            />

            <StatCard
              label="Confirmées"
              value={stats.activeBookings}
              icon={<TrendingUp size={20} className="text-blue-600" />}
              bgColor="bg-blue-100"
            />
          </div>

          {/* Recent bookings */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-sm text-gray-900">
                Réservations récentes
              </h2>
            </div>

            {!recentBookings || recentBookings.length === 0 ? (
              <p className="text-sm text-gray-600 p-5">
                Aucune réservation pour le moment.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-left">
                    <th className="px-5 py-3 font-medium">Ressource</th>
                    <th className="px-5 py-3 font-medium">Utilisateur</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {b.resource.name}
                      </td>

                      <td className="px-5 py-3 text-gray-600">
                        {b.user?.name}
                      </td>

                      <td className="px-5 py-3 text-gray-600">
                        {new Date(b.date).toLocaleDateString("fr-FR")}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            b.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
