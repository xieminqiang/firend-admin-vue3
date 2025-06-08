import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Base64 } from 'js-base64'

// 解析JWT Token
const parseToken = (token) => {
  if (!token) {
    return { id: 0 }
  }
  try {
    const jwt_arr = token.split('.')
    return JSON.parse(Base64.decode(jwt_arr[1]))
  } catch (error) {
    console.error('Token解析失败:', error)
    return { id: 0 }
  }
}

// 用户状态管理 - 使用组合式API风格
export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(getToken())
  const id = ref(0)
  const user_id = ref('')
  const user_name = ref('')
  const real_name = ref('')
  const role = ref([])
  const auth = ref([])
  const tel = ref('')
  const sub = ref('')
  const exp = ref(0) // 过期时间

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userInfo = computed(() => ({
    id: id.value,
    user_id: user_id.value,
    user_name: user_name.value,
    real_name: real_name.value,
    tel: tel.value,
    role: role.value,
    auth: auth.value
  }))
  const hasRole = computed(() => (roleName) => {
    return role.value.includes(roleName)
  })
  const hasAuth = computed(() => (authName) => {
    return auth.value.includes(authName)
  })

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    const tokenInfo = parseToken(newToken)
    Object.assign({ 
      id: id.value, 
      sub: sub.value, 
      exp: exp.value 
    }, tokenInfo)
    setToken(newToken)
  }

  const setUserInfo = (userInfoData) => {
    id.value = userInfoData.userInfo.id
    user_id.value = userInfoData.userInfo.user_id
    user_name.value = userInfoData.userInfo.user_name
    real_name.value = userInfoData.userInfo.real_name
    tel.value = userInfoData.userInfo.tel
    role.value = userInfoData.role
    auth.value = userInfoData.auth

    console.log('role:', userInfoData.role)
    console.log('auth:', userInfoData.auth)
  }

  // 登录
  const userLogin = async (userInfo) => {
    try {
      const { data } = await login(userInfo)
      setToken(data)
      await getUserInfoAction()
      return Promise.resolve()
    } catch (err) {
      console.error('登录失败:', err)
      return Promise.reject(err)
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const { data } = await getUserInfo()
      setUserInfo(data)
      return Promise.resolve()
    } catch (err) {
      console.error('获取用户信息失败:', err)
      return Promise.reject(err)
    }
  }

  // 登出
  const logout = async () => {
    try {
      removeToken() // 清除token
      resetRouter() // 重置路由
      resetState() // 重置状态
      return Promise.resolve()
    } catch (err) {
      console.error('登出失败:', err)
      return Promise.reject(err)
    }
  }

  // 重置Token
  const resetToken = async () => {
    try {
      removeToken() // 清除token
      resetState() // 重置状态
      return Promise.resolve()
    } catch (err) {
      return Promise.reject(err)
    }
  }

  // 重置状态
  const resetState = () => {
    token.value = ''
    id.value = 0
    user_id.value = ''
    user_name.value = ''
    real_name.value = ''
    role.value = []
    auth.value = []
    tel.value = ''
    sub.value = ''
    exp.value = 0
  }

  return {
    // State
    token,
    id,
    user_id,
    user_name,
    real_name,
    role,
    auth,
    tel,
    sub,
    exp,
    
    // Getters
    isLoggedIn,
    userInfo,
    hasRole,
    hasAuth,
    
    // Actions
    setToken,
    setUserInfo,
    userLogin,
    getUserInfoAction,
    logout,
    resetToken,
    resetState
  }
}) 