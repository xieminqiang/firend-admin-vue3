import request from '@/utils/request'


export function upload(data) {
    return request({
        url: '/file/upload',
        method: 'post',
        data
    })
}

export function proxyList(data) {
    return request({
        url: '/proxy/list',
        method: 'post',
        data
    })
}

