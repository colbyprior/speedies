import { defineConfig } from 'vite'

export default defineConfig({
  base: '/builder/',
  build: {
    outDir: '../static/builder',
    emptyOutDir: true,
  },
  server: {
    fs: {
      // Allow serving files from the parent project directory during dev
      allow: ['..'],
    },
  },
})
