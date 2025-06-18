import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const state = ref({
    sidebar: {
      opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: localStorage.getItem('size') || 'medium'
  })

  // Getters
  const sidebarOpened = computed(() => state.value.sidebar.opened)
  const device = computed(() => state.value.device)
  const size = computed(() => state.value.size)

  // Actions
  const toggleSidebar = () => {
    state.value.sidebar.opened = !state.value.sidebar.opened
    state.value.sidebar.withoutAnimation = false
    
    if (state.value.sidebar.opened) {
      localStorage.setItem('sidebarStatus', '1')
    } else {
      localStorage.setItem('sidebarStatus', '0')
    }
  }

  const closeSidebar = (withoutAnimation = false) => {
    localStorage.setItem('sidebarStatus', '0')
    state.value.sidebar.opened = false
    state.value.sidebar.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (device) => {
    state.value.device = device
  }

  const setSize = (size) => {
    state.value.size = size
    localStorage.setItem('size', size)
  }

  const setLanguage = (language) => {
    state.value.language = language
    localStorage.setItem('language', language)
  }

  return {
    state,
    sidebarOpened,
    device,
    size,
    toggleSidebar,
    closeSidebar,
    toggleDevice,
    setSize,
    setLanguage
  }
}) 