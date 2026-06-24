import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SITE_URL = process.env.VITE_SITE_URL || 'https://mikancode.github.io/lab-minimal-todo'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-site-url',
      transformIndexHtml(html) {
        return html.replace(/__SITE_URL__/g, SITE_URL)
      },
    },
  ],
  base: process.env.VERCEL ? '/' : '/lab-minimal-todo/',
})
