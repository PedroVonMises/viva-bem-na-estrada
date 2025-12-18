import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'client',
  envDir: '..',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Isso diz ao Vite que "@" aponta para a pasta "client/src"
      "@": path.resolve(process.cwd(), "./client/src"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})