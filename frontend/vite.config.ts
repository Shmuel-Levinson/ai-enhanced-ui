import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // Ensures modern JS output
    modulePreload: { polyfill: false }, // Avoids unnecessary preloading issues
  }
})
