import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Calendar } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/resources");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Calendar size={24} className="text-primary" />
          <span className="text-xl font-bold text-foreground">BookingHub</span>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">Connexion</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Accédez à votre espace de réservation
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" isLoading={isLoading} className="w-full mt-1">
              Se connecter
            </Button>
          </form>

          {/* Comptes de démo */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Comptes de démo :</p>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <span>👤 bob@example.com / user123</span>
              <span>🔑 alice@example.com / admin123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-primary font-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
