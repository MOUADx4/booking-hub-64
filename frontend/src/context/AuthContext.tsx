// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import { login as apiLogin, register as apiRegister } from "../api/auth";

// =======================
// Types
// =======================

export interface User {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// =======================
// Context
// =======================

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext)!;
}

// =======================
// Helper : Decode JWT
// =======================

function decodeToken(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));

    return {
      id: 0,
      email: payload.username,
      name: payload.username,
      role: payload.roles.includes("ROLE_ADMIN") ? "admin" : "user",
    };
  } catch (err) {
    console.error("❌ Token decode failed:", err);
    return null;
  }
}

// =======================
// Provider
// =======================

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedUser = decodeToken(storedToken);

      if (decodedUser) {
        setToken(storedToken);
        setUser(decodedUser);
      } else {
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);

  // =======================
  // Login
  // =======================

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);

    localStorage.setItem("token", data.token);

    const decodedUser = decodeToken(data.token);
    if (!decodedUser) throw new Error("Token invalide");

    setToken(data.token);
    setUser(decodedUser);
  }, []);

  // =======================
  // Register (CORRIGÉ)
  // =======================

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiRegister(name, email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);

        const decodedUser = decodeToken(data.token);
        if (decodedUser) {
          setToken(data.token);
          setUser(decodedUser);
        }
      }
    },
    []
  );

  // =======================
  // Logout
  // =======================

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register, // ✅ AJOUTÉ
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
