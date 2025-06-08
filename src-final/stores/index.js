import { createPinia } from 'pinia'

// 创建 pinia 实例
const pinia = createPinia()

// 在开发环境中启用 Pinia 开发工具
if (process.env.NODE_ENV === 'development') {
  // Pinia 开发工具会自动检测
}

export default pinia 