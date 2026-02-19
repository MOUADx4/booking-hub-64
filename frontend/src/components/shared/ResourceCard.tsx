import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import type { Resource } from "../../api/resources";

interface ResourceCardProps {
  resource: Resource;
}

function getTypeStyle(type: string) {
  switch (type) {
    case "room":
      return "bg-blue-100 text-blue-700";
    case "equipment":
      return "bg-orange-100 text-orange-700";
    case "car":
      return "bg-purple-100 text-purple-700";
    case "space":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-gray-900 leading-snug">
          {resource.name}
        </h3>

        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getTypeStyle(
            resource.type
          )}`}
        >
          {resource.type}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {resource.description}
      </p>

      {/* Meta info */}
      <div className="flex flex-col gap-1 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Users size={13} />
          Capacité : {resource.capacity} pers.
        </span>

        <span className="flex items-center gap-1">
          <MapPin size={13} />
          {resource.location}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            resource.available ? "text-green-600" : "text-red-600"
          }`}
        >
          {resource.available ? "● Disponible" : "● Indisponible"}
        </span>

        <Link
          to={`/resources/${resource.id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Voir les détails →
        </Link>
      </div>
    </div>
  );
}
