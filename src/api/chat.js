import request from '@/utils/request'

export function proxyList(data) {
    return request({
        url: '/proxy/list',
        method: 'post',
        data
    })
}

export function chatAdd(data) {
    return request({
        url: '/chat/save',
        method: 'post',
        data
    })
}


export function chatList(data) {
    return request({
        url: '/chat/list',
        method: 'post',
        data
    })
}

export function chatDel(data) {
    return request({
        url: '/chat/delete',
        method: 'post',
        data
    })
}


export function searchUser(data) {
    return request({
        url: '/chat/search/user',
        method: 'post',
        data
    })
}

export function chatGreet(data) {
    return request({
        url: '/chat/greet',
        method: 'post',
        data
    })
}
