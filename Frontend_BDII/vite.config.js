import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // process.cwd() corre en Node (config de build), no en el navegador
  const env = loadEnv(mode, globalThis.process?.cwd?.() ?? ".", "");
  return {
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
    server: {
        host: "0.0.0.0",
        port: 5714,
        strictPort: true,
        proxy: {
          "/api": {
            target: env.VITE_PROXY_TARGET || "http://localhost:5293",
            changeOrigin: true,
            secure: false,
        },
      },
    },
  };
});
