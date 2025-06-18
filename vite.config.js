import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9528,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9901/love/admin',
        // target: 'http://0.0.0.0:9901/love/admin',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    historyApiFallback: {
      rewrites: [
        { from: /^\//, to: '/index.html' }
      ]
    }
  },
  build: {
    target: 'es2015',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus'],
          tencentChat: ['@tencentcloud/chat'],
        },
      },
    },
  },
  define: {
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_OPTIONS_API__: true,
    // 定义环境变量
    'import.meta.env.VITE_APP_BASE_API': '"/api"',
    'import.meta.env.VITE_CDN': '""',
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 使用现代 Sass API，避免弃用警告
        api: 'modern-compiler',
        // 不再自动注入变量文件，因为我们现在使用 @use
        // additionalData: (content, filename) => filename.includes("variables.scss") ? content : `@import "@/styles/variables.scss";\n${content}`,
      },
    },
  },
}) 