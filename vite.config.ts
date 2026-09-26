import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss(), runtimeErrorOverlay()],
  resolve: { alias: { "@": path.resolve(process.cwd(), "src") } },
  server: { host: "0.0.0.0", port: Number(process.env.PORT || 5173), strictPort: true },
  preview: { host: "0.0.0.0", port: Number(process.env.PORT || 4173), strictPort: true }
});
