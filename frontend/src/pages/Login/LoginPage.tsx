import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/auth"; // ✅ Symfony login réel

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import { Calendar } from "lucide-react";

export default function LoginPage() {
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
      // ✅ Appel Symfony API
      await login(email, password);

      // ✅ Redirection après succès
      navigate("/resources");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Calendar size={24} className="text-blue-600" />
          <span className="text-xl font-bold text-gray-900">BookingHub</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            Connexion
          </h1>

          <p className="text-sm text-gray-600 mb-5">
            Connectez-vous avec votre compte Symfony JWT.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Adresse email"
              type="email"
              placeholder="test@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Mot de passe"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full mt-1">
              Se connecter
            </Button>
          </form>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
