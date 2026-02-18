// Base URL de l'API — à remplacer par l'URL du serveur Symfony
export const API_BASE_URL = "/api";

// Helper générique pour les requêtes fetch
// TODO: remplacer mock par appels réels à l'API Symfony
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }

  return response.json();
}
