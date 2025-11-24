import { resolve } from 'node:path'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'

export default defineConfig({
  main: {
    resolve: { alias: { '@': resolve('src') } },
    plugins: [externalizeDepsPlugin()],
  },
  preload: { plugins: [externalizeDepsPlugin()] },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
      },
    },
    plugins: [
      vue({ template: { transformAssetUrls } }),
      quasar({
        sassVariables: resolve(
          'src/renderer/src/assets/scss/quasar-variables.scss',
        ),
      }),
    ],
  },
})
