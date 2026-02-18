import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyBookings, cancelBooking } from "../../api/bookings";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../../components/layout/Navbar";
import { BookingCard } from "../../components/shared/BookingCard";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Link } from "react-router-dom";

// TODO: remplacer mock par GET /api/bookings/me (token JWT côté serveur)
export default function MyBookingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["myBookings", user?.id],
    queryFn: () => fetchMyBookings(user!.id),
    enabled: !!user,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
    },
  });

  const active = bookings?.filter((b) => b.status !== "annulée") ?? [];
  const cancelled = bookings?.filter((b) => b.status === "annulée") ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 page-enter">
        <h1 className="text-2xl font-bold mb-1">Mes réservations</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Retrouvez et gérez toutes vos réservations
        </p>

        {isLoading && <Loader />}
        {error && <ErrorMessage message="Impossible de charger vos réservations" />}

        {bookings && bookings.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="mb-4">Vous n'avez aucune réservation pour le moment.</p>
            <Link to="/resources" className="text-primary font-medium">
              Parcourir les ressources →
            </Link>
          </div>
        )}

        {active.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              En cours ({active.length})
            </h2>
            <div className="flex flex-col gap-3">
              {active.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={(id) => cancelMutation.mutate(id)}
                />
              ))}
            </div>
          </section>
        )}

        {cancelled.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Annulées ({cancelled.length})
            </h2>
            <div className="flex flex-col gap-3 opacity-60">
              {cancelled.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
