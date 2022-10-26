import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


import Router from "./router/index.js";
import {createPinia} from "pinia";

const pinia = createPinia()
const app = createApp(App)

app.use(ElementPlus, {size: 'small', zIndex: 3000})
app.use(Router)
app.use(pinia)

// .mount() 方法应该始终在整个应用配置和资源注册完成后被调用
app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}