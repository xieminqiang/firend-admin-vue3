import Layout from '@/layout'

const adminRouter = {
    path: '/admin',
    component: Layout,
    name: 'admin',
    redirect: '/admin/user',
    meta: { title: '后台管理', icon: 'example' },
    alwaysShow: true,
    children: [
        {
            path: 'back/user',
            name: 'admin-user',
            component: () => import('@/views/admin/user/back/index'),
            meta: { title: '后台用户', icon: 'table' }
        },
        {
            path: 'role',
            name: 'admin-role',
            component: () => import('@/views/admin/role/index'),
            meta: { title: '角色管理', icon: 'table' }
        },
        {
            path: 'user/back/add',
            name: 'admin-user-add',
            hidden: true,
            component: () => import('@/views/admin/user/back/add'),
            meta: { title: '添加用户', icon: 'table' }
        },
        {
            path: 'user/back/edit',
            name: 'admin-user-edit',
            hidden: true,
            component: () => import('@/views/admin/user/back/edit'),
            meta: { title: '编辑用户', icon: 'table' }
        },
        {
            path: 'user',
            name: 'client-user',
            component: () => import('@/views/admin/user/front/index'),
            meta: { title: '前台用户', icon: 'table' }
        },
        {
            path: 'user/group',
            name: 'client-user-group',
            component: () => import('@/views/admin/user/front/group'),
            meta: { title: '前台用户统计', icon: 'table' }
        },
    ]
}


export default adminRouter
