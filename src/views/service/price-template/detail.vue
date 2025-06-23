<template>
  <div class="app-container">
    <div class="page-header">
      <el-button @click="handleCancel" :icon="ElIconArrowLeft">返回</el-button>
      <h2 class="page-title">价格模板详情</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>

    <el-card class="detail-card" v-loading="loading">
      <!-- 基本信息 -->
      <div class="detail-section">
        <h3 class="section-title">基本信息</h3>
        <div class="info-item">
          <span class="label">模板名称：</span>
          <span class="value">{{ templateInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="label">计费单位：</span>
          <span class="value">{{ templateInfo.unit || '小时' }}</span>
        </div>
        <div class="info-item">
          <span class="label">最小购买数量：</span>
          <span class="value">{{ templateInfo.min_quantity || 1 }}</span>
        </div>
        <div class="info-item">
          <span class="label">创建时间：</span>
          <span class="value">{{ formatDate(templateInfo.created_at) }}</span>
        </div>
        <div class="info-item">
          <span class="label">更新时间：</span>
          <span class="value">{{ formatDate(templateInfo.updated_at) }}</span>
        </div>
      </div>

      <!-- 等级价格详情 -->
      <div class="detail-section">
        <h3 class="section-title">等级价格详情</h3>
        <div class="level-prices-container">
          <div
            v-for="level in templateLevels"
            :key="level.id"
            class="level-price-item"
          >
            <div class="level-info">
              <div class="level-name">{{ level.level_name }}</div>
              <div class="level-order">等级 {{ level.level_order }}</div>
            </div>
            <div class="price-info">
              <span class="price">¥{{ level.price }}</span>
              <span class="unit">/ {{ templateInfo.unit || '小时' }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 编辑等级价格对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑等级价格"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="等级名称">
          <el-input v-model="editForm.level_name" disabled />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="editForm.price"
            type="number"
            :min="0"
            :step="0.01"
            style="width: 200px"
          >
            <template #prepend>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="editForm.unit" style="width: 200px">
            <el-option label="小时" value="小时" />
            <el-option label="次" value="次" />
            <el-option label="天" value="天" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateLevel" :loading="updating">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft as ElIconArrowLeft } from '@element-plus/icons-vue'
import { getPriceTemplateDetail, editPriceTemplateLevel } from '@/api/service'

// 响应式数据
const router = useRouter()
const route = useRoute()
const editFormRef = ref(null)
const loading = ref(false)
const updating = ref(false)
const templateId = ref(null)
const templateInfo = ref({})
const templateLevels = ref([])
const editDialogVisible = ref(false)

const editForm = reactive({
  id: null,
  level_name: '',
  price: 0,
  unit: '小时',
})

const editRules = {
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格不能小于0', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请选择单位', trigger: 'change' },
  ],
}

// 方法
// 获取模板详情
const getTemplateDetail = async () => {
  loading.value = true
  try {
    const res = await getPriceTemplateDetail(templateId.value)
    if (res.code === 0) {
      const data = res.data
      templateInfo.value = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        updated_at: data.updated_at,
        unit: data.unit,
        min_quantity: data.min_quantity,
      }
      templateLevels.value = data.levels || []
    } else {
      ElMessage.error(res.message || '获取模板详情失败')
    }
  } catch (error) {
    ElMessage.error('获取模板详情失败')
    console.error('获取模板详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回列表页
const handleCancel = () => {
  router.push('/service/price-template')
}

// 编辑模板
const handleEdit = () => {
  router.push(`/service/price-template/edit/${templateId.value}`)
}

// 编辑等级价格
const handleEditLevel = (level) => {
  editForm.id = level.id
  editForm.level_name = level.level_name
  editForm.price = level.price
  editForm.unit = level.unit
  editDialogVisible.value = true
}

// 更新等级价格
const handleUpdateLevel = async () => {
  try {
    await editFormRef.value.validate()
    
    updating.value = true
    
    const res = await editPriceTemplateLevel(editForm.id, {
      price: editForm.price,
      unit: editForm.unit,
    })
    
    if (res.code === 0) {
      ElMessage.success('更新成功')
      editDialogVisible.value = false
      // 重新获取数据
      await getTemplateDetail()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('更新等级价格失败:', error)
    ElMessage.error('更新失败')
  } finally {
    updating.value = false
  }
}

// 生命周期
onMounted(async () => {
  templateId.value = route.params.id
  await getTemplateDetail()
})

// 辅助函数
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString()
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.detail-card {
  max-width: 1000px;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
  color: #909399;
}

.value {
  font-weight: bold;
  color: #303133;
}

.level-prices-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.level-price-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
  transition: all 0.3s ease;
}

.level-price-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.level-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.level-name {
  font-weight: bold;
  color: #303133;
  font-size: 16px;
}

.level-order {
  color: #909399;
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #e6a23c;
}

.unit {
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style> 