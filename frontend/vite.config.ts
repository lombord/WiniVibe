import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const serverEndpoint = "127.0.0.1:8000";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@Core": fileURLToPath(new URL("./src/components/Core", import.meta.url)),
      "@Main": fileURLToPath(new URL("./src/components/Main", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: `http://${serverEndpoint}`,
        secure: false,
      },
      "/media": {
        target: `http://${serverEndpoint}`,
        secure: false,
      },
    },
  },
});
