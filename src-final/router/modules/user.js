import { defineAsyncComponent } from 'vue'
import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  name: 'Admin',
  redirect: '/admin/user',
  meta: { 
    title: '后台管理', 
    icon: 'example',
    roles: ['admin'] // 权限控制
  },
  alwaysShow: true,
  children: [
    {
      path: 'back/user',
      name: 'AdminUser',
      component: defineAsyncComponent(() => import('@/views/admin/user/back/index.vue')),
      meta: { 
        title: '后台用户', 
        icon: 'table',
        keepAlive: true // 页面缓存
      },
    },
    {
      path: 'role',
      name: 'AdminRole',
      component: defineAsyncComponent(() => import('@/views/admin/role/index.vue')),
      meta: { 
        title: '角色管理', 
        icon: 'table',
        keepAlive: true
      },
    },
    {
      path: 'user/back/add',
      name: 'AdminUserAdd',
      hidden: true,
      component: defineAsyncComponent(() => import('@/views/admin/user/back/add.vue')),
      meta: { 
        title: '添加用户', 
        icon: 'table',
        activeMenu: '/admin/back/user' // 激活的菜单项
      },
    },
    {
      path: 'user/back/edit/:id(\\d+)',
      name: 'AdminUserEdit',
      hidden: true,
      component: defineAsyncComponent(() => import('@/views/admin/user/back/edit.vue')),
      meta: { 
        title: '编辑用户', 
        icon: 'table',
        activeMenu: '/admin/back/user'
      },
      props: true // 允许传递路由参数作为props
    },
    {
      path: 'user',
      name: 'ClientUser',
      component: defineAsyncComponent(() => import('@/views/admin/user/front/index.vue')),
      meta: { 
        title: '前台用户', 
        icon: 'table',
        keepAlive: true
      },
    },
    {
      path: 'user/group',
      name: 'ClientUserGroup',
      component: defineAsyncComponent(() => import('@/views/admin/user/front/group.vue')),
      meta: { 
        title: '前台用户统计', 
        icon: 'table',
        keepAlive: true
      },
    },
  ],
}

export default adminRouter
