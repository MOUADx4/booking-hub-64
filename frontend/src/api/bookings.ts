// src/api/bookings.ts
import { apiFetch } from "./apiFetch";

/**
 * ============================
 * Booking backend Symfony
 * ============================
 */
export interface Booking {
  id: number;

  date: string;
  startTime: string;
  endTime: string;

  status: "pending" | "confirmed" | "cancelled";

  createdAt?: string;

  user: {
    id: number;
    email: string;
    name: string;
  };

  resource: {
    id: number;
    name: string;
    type: string;
  };
}

/**
 * ============================
 * USER API
 * ============================
 */

/**
 * ✅ GET /api/bookings/me
 * Réservations de l'utilisateur connecté
 */
export async function fetchMyBookings(): Promise<Booking[]> {
  return apiFetch("/bookings/me");
}

/**
 * ✅ POST /api/bookings
 * Créer une réservation
 */
export async function createBooking(data: {
  date: string;
  startTime: string;
  endTime: string;
  resource_id: number;
}): Promise<Booking> {
  return apiFetch("/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * ✅ DELETE /api/bookings/{id}
 * Annuler réservation utilisateur
 */
export async function cancelBooking(id: number): Promise<void> {
  return apiFetch(`/bookings/${id}`, {
    method: "DELETE",
  });
}

/**
 * ============================
 * ADMIN API
 * ============================
 */

/**
 * ✅ GET /api/admin/bookings
 * Toutes les réservations (admin)
 */
export async function fetchAllBookings(): Promise<Booking[]> {
  return apiFetch("/admin/bookings");
}

/**
 * ✅ DELETE /api/admin/bookings/{id}
 * Supprimer réservation (admin)
 */
export async function deleteBooking(id: number): Promise<void> {
  return apiFetch(`/admin/bookings/${id}`, {
    method: "DELETE",
  });
}
