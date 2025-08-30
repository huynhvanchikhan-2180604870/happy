import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
  },
});
