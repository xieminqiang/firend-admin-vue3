import router from './router'
import { useUserStore } from '@/stores/modules/useUserStore'
import { usePermissionStore } from '@/stores/modules/usePermissionStore'
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
      // 获取store实例
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()
      
      // 检查用户信息
      if (userStore.id === 0) {
        try {
          await userStore.getUserInfoAction()
        } catch (error) {
          console.error('获取用户信息失败:', error)
          await userStore.resetToken()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
          return
        }
      }

      // 再次检查用户信息是否获取成功
      if (userStore.id === 0) {
        await userStore.resetToken()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
        return
      }

      // 处理权限路由
      if (permissionStore.routes.length === 0) {
        try {
          const accessRoutes = await permissionStore.generateRoutes(userStore.auth)
          // Vue Router 4.x 使用 addRoute 替代 addRoutes
          accessRoutes.forEach(route => {
            router.addRoute(route)
          })
          // 确保路由添加完成，然后重新导航到目标路由
          next({ ...to, replace: true })
          return
        } catch (error) {
          console.error('生成权限路由失败:', error)
          await userStore.resetToken()
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
