import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Configuration Vite React + Symfony Backend
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,

    // Proxy vers Symfony (backend)
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
