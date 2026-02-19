import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-center px-4">
      {/* Code erreur */}
      <span className="text-6xl font-bold text-gray-300">
        404
      </span>

      {/* Message */}
      <h1 className="text-xl font-semibold text-gray-900">
        Page introuvable
      </h1>

      <p className="text-sm text-gray-600 max-w-md">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      {/* Retour */}
      <Link
        to="/"
        className="mt-2 text-sm text-blue-600 font-medium hover:underline"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
