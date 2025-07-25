<template>
  <div class="app-container">
    <p class="page-title">编辑用户</p>
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="formData.user_name" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="不输入则不修改"
          type="password"
        />
      </el-form-item>
      <el-form-item label="所属角色" prop="roles">
        <el-cascader
          v-model="formData.roles"
          style="width: 100%"
          clearable
          :options="roleOptions"
          :show-all-levels="false"
          :props="roleProps"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="formData.real_name" />
      </el-form-item>
      <el-form-item label="电话号码" prop="tel">
        <el-input v-model="formData.tel" />
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="0" border>封停</el-radio>
          <el-radio :label="1" border>正常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { edit, getDetail } from '@/api/user'
import { getRoleTree } from '@/api/role'
import { removeEmptyChildren } from '@/utils'
export default {
  name: 'AdminUserEdit',
  data() {
    return {
      formData: {
        user_name: '',
        password: '',
        real_name: '',
        roles: [],
        status: 1,
        tel: '',
      },
      roleOptions: [],
      roleProps: {
        multiple: true,
        value: 'id',
        label: 'name',
        checkStrictly: true,
        expandTrigger: 'hover',
        emitPath: false,
      },
      rules: {
        user_name: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
        ],
        real_name: [
          { required: true, trigger: 'blur', message: '请输入真实姓名' },
        ],
        roles: [
          {
            required: true,
            type: 'array',
            trigger: 'blur',
            min: 1,
            message: '请选择至少一个角色',
          },
        ],
        status: [
          {
            required: true,
            trigger: 'blur',
            type: 'enum',
            enum: [0, 1],
            message: '请设置用户状态',
          },
        ],
        tel: [
          {
            required: true,
            trigger: 'blur',
            max: 12,
            message: '请输入合法电话号码',
          },
        ],
      },
    }
  },
  watch: {
    // 只允许输入数字
    'formData.tel': function (newVal, oldVal) {
      this.formData.tel = newVal.replace(/\D/g, '')
    },
  },
  created() {
    if (!this.$route.query.id) {
      this.back()
    }
    this.init()
  },
  methods: {
    // 初始化
    async init() {
      let { data: roleData } = await getRoleTree()
      roleData = removeEmptyChildren(roleData)
      this.roleOptions = roleData
      const { data: userData } = await getDetail(this.$route.query.id)
      const arr = []
      for (const v of userData.roles) {
        arr.push(v.id)
      }
      userData.roles = arr
      Object.assign(this.formData, userData)
    },
    // 提交表单
    async submitForm() {
      await this.$refs['elForm'].validate()
      const { msg } = await edit(this.$route.query.id, this.formData)
      this.$message.success(msg)
      this.back()
    },
    // 返回
    back() {
      this.$router.push('/admin/back/user')
    },
  },
}
</script>
