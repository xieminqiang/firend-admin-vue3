import Layout from '@/layout'

const serviceRouter = {
    path: '/service',
    component: Layout,
    name: 'service',
    redirect: '/service/list',
    meta: { title: '服务管理', icon: 'service' },
    alwaysShow: true,
    children: [
        {
            path: 'list',
            name: 'service-list',
            component: () => import('@/views/service/index'),
            meta: { title: '服务列表', icon: 'table' }
        },
        {
            path: 'add',
            name: 'service-add',
            hidden: true,
            component: () => import('@/views/service/add'),
            meta: { title: '添加服务', icon: 'form' }
        },
        {
            path: 'edit/:id',
            name: 'service-edit',
            hidden: true,
            component: () => import('@/views/service/edit'),
            meta: { title: '编辑服务', icon: 'form' }
        },
        {
            path: 'detail/:id',
            name: 'service-detail',
            hidden: true,
            component: () => import('@/views/service/detail'),
            meta: { title: '服务详情', icon: 'eye' }
        }
    ]
}

export default serviceRouter 