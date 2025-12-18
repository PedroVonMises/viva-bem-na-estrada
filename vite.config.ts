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
      // Alias para a pasta client/src
      "@": path.resolve(process.cwd(), "client/src"),
      // NOVO: Alias para a pasta shared (necessário para corrigir o erro)
      "@shared": path.resolve(process.cwd(), "shared"),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})