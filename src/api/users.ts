// Gestion des utilisateurs — mock localStorage
// TODO: remplacer par GET /api/admin/users

import type { User } from "../context/AuthContext";

// Récupère les users stockés (mêmes que auth.ts, sans les mots de passe)
export async function fetchAllUsers(): Promise<User[]> {
  await delay(300);
  const raw = localStorage.getItem("bh_users");
  const users: (User & { password?: string })[] = raw
    ? JSON.parse(raw)
    : [
        { id: "1", name: "Alice Martin", email: "alice@example.com", role: "admin" },
        { id: "2", name: "Bob Dupont", email: "bob@example.com", role: "user" },
      ];

  return users.map(({ password: _, ...u }) => u);
}

// DELETE /api/admin/users/:id
export async function deleteUser(id: string): Promise<void> {
  await delay(300);
  const raw = localStorage.getItem("bh_users");
  if (!raw) return;
  const users = JSON.parse(raw).filter((u: User) => u.id !== id);
  localStorage.setItem("bh_users", JSON.stringify(users));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
