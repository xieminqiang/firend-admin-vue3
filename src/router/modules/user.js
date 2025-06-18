import Layout from '@/layout/index.vue'

const adminRouter = {
  path: '/admin',
  component: Layout,
  name: 'admin',
  redirect: '/admin/user',
  meta: { 
    title: '后台管理', 
    icon: 'Setting',
    roles: ['admin'] // 权限控制
  },
  alwaysShow: true,
  children: [
    {
      path: 'back/user',
      name: 'admin-user',
      component: () => import('@/views/admin/user/back/index.vue'),
      meta: { 
        title: '后台用户', 
        icon: 'User',
        keepAlive: true // 页面缓存
      },
    },
    {
      path: 'role',
      name: 'admin-role',
      component: () => import('@/views/admin/role/index.vue'),
      meta: { 
        title: '角色管理', 
        icon: 'UserFilled',
        keepAlive: true
      },
    },
    {
      path: 'user/back/add',
      name: 'admin-user-add',
      hidden: true,
      component: () => import('@/views/admin/user/back/add.vue'),
      meta: { 
        title: '添加用户', 
        icon: 'Plus',
        activeMenu: '/admin/back/user' // 激活的菜单项
      },
    },
    {
      path: 'user/back/edit/:id(\\d+)',
      name: 'admin-user-edit',
      hidden: true,
      component: () => import('@/views/admin/user/back/edit.vue'),
      meta: { 
        title: '编辑用户', 
        icon: 'Edit',
        activeMenu: '/admin/back/user'
      },
      props: true // 允许传递路由参数作为props
    },
    {
      path: 'user',
      name: 'client-user',
      component: () => import('@/views/admin/user/front/index.vue'),
      meta: { 
        title: '前台用户', 
        icon: 'User',
        keepAlive: true
      },
    },
    {
      path: 'user/group',
      name: 'client-user-group',
      component: () => import('@/views/admin/user/front/group.vue'),
      meta: { 
        title: '前台用户统计', 
        icon: 'DataLine',
        keepAlive: true
      },
    },
  ],
}

export default adminRouter
