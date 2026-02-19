import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchResources } from "../../api/resources";
import type { Resource } from "../../api/resources";

import { Navbar } from "../../components/layout/Navbar";
import { ResourceCard } from "../../components/shared/ResourceCard";

import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Input } from "../../components/ui/Input";

import { Search } from "lucide-react";

// 🔥 Types EXACTS venant du backend Symfony
type ResourceType = "room" | "equipment" | "car" | "space";

const TYPE_FILTERS: { label: string; value: ResourceType | "all" }[] = [
  { label: "Tout", value: "all" },
  { label: "Salles", value: "room" },
  { label: "Équipements", value: "equipment" },
  { label: "Voitures", value: "car" },
  { label: "Espaces", value: "space" },
];

export default function ResourcesListPage() {
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });

  const filteredResources =
    data?.filter((r) => {
      const matchType = typeFilter === "all" || r.type === typeFilter;
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    }) ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Ressources disponibles
          </h1>
          <p className="text-sm text-gray-600">
            Consultez et réservez salles, équipements, espaces et véhicules.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une ressource..."
              className="pl-9"
            />
          </div>

          {/* Type filter */}
          <div className="flex gap-2 flex-wrap">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-1.5 text-sm rounded-md border transition ${
                  typeFilter === f.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading && <Loader />}

        {error && (
          <ErrorMessage
            message="Impossible de charger les ressources."
            onRetry={refetch}
          />
        )}

        {!isLoading && !error && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {filteredResources.length} ressource
              {filteredResources.length !== 1 ? "s" : ""}
            </p>

            {filteredResources.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                Aucune ressource ne correspond à votre recherche.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
