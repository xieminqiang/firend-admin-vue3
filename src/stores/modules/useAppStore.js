import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      opened: true,
      withoutAnimation: false
    },
    device: 'desktop',
    size: 'default',
    language: 'zh-CN'
  }),

  getters: {
    sidebarOpened: (state) => state.sidebar.opened,
    getSidebar: (state) => state.sidebar,
    getDevice: (state) => state.device,
    getSize: (state) => state.size,
    getLanguage: (state) => state.language
  },

  actions: {
    toggleSidebar() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
    },
    closeSidebar({ withoutAnimation }) {
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    toggleDevice(device) {
      this.device = device
    },
    setSize(size) {
      this.size = size
    },
    setLanguage(language) {
      this.language = language
    }
  }
}) 