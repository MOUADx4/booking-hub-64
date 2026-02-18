import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchResource } from "../../api/resources";
import { createBooking } from "../../api/bookings";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../../components/layout/Navbar";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { MapPin, Users, ArrowLeft, CheckCircle } from "lucide-react";

// TODO: remplacer mock par GET /api/resources/:id
export default function ResourceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const { data: resource, isLoading, error } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => fetchResource(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      setBookingSuccess(true);
    },
    onError: (err: Error) => {
      setFormError(err.message);
    },
  });

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!user || !resource) return;
    if (startTime >= endTime) {
      setFormError("L'heure de fin doit être après l'heure de début");
      return;
    }

    mutation.mutate({
      resourceId: resource.id,
      resourceName: resource.name,
      userId: user.id,
      userName: user.name,
      date,
      startTime,
      endTime,
    });
  }

  function closeModal() {
    setModalOpen(false);
    setBookingSuccess(false);
    setFormError("");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 page-enter">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux ressources
        </button>

        {isLoading && <Loader />}
        {error && <ErrorMessage message="Ressource introuvable" />}

        {resource && (
          <div className="flex flex-col gap-6">
            {/* En-tête ressource */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl font-bold">{resource.name}</h1>
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-medium capitalize shrink-0">
                  {resource.type}
                </span>
              </div>

              <p className="text-muted-foreground mb-5">{resource.description}</p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-5">
                <span className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Capacité : {resource.capacity} personne{resource.capacity > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {resource.location}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={resource.available ? "text-success font-medium text-sm" : "text-destructive font-medium text-sm"}>
                  {resource.available ? "● Disponible" : "● Indisponible"}
                </span>

                {user ? (
                  <Button
                    onClick={() => setModalOpen(true)}
                    disabled={!resource.available}
                  >
                    Réserver cette ressource
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")}>
                    Se connecter pour réserver
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de réservation */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={`Réserver — ${resource?.name}`}>
        {bookingSuccess ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle size={40} className="text-success" />
            <h3 className="font-semibold text-base">Réservation confirmée !</h3>
            <p className="text-sm text-muted-foreground">
              Votre réservation a bien été enregistrée.
            </p>
            <Button variant="outline" onClick={() => navigate("/bookings")} className="mt-2">
              Voir mes réservations
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="flex flex-col gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Heure de début"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="Heure de fin"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex gap-3 mt-2">
              <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" isLoading={mutation.isPending} className="flex-1">
                Confirmer
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
