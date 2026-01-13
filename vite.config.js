import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Use the @tailwindcss/vite package

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
