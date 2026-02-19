import { Link } from "react-router-dom";
import { CalendarDays, Search, CheckCircle } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";

const features = [
  {
    icon: Search,
    title: "Catalogue clair et structuré",
    desc: "Parcourez l’ensemble des ressources disponibles grâce à une interface intuitive et organisée.",
  },
  {
    icon: CalendarDays,
    title: "Réservation optimisée",
    desc: "Sélectionnez un créneau et réservez une ressource en quelques secondes, sans complexité inutile.",
  },
  {
    icon: CheckCircle,
    title: "Suivi centralisé",
    desc: "Accédez à l’historique de vos réservations et gérez-les en toute autonomie.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero section */}
      <header className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          BookingHub
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Une plateforme moderne dédiée à la gestion et à la réservation de
          ressources professionnelles. Pensée pour offrir une expérience fluide,
          rapide et fiable.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/resources"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Accéder au catalogue
          </Link>

          <Link
            to="/profile"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-900 font-medium hover:bg-gray-100 transition"
          >
            Espace utilisateur
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold text-center mb-10 text-gray-900">
          Ce que BookingHub met à votre disposition
        </h2>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
            >
              <div className="flex justify-center mb-4">
                <f.icon className="h-8 w-8 text-blue-600" />
              </div>

              <h3 className="font-semibold text-lg text-gray-900">
                {f.title}
              </h3>

              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-800 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-6 w-6 text-blue-500" />
              <span className="text-lg font-semibold text-white">BookingHub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Solution de gestion et de réservation de ressources, conçue pour
              offrir une expérience fluide et professionnelle.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="text-white font-semibold mb-2">Navigation</h3>
            <Link to="/resources" className="hover:text-white transition">
              Catalogue
            </Link>
            <Link to="/bookings" className="hover:text-white transition">
              Mes réservations
            </Link>
            <Link to="/profile" className="hover:text-white transition">
              Profil
            </Link>
          </div>

          {/* About */}
          <div className="flex flex-col gap-2 text-sm">
            <h3 className="text-white font-semibold mb-2">À propos</h3>
            <p className="text-gray-400">
              Développé par{" "}
              <span className="text-white font-medium">Mouad Bounokra</span>.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BookingHub — Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
