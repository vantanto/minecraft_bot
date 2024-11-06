import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components')
      }
    },
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: 'src/renderer/src/assets/sass/quasar-variables.sass'
      })
    ]
  }
})
