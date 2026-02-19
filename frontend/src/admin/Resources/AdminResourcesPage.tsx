// src/admin/Resources/AdminResourcesPage.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
} from "../../api/resources";

import type { Resource } from "../../api/resources";

import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";

import { Pencil, Trash2, Plus } from "lucide-react";

// ===========================
// Form backend compatible
// ===========================
type FormData = Omit<Resource, "id">;

const EMPTY_FORM: FormData = {
  name: "",
  type: "room",
  capacity: 10,
  description: null,
  location: "",
  available: true,
};

// 🔥 Normalisation des types FR → backend
function normalizeType(type: string): string {
  switch (type.toLowerCase()) {
    case "salle":
      return "room";
    case "équipement":
      return "equipment";
    case "voiture":
      return "car";
    case "espace":
      return "space";
    default:
      return type;
  }
}

export default function AdminResourcesPage() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Resource | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  // ===========================
  // GET resources
  // ===========================
  const {
    data: resources,
    isLoading,
    error,
  } = useQuery<Resource[]>({
    queryKey: ["admin-resources"],
    queryFn: fetchResources,
  });

  // ===========================
  // CREATE
  // ===========================
  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      closeModal();
    },
    onError: () => {
      alert("Erreur lors de la création !");
    },
  });

  // ===========================
  // UPDATE
  // ===========================
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Resource> }) =>
      updateResource(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      closeModal();
    },
    onError: () => {
      alert("Erreur lors de la modification !");
    },
  });

  // ===========================
  // DELETE
  // ===========================
  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
    },
  });

  // ===========================
  // Modal helpers
  // ===========================
  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(resource: Resource) {
    const { id, ...rest } = resource;

    setEditTarget(resource);

    // 🔥 Correction : normalisation du type
    setForm({
      ...rest,
      type: normalizeType(rest.type),
    });

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  }

  // ===========================
  // Actions
  // ===========================
  function handleDelete(id: number) {
    if (!window.confirm("Supprimer cette ressource ?")) return;
    deleteMutation.mutate(id);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      ...form,
      description: form.description?.trim() || null,
    };

    if (editTarget) {
      updateMutation.mutate({
        id: editTarget.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  }

  // ===========================
  // Render
  // ===========================
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ressources</h1>
          <p className="text-sm text-gray-600">
            Gestion des ressources via Symfony API
          </p>
        </div>

        <Button onClick={openCreate} size="sm">
          <Plus size={16} />
          Ajouter
        </Button>
      </div>

      {/* Loading */}
      {isLoading && <Loader />}

      {/* Error */}
      {error && (
        <ErrorMessage message="Impossible de charger les ressources." />
      )}

      {/* Table */}
      {resources && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-left">
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Capacité</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.type}</td>
                  <td className="px-5 py-3">{r.capacity}</td>

                  <td className="px-5 py-3 flex gap-2">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 rounded hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
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

          {/* Type */}
          <label className="text-sm font-medium text-gray-700">
            Type
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 w-full border rounded-md p-2 text-sm"
            >
              <option value="room">Salle</option>
              <option value="equipment">Équipement</option>
              <option value="car">Voiture</option>
              <option value="space">Espace</option>
            </select>
          </label>

          <Input
            label="Capacité"
            type="number"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
            required
          />

          <Input
            label="Description"
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Input
            label="Localisation"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />

          <Button
            type="submit"
            isLoading={createMutation.isPending || updateMutation.isPending}
          >
            {editTarget ? "Enregistrer" : "Créer"}
          </Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
