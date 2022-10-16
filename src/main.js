import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Router from "./router/index.js";

const app = createApp(App)
app.use(ElementPlus, {size: 'small', zIndex: 3000})

app.use(Router)

// .mount() 方法应该始终在整个应用配置和资源注册完成后被调用
app.mount('#app')
