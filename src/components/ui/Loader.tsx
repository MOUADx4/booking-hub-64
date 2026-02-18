// Indicateur de chargement — utilisé dans toutes les pages
export function Loader({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <span className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin block" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
