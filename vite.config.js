import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  server: {
    port: 3000,
    open: '/legendary-football-landing.html'
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './legendary-football-landing.html'
      }
    }
  }
}) 