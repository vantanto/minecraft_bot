import { createApp } from 'vue'
import App from './App.vue'
import { registerPlugins } from './utils/plugins'

const myApp = createApp(App)

registerPlugins(myApp)

myApp.mount('#app')
