// Gestion des ressources — mock localStorage
// TODO: remplacer par GET/POST/PUT/DELETE /api/resources

export type ResourceType = "salle" | "équipement" | "espace";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  description: string;
  location: string;
  available: boolean;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "r1",
    name: "Salle Einstein",
    type: "salle",
    capacity: 20,
    description: "Grande salle de réunion équipée d'un projecteur et d'un tableau blanc.",
    location: "Bâtiment A — 2ème étage",
    available: true,
  },
  {
    id: "r2",
    name: "Salle Curie",
    type: "salle",
    capacity: 8,
    description: "Petite salle idéale pour les brainstormings et réunions d'équipe.",
    location: "Bâtiment A — 1er étage",
    available: true,
  },
  {
    id: "r3",
    name: "Espace Coworking Nord",
    type: "espace",
    capacity: 15,
    description: "Open space calme avec prises et accès Wi-Fi haut débit.",
    location: "Bâtiment B — RDC",
    available: true,
  },
  {
    id: "r4",
    name: "Projecteur HD",
    type: "équipement",
    capacity: 1,
    description: "Projecteur portable haute définition pour présentations.",
    location: "Accueil — Bureau matériel",
    available: true,
  },
  {
    id: "r5",
    name: "Salle Tesla",
    type: "salle",
    capacity: 50,
    description: "Amphithéâtre pour conférences et présentations importantes.",
    location: "Bâtiment C — RDC",
    available: false,
  },
];

function getResources(): Resource[] {
  const raw = localStorage.getItem("bh_resources");
  return raw ? JSON.parse(raw) : INITIAL_RESOURCES;
}

function saveResources(resources: Resource[]) {
  localStorage.setItem("bh_resources", JSON.stringify(resources));
}

// GET /api/resources
export async function fetchResources(): Promise<Resource[]> {
  await delay(300);
  return getResources();
}

// GET /api/resources/:id
export async function fetchResource(id: string): Promise<Resource> {
  await delay(200);
  const resource = getResources().find((r) => r.id === id);
  if (!resource) throw new Error("Ressource introuvable");
  return resource;
}

// POST /api/admin/resources
export async function createResource(data: Omit<Resource, "id">): Promise<Resource> {
  await delay(300);
  const resources = getResources();
  const newResource: Resource = { ...data, id: `r${Date.now()}` };
  saveResources([...resources, newResource]);
  return newResource;
}

// PUT /api/admin/resources/:id
export async function updateResource(id: string, data: Partial<Resource>): Promise<Resource> {
  await delay(300);
  const resources = getResources();
  const updated = resources.map((r) => (r.id === id ? { ...r, ...data } : r));
  saveResources(updated);
  const result = updated.find((r) => r.id === id)!;
  return result;
}

// DELETE /api/admin/resources/:id
export async function deleteResource(id: string): Promise<void> {
  await delay(300);
  saveResources(getResources().filter((r) => r.id !== id));
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
