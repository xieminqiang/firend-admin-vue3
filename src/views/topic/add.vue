<template>
  <div class="app-container">
    <p class="page-title">添加</p>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="父级id" prop="parent_id">
        <el-input v-model="formData.parent_id" />
      </el-form-item>
      <el-form-item label="话题id" prop="topic_id">
        <el-input v-model="formData.topic_id" />
      </el-form-item>
      <el-form-item label="话题名" prop="topic_desc">
        <el-input v-model="formData.topic_desc" />
      </el-form-item>
      <el-form-item label="话题icon" prop="topic_icon">
        <upload
          v-model:value="formData.topic_icon"
          @on-success="handleUploadSuccess"
        ></upload>
      </el-form-item>
      <el-form-item size="medium">
        <el-button type="primary" @click="handleSubmit" :loading="loading.submit">提交</el-button>
        <el-button @click="handleBack" :loading="loading.back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addTopic } from '@/api/moment'
import upload from '@/components/Upload/icon-upload.vue'
import { getRelativePath } from '@/utils/image'

// 定义响应式数据
const router = useRouter()
const formRef = ref(null)

// 表单数据
const formData = reactive({
  parent_id: '',
  topic_id: '',
  topic_desc: '',
  topic_icon: '',
})

// 表单验证规则
const rules = {
  parent_id: [
    { required: true, trigger: 'blur', message: '请输入父级id' },
  ],
  topic_id: [
    { required: true, trigger: 'blur', message: '请输入话题id' },
  ],
  topic_desc: [
    { required: true, trigger: 'blur', message: '请输入话题名' },
  ],
  topic_icon: [
    { required: true, trigger: 'blur', message: '请上传话题icon' },
  ],
}

// 加载状态
const loading = reactive({
  submit: false,
  back: false
})

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    loading.submit = true
    
    // 准备提交数据，处理图片URL
    const submitData = { ...formData }
    // 处理图片URL：提交时只发送相对路径，不包含域名
    if (submitData.topic_icon) {
      submitData.topic_icon = getRelativePath(submitData.topic_icon)
    }
    
    const response = await addTopic(submitData)
    if (response.msg) {
      ElMessage.success(response.msg)
      handleBack()
    }
  } catch (error) {
    ElMessage.error('提交失败：' + (error.message || '未知错误'))
    console.error('提交失败:', error)
  } finally {
    loading.submit = false
  }
}

// 返回
const handleBack = async () => {
  try {
    loading.back = true
    await router.push('/topic/topic')
  } catch (error) {
    ElMessage.error('返回失败')
  } finally {
    loading.back = false
  }
}

// 上传成功回调
const handleUploadSuccess = () => {
  formRef.value?.clearValidate('topic_icon')
}

// 导出供模板使用的变量和方法
defineExpose({
  handleSubmit,
  handleBack,
  handleUploadSuccess
})
</script>

<style scoped>
.page-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}
</style>
