import * as Vue from 'vue'
import Layout from '@/layout/index.vue'

const chatRouter = {
  path: '/chat',
  component: Layout,
  name: 'chat',
  redirect: '/chat/chat',
  meta: { title: '聊天管理', icon: 'Message' },
  alwaysShow: true,
  children: [
    {
      path: 'chat',
      name: 'chat-list',
      component: () => import('@/views/chat/index.vue'),
      meta: { title: '聊天列表', icon: 'ChatRound' },
    },
    {
      path: 'manage',
      name: 'chat-manage',
      component: () => import('@/views/chat/manage.vue'),
      meta: { title: '聊天管理', icon: 'Setting' },
    },
    {
      path: 'add',
      name: 'chat-add',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/chat/add.vue')),
      meta: { title: '聊天添加', icon: 'table' },
    },
  ],
}

export default chatRouter
