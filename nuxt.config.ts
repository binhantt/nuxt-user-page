// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['bulma/css/bulma.min.css'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
      ]
    }
  },
  modules: [
    '@pinia/nuxt'
  ],
  imports: {
    dirs: ['stores']
  }
})