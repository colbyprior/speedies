import { defineConfig } from 'vite'

export default defineConfig({
  base: '/builder/',
  build: {
    outDir: '../static/builder',
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
})
