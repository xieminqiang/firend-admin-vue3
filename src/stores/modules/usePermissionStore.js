import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authKey
 */
function filterAsyncRoutes(routes, authKey) {
  const res = []
  for (const v of routes) {
    // 如果路由没有name属性，或者name在权限列表中，则添加该路由
    if (!v.name || authKey.includes(v.name)) {
      const tmp = { ...v }
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authKey)
      }
      res.push(tmp)
    }
  }
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    // 所有路由
    routes: [],
    // 新增路由
    addRoutes: [],
    // 权限 -- 判断路由的 name 是否包含在内
    authKey: [],
  }),

  getters: {
    permissionRoutes: (state) => state.routes,
    authKeys: (state) => state.authKey,
  },

  actions: {
    setRoutes(routes) {
      this.addRoutes = routes
      this.routes = constantRoutes.concat(routes)
    },

    setAuthKey(authKey) {
      this.authKey = authKey
    },

    generateRoutes(userAuth) {
      const authKey = []
      for (const v of userAuth || []) {
        authKey.push(v.ext)
      }
      this.setAuthKey(authKey)
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, authKey)
      // 添加404路由
      accessedRoutes.push({ 
        path: '/:pathMatch(.*)*', 
        redirect: '/404', 
        hidden: true 
      })
      this.setRoutes(accessedRoutes)
      return accessedRoutes
    },
  },
}) 