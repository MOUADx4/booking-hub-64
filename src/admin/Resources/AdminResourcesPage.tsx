import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchResources, createResource, updateResource, deleteResource } from "../../api/resources";
import type { Resource } from "../../api/resources";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Pencil, Trash2, Plus } from "lucide-react";

type FormData = Omit<Resource, "id">;

const EMPTY_FORM: FormData = {
  name: "",
  type: "salle",
  capacity: 10,
  description: "",
  location: "",
  available: true,
};

// TODO: remplacer mock par GET /api/admin/resources avec pagination
export default function AdminResourcesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  const { data: resources, isLoading, error } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: fetchResources,
  });

  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-resources"] }); closeModal(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Resource> }) => updateResource(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-resources"] }); closeModal(); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(resource: Resource) {
    const { id, ...rest } = resource;
    setEditTarget(resource);
    setForm(rest);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Ressources</h1>
          <p className="text-sm text-muted-foreground">Gérez les ressources disponibles</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {isLoading && <Loader />}
      {error && <ErrorMessage message="Impossible de charger les ressources" />}

      {resources && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Capacité</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3 text-muted-foreground capitalize">{r.type}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.capacity}</td>
                  <td className="px-5 py-3">
                    <span className={r.available ? "text-success text-xs font-medium" : "text-destructive text-xs font-medium"}>
                      {r.available ? "Disponible" : "Indisponible"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(r.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Modifier la ressource" : "Nouvelle ressource"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Resource["type"] })}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="salle">Salle</option>
              <option value="espace">Espace</option>
              <option value="équipement">Équipement</option>
            </select>
          </div>
          <Input
            label="Capacité"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            min={1}
            required
          />
          <Input
            label="Localisation"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="available" className="text-sm">Disponible</label>
          </div>
          <div className="flex gap-3 mt-1">
            <Button type="button" variant="outline" onClick={closeModal} className="flex-1">Annuler</Button>
            <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending} className="flex-1">
              {editTarget ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
