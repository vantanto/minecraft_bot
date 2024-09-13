// import './assets/main.css'

import { createApp } from 'vue'
import { registerPlugins } from './utils/plugins'

import App from './App.vue'

const myApp = createApp(App)

registerPlugins(myApp)

myApp.mount('#app')
