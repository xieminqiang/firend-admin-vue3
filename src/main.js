import { createApp } from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import '@/styles/index.scss' // global css

import App from './App.vue'
import pinia from './stores' // 引入Pinia状态管理
import router from './router'

// 导入组件
import SvgIcon from '@/components/SvgIcon/index.vue'

import 'virtual:svg-icons-register' // Vite SVG图标插件
import '@/permission' // permission control
import permission from '@/directive/permission/index'
import TencentCloudChat from '@tencentcloud/chat'
import TIMUploadPlugin from 'tim-upload-plugin'
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin'

import echarts from './echars/index' // npm install echarts --save
import { getImageUrl, getThumbnailUrl, getImageUrls } from '@/utils/image' // 图片处理工具

let options = {
  SDKAppID: 1400823559, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let chat = TencentCloudChat.create(options) // SDK 实例通常用 chat 表示

console.log('NODE_ENV:', import.meta.env.MODE)
if (import.meta.env.MODE === 'development') {
  chat.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
} else {
  chat.setLogLevel(1) // release 级别，SDK 输出关键信息，生产环境时建议使用
}
// 注册腾讯云即时通信 IM 上传插件
chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
// 注册腾讯云即时通信 IM 本地审核插件
chat.registerPlugin({ 'tim-profanity-filter-plugin': TIMProfanityFilterPlugin })

// 创建Vue3应用实例
const app = createApp(App)

// 全局属性配置
app.config.globalProperties.Tim = chat
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}

// 全局图片处理方法
app.config.globalProperties.$getImageUrl = getImageUrl
app.config.globalProperties.$getThumbnailUrl = getThumbnailUrl
app.config.globalProperties.$getImageUrls = getImageUrls

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局组件
app.component('SvgIcon', SvgIcon)

// 注册插件
app.use(ElementPlus, {
  locale: zhCn, // 设置为中文
})
app.use(permission)
app.use(pinia) // 使用Pinia状态管理
app.use(router)

// 挂载应用
app.mount('#app')
