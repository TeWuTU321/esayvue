import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElIcons from '@element-plus/icons'


const app = createApp(App)
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(key, component)
}

app.use(store)
app.use(router)
app.use(ElementPlus,{
    locale: zhCn,
})

app.mount('#app')
