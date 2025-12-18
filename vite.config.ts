import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <--- OBRIGATÓRIO: Importar isso

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- OBRIGATÓRIO: Adicionar na lista de plugins
  ],
})