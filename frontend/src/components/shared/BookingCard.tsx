// src/components/shared/BookingCard.tsx

import { Calendar, Clock, Trash2 } from "lucide-react";
import type { Booking } from "../../api/bookings";

interface BookingCardProps {
  booking: Booking;

  // ✅ Cancel booking (Symfony uses number IDs)
  onCancel?: (id: number) => void;

  // ✅ Admin mode shows extra info
  isAdmin?: boolean;
}

/**
 * ✅ Badge styling (Symfony status)
 */
function getStatusStyle(status: Booking["status"]) {
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
 * ✅ French label display
 */
function getStatusLabel(status: Booking["status"]) {
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

export function BookingCard({
  booking,
  onCancel,
  isAdmin = false,
}: BookingCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between gap-4 shadow-sm">
      {/* Left */}
      <div className="flex flex-col gap-2">
        {/* Title + Status */}
        <div className="flex items-center gap-2">
          {/* ✅ Symfony resource */}
          <h4 className="font-semibold text-sm text-gray-900">
            {booking.resource.name}
          </h4>

          {/* ✅ Status badge */}
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusStyle(
              booking.status
            )}`}
          >
            {getStatusLabel(booking.status)}
          </span>
        </div>

        {/* Admin info */}
        {isAdmin && (
          <p className="text-xs text-gray-500">
            Réservé par :{" "}
            <span className="font-medium">{booking.user.name}</span>
          </p>
        )}

        {/* Date + Time */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          {/* Date */}
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {new Date(booking.date).toLocaleDateString("fr-FR")}
          </span>

          {/* Time */}
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {booking.startTime} – {booking.endTime}
          </span>
        </div>
      </div>

      {/* Cancel button */}
      {onCancel && booking.status !== "cancelled" && (
        <button
          onClick={() => onCancel(booking.id)}
          className="p-2 rounded-md text-red-600 hover:bg-red-50 transition shrink-0"
          aria-label="Annuler la réservation"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
