import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/test_flowers/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Allow tunnel hostnames (cloudflare / ngrok) to reach the dev server
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.app', '.tuna.am'],
  },
})
