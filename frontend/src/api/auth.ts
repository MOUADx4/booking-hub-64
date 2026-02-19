// src/api/auth.ts
import { apiFetch } from "./apiFetch";

/**
 * Login Symfony JWT
 */
export async function login(email: string, password: string) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", data.token);
  return data;
}

/**
 * Register Symfony
 */
export async function register(name: string, email: string, password: string) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

/**
 * Logout
 */
export function logout() {
  localStorage.removeItem("token");
}
