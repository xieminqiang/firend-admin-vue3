import * as Vue from 'vue'
import Layout from '@/layout/index.vue'

const serviceRouter = {
  path: '/service',
  component: Layout,
  name: 'service',
  redirect: '/service/service',
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
    {
      path: 'tags',
      name: 'service-tag-management',
      component: () => import('@/views/service/tags.vue'),
      meta: { title: '服务标签管理', icon: 'PriceTag' },
    },
    {
      path: 'price-template',
      name: 'price-template-list',
      component: () => import('@/views/service/price-template/index.vue'),
      meta: { title: '等级价格管理', icon: 'Money' },
    },
    {
      path: 'price-template/add',
      name: 'price-template-add',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/service/price-template/add.vue')),
      meta: { title: '添加价格模板', icon: 'form', activeMenu: '/service/price-template' },
    },
    {
      path: 'price-template/edit/:id',
      name: 'price-template-edit',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/service/price-template/edit.vue')),
      meta: { title: '编辑价格模板', icon: 'form', activeMenu: '/service/price-template' },
    },
    {
      path: 'price-template/detail/:id',
      name: 'price-template-detail',
      hidden: true,
      component: Vue.defineAsyncComponent(() => import('@/views/service/price-template/detail.vue')),
      meta: { title: '价格模板详情', icon: 'eye', activeMenu: '/service/price-template' },
    },
    {
      path: 'city-config',
      name: 'city-service-config',
      component: () => import('@/views/service/city-config.vue'),
      meta: { title: '城市服务配置', icon: 'Location' },
    },
  ],
}

export default serviceRouter
