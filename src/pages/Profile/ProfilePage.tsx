import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../../components/layout/Navbar";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CheckCircle, User } from "lucide-react";

// TODO: remplacer par PUT /api/users/me pour la sauvegarde du profil
export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-8 page-enter">
        <h1 className="text-2xl font-bold mb-1">Mon profil</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Gérez vos informations personnelles
        </p>

        <div className="bg-card rounded-xl border border-border p-6">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize font-medium">
                {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value="••••••••"
              disabled
              hint="La modification du mot de passe sera disponible prochainement"
            />

            <div className="flex items-center gap-3 mt-2">
              <Button type="submit">Enregistrer les modifications</Button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-success">
                  <CheckCircle size={16} />
                  Sauvegardé
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
