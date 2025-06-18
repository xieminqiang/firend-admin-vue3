import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    title: '伴集',
    fixedHeader: true,
    sidebarLogo: true,
    showSettings: false,
    showTagsView: true,
    showSidebarLogo: true,
    showDynamicTitle: false,
    // 主题色
    primaryColor: '#FF6B9D',
    // 布局模式
    layout: 'side',
    // 内容区域宽度
    contentWidth: 'auto',
    // 导航模式
    navMode: 'side',
    // 导航风格
    navTheme: 'dark',
    // 是否开启多标签
    multiTab: true,
    // 是否固定头部
    fixedHeader: true,
    // 是否显示面包屑
    showBreadcrumb: true,
    // 是否显示页脚
    showFooter: true,
    // 是否显示设置
    showSettings: false,
    // 是否显示标签页
    showTagsView: true,
    // 是否显示侧边栏Logo
    showSidebarLogo: true,
    // 是否显示动态标题
    showDynamicTitle: false,
    // 是否显示主题设置
    showThemeSetting: true,
    // 是否显示布局设置
    showLayoutSetting: true,
    // 是否显示导航设置
    showNavSetting: true,
    // 是否显示标签设置
    showTabSetting: true,
    // 是否显示页脚设置
    showFooterSetting: true,
    // 是否显示面包屑设置
    showBreadcrumbSetting: true,
    // 是否显示Logo设置
    showLogoSetting: true,
    // 是否显示动态标题设置
    showDynamicTitleSetting: true,
    // 是否显示主题色设置
    showPrimaryColorSetting: true,
    // 是否显示布局模式设置
    showLayoutModeSetting: true,
    // 是否显示内容区域宽度设置
    showContentWidthSetting: true,
    // 是否显示导航模式设置
    showNavModeSetting: true,
    // 是否显示导航风格设置
    showNavThemeSetting: true,
    // 是否显示多标签设置
    showMultiTabSetting: true,
    // 是否显示固定头部设置
    showFixedHeaderSetting: true,
    // 是否显示面包屑设置
    showBreadcrumbSetting: true,
    // 是否显示页脚设置
    showFooterSetting: true,
    // 是否显示设置按钮
    showSettingButton: true,
    // 是否显示标签页设置
    showTabSetting: true,
    // 是否显示Logo设置
    showLogoSetting: true,
    // 是否显示动态标题设置
    showDynamicTitleSetting: true,
    // 是否显示主题色设置
    showPrimaryColorSetting: true,
    // 是否显示布局模式设置
    showLayoutModeSetting: true,
    // 是否显示内容区域宽度设置
    showContentWidthSetting: true,
    // 是否显示导航模式设置
    showNavModeSetting: true,
    // 是否显示导航风格设置
    showNavThemeSetting: true,
    // 是否显示多标签设置
    showMultiTabSetting: true,
    // 是否显示固定头部设置
    showFixedHeaderSetting: true,
    // 是否显示面包屑设置
    showBreadcrumbSetting: true,
    // 是否显示页脚设置
    showFooterSetting: true,
    // 是否显示设置按钮
    showSettingButton: true,
  }),

  getters: {
    getTitle: (state) => state.title,
    getFixedHeader: (state) => state.fixedHeader,
    getSidebarLogo: (state) => state.sidebarLogo,
    getShowSettings: (state) => state.showSettings,
    getShowTagsView: (state) => state.showTagsView,
    getShowSidebarLogo: (state) => state.showSidebarLogo,
    getShowDynamicTitle: (state) => state.showDynamicTitle,
  },

  actions: {
    changeSetting({ key, value }) {
      if (this.hasOwnProperty(key)) {
        this[key] = value
      }
    },
  },
}) 