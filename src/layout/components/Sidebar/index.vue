<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="menuBg"
        :text-color="menuText"
        :unique-opened="false"
        :active-text-color="menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/usePermissionStore'
import { useSettingsStore } from '@/stores/modules/useSettingsStore'
import { useAppStore } from '@/stores/modules/useAppStore'
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const appStore = useAppStore()

const permission_routes = computed(() => permissionStore.routes)
const showLogo = computed(() => settingsStore.sidebarLogo)
const isCollapse = computed(() => !appStore.sidebar.opened)

const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

// 菜单样式变量
const menuBg = '#304156'
const menuText = '#bfcbd9'
const menuActiveText = '#409EFF'
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: 210px;
  height: 100%;
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;

  &.has-logo {
    .el-scrollbar {
      height: calc(100% - 50px);
    }
  }

  .el-scrollbar {
    height: 100%;
    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }
  }

  :deep(.el-menu) {
    border: none;
    height: 100%;
    width: 100% !important;
  }

  :deep(.el-menu--collapse) {
    width: 64px !important;
  }

  :deep(.el-menu:not(.el-menu--collapse)) {
    width: 210px !important;
  }
}

// 当侧边栏折叠时的样式
.sidebar-container.collapse {
  width: 64px;
}
</style>
