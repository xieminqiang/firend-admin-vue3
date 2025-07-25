<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="tagsView" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/useAppStore'
import { Navbar, Sidebar, AppMain, TagsView } from './components'
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    TagsView,
    AppMain,
  },
  setup() {
    const appStore = useAppStore()
    
    const sidebar = computed(() => ({
      opened: appStore.sidebarOpened,
      withoutAnimation: false
    }))
    
    const device = computed(() => appStore.device || 'desktop')
    
    const fixedHeader = computed(() => true) // 默认固定头部
    
    const tagsView = computed(() => false) // 默认不显示标签页
    
    const classObj = computed(() => ({
      hideSidebar: !sidebar.value.opened,
      openSidebar: sidebar.value.opened,
      withoutAnimation: sidebar.value.withoutAnimation,
      mobile: device.value === 'mobile',
    }))
    
    const handleClickOutside = () => {
      appStore.closeSideBar()
    }
    
    return {
      sidebar,
      device,
      fixedHeader,
      tagsView,
      classObj,
      handleClickOutside
    }
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/mixin.scss' as *;
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 240px);
  transition: width 0.28s;
}
.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}
.mobile .fixed-header {
  width: 100%;
}
</style>
