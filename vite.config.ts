import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'client', // Define a pasta client como raiz dos arquivos fontes
  envDir: '..',   // Permite ler o arquivo .env da raiz do projeto
  build: {
    outDir: '../dist', // Gera a pasta dist na raiz do projeto, não dentro de client
    emptyOutDir: true, // Limpa a pasta dist antes de gerar o novo build
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})