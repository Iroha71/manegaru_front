require('dotenv').config()
const { BASE_URL, LIFF_ID } = process.env
export default {
  mode: 'spa',
  env: {
    BASE_URL,
    LIFF_ID
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{ src: 'https://static.line-scdn.net/liff/edge/2.1/sdk.js' }]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@assets/scss/style.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/persistedstate.js',
    '~/plugins/vee-validate.js'
  ],

  router: {
    trailingSlash: true,
    middleware: 'checkAuth'
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/device'
  ],
  manifest: {
    "name":				"こんこん♪",
    "short_name":		"こんこん♪",
    "description":		"ボイロたちと過ごすドタバタ日常系タスクアプリ",
    "start_url":		"/",
    "display":			"standalone",
    "background_color":	"#fff",
    "theme_color":		"#fff",
    "orientation":		"portrait",
    "icons": [
      {
        "src": "/android-chrome-36x36.png",
        "sizes": "36x36",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-48x48.png",
        "sizes": "48x48",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-72x72.png",
        "sizes": "72x72",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-128x128.png",
        "sizes": "128x128",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-144x144.png",
        "sizes": "144x144",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-152x152.png",
        "sizes": "152x152",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-256x256.png",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-384x384.png",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
