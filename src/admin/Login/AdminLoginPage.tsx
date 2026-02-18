import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Calendar, Shield } from "lucide-react";

// Page de connexion dédiée à l'administration
export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("alice@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirection si déjà connecté en admin
  if (user?.role === "admin") {
    navigate("/admin");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const storedUser = localStorage.getItem("user");
      const parsed = storedUser ? JSON.parse(storedUser) : null;

      if (parsed?.role !== "admin") {
        setError("Accès refusé : vous n'avez pas les droits administrateur");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        navigate("/admin");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Calendar size={22} className="text-sidebar-active" />
          <span className="text-xl font-bold text-sidebar-foreground">BookingHub</span>
          <span className="text-xs text-sidebar-foreground/50 ml-1 flex items-center gap-1">
            <Shield size={12} /> Admin
          </span>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h1 className="text-lg font-semibold mb-1">Espace administrateur</h1>
          <p className="text-sm text-muted-foreground mb-5">Connectez-vous avec un compte admin</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" isLoading={isLoading} className="w-full">
              Accéder au panneau admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
