<template>
  <div class="app-container">
    <p class="page-title">添加</p>
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="管理员ID" prop="admin_user_id">
        <el-input v-model="formData.admin_user_id" />
      </el-form-item>
      <el-form-item label="用户名ID" prop="user_id">
        <!-- <el-input v-model="formData.user_id" /> -->
        <el-autocomplete
          v-model="state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="handleSelect"
        >
          <template v-slot="{ item }">
            <el-avatar
              :size="'medium'"
              :fit="'contain'"
              :src="item.head_img"
            ></el-avatar>
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { chatAdd, chatDel, chatList, searchUser } from '@/api/chat'
export default {
  name: 'add',
  data() {
    return {
      formData: {
        admin_user_id: '',
        user_id: '',
      },
      state: '',
      rules: {
        admin_user_id: [
          { required: true, trigger: 'blur', message: '请输入管理员ID' },
        ],
      },
    }
  },
  methods: {
    // 提交表单
    async submitForm() {
      await this.$refs['elForm'].validate()
      let req = {
        admin_user_id: this.formData.admin_user_id.trim(),
        user_id: this.formData.user_id.trim(),
      }
      const { msg } = await chatAdd(req)
      this.$message.success(msg)
      this.back()
    },
    // 返回
    back() {
      this.$router.push('/chat/manage')
    },
    querySearchAsync(queryString, cb) {
      searchUser({ keyword: queryString, business: 'NormalUser' }).then(
        (res) => {
          cb(res.data)
        }
      )
    },
    handleSelect(item) {
      this.formData.user_id = item.user_id
    },
  },
}
</script>
