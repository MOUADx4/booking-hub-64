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

  const {
    data: resource,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => fetchResource(Number(id)),
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

    if (!user) {
      navigate("/login");
      return;
    }

    if (!resource) return;

    if (startTime >= endTime) {
      setFormError("L'heure de fin doit être après l'heure de début.");
      return;
    }

    mutation.mutate({
      date,
      startTime,
      endTime,
      resource_id: resource.id,
    });
  }

  function closeModal() {
    setModalOpen(false);
    setBookingSuccess(false);
    setFormError("");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={16} />
          Retour aux ressources
        </button>

        {isLoading && <Loader />}
        {error && <ErrorMessage message="Ressource introuvable" />}

        {resource && (
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h1 className="text-2xl font-bold">{resource.name}</h1>

            <p className="text-gray-600 mt-2">{resource.description}</p>

            <div className="mt-4 flex gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Users size={16} />
                Capacité : {resource.capacity}
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={16} />
                {resource.location}
              </span>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setModalOpen(true)}
                disabled={!resource.available}
              >
                Réserver cette ressource
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={`Réserver — ${resource?.name}`}
      >
        {bookingSuccess ? (
          <div className="text-center py-6">
            <CheckCircle size={42} className="text-green-600 mx-auto" />
            <p className="mt-3 font-semibold">Réservation confirmée !</p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="flex flex-col gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <Input
              label="Début"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              label="Fin"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            {formError && (
              <p className="text-sm text-red-600">{formError}</p>
            )}

            <Button type="submit" isLoading={mutation.isPending}>
              Confirmer
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
