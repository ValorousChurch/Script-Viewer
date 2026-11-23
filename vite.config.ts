import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const base = "/Script-Viewer/";

export default defineConfig({
  base,
  plugins: [vue()],
  build: {
    // Keep the browser targets used by the previous Vite build.
    target: ["es2020", "edge88", "firefox78", "chrome87", "safari14"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    env: { BASE_URL: base },
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
