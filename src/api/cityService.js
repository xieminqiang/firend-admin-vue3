import request from '@/utils/request'

// 获取城市列表
export function getCityList(params) {
  return request({
    url: '/cities',
    method: 'get',
    params
  })
}

// 获取城市详情
export function getCityDetail(cityCode) {
  return request({
    url: `/cities/${cityCode}`,
    method: 'get'
  })
}

// 添加城市
export function addCity(data) {
  return request({
    url: '/cities/add',
    method: 'post',
    data
  })
}

// 更新城市信息
export function updateCity(cityCode, data) {
  return request({
    url: `/cities/${cityCode}`,
    method: 'put',
    data
  })
}

// 更新城市状态
export function updateCityStatus(cityCode, data) {
  return request({
    url: `/cities/${cityCode}/status`,
    method: 'put',
    data
  })
}

// 删除城市
export function deleteCity(cityCode) {
  return request({
    url: `/cities/${cityCode}`,
    method: 'delete'
  })
}

// ================ 服务城市设置相关API ================

// 获取服务城市设置列表
export function getServiceCitySettingsList(params) {
  return request({
    url: '/service-city-settings',
    method: 'get',
    params
  })
}

// 获取服务城市设置详情
export function getServiceCitySettingsDetail(serviceId, cityCode) {
  return request({
    url: `/service-city-settings/${serviceId}/${cityCode}`,
    method: 'get'
  })
}

// 添加服务城市设置
export function addServiceCitySettings(data) {
  return request({
    url: '/service-city-settings',
    method: 'post',
    data
  })
}

// 更新服务城市设置
export function updateServiceCitySettings(serviceId, cityCode, data) {
  return request({
    url: `/service-city-settings/${serviceId}/${cityCode}`,
    method: 'put',
    data
  })
}

// 删除服务城市设置
export function deleteServiceCitySettings(serviceId, cityCode) {
  return request({
    url: `/service-city-settings/${serviceId}/${cityCode}`,
    method: 'delete'
  })
}

// 批量更新服务城市设置
export function batchUpdateServiceCitySettings(data) {
  return request({
    url: '/service-city-settings/batch',
    method: 'post',
    data
  })
}

// ================ 服务城市价格模板绑定相关API ================

// 获取服务城市价格模板绑定列表
export function getServiceCityTemplatesList(params) {
  return request({
    url: '/service-city-templates',
    method: 'get',
    params
  })
}

// 获取服务城市价格模板绑定详情
export function getServiceCityTemplateDetail(serviceId, cityCode) {
  return request({
    url: `/service-city-templates/${serviceId}/${cityCode}`,
    method: 'get'
  })
}

// 添加服务城市价格模板绑定
export function addServiceCityTemplate(data) {
  return request({
    url: '/service-city-templates',
    method: 'post',
    data
  })
}

// 更新服务城市价格模板绑定
export function updateServiceCityTemplate(serviceId, cityCode, data) {
  return request({
    url: `/service-city-templates/${serviceId}/${cityCode}`,
    method: 'put',
    data
  })
}

// 删除服务城市价格模板绑定
export function deleteServiceCityTemplate(serviceId, cityCode) {
  return request({
    url: `/service-city-templates/${serviceId}/${cityCode}`,
    method: 'delete'
  })
}

// 批量更新服务城市价格模板绑定
export function batchUpdateServiceCityTemplates(data) {
  return request({
    url: '/service-city-templates/batch',
    method: 'post',
    data
  })
}

// ================ 综合查询API ================

// 获取服务的城市配置概览
export function getServiceCityConfigs(serviceId, params) {
  return request({
    url: `/services/${serviceId}/city-configs`,
    method: 'get',
    params
  })
}

// 获取城市的服务配置概览
export function getCityServiceConfigs(cityCode, params) {
  return request({
    url: `/cities/${cityCode}/service-configs`,
    method: 'get',
    params
  })
}

// 批量复制城市配置到其他城市
export function copyCityConfigsToOtherCities(data) {
  return request({
    url: '/city-configs/copy',
    method: 'post',
    data
  })
}

// ================ 获取选项数据的辅助API ================

// 获取城市服务配置列表（组合数据）
export function getCityServiceConfigList(params) {
  return request({
    url: '/city-service-configs',
    method: 'get',
    params
  })
} 