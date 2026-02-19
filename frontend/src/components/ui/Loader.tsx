interface LoaderProps {
  text?: string;
}

export function Loader({ text = "Chargement..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-600">
      {/* Spinner */}
      <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin" />

      {/* Texte */}
      <p className="text-sm">{text}</p>
    </div>
  );
}
