import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import pinia from './pinia'
import Vue3Sanitize from 'vue-3-sanitize'

import FontAwesomeIcon from './fontawesome'

import './assets/main.css'
import './styles/customize.scss'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(Vue3Sanitize, {
  allowedTags: ['br', 'a'],
  allowedAttributes: {
    a: ['class', 'href', 'target', 'rel', 'title']
  }
})

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
