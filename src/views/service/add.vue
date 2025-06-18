<template>
  <div class="app-container">
    <p class="page-title">添加服务</p>

    <el-card>
      <el-form
        ref="serviceForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入服务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务分类" prop="category_id">
              <el-select
                v-model="formData.category_id"
                placeholder="请选择服务分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务价格" prop="price">
              <el-input-number
                v-model="formData.price"
                :min="0"
                :precision="2"
                placeholder="请输入服务价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="服务图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <img v-if="formData.image" :src="formData.image" class="avatar" />
            <el-icon class="avatar-uploader-icon"><el-icon-plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="服务描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入服务描述"
          />
        </el-form-item>

        <el-form-item label="服务详情" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="6"
            placeholder="请输入服务详细内容"
          />
        </el-form-item>

        <el-form-item label="标签" prop="tags">
          <el-input
            v-model="formData.tags"
            placeholder="请输入标签，多个标签用逗号分隔"
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            placeholder="排序值，数值越大越靠前"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { Plus as ElIconPlus } from '@element-plus/icons-vue'
import { addService, getServiceCategories } from '@/api/service'

export default {
  components: {
    ElIconPlus,
  },
  name: 'ServiceAdd',
  data() {
    return {
      formData: {
        name: '',
        category_id: '',
        price: 0,
        status: 1,
        image: '',
        description: '',
        content: '',
        tags: '',
        sort: 0,
      },
      rules: {
        name: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '服务名称长度在 2 到 50 个字符',
            trigger: 'blur',
          },
        ],
        category_id: [
          { required: true, message: '请选择服务分类', trigger: 'change' },
        ],
        price: [
          { required: true, message: '请输入服务价格', trigger: 'blur' },
          { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入服务描述', trigger: 'blur' },
          {
            min: 10,
            max: 200,
            message: '服务描述长度在 10 到 200 个字符',
            trigger: 'blur',
          },
        ],
      },
      categoryOptions: [],
      submitting: false,
    }
  },
  created() {
    this.getCategories()
  },
  methods: {
    // 获取服务分类
    async getCategories() {
      try {
        const res = await getServiceCategories()
        if (res.code === 0) {
          this.categoryOptions = res.data || []
        }
      } catch (error) {
        console.error('获取服务分类失败:', error)
      }
    },
    // 处理图片上传
    handleImageChange(file) {
      if (file.raw) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formData.image = e.target.result
        }
        reader.readAsDataURL(file.raw)
      }
    },
    // 提交表单
    async handleSubmit() {
      try {
        await this.$refs.serviceForm.validate()
        this.submitting = true

        const res = await addService(this.formData)
        if (res.code === 0) {
          this.$message.success(res.msg || '添加服务成功')
          this.$router.push('/service/list')
        } else {
          this.$message.error(res.msg || '添加服务失败')
        }
      } catch (error) {
        if (error !== false) {
          // 表单验证失败时返回false
          this.$message.error('添加服务失败')
          console.error('添加服务失败:', error)
        }
      } finally {
        this.submitting = false
      }
    },
    // 取消操作
    handleCancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
.form-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
