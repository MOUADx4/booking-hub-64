// src/pages/Profile/ProfilePage.tsx

import { useAuth } from "../../hooks/useAuth";

import { Navbar } from "../../components/layout/Navbar";
import { Input } from "../../components/ui/Input";

import { User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Vous devez être connecté pour voir votre profil.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-10">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Mon profil
        </h1>

        <p className="text-sm text-gray-600 mb-8">
          Informations de votre compte (lecture seule pour le moment).
        </p>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {/* User header */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-200">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={24} className="text-blue-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {user.email}
              </p>

              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                {user.role === "admin"
                  ? "Administrateur"
                  : "Utilisateur"}
              </span>
            </div>
          </div>

          {/* Form (readonly) */}
          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              value={user.email}
              disabled
            />

            <Input
              label="Rôle"
              value={user.role}
              disabled
            />

            <Input
              label="Nom"
              value="(Non disponible avec JWT pour l’instant)"
              disabled
              hint="Le backend Symfony ne fournit pas encore le champ name."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
