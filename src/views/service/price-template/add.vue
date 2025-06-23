<template>
  <div class="app-container">
    <div class="page-header">
      <el-button @click="handleCancel" :icon="ElIconArrowLeft">返回</el-button>
      <h2 class="page-title">添加价格模板</h2>
    </div>

    <el-card class="form-card">
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
            提交
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft as ElIconArrowLeft } from '@element-plus/icons-vue'

import { addPriceTemplate, getServiceLevels, batchAddPriceTemplateLevels } from '@/api/service'

// 响应式数据
const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)
const serviceLevels = ref([])
const levelPrices = ref({})

const form = reactive({
  name: '',
  unit: '小时',
  min_quantity: 1,
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
const initLevelPrices = () => {
  serviceLevels.value.forEach(level => {
    levelPrices.value[level.id] = {
      level_id: level.id,
      price: 0,
    }
  })
  // 初始化最低价格
  calculateMinPrice()
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
    
    // 1. 创建价格模板
    const templateRes = await addPriceTemplate({
      name: form.name,
      unit: form.unit,
      min_quantity: form.min_quantity,
      min_price: form.min_price,
    })
    
    if (templateRes.code !== 0) {
      ElMessage.error(templateRes.message || '创建模板失败')
      return
    }
    
    const templateId = templateRes.data?.id || templateRes.data
    
    // 2. 批量添加等级价格
    const levelsData = Object.values(levelPrices.value).map(item => ({
      template_id: templateId,
      level_id: item.level_id,
      price: item.price,
      unit: form.unit,
      min_quantity: form.min_quantity,
    }))
    
    const levelsRes = await batchAddPriceTemplateLevels({
      template_id: templateId,
      levels: levelsData,
    })
    
    if (levelsRes.code === 0) {
      ElMessage.success('创建成功')
      router.go(-1)
    } else {
      ElMessage.error(levelsRes.message || '创建等级价格失败')
    }
  } catch (error) {
    console.error('创建价格模板失败:', error)
    ElMessage.error('创建失败')
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
  await fetchServiceLevels()
  initLevelPrices()
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