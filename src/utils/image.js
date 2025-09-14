import settings from '@/settings'

/**
 * 获取完整的图片URL
 * @param {string} imagePath - 图片路径，可以是相对路径或完整URL
 * @param {string} defaultImage - 默认图片路径（可选）
 * @returns {string} 完整的图片URL
 */
export function getImageUrl(imagePath, defaultImage = '') {
  // 如果没有图片路径，返回默认图片或空字符串
  if (!imagePath) {
    return defaultImage ? getImageUrl(defaultImage) : ''
  }
  
  // 如果已经是完整的URL（包含http://或https://），直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // 如果是相对路径，添加OSS域名前缀
  const baseUrl = settings.ossBaseUrl
  
  // 确保路径格式正确
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  return `${cleanBaseUrl}/${cleanPath}`
}

/**
 * 获取图片缩略图URL
 * @param {string} imagePath - 原图片路径
 * @param {string} size - 缩略图尺寸，如 '200x200'
 * @returns {string} 缩略图URL
 */
export function getThumbnailUrl(imagePath, size = '200x200') {
  const fullUrl = getImageUrl(imagePath)
  if (!fullUrl) return ''
  
  // 阿里云OSS图片处理参数
  return `${fullUrl}?x-oss-process=image/resize,m_fill,w_${size.split('x')[0]},h_${size.split('x')[1]}`
}

/**
 * 批量获取图片URL
 * @param {Array} imagePaths - 图片路径数组
 * @returns {Array} 完整图片URL数组
 */
export function getImageUrls(imagePaths = []) {
  return imagePaths.map(path => getImageUrl(path))
}

/**
 * 检查图片是否为有效路径
 * @param {string} imagePath - 图片路径
 * @returns {boolean} 是否为有效图片路径
 */
export function isValidImagePath(imagePath) {
  if (!imagePath) return false
  
  // 检查是否为图片格式
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']
  const lowerPath = imagePath.toLowerCase()
  
  return imageExtensions.some(ext => lowerPath.includes(ext))
}

/**
 * 从完整URL中提取相对路径
 * @param {string} fullUrl - 完整的图片URL
 * @returns {string} 相对路径，保持开头的 /
 */
export function getRelativePath(fullUrl) {
  if (!fullUrl) return ''
  
  const baseUrl = settings.ossBaseUrl
  if (fullUrl.startsWith(baseUrl)) {
    // 保持开头的 /，确保路径格式为 /img/20250811/...
    return fullUrl.replace(baseUrl, '')
  }
  
  return fullUrl
}

// 测试用例和说明
/*
 * 测试 getRelativePath 函数：
 * 
 * 输入: "https://example.com/img/20250811/ca5e21657e6e79a0e26b9c30fbe52274/00fd4229-c609-4c97-9e21-b1af39ee465d.png"
 * 输出: "/img/20250811/ca5e21657e6e79a0e26b9c30fbe52274/00fd4229-c609-4c97-9e21-b1af39ee465d.png"
 * 
 * 确保保存时保持开头的 /，这样后端就能正确识别为绝对路径
 */

// 默认导出
export default {
  getImageUrl,
  getThumbnailUrl,
  getImageUrls,
  isValidImagePath,
  getRelativePath
}