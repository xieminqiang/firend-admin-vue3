import request from '@/utils/request'


export function queryTopicPage(data) {
    return request({
        url: '/moment/query',
        method: 'post',
        data
    })
}

export function addTopic(data) {
    return request({
        url: '/moment/add',
        method: 'post',
        data
    })
}


export function deleteTopic(data) {
    return request({
        url: '/moment/delete',
        method: 'post',
        data
    })
}


