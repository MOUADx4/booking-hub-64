// src/admin/Bookings/AdminBookingsPage.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllBookings, deleteBooking } from "../../api/bookings";

import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

import { Trash2 } from "lucide-react";

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchAllBookings,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] }),
  });

  function formatStatus(status: string) {
    if (status === "confirmed") return "Confirmée";
    if (status === "cancelled") return "Annulée";
    return "En attente";
  }

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-6">Réservations</h1>

      {isLoading && <Loader />}
      {error && (
        <ErrorMessage message="Impossible de charger les réservations admin." />
      )}

      {bookings && (
        <table className="w-full text-sm bg-white border rounded-lg">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="p-3">Ressource</th>
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Date</th>
              <th className="p-3">Horaire</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{b.resource.name}</td>
                <td className="p-3">{b.user.name}</td>
                <td className="p-3">
                  {new Date(b.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="p-3">
                  {b.startTime} - {b.endTime}
                </td>
                <td className="p-3">{formatStatus(b.status)}</td>

                <td className="p-3">
                  <button
                    onClick={() => deleteMutation.mutate(b.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
