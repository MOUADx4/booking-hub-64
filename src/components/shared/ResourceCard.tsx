import { Link } from "react-router-dom";
import { MapPin, Users, Tag } from "lucide-react";
import type { Resource } from "../../api/resources";

interface ResourceCardProps {
  resource: Resource;
}

const typeColors: Record<string, string> = {
  salle: "bg-accent text-accent-foreground",
  équipement: "bg-warning/10 text-warning",
  espace: "bg-success/10 text-success",
};

// Carte ressource utilisée dans la liste et les pages de recherche
export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all p-5 flex flex-col gap-3">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground leading-snug">{resource.name}</h3>
        <span
          className={[
            "text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0",
            typeColors[resource.type] ?? "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {resource.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

      {/* Métadonnées */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users size={13} />
          {resource.capacity} pers.
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={13} />
          {resource.location}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-1">
        <span
          className={[
            "text-xs font-medium",
            resource.available ? "text-success" : "text-destructive",
          ].join(" ")}
        >
          {resource.available ? "● Disponible" : "● Indisponible"}
        </span>
        <Link
          to={`/resources/${resource.id}`}
          className="text-sm text-primary hover:underline underline-offset-2 no-underline font-medium"
        >
          Voir les détails →
        </Link>
      </div>
    </div>
  );
}
