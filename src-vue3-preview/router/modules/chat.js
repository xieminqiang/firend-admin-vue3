import * as Vue from 'vue'
import Layout from '@/layout'

const chatRouter = {
  path: '/chat',
  component: Layout,
  name: 'chat',
  redirect: '/chat/list',
  meta: { title: '聊天管理', icon: 'example' },
  alwaysShow: true,
  children: [
    {
      path: 'list',
      name: 'chat-list',
      component: Vue.defineAsyncComponent(() => import('@/views/chat/index')),
      meta: { title: '聊天', icon: 'table' },
    },
    {
      path: 'manage',
      name: 'chat-manage',
      component: Vue.defineAsyncComponent(() => import('@/views/chat/manage')),
      meta: { title: '聊天管理', icon: 'table' },
    },
    {
      path: 'add',
      name: 'chat-add',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/chat/add')),
      meta: { title: '聊天添加', icon: 'table' },
    },
  ],
}

export default chatRouter
