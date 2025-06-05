import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import tailwindAutoReference from 'vite-plugin-vue-tailwind-auto-reference';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindAutoReference('@/assets/main.css'),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // https://github.com/tailwindlabs/tailwindcss/discussions/16429
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/tailwind.css" as *;
        `,
      },
    },
  },
  server: {
    proxy: {
      '/_sse': 'http://localhost:8080/_sse',
    },
  },
})
