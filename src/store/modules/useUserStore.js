import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, getUserInfo } from '@/api/user'
import { removeToken, setToken, getToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

export const useUserStore = defineStore('user', () => {
  // 状态
  const state = ref({
    token: getToken(),
    user: {},
    roles: [],
    permissions: []
  })

  // Getters
  const isLoggedIn = computed(() => !!state.value.token)
  const userRoles = computed(() => state.value.roles)
  const userPermissions = computed(() => state.value.permissions)

  // Actions
  const setUserToken = (token) => {
    state.value.token = token
    setToken(token)
  }

  const setUser = (user) => {
    state.value.user = user
  }

  const setRoles = (roles) => {
    state.value.roles = roles
  }

  const setPermissions = (permissions) => {
    state.value.permissions = permissions
  }

  // 登录
  const userLogin = async (userInfo) => {
    try {
      const { username, password } = userInfo
      const response = await login({ username: username.trim(), password })
      
      if (response.code === 0) {
        const { token } = response.data
        setUserToken(token)
        return Promise.resolve()
      } else {
        return Promise.reject(new Error(response.msg || '登录失败'))
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 获取用户信息
  const getInfo = async () => {
    try {
      const response = await getUserInfo()
      
      if (response.code === 0) {
        const { user, roles, permissions } = response.data
        
        if (!roles || roles.length <= 0) {
          return Promise.reject(new Error('用户角色不能为空'))
        }

        setUser(user)
        setRoles(roles)
        setPermissions(permissions)
        
        return response.data
      } else {
        return Promise.reject(new Error(response.msg || '获取用户信息失败'))
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 退出登录
  const logout = async () => {
    try {
      state.value.token = ''
      state.value.user = {}
      state.value.roles = []
      state.value.permissions = []
      
      removeToken()
      resetRouter()
      
      // 重定向到登录页
      router.push('/login')
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 重置状态
  const resetState = () => {
    state.value = {
      token: '',
      user: {},
      roles: [],
      permissions: []
    }
  }

  // 检查权限
  const hasPermission = (permission) => {
    return state.value.permissions.includes(permission)
  }

  // 检查角色
  const hasRole = (role) => {
    return state.value.roles.some(userRole => userRole.slug === role)
  }

  return {
    state,
    isLoggedIn,
    userRoles,
    userPermissions,
    setUserToken,
    setUser,
    setRoles,
    setPermissions,
    userLogin,
    getInfo,
    logout,
    resetState,
    hasPermission,
    hasRole
  }
}) 