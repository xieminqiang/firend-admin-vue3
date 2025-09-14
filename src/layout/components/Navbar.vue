<template>
  <div class="navbar">
    <hamburger
      :is-active="appStore.sidebarOpened"
      class="hamburger-container"
      @toggleClick="appStore.toggleSidebar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <div class="user-avatar">
            {{ userStore.real_name || '用户' }}
          </div>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>主页</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="handleLogout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { CaretBottom } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import { useAppStore } from '@/stores/modules/useAppStore'
import { useUserStore } from '@/stores/modules/useUserStore'

// 使用Pinia store
const appStore = useAppStore()
const userStore = useUserStore()

// 使用Vue Router
const router = useRouter()
const route = useRoute()

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 退出登录
const handleLogout = async () => {
  try {
    await userStore.logout()
    ElMessage.success('退出登录成功')
    
    // 使用replace而不是push，避免浏览器历史记录问题
    // 添加错误处理，如果路由跳转失败则使用window.location
    try {
      await router.replace({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    } catch (routerError) {
      console.warn('路由跳转失败，使用window.location:', routerError)
      // 如果路由跳转失败，直接使用window.location
      window.location.href = `/login?redirect=${encodeURIComponent(route.fullPath)}`
    }
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
    // 即使退出失败，也尝试跳转到登录页
    try {
      await router.replace('/login')
    } catch {
      window.location.href = '/login'
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as *;
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 20px rgba(0, 21, 41, 0.08);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 107, 157, 0.1);
  .hamburger-container {
    line-height: 56px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    padding: 0 15px;
    border-radius: $borderRadiusMedium;
    margin: 8px;

    &:hover {
      background: rgba(255, 107, 157, 0.05);
      transform: scale(1.05);
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 10px;
    line-height: 60px;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 12px;
      height: 40px;
      font-size: 18px;
      color: #64748b;
      vertical-align: text-bottom;
      border-radius: $borderRadiusMedium;
      transition: all 0.3s ease;
      margin: 0 4px;

      &.hover-effect {
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: rgba(255, 107, 157, 0.05);
          color: $primaryColor;
          transform: translateY(-2px);
        }
      }
    }

    .avatar-container {
      margin-right: 25px;

      .avatar-wrapper {
        margin-top: 0;
        position: relative;
        display: flex;
        align-items: center;
        padding: 8px 15px;
        background: linear-gradient(
          135deg,
          rgba(255, 107, 157, 0.1) 0%,
          rgba(79, 172, 254, 0.1) 100%
        );
        border-radius: $borderRadiusLarge;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;

        &:hover {
          background: linear-gradient(
            135deg,
            rgba(255, 107, 157, 0.15) 0%,
            rgba(79, 172, 254, 0.15) 100%
          );
          transform: translateY(-2px);
          box-shadow: $shadowMedium;
        }

        .user-avatar {
          cursor: pointer;
          height: 36px;
          padding: 0 12px;
          border-radius: $borderRadiusMedium;
          background: linear-gradient(
            135deg,
            $primaryColor 0%,
            $secondaryColor 100%
          );
          color: white;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          box-shadow: $shadowLight;
          transition: all 0.3s ease;

          &:hover {
            transform: scale(1.05);
            box-shadow: $shadowMedium;
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          margin-left: 8px;
          font-size: 14px;
          color: $primaryColor;
          transition: all 0.3s ease;
        }

        &:hover .el-icon-caret-bottom {
          transform: rotate(180deg);
        }
      }
    }
  }
} /*// 下拉菜单样式*/
:deep(.user-dropdown) {
  margin-top: 10px !important;
  border-radius: $borderRadiusMedium !important;
  border: none !important;
  box-shadow: $shadowHeavy !important;
  background: white !important;
  .el-dropdown-menu__item {
    padding: 12px 20px !important;
    color: #475569 !important;
    font-weight: 500 !important;
    transition: all 0.3s ease !important;

    &:hover {
      background: rgba(255, 107, 157, 0.05) !important;
      color: $primaryColor !important;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #f1f5f9 !important;
    }
  }
}
</style>
