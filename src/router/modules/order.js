import * as Vue from 'vue'
import Layout from '@/layout/index.vue'

const orderRouter = {
  path: '/order',
  component: Layout,
  name: 'order',
  redirect: '/order',
  meta: { title: '订单管理', icon: 'Document' },
  alwaysShow: true,
  children: [
    {
      path: 'order',
      name: 'order-list',
      component: () => import('@/views/order/index.vue'),
      meta: { title: '订单列表', icon: 'List' },
    },
  ],
}

export default orderRouter
