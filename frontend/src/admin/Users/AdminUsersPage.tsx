// src/admin/Bookings/AdminBookingsPage.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllBookings, deleteBooking } from "../../api/bookings";

import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

import { Trash2 } from "lucide-react";

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();

  /**
   * ✅ Fetch bookings from Symfony Admin API
   */
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchAllBookings,
  });

  /**
   * ✅ Delete booking via Symfony API
   */
  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });

  /**
   * ✅ Status badge styling (Symfony values)
   */
  function getStatusStyle(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      case "pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  /**
   * ✅ Traduction FR pour affichage
   */
  function getStatusLabel(status: string) {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "cancelled":
        return "Annulée";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Réservations</h1>

        <p className="text-sm text-gray-600">
          Toutes les réservations enregistrées en base Symfony
        </p>
      </div>

      {/* Loading */}
      {isLoading && <Loader />}

      {/* Error */}
      {error && (
        <ErrorMessage message="Impossible de charger les réservations admin." />
      )}

      {/* Table */}
      {bookings && (
        <>
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-600 py-10 text-center">
              Aucune réservation enregistrée.
            </p>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-left">
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
                    <tr
                      key={b.id}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                    >
                      {/* Resource */}
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {b.resource.name}
                      </td>

                      {/* User */}
                      <td className="px-5 py-3 text-gray-600">
                        {b.user.name}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3 text-gray-600">
                        {new Date(b.date).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Time */}
                      <td className="px-5 py-3 text-gray-600">
                        {b.startTime} – {b.endTime}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(
                            b.status
                          )}`}
                        >
                          {getStatusLabel(b.status)}
                        </span>
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() =>
                            deleteMutation.mutate(Number(b.id))
                          }
                          className="p-2 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
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
