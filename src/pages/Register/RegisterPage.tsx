import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Calendar } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate("/resources");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Calendar size={24} className="text-primary" />
          <span className="text-xl font-bold text-foreground">BookingHub</span>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">Créer un compte</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Rejoignez BookingHub et réservez vos ressources
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nom complet"
              type="text"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint="Au moins 6 caractères"
              autoComplete="new-password"
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" isLoading={isLoading} className="w-full mt-1">
              Créer mon compte
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-primary font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
