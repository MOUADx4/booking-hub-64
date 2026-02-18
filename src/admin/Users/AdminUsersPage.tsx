import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllUsers, deleteUser } from "../../api/users";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Loader } from "../../components/ui/Loader";
import { ErrorMessage } from "../../components/ui/ErrorMessage";
import { Trash2, Shield, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// TODO: remplacer mock par GET /api/admin/users
export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Utilisateurs</h1>
        <p className="text-sm text-muted-foreground">
          {users?.length ?? "—"} compte{(users?.length ?? 0) > 1 ? "s" : ""} enregistré{(users?.length ?? 0) > 1 ? "s" : ""}
        </p>
      </div>

      {isLoading && <Loader />}
      {error && <ErrorMessage message="Impossible de charger les utilisateurs" />}

      {users && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Rôle</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                        {u.role === "admin" ? (
                          <Shield size={13} className="text-primary" />
                        ) : (
                          <User size={13} className="text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{u.name}</span>
                      {u.id === currentUser?.id && (
                        <span className="text-xs text-muted-foreground">(vous)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={[
                        "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
                        u.role === "admin" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {u.role === "admin" ? "Administrateur" : "Utilisateur"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => deleteMutation.mutate(u.id)}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Supprimer l'utilisateur"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
