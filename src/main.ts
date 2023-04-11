/*
 * @Author: lizesheng
 * @Date: 2023-02-22 16:41:23
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-07 21:14:55
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /vue-manage-system/src/main.ts
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import './assets/css/icon.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
