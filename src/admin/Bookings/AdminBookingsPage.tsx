import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllBookings, deleteBooking } from "../../api/bookings";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Trash2 } from "lucide-react";

// TODO: remplacer mock par GET /api/admin/bookings avec pagination et filtres
export default function AdminBookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchAllBookings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  const statusStyles: Record<string, string> = {
    confirmée: "bg-success/10 text-success",
    annulée: "bg-muted text-muted-foreground",
    "en attente": "bg-warning/10 text-warning",
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Réservations</h1>
        <p className="text-sm text-muted-foreground">Toutes les réservations de la plateforme</p>
      </div>

      {isLoading && <Loader />}
      {error && <ErrorMessage message="Impossible de charger les réservations" />}

      {bookings && (
        <>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Aucune réservation enregistrée.
            </p>
          ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-left">
                    <th className="px-5 py-3 font-medium">Ressource</th>
                    <th className="px-5 py-3 font-medium">Utilisateur</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Horaire</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">{b.resourceName}</td>
                      <td className="px-5 py-3 text-muted-foreground">{b.userName}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(b.date).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {b.startTime} – {b.endTime}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[b.status] ?? "bg-muted text-muted-foreground"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => deleteMutation.mutate(b.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
