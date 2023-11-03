/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require('quasar/wrappers');
const path = require('path')

module.exports = configure(function (ctx) {
  return {
    sourceFiles: {
      // electronMainDev: 'src-electron/main-process/electron-main.dev',
      // electronMainProd: 'src-electron/main-process/electron-main'
    },
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: {
      tsCheckerConfig: {
        eslint: true
      }
    },

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'composition-api',
      'hotkey-plugin',
      'i18n',
      'axios',
      'devtools',
      'backend-event-dispatcher'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      //'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack (cfg) {
          // linting is slow in TS projects, we execute it only for production builds
        // if (ctx.prod) {
        // cfg.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /node_modules/
        // })
        // }
        if (process.argv[2] === '--ui-only') {
          cfg.resolve.alias = {
            ...cfg.resolve.alias, // This adds the existing alias

            // Add your own alias like this
            '@tauri-apps/api': path.resolve(__dirname, './src/mocks/@tauri/api'),
          }
        }
      },
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      host: '0.0.0.0',
      https: false,
      port: 8080,
      open: false // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'Notify',
        'LocalStorage'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'Jymmin Rehab',
        short_name: 'Jymmin Rehab',
        description: 'An app for rehab cycling use cases with Jymmin.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'builder', // 'packager' or 'builder'

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'com.jymmin.rehabcycling',
        publish: {
          provider: 's3',
          bucket: 'jymmin-rehab-cycling',
          region: 'eu-central-1'
        },
        asar: true,
        asarUnpack: [
          'bin/*',
          'bin_x64/*',
          'articles.xml',
          'devicedata.xml'
        ],
        win: {
          target: ['nsis', 'zip']
        },
        nsis: {
          oneClick: true,
          perMachine: false
        },
        mac: {
          target: ['zip'],
          category: 'public.app-category.music',
          hardenedRuntime: true,
          entitlements: 'build/entitlements.mac.plist',
          entitlementsInherit: 'build/entitlements.mac.plist',
          gatekeeperAssess: false
        }
        // afterAllArtifactBuild: 'scripts/notarize.js'
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
      chainWebpack (cfg) {
        cfg.resolve.extensions.prepend('.ts').prepend('.tsx')

        cfg.module
          .rule('typescript')
          .test(/\.ts?$/)
          .use('ts-loader')
          .loader('ts-loader')
          .options({
            onlyCompileBundledFiles: true,
            transpileOnly: false
          })
      },

      extendPackageJson (pkg) {
        // directly change props of pkg;
        // no need to return anything
        let os = require('os')
        let path = require('path')
        let moduleBaseDir = path.join('node_modules','@jymmin', 'audio')
        let nativeTargetDir =  path.join(moduleBaseDir, 'audio-core-ffi', 'node', 'native', 'target')
        let audioTargetDir = path.join(moduleBaseDir, 'target')
        let audioCodeDir = path.join(moduleBaseDir, 'audio-core')
        let dataCodeDir = path.join(moduleBaseDir, 'audio-data-model')

        let removeNativeTarget = os.platform() === 'win32' ? `rmdir "${nativeTargetDir}" /s /q` : `rm -rf ${nativeTargetDir}`
        let removeAudioTarget = os.platform() === 'win32' ? `rmdir "${audioTargetDir}" /s /q` : `rm -rf ${audioTargetDir}`
        let removeAudioCode = os.platform() === 'win32' ? `rmdir "${audioCodeDir}" /s /q` : `rm -rf ${audioCodeDir}`
        let removeDataCode = os.platform() === 'win32' ? `rmdir "${dataCodeDir}" /s /q` : `rm -rf ${dataCodeDir}`
        
        pkg.scripts = { install: `electron-build-env neon build @jymmin/audio/audio-core-ffi/node --release && ${removeNativeTarget} && ${removeAudioTarget} && ${removeAudioCode} && ${removeDataCode}` }
      }
    }
  }
});
