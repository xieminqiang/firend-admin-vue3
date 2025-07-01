import * as Vue from 'vue'
import Layout from '@/layout/index.vue'

const companionRouter = {
  path: '/companion',
  component: Layout,
  name: 'companion-applications-list',
  redirect: '/companion/list',
  meta: { title: '友伴师管理', icon: 'User' },
  alwaysShow: true,
  children: [
    {
      path: 'list',
      name: 'companion-list',
      component: () => import('@/views/companion/index.vue'),
      meta: { title: '友伴师列表', icon: 'List' },
    },
    {
      path: 'detail/:id',
      name: 'companion-application-detail',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/companion/detail.vue')),
      meta: { title: '友伴师详情', icon: 'eye', activeMenu: '/companion/list' },
    },
  ],
}

export default companionRouter 