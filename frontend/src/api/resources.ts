import { apiFetch } from "./apiFetch";

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  description: string | null;
  location: string;
  available: boolean;
}

export async function fetchResources(): Promise<Resource[]> {
  return apiFetch("/resources");
}

export async function fetchResource(id: number): Promise<Resource> {
  return apiFetch(`/resources/${id}`);
}

export async function createResource(
  data: Omit<Resource, "id">
): Promise<Resource> {
  return apiFetch("/admin/resources", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      description: data.description?.trim() || null,
    }),
  });
}

export async function updateResource(
  id: number,
  data: Partial<Resource>
): Promise<Resource> {
  return apiFetch(`/admin/resources/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      ...data,
      description:
        data.description !== undefined
          ? data.description?.trim() || null
          : undefined,
    }),
  });
}

export async function deleteResource(id: number): Promise<void> {
  return apiFetch(`/admin/resources/${id}`, {
    method: "DELETE",
  });
}
