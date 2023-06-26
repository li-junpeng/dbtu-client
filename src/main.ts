// 全局样式
import '@/assets/css-style/base.scss'

// 主题
import '@/assets/theme/dark.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
