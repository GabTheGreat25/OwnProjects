import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "url";
import million from "million/compiler";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), million.vite({ auto: true, mute: true })],
  resolve: {
    alias: {
      "@": srcPath,
      "@assets": `${srcPath}/assets`,
      "@components": `${srcPath}/components`,
      "@layouts": `${srcPath}/layouts`,
      "@pages": `${srcPath}/pages`,
    },
  },
  server: {
    port: 6969,
  },
});
