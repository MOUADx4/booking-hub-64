import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

// Composant Card générique — utilisé pour les ressources, réservations, stats admin
export function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-card rounded-lg border border-border p-5",
        hoverable ? "cursor-pointer hover:shadow-md hover:border-primary/30 transition-all" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// Sous-composants pour une meilleure lisibilité dans les pages
Card.Header = function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
};

Card.Title = function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold text-foreground ${className}`}>{children}</h3>;
};

Card.Body = function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
};
