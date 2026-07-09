import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        // Inside the frontend container, use the Docker service name for backend
        target: "http://backend:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
