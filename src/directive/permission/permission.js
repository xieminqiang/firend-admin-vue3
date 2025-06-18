import { usePermissionStore } from '@/stores/modules/usePermissionStore'

export default {
  mounted(el, { value }, vnode) {
    const permissionStore = usePermissionStore()
    const hasAuth = permissionStore.authKeys || []
    
    if (value && typeof value === 'string') {
      if (!hasAuth.includes(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need auth-keys! Like v-permission="admin-user-add"`)
    }
  },
}
