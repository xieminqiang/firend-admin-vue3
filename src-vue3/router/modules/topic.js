import * as Vue from 'vue'
import Layout from '@/layout'

const topicRouter = {
  path: '/topic',
  component: Layout,
  name: 'topic',
  redirect: '/topic/list',
  meta: { title: '话题管理', icon: 'table' },
  alwaysShow: true,
  children: [
    {
      path: 'list',
      name: 'topic-list',
      component: Vue.defineAsyncComponent(() => import('@/views/topic/index')),
      meta: { title: '话题列表', icon: 'list' },
    },
    {
      path: 'add',
      name: 'topic-list',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/topic/add')),
      meta: { title: '添加话题', icon: 'table' },
    },
  ],
}

export default topicRouter
