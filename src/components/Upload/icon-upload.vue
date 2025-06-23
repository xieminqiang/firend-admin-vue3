<template>
  <el-upload
    action="string"
    class="avatar-uploader"
    :show-file-list="false"
    :http-request="ossUpload"
    :before-upload="beforeUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
  >
    <img v-if="url" :src="getDisplayUrl(url)" class="avatar" />
    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import { $on, $off, $once, $emit } from '../../utils/gogocodeTransfer'
import { upload } from '@/api/common'
import { getImageUrl } from '@/utils/image'

export default {
  components: {
    Plus,
  },
  name: 'icon-upload',
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      url: this.value,
      prev: this.value,
    }
  },
  watch: {
    // 监听props.value的变化，用于外部数据更新时的图片回显
    value(newVal) {
      this.url = newVal
      this.prev = newVal
    }
  },
  methods: {
    // 上传前
    beforeUpload(file) {
      const limitSize = 500
      const isLt500M = file.size / 1024 / 1024 < limitSize
      if (!isLt500M) {
        this.$message.error(`上传文件大小不能超过 ${limitSize}MB!`)
      }
      return isLt500M
    },
    // 自定义上传oss方法
    ossUpload(option) {
      this.buildUrl(option.file)
      const formData = new FormData()
      formData.append('file', option.file)
      upload(formData)
        .then((response) => {
          if (response.code === 0) {
            this.prev = this.url
            $emit(this, 'update:value', response.data.url)
          } else {
            this.url = this.prev
            this.$message.error('服务器错误请稍后重试')
          }
          option.onSuccess(response)
        })
        .catch((response) => {
          this.url = this.prev
          option.onError(response)
        })
    },
    // 上传成功钩子
    handleSuccess(_res, _file, fileList) {
      $emit(this, 'on-success', _res)
    },
    // 上传失败的钩子
    handleError(err, _file, fileList) {
      $emit(this, 'on-error', err)
    },
    handlerChange(file, fileList) {},
    // 获取显示用的图片URL
    getDisplayUrl(url) {
      if (!url) return ''
      
      // 如果是本地预览URL（blob:开头），直接返回
      if (url.startsWith('blob:')) {
        return url
      }
      
      // 其他情况使用全局图片URL处理方法
      return getImageUrl(url)
    },
    buildUrl(file) {
      // 获取上传图片的本地URL，用于上传前的本地预览
      var URL = null
      if (window.createObjectURL != undefined) {
        // basic
        URL = window.createObjectURL(file)
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(file)
      }
      this.url = URL
    },
  },
  emits: ['update:value', 'on-success', 'on-error'],
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
