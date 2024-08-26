import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const serverEndpoint = `${process.env.DJANGO_HOST || "127.0.0.1"}:${process.env.DJANGO_PORT || 8000}`;
  const mediaEndpoint = `${process.env.MEDIA_HOST || "127.0.0.1"}:${process.env.MEDIA_PORT || 5000}`;

  const webPort = parseInt(process.env.WEB_PORT || "3000");
  const webHost = process.env.WEB_HOST || "localhost";

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "@Core": fileURLToPath(
          new URL("./src/components/Core", import.meta.url),
        ),
        "@Main": fileURLToPath(
          new URL("./src/components/Main", import.meta.url),
        ),
      },
    },
    server: {
      port: webPort,
      host: webHost,
      proxy: {
        "/api": {
          target: `http://${serverEndpoint}`,
          secure: false,
        },
        "/media-api": {
          target: `http://${mediaEndpoint}`,
          rewrite: (path) => path.replace(/^\/media-api/, "/api"),
          secure: false,
        },
      },
      watch: {
        usePolling: true,
      },
    },
  });
};
