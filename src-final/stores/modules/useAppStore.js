import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 应用状态管理 - 使用组合式API风格
export const useAppStore = defineStore('app', () => {
  // State
  const sidebar = ref({
    opened: localStorage.getItem('sidebarStatus') 
      ? !!+localStorage.getItem('sidebarStatus') 
      : true,
    withoutAnimation: false,
  })
  
  const device = ref('desktop')
  
  // Getters
  const sidebarOpened = computed(() => sidebar.value.opened)
  const sidebarWithoutAnimation = computed(() => sidebar.value.withoutAnimation)
  const isMobile = computed(() => device.value === 'mobile')
  const isDesktop = computed(() => device.value === 'desktop')
  
  // Actions
  const toggleSidebar = () => {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    
    // 持久化到localStorage
    if (sidebar.value.opened) {
      localStorage.setItem('sidebarStatus', '1')
    } else {
      localStorage.setItem('sidebarStatus', '0')
    }
  }
  
  const closeSidebar = (withoutAnimation = false) => {
    localStorage.setItem('sidebarStatus', '0')
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }
  
  const openSidebar = () => {
    localStorage.setItem('sidebarStatus', '1')
    sidebar.value.opened = true
    sidebar.value.withoutAnimation = false
  }
  
  const toggleDevice = (deviceType) => {
    device.value = deviceType
    
    // 移动端自动收起侧边栏
    if (deviceType === 'mobile') {
      closeSidebar(true)
    }
  }
  
  // 初始化应用设置
  const initApp = () => {
    // 从localStorage恢复设置
    const sidebarStatus = localStorage.getItem('sidebarStatus')
    if (sidebarStatus !== null) {
      sidebar.value.opened = !!+sidebarStatus
    }
  }
  
  return {
    // State
    sidebar,
    device,
    
    // Getters
    sidebarOpened,
    sidebarWithoutAnimation,
    isMobile,
    isDesktop,
    
    // Actions
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleDevice,
    initApp
  }
}) 