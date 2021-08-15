import { defineConfig } from "vite";
export default defineConfig({
  root: './',
  publicDir: './public',
  base: './',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 3010
  }
})