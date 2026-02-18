import { Calendar, Clock, Trash2 } from "lucide-react";
import type { Booking } from "../../api/bookings";
import { Button } from "../ui/Button";

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  isAdmin?: boolean;
}

const statusStyles: Record<string, string> = {
  confirmée: "bg-success/10 text-success",
  annulée: "bg-muted text-muted-foreground",
  "en attente": "bg-warning/10 text-warning",
};

// Carte de réservation — partagée entre la vue utilisateur et admin
export function BookingCard({ booking, onCancel, isAdmin = false }: BookingCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-foreground text-sm">{booking.resourceName}</h4>
          <span
            className={[
              "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
              statusStyles[booking.status] ?? "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {booking.status}
          </span>
        </div>

        {isAdmin && (
          <p className="text-xs text-muted-foreground">Réservé par : {booking.userName}</p>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(booking.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
      </div>

      {onCancel && booking.status !== "annulée" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCancel(booking.id)}
          className="text-destructive hover:bg-destructive/10 shrink-0"
          aria-label="Annuler la réservation"
        >
          <Trash2 size={15} />
        </Button>
      )}
    </div>
  );
}
