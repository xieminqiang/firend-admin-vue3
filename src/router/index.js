import { createRouter, createWebHistory } from 'vue-router'
import adminUser from './modules/user'
import order from './modules/order'
import topic from './modules/topic'
import system from './modules/system'
import chat from './modules/chat'
import service from './modules/service'
import companion from './modules/companion'

/* Layout */
import Layout from '@/layout/index.vue'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/views/404.vue'),
    hidden: true,
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },
    ],
  },

  {
    path: '/external-link',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/external-link/vue-element-admin',
        name: 'ExternalLink',
        component: () => import('@/views/redirect/index.vue'),
        meta: { 
          title: 'External Link', 
          icon: 'link',
          externalLink: 'https://panjiachen.github.io/vue-element-admin-site/#/'
        },
      },
    ],
  },
]

export const asyncRoutes = [adminUser, order, topic, system, chat, service, companion]

const createRouterInstance = () =>
  createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
    scrollBehavior: () => ({
      left: 0,
      top: 0,
    }),
  })

const router = createRouterInstance()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouterInstance()
  // 清除所有动态路由
  asyncRoutes.forEach(route => {
    if (route.name) {
      router.removeRoute(route.name)
    }
  })
  // 重新添加基础路由
  constantRoutes.forEach(route => {
    router.addRoute(route)
  })
}

export default router
