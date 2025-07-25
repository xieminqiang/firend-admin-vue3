<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group tag="span" name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { compile } from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null,
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '随伴行' } }].concat(
          matched
        )
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = compile(path)
      return toPath(params)
    },
    handleLink(item) {
      try {
        const { redirect, path } = item
        
        // 防止循环重定向
        if (redirect && redirect === path) {
          console.warn('检测到循环重定向:', redirect)
          return
        }
        
        if (redirect) {
          // 检查重定向路径是否与当前路径相同
          if (redirect === this.$route.path) {
            console.warn('重定向路径与当前路径相同，跳过导航:', redirect)
            return
          }
          this.$router.push(redirect)
          return
        }
        
        // 编译路径并检查结果
        const compiledPath = this.pathCompile(path)
        if (compiledPath === this.$route.path) {
          console.warn('编译后的路径与当前路径相同，跳过导航:', compiledPath)
          return
        }
        
        this.$router.push(compiledPath)
      } catch (error) {
        console.error('面包屑导航错误:', error)
        // 如果出现错误，尝试直接跳转到路径
        if (item.path && item.path !== this.$route.path) {
          this.$router.push(item.path)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
