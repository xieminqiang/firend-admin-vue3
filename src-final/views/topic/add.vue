<template>
  <div class="app-container">
    <p class="page-title">添加</p>
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
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
          @on-success="uploadSuccess"
        ></upload>
      </el-form-item>
      <el-form-item size="medium">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addTopic } from '@/api/moment'
import upload from '@/components/Upload/icon-upload.vue'

export default {
  name: 'add',
  data() {
    return {
      formData: {
        parent_id: '',
        topic_id: '',
        topic_desc: '',
        topic_icon: '',
      },
      rules: {
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
      },
    }
  },
  methods: {
    // 返回
    back() {
      this.$router.push('/topic/list')
    },
    // 提交表单
    async submitForm() {
      await this.$refs['elForm'].validate()
      const { msg } = await addTopic(this.formData)
      this.$message.success(msg)
      this.back()
    },
    uploadSuccess(res) {
      this.$nextTick(() => {
        this.$refs['elForm'].clearValidate('topic_icon')
      })
    },
  },
  components: {
    upload,
  },
}
</script>
