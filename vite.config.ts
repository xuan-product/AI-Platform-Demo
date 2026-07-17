import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/AI-Platform-Demo/",
  plugins: [react(), tailwindcss()],
});
