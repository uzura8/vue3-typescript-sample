import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import Vue3Sanitize from 'vue-3-sanitize'
import Vue3TouchEvents from 'vue3-touch-events'

import FontAwesomeIcon from './fontawesome'

import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Vue3Sanitize, {
  allowedTags: ['br', 'a'],
  allowedAttributes: {
    a: ['class', 'href', 'target', 'rel', 'title']
  }
})
app.use(Vue3TouchEvents)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
