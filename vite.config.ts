import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "https://hillmanliming.github.io/", // <-- your GitHub repo name
});
