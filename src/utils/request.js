import axios from 'axios'
import { ElMessageBox as MessageBox, ElMessage as Message } from 'element-plus'
import store from '@/stores'
import { getToken } from '@/utils/auth'

const requestTimeOut = () => {
  if (import.meta.env.MODE === 'development') {
    return 1000 * 60 * 5
  } else {
    return 1000 * 5
  }
}

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  timeout: requestTimeOut(), // request timeout
})

service.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})

service.interceptors.response.use(
  (response) => {
    const { data } = response
    // 正常情况
    if (data.code != 0) {
      Message({
        message: data.msg,
        type: 'error',
        duration: 5 * 1000,
      })
      return Promise.reject(data.msg)
    }
    return data
  },
  async (error) => {
    const { status, data } = error.response
    switch (status) {
      case 500:
        Message({
          message: '系统错误',
          type: 'error',
          duration: 5 * 1000,
        })
        break
      case 403:
        Message({
          message: '没有权限',
          type: 'error',
          duration: 5 * 1000,
        })
        break
      case 401:
        await MessageBox.confirm(data.msg, '登录过期，请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
        await store.dispatch('user/resetToken')
        location.reload()
        break
      default:
        Message({
          message: '未知错误',
          type: 'error',
          duration: 5 * 1000,
        })
        break
    }
    return Promise.reject(error)
  }
)

export default service
