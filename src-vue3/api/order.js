import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: '/order/list',
    method: 'post',
    data,
  })
}

export function getOrderDetail(params) {
  return request({
    url: '/order/detail',
    params,
  })
}
