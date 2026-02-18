import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./router/AppRouter";
import { AdminRouter } from "./router/AdminRouter";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/Toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AppWithToast() {
  const { toasts, addToast, removeToast } = useToast();

  // addToast est disponible ici si besoin de le passer plus bas
  void addToast;

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Routes utilisateur */}
          <Route path="/*" element={<AppRouter />} />
          {/* Routes admin montées sous /admin */}
          <Route path="/admin/*" element={<AdminRouter />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppWithToast />
      </AuthProvider>
    </QueryClientProvider>
  );
}
