import { fileURLToPath, URL } from 'node:url'
import svgLoader from 'vite-svg-loader'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import tailwindAutoReference from 'vite-plugin-vue-tailwind-auto-reference';
import postcssNesting from 'postcss-nesting';


// https://vite.dev/config/
export default defineConfig({
  base: process.env["VITE_BASEPATH"] || '/',
  plugins: [
    vue(),
    // vueDevTools(),
    tailwindAutoReference('@/assets/main.css'),
    tailwindcss(),
    svgLoader(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
  server: {
    proxy: {
      '/_sse': 'http://localhost:8080/_sse',
    },
    allowedHosts: ['.localhost', '.local'],
    watch: {
      ignored: ["**/out/**"],
    },
    hmr: {
      overlay: false,
    }
  },
})
