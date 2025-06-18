<template>
  <div class="menu-item">
    <el-icon v-if="icon" class="menu-icon">
      <component :is="icon" />
    </el-icon>
    <span class="menu-title" :class="{ 'show-in-popup': isCollapse }">{{ title }}</span>
  </div>
</template>

<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.menu-item {
  display: flex;
  align-items: center;
  height: 100%;
  
  .menu-icon {
    margin-right: 8px;
    font-size: 18px;
  }
  
  .menu-title {
    font-size: 14px;
    white-space: nowrap;
  }

  .show-in-popup {
    display: none;
  }
}

:deep(.el-menu--popup) {
  .menu-title {
    display: inline-block !important;
    visibility: visible !important;
    width: auto !important;
    height: auto !important;
    overflow: visible !important;
  }
}
</style>
