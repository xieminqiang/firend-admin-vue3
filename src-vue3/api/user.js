import request from '@/utils/request'

export function getFrontUserList(params) {
  return request({
    url: '/user/list/current',
    params,
  })
}

export function getFrontUserListGroup(params) {
  return request({
    url: '/user/list/group',
    params,
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/user/userinfo',
  })
}
// 获取后台用户列表
export function getList(params) {
  return request({
    url: '/user/list',
    params,
  })
}

export function getDetail(id) {
  return request({
    url: '/user/detail/' + id,
    method: 'get',
  })
}

export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

export function edit(id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data,
  })
}

export function del(id) {
  return request({
    url: '/user/' + id,
    method: 'delete',
  })
}
