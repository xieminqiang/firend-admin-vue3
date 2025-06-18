import * as Vue from 'vue'
import Layout from '@/layout/index.vue'

const serviceRouter = {
  path: '/service',
  component: Layout,
  name: 'service',
  redirect: '/service',
  meta: { title: '服务管理', icon: 'Service' },
  alwaysShow: true,
  children: [
    {
      path: 'service',
      name: 'service-list',
      component: () => import('@/views/service/index.vue'),
      meta: { title: '服务列表', icon: 'List' },
    },
    {
      path: 'add',
      name: 'service-add',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/service/add.vue')),
      meta: { title: '添加服务', icon: 'form' },
    },
    {
      path: 'edit/:id',
      name: 'service-edit',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/service/edit.vue')),
      meta: { title: '编辑服务', icon: 'form' },
    },
    {
      path: 'detail/:id',
      name: 'service-detail',
      hidden: true,
      component: Vue.defineAsyncComponent(
        () => import('@/views/service/detail.vue')
      ),
      meta: { title: '服务详情', icon: 'eye' },
    },
  ],
}

export default serviceRouter
