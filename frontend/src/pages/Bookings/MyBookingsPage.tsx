// src/pages/Bookings/MyBookingsPage.tsx

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyBookings, cancelBooking } from "../../api/bookings";

import { Navbar } from "../../components/layout/Navbar";
import { BookingCard } from "../../components/shared/BookingCard";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

import { Link } from "react-router-dom";

export default function MyBookingsPage() {
  const queryClient = useQueryClient();

  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: fetchMyBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const activeBookings =
    bookings?.filter((b) => b.status !== "cancelled") ?? [];

  const cancelledBookings =
    bookings?.filter((b) => b.status === "cancelled") ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Mes réservations
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          Retrouvez et gérez toutes vos réservations.
        </p>

        {isLoading && <Loader />}

        {error && (
          <ErrorMessage message="Impossible de charger vos réservations." />
        )}

        {bookings && bookings.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-4">Vous n'avez aucune réservation pour le moment.</p>

            <Link
              to="/resources"
              className="text-blue-600 font-medium hover:underline"
            >
              Parcourir les ressources →
            </Link>
          </div>
        )}

        {activeBookings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              En cours ({activeBookings.length})
            </h2>

            <div className="flex flex-col gap-3">
              {activeBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={(id) => cancelMutation.mutate(Number(id))}
                />
              ))}
            </div>
          </section>
        )}

        {cancelledBookings.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Annulées ({cancelledBookings.length})
            </h2>

            <div className="flex flex-col gap-3 opacity-60">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
