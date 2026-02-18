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
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// TODO: remplacer mock par GET /api/admin/stats (agrégation côté serveur)
export default function AdminDashboardPage() {
  const resources = useQuery({ queryKey: ["admin-resources"], queryFn: fetchResources });
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: fetchAllBookings });
  const users = useQuery({ queryKey: ["admin-users"], queryFn: fetchAllUsers });

  const isLoading = resources.isLoading || bookings.isLoading || users.isLoading;

  const stats = {
    resources: resources.data?.length ?? 0,
    bookings: bookings.data?.length ?? 0,
    users: users.data?.length ?? 0,
    activeBookings: bookings.data?.filter((b) => b.status === "confirmée").length ?? 0,
  };

  const recent = bookings.data
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Vue d'ensemble de BookingHub</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Ressources"
              value={stats.resources}
              icon={<BookOpen size={20} className="text-primary" />}
              color="bg-accent"
            />
            <StatCard
              label="Utilisateurs"
              value={stats.users}
              icon={<Users size={20} className="text-success" />}
              color="bg-success/10"
            />
            <StatCard
              label="Réservations totales"
              value={stats.bookings}
              icon={<CalendarCheck size={20} className="text-warning" />}
              color="bg-warning/10"
            />
            <StatCard
              label="Confirmées"
              value={stats.activeBookings}
              icon={<TrendingUp size={20} className="text-primary" />}
              color="bg-accent"
            />
          </div>

          {/* Réservations récentes */}
          <div className="bg-card rounded-lg border border-border">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-sm">Réservations récentes</h2>
            </div>
            {!recent || recent.length === 0 ? (
              <p className="text-sm text-muted-foreground p-5">Aucune réservation pour le moment.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="px-5 py-3 font-medium">Ressource</th>
                    <th className="px-5 py-3 font-medium">Utilisateur</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 font-medium">{b.resourceName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.userName}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(b.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={[
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            b.status === "confirmée" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                          ].join(" ")}
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
