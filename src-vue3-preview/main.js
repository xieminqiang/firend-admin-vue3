import * as Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import permission from '@/directive/permission/index'
import TencentCloudChat from '@tencentcloud/chat'
import TIMUploadPlugin from 'tim-upload-plugin'
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin'
import VueContextMenu from '@xunlei/vue-context-menu'

import echarts from './echars/index' // npm install echarts --save

let options = {
  SDKAppID: 1400823559, // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
}
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let chat = TencentCloudChat.create(options) // SDK 实例通常用 chat 表示

console.log('NODE_ENV:', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  chat.setLogLevel(0) // 普通级别，日志量较多，接入时建议使用
} else {
  chat.setLogLevel(1) // release 级别，SDK 输出关键信息，生产环境时建议使用
}
// 注册腾讯云即时通信 IM 上传插件
chat.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
// 注册腾讯云即时通信 IM 本地审核插件
chat.registerPlugin({ 'tim-profanity-filter-plugin': TIMProfanityFilterPlugin })
window.$vueApp.config.globalProperties.Tim = chat
window.$vueApp.config.globalProperties.$echarts = echarts
window.$vueApp.use(ElementUI)
window.$vueApp.use(permission)
permission.install(Vue)
window.$vueApp.use(VueContextMenu)

window.$vueApp = Vue.createApp(App)
window.$vueApp.config.globalProperties.routerAppend = (path, pathToAppend) => {
  return path + (path.endsWith('/') ? '' : '/') + pathToAppend
}
window.$vueApp.use(store)
window.$vueApp.use(router)
window.$vueApp.mount('#app')
