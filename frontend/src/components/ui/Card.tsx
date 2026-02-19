import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg p-5 ${
        onClick ? "cursor-pointer hover:shadow-md transition" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
