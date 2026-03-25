import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/cometchat-chat-sample-app/',
  plugins: [react(), tailwindcss()],
})
