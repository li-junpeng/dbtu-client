import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 持久化插件, docs: https://prazdevs.github.io/pinia-plugin-persistedstate/guide/
pinia.use(piniaPluginPersistedState)

export default pinia
