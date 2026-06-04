import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite — build optimisé pour déploiement Vercel (SPA)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /* Three.js / R3F isolés — chargés avec la carte cadeau */
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('@react-three/fiber') ||
            id.includes('@react-three/drei')
          ) {
            return 'vendor-three'
          }
        },
      },
    },
  },
})
