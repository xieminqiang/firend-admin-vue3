import * as Vue from 'vue'
import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system',
  meta: { title: '系统管理', icon: 'system' },
  alwaysShow: true,
  children: [
    {
      path: 'config',
      name: 'system-config',
      component: Vue.defineAsyncComponent(() => import('@/views/system/index')),
      meta: { title: '系统配置', icon: 'config' },
    },
    {
      path: 'monitor',
      name: 'system-monitor',
      component: Vue.defineAsyncComponent(() => import('@/views/system/index')),
      meta: { title: '服务监控', icon: 'monitor' },
    },
    {
      path: 'interface',
      name: 'system-interface',
      component: Vue.defineAsyncComponent(() => import('@/views/system/index')),
      meta: { title: '系统接口', icon: 'interface' },
    },
    {
      path: 'params',
      name: 'system-params',
      component: Vue.defineAsyncComponent(() => import('@/views/system/index')),
      meta: { title: '参数设置', icon: 'params' },
    },
  ],
}
export default systemRouter
