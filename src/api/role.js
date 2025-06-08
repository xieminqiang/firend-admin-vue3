import request from '@/utils/request'

export function getRoleTree(id = 0) {
    return request({
        url: '/role/tree',
        params: {
            'id': id
        }
    })
}

export function getList(params) {
    return request({
        url: '/role',
        params
    })
}

export function getDetail(id) {
    return request({
        url: '/role/' + id,
        method: 'get'
    })
}

export function add(data) {
    return request({
        url: '/role',
        method: 'post',
        data
    })
}

export function edit(id, data) {
    return request({
        url: '/role/' + id,
        method: 'put',
        data
    })
}

export function del(id) {
    return request({
        url: '/role/' + id,
        method: 'delete'
    })
}

export function authTree() {
    return request({
        url: '/auth/tree'
    })
}
