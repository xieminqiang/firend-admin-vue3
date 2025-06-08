import * as Vue from 'vue'
import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  name: 'order',
  redirect: '/order',
  meta: { title: '订单管理', icon: 'order' },
  alwaysShow: true,
  children: [
    {
      path: 'order',
      name: 'order-list',
      component: Vue.defineAsyncComponent(() => import('@/views/order/index')),
      meta: { title: '订单列表', icon: 'list' },
    },
  ],
}

export default orderRouter
