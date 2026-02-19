// src/api/users.ts

import { apiFetch } from "./apiFetch";

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

export async function fetchAllUsers(): Promise<ApiUser[]> {
  return apiFetch("/admin/users");
}

export async function deleteUser(id: number): Promise<void> {
  return apiFetch(`/admin/users/${id}`, {
    method: "DELETE",
  });
}
