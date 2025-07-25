import Layout from '@/layout/index.vue'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'system',
  redirect: '/system/config',
  meta: { title: '系统管理', icon: 'system' },
  alwaysShow: true,
  children: [
    {
      path: 'config',
      name: 'system-config',
      component: () => import('@/views/system/index.vue'),
      meta: { title: '系统配置', icon: 'config' },
    },
    {
      path: 'monitor',
      name: 'system-monitor',
      component: () => import('@/views/system/index.vue'),
      meta: { title: '服务监控', icon: 'monitor' },
    },
    {
      path: 'interface',
      name: 'system-interface',
      component: () => import('@/views/system/index.vue'),
      meta: { title: '系统接口', icon: 'interface' },
    },
    {
      path: 'params',
      name: 'system-params',
      component: () => import('@/views/system/index.vue'),
      meta: { title: '参数设置', icon: 'params' },
    },
  ],
}

export default systemRouter
