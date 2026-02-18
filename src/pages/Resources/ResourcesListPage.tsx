import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchResources } from "../../api/resources";
import type { ResourceType } from "../../api/resources";
import { Navbar } from "../../components/layout/Navbar";
import { ResourceCard } from "../../components/shared/ResourceCard";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Search } from "lucide-react";

const TYPE_FILTERS: { label: string; value: ResourceType | "all" }[] = [
  { label: "Tout", value: "all" },
  { label: "Salles", value: "salle" },
  { label: "Espaces", value: "espace" },
  { label: "Équipements", value: "équipement" },
];

// TODO: remplacer mock par GET /api/resources avec filtres côté serveur
export default function ResourcesListPage() {
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [search, setSearch] = useState("");

  const { data: resources, isLoading, error, refetch } = useQuery({
    queryKey: ["resources"],
    queryFn: fetchResources,
  });

  const filtered = resources?.filter((r) => {
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 page-enter">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Ressources disponibles</h1>
          <p className="text-muted-foreground text-sm">
            Consultez et réservez salles, espaces et équipements
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Recherche */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filtre type */}
          <div className="flex gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={[
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  typeFilter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        {isLoading && <Loader />}
        {error && <ErrorMessage message="Impossible de charger les ressources" onRetry={refetch} />}

        {filtered && (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} ressource{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Aucune ressource ne correspond à votre recherche.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
