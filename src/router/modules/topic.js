import Layout from '@/layout/index.vue'

const topicRouter = {
  path: '/topic',
  component: Layout,
  name: 'topic',
  redirect: '/topic/topic',
  meta: { title: '话题管理', icon: 'ChatDotRound' },
  alwaysShow: true,
  children: [
    {
      path: 'topic',
      name: 'topic-list',
      component: () => import('@/views/topic/index.vue'),
      meta: { title: '话题列表', icon: 'List'},
    },

    {
      path: 'add',
      // name: 'topic-add', // 临时注释掉name，避免权限过滤
      hidden: true,
      component: () => import('@/views/topic/add.vue'),
      meta: { title: '添加话题', icon: 'Plus', activeMenu: '/topic/add' },
    },
  ],
}

export default topicRouter
