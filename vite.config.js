import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/impulse",
  plugins: [react()],
  esbuild: {
    loader: "jsx",
  },
  resolve: {
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
    historyApiFallback: true,
  },
  historyApiFallback: {
    index: "/impulse/main/index.html",
    disableDotRule: true,
  },
});
