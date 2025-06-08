import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 检查用户信息
      if (store.getters.user.id == 0) {
        try {
          await store.dispatch('user/getUserInfo')
        } catch (error) {
          console.error('获取用户信息失败:', error)
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
          return
        }
      }

      // 再次检查用户信息是否获取成功
      if (store.getters.user.id == 0) {
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
        return
      }

      // 处理权限路由
      if (store.getters.permission_routes.length == 0) {
        try {
          const accessRoutes = await store.dispatch('permission/generateRoutes')
          // Vue Router 3.x 使用 addRoutes
          router.addRoutes(accessRoutes)
          // 确保路由添加完成，然后重新导航到目标路由
          router.push(to.fullPath)
          return
        } catch (error) {
          console.error('生成权限路由失败:', error)
          await store.dispatch('user/resetToken')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
          return
        }
      }
      next()
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
