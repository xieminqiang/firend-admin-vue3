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

// ========== 服务标签管理相关接口 ==========

/**
 * 获取服务标签列表
 * @param {Object} params - 查询参数
 */
export function getServiceTags(params) {
  return request({
    url: '/service/tags',
    method: 'get',
    params,
  })
}

/**
 * 获取标签详情
 * @param {string|number} id - 标签ID
 */
export function getServiceTagDetail(id) {
  return request({
    url: `/service/tags/${id}`,
    method: 'get',
  })
}

/**
 * 创建服务标签
 * @param {Object} data - 标签数据
 */
export function createServiceTag(data) {
  return request({
    url: '/service/tags',
    method: 'post',
    data,
  })
}

/**
 * 更新服务标签
 * @param {string|number} id - 标签ID
 * @param {Object} data - 标签数据
 */
export function updateServiceTag(id, data) {
  return request({
    url: `/service/tags/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除服务标签
 * @param {string|number} id - 标签ID
 */
export function deleteServiceTag(id) {
  return request({
    url: `/service/tags/${id}`,
    method: 'delete',
  })
}

/**
 * 获取热门标签
 * @param {Object} params - 查询参数 {tag_type, limit}
 */
export function getPopularTags(params) {
  return request({
    url: '/service/tags/popular',
    method: 'get',
    params,
  })
}

/**
 * 根据类型获取标签列表
 * @param {number} tagType - 标签类型 1=服务类，2=娱乐类，3=运动类
 * @param {Object} params - 分页参数 {page, pageSize}
 */
export function getTagsByType(tagType, params = {}) {
  return request({
    url: '/service/tags/by-type',
    method: 'get',
    params: {
      tag_type: tagType,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    },
  })
}

// ========== 价格模板管理相关接口 ==========

/**
 * 获取价格模板列表
 * @param {Object} params - 查询参数
 */
export function getPriceTemplateList(params) {
  return request({
    url: '/price-template/list',
    method: 'get',
    params,
  })
}

/**
 * 获取价格模板详情
 * @param {string|number} id - 模板ID
 */
export function getPriceTemplateDetail(id) {
  return request({
    url: `/price-template/detail/${id}`,
    method: 'get',
  })
}

/**
 * 获取价格模板绑定的区域列表
 * @param {string|number} id - 模板ID
 */
export function getPriceTemplateBoundRegions(id) {
  return request({
    url: `/price-template/${id}/bound-regions`,
    method: 'get',
  })
}

/**
 * 获取服务绑定的区域和价格模板列表
 * @param {string|number} id - 服务ID
 */
export function getServiceBoundRegions(id) {
  return request({
    url: `/service/${id}/bound-regions`,
    method: 'get',
  })
}

/**
 * 添加价格模板
 * @param {Object} data - 模板数据
 */
export function addPriceTemplate(data) {
  return request({
    url: '/price-template/add',
    method: 'post',
    data: {
      name: data.name,
      unit: data.unit,
      min_quantity: data.min_quantity,
      min_price: data.min_price,
    }
  })
}

/**
 * 编辑价格模板
 * @param {string|number} id - 模板ID
 * @param {Object} data - 模板数据
 */
export function editPriceTemplate(id, data) {
  return request({
    url: `/price-template/edit/${id}`,
    method: 'put',
    data: {
      name: data.name,
      unit: data.unit,
      min_quantity: data.min_quantity,
      min_price: data.min_price,
    }
  })
}

/**
 * 删除价格模板
 * @param {string|number} id - 模板ID
 */
export function deletePriceTemplate(id) {
  return request({
    url: `/price-template/delete/${id}`,
    method: 'delete',
  })
}

/**
 * 获取服务等级列表
 */
export function getServiceLevels() {
  return request({
    url: '/service-levels',
    method: 'get',
  })
}

/**
 * 添加模板等级价格
 * @param {Object} data - 等级价格数据
 */
export function addPriceTemplateLevel(data) {
  return request({
    url: '/price-template/level/add',
    method: 'post',
    data,
  })
}

/**
 * 批量添加模板等级价格
 * @param {Object} data - 批量等级价格数据
 */
export function batchAddPriceTemplateLevels(data) {
  return request({
    url: '/price-template/level/batch-add',
    method: 'post',
    data,
  })
}

/**
 * 批量更新模板等级价格
 * @param {Object} data - 批量等级价格数据
 */
export function batchEditPriceTemplateLevels(data) {
  return request({
    url: '/price-template/level/batch-edit',
    method: 'put',
    data,
  })
}

/**
 * 编辑模板等级价格
 * @param {string|number} id - 等级价格ID
 * @param {Object} data - 等级价格数据
 */
export function editPriceTemplateLevel(id, data) {
  return request({
    url: `/price-template/level/edit/${id}`,
    method: 'put',
    data,
  })
}

/**
 * 删除模板等级价格
 * @param {string|number} id - 等级价格ID
 */
export function deletePriceTemplateLevel(id) {
  return request({
    url: `/price-template/level/delete/${id}`,
    method: 'delete',
  })
}

/**
 * 手动同步指定价格模板相关服务的最低价格
 * @param {string|number} id - 模板ID
 */
export function syncServiceMinPricesForTemplate(id) {
  return request({
    url: `/price-template/sync-services/${id}`,
    method: 'post',
  })
}
