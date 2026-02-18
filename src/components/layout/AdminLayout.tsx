import React from "react";
import { AdminSidebar } from "./AdminSidebar";

// Layout commun à toutes les pages admin
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 page-enter">{children}</div>
      </main>
    </div>
  );
}
