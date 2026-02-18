import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-center px-4">
      <span className="text-6xl font-bold text-muted">404</span>
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-muted-foreground">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-2 text-sm text-primary font-medium underline underline-offset-4 no-underline hover:underline"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
