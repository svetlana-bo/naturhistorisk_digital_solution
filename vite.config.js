import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/naturhistorisk_digital_solution/',
  plugins: [react()],
})
