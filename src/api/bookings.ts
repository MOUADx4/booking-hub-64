// Gestion des réservations — mock localStorage
// TODO: remplacer par appels réels à /api/bookings

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  status: "confirmée" | "annulée" | "en attente";
  createdAt: string;
}

function getBookings(): Booking[] {
  const raw = localStorage.getItem("bh_bookings");
  return raw ? JSON.parse(raw) : [];
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem("bh_bookings", JSON.stringify(bookings));
}

// POST /api/bookings
export async function createBooking(data: {
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
}): Promise<Booking> {
  await delay(400);

  const newBooking: Booking = {
    id: `b${Date.now()}`,
    ...data,
    status: "confirmée",
    createdAt: new Date().toISOString(),
  };

  saveBookings([...getBookings(), newBooking]);
  return newBooking;
}

// GET /api/bookings/me
export async function fetchMyBookings(userId: string): Promise<Booking[]> {
  await delay(300);
  return getBookings().filter((b) => b.userId === userId);
}

// DELETE /api/bookings/:id
export async function cancelBooking(id: string): Promise<void> {
  await delay(300);
  const updated = getBookings().map((b) =>
    b.id === id ? { ...b, status: "annulée" as const } : b
  );
  saveBookings(updated);
}

// GET /api/admin/bookings
export async function fetchAllBookings(): Promise<Booking[]> {
  await delay(300);
  return getBookings();
}

// DELETE /api/admin/bookings/:id
export async function deleteBooking(id: string): Promise<void> {
  await delay(300);
  saveBookings(getBookings().filter((b) => b.id !== id));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
