import './assets/css/base.css'
import './assets/icon/iconfont.css'
import './assets/font/font.css'
import  './assets/css/markdown-01.css'

import App from './App.vue'
import router from '@/route/route'
import {createApp} from 'vue'
import mitt from 'mitt'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 实例化 Vue
const app = createApp(App)

// 声明并注册插件
const EventBusPlugin = {
    install(app) {
        app.config.globalProperties.$emitter = mitt();
    }
}
app.use(EventBusPlugin)
app.use(ElementPlus)
app.use(router)

// 将 Vue 实例挂载到容器中
app.mount('#app')