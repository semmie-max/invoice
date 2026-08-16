import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/invoice/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Invoice',
        short_name: 'Invoice',
        description: 'Create invoices and get paid.',
        theme_color: '#08080a',
        background_color: '#08080a',
        display: 'standalone',
        start_url: '/invoice/',
        scope: '/invoice/',
        icons: [
          {
            src: '/invoice/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/invoice/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})