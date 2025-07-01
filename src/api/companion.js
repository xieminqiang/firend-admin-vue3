import request from '@/utils/request'

/**
 * 获取友伴师申请列表
 * @param {Object} params - 查询参数
 */
export function getCompanionApplicationList(params) {
  return request({
    url: '/companion/applications',
    method: 'get',
    params,
  })
}

/**
 * 获取友伴师申请详情
 * @param {string|number} id - 申请ID
 */
export function getCompanionApplicationDetail(id) {
  return request({
    url: `/companion/applications/${id}`,
    method: 'get',
  })
}

/**
 * 更新友伴师申请状态
 * @param {string|number} id - 申请ID
 * @param {Object} data - 状态数据
 */
export function updateCompanionApplicationStatus(id, data) {
  return request({
    url: `/companion/applications/${id}/status`,
    method: 'put',
    data,
  })
}

/**
 * 更新友伴师视频审核状态
 * @param {string|number} id - 申请ID
 * @param {Object} data - 视频审核状态数据
 */
export function updateCompanionVideoReviewStatus(id, data) {
  return request({
    url: `/companion/applications/${id}/video-review`,
    method: 'put',
    data,
  })
}

/**
 * 更新友伴师接单状态
 * @param {string|number} id - 申请ID
 * @param {Object} data - 接单状态数据
 */
export function updateCompanionOrderStatus(id, data) {
  return request({
    url: `/companion/applications/${id}/order-status`,
    method: 'put',
    data,
  })
}

/**
 * 删除友伴师申请
 * @param {string|number} id - 申请ID
 */
export function deleteCompanionApplication(id) {
  return request({
    url: `/companion/applications/${id}`,
    method: 'delete',
  })
}

/**
 * 获取友伴师在线状态列表
 * @param {Object} params - 查询参数
 */
export function getCompanionOnlineStatusList(params) {
  return request({
    url: '/companion/online-status',
    method: 'get',
    params,
  })
}

/**
 * 管理员更新友伴师在线状态
 * @param {string|number} id - 申请ID
 * @param {Object} data - 在线状态数据
 */
export function updateCompanionOnlineStatusByAdmin(id, data) {
  return request({
    url: `/companion/applications/${id}/online-status`,
    method: 'put',
    data,
  })
}

/**
 * 获取友伴师统计信息
 */
export function getCompanionStatistics() {
  return request({
    url: '/companion/statistics',
    method: 'get',
  })
} 