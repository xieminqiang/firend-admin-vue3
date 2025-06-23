<template>
  <div class="app-container">
    <div class="page-header">
      <el-button @click="handleCancel" :icon="ElIconArrowLeft">返回</el-button>
      <h2 class="page-title">编辑价格模板</h2>
    </div>

    <el-card class="form-card" v-loading="loading">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="price-template-form"
      >
        <!-- 基本信息 -->
        <div class="form-section">
          <h3 class="section-title">基本信息</h3>
          <el-form-item label="模板名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入模板名称"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="计费单位" prop="unit">
            <el-select
              v-model="form.unit"
              placeholder="请选择计费单位"
              style="width: 200px"
            >
              <el-option label="小时" value="小时" />
              <el-option label="次" value="次" />
              <el-option label="天" value="天" />
            </el-select>
            <span class="form-tip">设置该模板的计费单位</span>
          </el-form-item>
          <el-form-item label="最小购买数量" prop="min_quantity">
            <el-input
              v-model.number="form.min_quantity"
              placeholder="最小购买数量"
              style="width: 200px"
              type="number"
              :min="1"
              :precision="0"
            />
            <span class="form-tip">设置该模板的最小购买数量</span>
          </el-form-item>
          <el-form-item label="最低价格" prop="min_price">
            <span class="readonly-value">¥{{ form.min_price || '0.00' }}</span>
            <span class="form-tip">由等级价格设置自动计算</span>
          </el-form-item>
        </div>

        <!-- 等级价格设置 -->
        <div class="form-section">
          <h3 class="section-title">等级价格设置</h3>
          <div class="level-prices-container">
            <div
              v-for="level in serviceLevels"
              :key="level.id"
              class="level-price-item"
            >
              <div class="level-info">
                <div class="level-name">{{ level.level_name }}</div>
                <div class="level-order">等级 {{ level.level_order }}</div>
              </div>
              <div class="price-inputs">
                <el-input
                  v-model="levelPrices[level.id].price"
                  placeholder="价格"
                  style="width: 150px"
                  type="number"
                  :min="0"
                  maxlength="8"
                  @input="handlePriceInput($event, level.id)"
                >
                  <template #prepend>¥</template>
                </el-input>
                <span class="unit-display">/ {{ form.unit || '小时' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            保存
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft as ElIconArrowLeft } from '@element-plus/icons-vue'

import { 
  getPriceTemplateDetail, 
  editPriceTemplate, 
  batchEditPriceTemplateLevels,
  getServiceLevels
} from '@/api/service'

// 响应式数据
const router = useRouter()
const route = useRoute()
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)
const templateId = ref(null)
const serviceLevels = ref([])
const levelPrices = ref({})

const form = reactive({
  name: '',
  min_quantity: 1,
  unit: '小时',
  min_price: 0,
})

const rules = {
  name: [
    { required: true, message: '请输入模板名称', trigger: 'blur' },
    { max: 100, message: '模板名称不能超过100个字符', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请选择计费单位', trigger: 'change' },
  ],
  min_quantity: [
    { required: true, message: '请输入最小购买数量', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value === '' || value === null || value === undefined) {
          callback(new Error('请输入最小购买数量'))
        } else if (isNaN(value) || value < 1) {
          callback(new Error('最小购买数量不能小于1'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    },
  ],
}

// 方法
// 获取服务等级列表
const fetchServiceLevels = async () => {
  try {
    const res = await getServiceLevels()
    if (res.code === 0) {
      serviceLevels.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('获取服务等级列表失败')
    console.error('获取服务等级列表失败:', error)
  }
}

// 初始化等级价格数据
const initLevelPrices = (templateData) => {
  serviceLevels.value.forEach(level => {
    const existingLevel = templateData.levels?.find(l => l.level_id === level.id)
    levelPrices.value[level.id] = {
      level_id: level.id,
      price: existingLevel?.price || 0,
      id: existingLevel?.id || null, // 保存现有记录的ID用于更新
    }
  })
  // 重新计算最低价格
  calculateMinPrice()
}

// 获取模板详情
const getTemplateDetail = async () => {
  loading.value = true
  try {
    const res = await getPriceTemplateDetail(templateId.value)
    if (res.code === 0) {
      const data = res.data
      form.name = data.name
      form.unit = data.unit || '小时'
      form.min_quantity = data.min_quantity || 1
      form.min_price = data.min_price || 0
      
      // 初始化等级价格数据
      initLevelPrices(data)
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

// 处理价格输入
const handlePriceInput = (value, levelId) => {
  if (!value) {
    levelPrices.value[levelId].price = 0
  } else {
    // 限制输入长度为8位（包括小数点）
    if (value.toString().length > 8) {
      value = value.toString().slice(0, 8)
    }
    
    // 限制小数位数为2位
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      // 保留2位小数
      const roundedValue = Math.round(numValue * 100) / 100
      levelPrices.value[levelId].price = roundedValue
    }
  }
  
  // 重新计算最低价格
  calculateMinPrice()
}

// 计算最低价格
const calculateMinPrice = () => {
  const prices = Object.values(levelPrices.value).map(item => item.price).filter(price => price > 0)
  if (prices.length > 0) {
    form.min_price = Math.min(...prices)
  } else {
    form.min_price = 0
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    submitting.value = true
    
    // 1. 更新价格模板基本信息
    const templateRes = await editPriceTemplate(templateId.value, {
      name: form.name,
      unit: form.unit,
      min_quantity: form.min_quantity,
      min_price: form.min_price,
    })
    
    if (templateRes.code !== 0) {
      ElMessage.error(templateRes.message || '更新模板失败')
      return
    }
    
    // 2. 批量更新等级价格
    const levelsData = Object.values(levelPrices.value).map(item => ({
      id: item.id || 0, // 如果有ID则为更新，否则为新增
      level_id: item.level_id,
      price: item.price,
      unit: form.unit,
      min_quantity: form.min_quantity,
    }))
    
    const levelsRes = await batchEditPriceTemplateLevels({
      template_id: Number(templateId.value),
      levels: levelsData,
    })
    
    if (levelsRes.code !== 0) {
      ElMessage.error(levelsRes.message || '更新等级价格失败')
      return
    }
    
    ElMessage.success('保存成功！已自动同步相关服务的数据')
    router.push('/service/price-template')
  } catch (error) {
    console.error('保存价格模板失败:', error)
    ElMessage.error('保存失败')
  } finally {
    submitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  router.push('/service/price-template')
}

// 生命周期
onMounted(async () => {
  templateId.value = Number(route.params.id)
  await fetchServiceLevels()
  await getTemplateDetail()
})
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

.form-card {
  max-width: 800px;
}

.form-section {
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

.level-prices-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.level-price-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.level-name {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.level-order {
  color: #909399;
  font-size: 12px;
}

.price-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
}

.unit-display {
  font-size: 12px;
  color: #909399;
}

.readonly-value {
  font-size: 14px;
  color: #606266;
  font-weight: bold;
}
</style> 