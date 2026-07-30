import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Rutas relativas: funcionan en GitHub Pages y también en cualquier subcarpeta.
  base: './',
  plugins: [react(), tailwindcss()],
})
