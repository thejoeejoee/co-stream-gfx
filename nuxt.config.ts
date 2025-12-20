import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // not ready for SSR
  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/hints'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    plugins: [
      tailwindcss(),
      svgLoader()
    ],
    server: {
      proxy: {
        '/_sse': 'http://localhost:8080/_sse'
      },
      allowedHosts: ['.localhost', '.local'],
      watch: {
        ignored: ['**/out/**']
      },
      hmr: {
        overlay: false
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
