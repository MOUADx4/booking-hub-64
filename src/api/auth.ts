// Fonctions d'authentification — mock localStorage
// TODO: remplacer par appels réels POST /api/auth/login et /api/auth/register

import type { User } from "../context/AuthContext";

// Données initiales de démo
const DEMO_USERS: (User & { password: string })[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice@example.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "2",
    name: "Bob Dupont",
    email: "bob@example.com",
    role: "user",
    password: "user123",
  },
];

function getStoredUsers(): (User & { password: string })[] {
  const raw = localStorage.getItem("bh_users");
  return raw ? JSON.parse(raw) : DEMO_USERS;
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem("bh_users", JSON.stringify(users));
}

// POST /api/auth/login
export async function login(email: string, password: string): Promise<{ token: string; user: User }> {
  await delay(400);

  const users = getStoredUsers();
  const found = users.find((u) => u.email === email && u.password === password);

  if (!found) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const { password: _, ...user } = found;
  const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));

  return { token, user };
}

// POST /api/auth/register
export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  await delay(400);

  const users = getStoredUsers();
  if (users.find((u) => u.email === email)) {
    throw new Error("Cet email est déjà utilisé");
  }

  const newUser: User & { password: string } = {
    id: String(Date.now()),
    name,
    email,
    role: "user",
    password,
  };

  saveUsers([...users, newUser]);

  const { password: _, ...user } = newUser;
  const token = btoa(JSON.stringify({ id: user.id, role: user.role, exp: Date.now() + 86400000 }));

  return { token, user };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
