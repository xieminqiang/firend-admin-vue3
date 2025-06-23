import { usePermissionStore } from '@/stores/modules/usePermissionStore'

/**
 * @param {String|Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value) {
    const permissionStore = usePermissionStore()
    const hasAuth = permissionStore.authKeys || []

    if (typeof value === 'string') {
      return hasAuth.includes(value)
    } else if (Array.isArray(value)) {
      return value.some((auth) => hasAuth.includes(auth))
    } else {
      console.error(`Invalid permission value type! Expected string or array.`)
      return false
    }
  } else {
    console.error(`need auth-keys! Like v-permission="admin-user-add"`)
    return false
  }
}

// 导出为命名导出以保持兼容性
export { checkPermission }
