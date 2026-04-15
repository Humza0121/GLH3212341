import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/health": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/products": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/basket": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
