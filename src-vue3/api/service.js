import request from '@/utils/request'

/**
 * 获取服务列表
 * @param {Object} params - 查询参数
 */
export function getServiceList(params) {
  return request({
    url: '/service/list',
    method: 'get',
    params,
  })
}

/**
 * 获取服务详情
 * @param {string|number} id - 服务ID
 */
export function getServiceDetail(id) {
  return request({
    url: `/service/detail/${id}`,
    method: 'get',
  })
}

/**
 * 添加服务
 * @param {Object} data - 服务数据
 */
export function addService(data) {
  return request({
    url: '/service/add',
    method: 'post',
    data,
  })
}

/**
 * 编辑服务
 * @param {string|number} id - 服务ID
 * @param {Object} data - 服务数据
 */
export function editService(id, data) {
  return request({
    url: `/service/edit/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除服务
 * @param {string|number} id - 服务ID
 */
export function deleteService(id) {
  return request({
    url: `/service/delete/${id}`,
    method: 'delete',
  })
}

/**
 * 获取服务分类列表
 */
export function getServiceCategories() {
  return request({
    url: '/service/categories',
    method: 'get',
  })
}
