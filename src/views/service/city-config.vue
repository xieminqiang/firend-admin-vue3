<template>
  <div class="app-container">
    <p class="page-title">区域服务配置</p>

    <!-- 搜索和操作区域 -->
    <div class="filter-container">
      <el-input
        v-model="params.keyword"
        placeholder="搜索区域或服务名称"
        style="width: 200px;"
        clearable
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="params.service_id"
        placeholder="选择服务"
        style="width: 200px;"
        clearable
      >
        <el-option
          v-for="item in serviceOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="params.city_code"
        placeholder="选择区域"
        style="width: 200px;"
        clearable
        filterable
      >
        <el-option
          v-for="item in cityOptions"
          :key="item.city_code"
          :label="`${item.name}`"
          :value="item.city_code"
        />
      </el-select>
      <el-select
        v-model="params.is_enabled"
        placeholder="状态筛选"
        style="width: 120px;"
        clearable
      >
        <el-option label="已启用" :value="1" />
        <el-option label="已禁用" :value="0" />
      </el-select>
      <el-button
        type="primary"
        :icon="ElIconSearch"
        class="filter-item"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        :icon="ElIconPlus"
        class="filter-item"
        @click="handleBatchAdd"
      >
        批量配置
      </el-button>
    </div>

    <!-- 配置列表表格 -->
    <el-table
      v-loading="table_loading"
      :data="list"
      border
      element-loading-text="加载中..."
    >
      <el-table-column label="区域代码" prop="city_code" align="center" width="100" />
      <el-table-column label="区域名称" prop="city_name" align="center" width="120" />
      <el-table-column label="服务名称" align="center" min-width="150">
        <template v-slot="scope">
          <span 
            class="service-name service-link"
            @click="handleViewService(scope.row)"
            title="点击查看服务详情"
          >
            {{ scope.row.service_name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="服务状态" align="center" width="120">
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.is_enabled"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
   
      <el-table-column label="价格模板" align="center" width="150">
        <template v-slot="scope">
          <span 
            v-if="scope.row.template_name" 
            class="template-name template-link"
            @click="handleViewPriceTemplate(scope.row)"
            title="点击查看价格模板详情"
          >
            {{ scope.row.template_name }}
          </span>
          <span v-else class="no-template">未绑定</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价格" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.template_min_price" class="price-text">
            ¥{{ scope.row.template_min_price }}/{{scope.row.template_unit}}
          </span>
          <span v-else class="no-price">-</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center" min-width="120">
        <template v-slot="scope">
          <span v-if="scope.row.note" class="note-text">{{ scope.row.note }}</span>
          <span v-else class="no-note">-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template v-slot="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button 
            size="small" 
            :type="scope.row.template_name ? 'warning' : 'success'" 
            @click="handleBindTemplate(scope.row)"
          >
            {{ scope.row.template_name ? '重新绑定' : '绑定模板' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="page-container">
      <el-pagination
        v-model:current-page="params.page"
        v-model:page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :small="false"
        :disabled="table_loading"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑区域服务配置"
      width="600px"
      :before-close="handleEditDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="区域名称">
          <el-input v-model="editForm.city_name" disabled />
        </el-form-item>
        <el-form-item label="服务名称">
          <el-input v-model="editForm.service_name" disabled />
        </el-form-item>
        <el-form-item label="服务状态" prop="is_enabled">
          <el-switch
            v-model="editForm.is_enabled"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="editForm.note"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <div class="dialog-footer-left">
            <el-button 
              type="danger" 
              plain 
              @click="handleDeleteConfig" 
              :loading="deleteLoading"
            >
              删除配置
            </el-button>
          </div>
          <div class="dialog-footer-right">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleEditSubmit" :loading="editLoading">
              确定
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <!-- 绑定模板对话框 -->
    <el-dialog
      v-model="templateDialogVisible"
      :title="templateForm.isUpdate ? '重新绑定价格模板' : '绑定价格模板'"
      width="500px"
      :before-close="handleTemplateDialogClose"
    >
      <el-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        label-width="100px"
      >
        <el-form-item label="区域名称">
          <el-input v-model="templateForm.city_name" disabled />
        </el-form-item>
        <el-form-item label="服务名称">
          <el-input v-model="templateForm.service_name" disabled />
        </el-form-item>
        <el-form-item label="价格模板" prop="price_template_id">
          <el-select
            v-model="templateForm.price_template_id"
            placeholder="请选择价格模板"
            style="width: 100%;"
            clearable
          >
            <el-option
              v-for="item in templateOptions"
              :key="item.id"
              :label="`${item.name} (¥${item.min_price})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="templateDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleTemplateSubmit" :loading="templateLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量配置对话框 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量配置区域服务"
      width="700px"
      :before-close="handleBatchDialogClose"
    >
      <el-form
        ref="batchFormRef"
        :model="batchForm"
        :rules="batchRules"
        label-width="100px"
      >
        <el-form-item label="选择服务" prop="service_id">
          <el-select
            v-model="batchForm.service_id"
            placeholder="请选择服务"
            style="width: 100%;"
          >
            <el-option
              v-for="item in serviceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择区域" prop="city_codes">
          <div class="city-select-container">
            <div class="city-select-header">
                              <span class="selected-count">
                已选择 {{ batchForm.city_codes.length }} 个区域
                <span v-if="cityOptions.length > 0" class="total-count">/ 共 {{ cityOptions.length }} 个</span>
              </span>
              <div class="city-select-actions">
                <el-button 
                  size="small" 
                  type="primary" 
                  plain 
                  @click="handleSelectAllCities"
                  :disabled="batchForm.city_codes.length === cityOptions.length"
                >
                  全选 ({{ cityOptions.length }})
                </el-button>
                <el-button 
                  size="small" 
                  type="warning" 
                  plain 
                  @click="handleClearCities"
                  :disabled="batchForm.city_codes.length === 0"
                >
                  清空
                </el-button>
              </div>
            </div>
            
            <!-- 自定义的城市显示区域 - 移到选择框上方 -->
            <div v-if="batchForm.city_codes.length > 0" class="selected-cities-display">
              <div class="cities-display-header">
                <span class="cities-display-title">已选择的区域：</span>
              </div>
              <div class="selected-cities-tags">
                <el-tag
                  v-for="cityCode in batchForm.city_codes"
                  :key="cityCode"
                  closable
                  @close="handleRemoveCity(cityCode)"
                  class="city-tag"
                  effect="light"
                >
                  {{ getCityNameByCode(cityCode) }}
                </el-tag>
              </div>
            </div>
            
            <!-- 空状态提示 -->
            <div v-if="batchForm.city_codes.length === 0" class="empty-state">
              <span class="empty-text">请从下方下拉框中选择要配置的区域</span>
            </div>
            
            <!-- 隐藏原生的多选标签显示，避免重复 -->
            <div class="select-wrapper">
              <el-select
                v-model="batchForm.city_codes"
                placeholder="点击此处搜索并选择区域..."
                style="width: 100%;"
                multiple
                filterable
                collapse-tags
                :max-collapse-tags="0"
                reserve-keyword
                popper-class="city-select-popper"
              >
                <template #tag>
                  <!-- 不显示任何标签，使用上方自定义显示 -->
                </template>
                <el-option
                  v-for="item in cityOptions"
                  :key="item.city_code"
                  :label="item.name"
                  :value="item.city_code"
                />
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="服务状态">
          <el-switch
            v-model="batchForm.is_enabled"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="价格模板">
          <el-select
            v-model="batchForm.price_template_id"
            placeholder="请选择价格模板（可选）"
            style="width: 100%;"
            clearable
          >
            <el-option
              v-for="item in templateOptions"
              :key="item.id"
              :label="`${item.name} (¥${item.min_price})`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="batchForm.note"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="batchDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleBatchSubmit" :loading="batchLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search as ElIconSearch, 
  Plus as ElIconPlus
} from '@element-plus/icons-vue'
import { getServiceList } from '@/api/service'
import { getPriceTemplateList } from '@/api/service'
import { 
  getCityList,
  getServiceCitySettingsList,
  updateServiceCitySettings,
  addServiceCitySettings,
  deleteServiceCitySettings,
  batchUpdateServiceCitySettings,
  addServiceCityTemplate,
  updateServiceCityTemplate,
  batchUpdateServiceCityTemplates
} from '@/api/cityService'

// 路由
const router = useRouter()

// 响应式数据
const params = reactive({
  service_id: '',
  city_code: '',
  is_enabled: '',
  page: 1,
  pageSize: 10,
  keyword: ''
})

const list = ref([])
const total = ref(0)
const table_loading = ref(false)

// 选项数据
const serviceOptions = ref([])
const cityOptions = ref([])
const templateOptions = ref([])

// 编辑对话框
const editDialogVisible = ref(false)
const editLoading = ref(false)
const deleteLoading = ref(false)
const editFormRef = ref()
const editForm = reactive({
  service_id: '',
  city_code: '',
  city_name: '',
  service_name: '',
  is_enabled: 1,
  note: ''
})

// 存储编辑前的原始值，用于确认对话框
const originalEditForm = reactive({
  is_enabled: 1,
  note: ''
})

const editRules = {
  is_enabled: [{ required: true, message: '请选择服务状态', trigger: 'change' }]
}

// 绑定模板对话框
const templateDialogVisible = ref(false)
const templateLoading = ref(false)
const templateFormRef = ref()
const templateForm = reactive({
  service_id: '',
  city_code: '',
  city_name: '',
  service_name: '',
  price_template_id: '',
  isUpdate: false // 标识是否为更新操作
})

const templateRules = {
  price_template_id: [{ required: true, message: '请选择价格模板', trigger: 'change' }]
}

// 批量配置对话框
const batchDialogVisible = ref(false)
const batchLoading = ref(false)
const batchFormRef = ref()
const batchForm = reactive({
  service_id: '',
  city_codes: [],
  is_enabled: 1,
  price_template_id: '',
  note: ''
})

const batchRules = {
  service_id: [{ required: true, message: '请选择服务', trigger: 'change' }],
  city_codes: [{ required: true, message: '请选择区域', trigger: 'change' }]
}



// 过滤空值参数的通用函数
const filterEmptyParams = (params) => {
  return Object.keys(params).reduce((acc, key) => {
    const value = params[key]
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}

// 初始化
const init = async () => {
  await Promise.all([
    getServiceOptions(),
    getCityOptions(),
    getTemplateOptions()
  ])
  _getData()
}

// 获取服务选项
const getServiceOptions = async () => {
  try {
    const res = await getServiceList({ page: 1, pageSize: 1000 })
    if (res.code === 0) {
      serviceOptions.value = res.data.list || []
    }
  } catch (error) {
    console.error('获取服务列表失败:', error)
  }
}

// 获取城市选项
const getCityOptions = async () => {
  try {
    const res = await getCityList({ page: 1, pageSize: 1000 })
    if (res.code === 0) {
      cityOptions.value = res.data|| []
    }
  } catch (error) {
    console.error('获取城市列表失败:', error)
  }
}

// 获取价格模板选项
const getTemplateOptions = async () => {
  try {
    const res = await getPriceTemplateList({ page: 1, pageSize: 1000 })
    if (res.code === 0) {
      templateOptions.value = res.data || []
    }
  } catch (error) {
    console.error('获取价格模板列表失败:', error)
  }
}

// 获取配置列表数据
const _getData = async () => {
  table_loading.value = true
  try {
    const filteredParams = filterEmptyParams(params)
    const res = await getServiceCitySettingsList(filteredParams)
    if (res.code === 0) {
      list.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    ElMessage.error('获取配置列表失败')
    console.error('获取配置列表失败:', error)
  } finally {
    table_loading.value = false
  }
}

// 搜索过滤
const handleFilter = () => {
  params.page = 1  // 重置到第一页
  _getData()
}

// 分页处理
const handleSizeChange = (val) => {
  params.pageSize = val
  params.page = 1  // 重置到第一页
  _getData()
}

const handleCurrentChange = (val) => {
  params.page = val
  _getData()
}

// 状态切换
const handleStatusChange = async (row) => {
  const newStatus = row.is_enabled
  const statusText = newStatus === 1 ? '启用' : '禁用'
  const actionText = newStatus === 1 ? '启用后，该城市的此服务将对用户开放' : '禁用后，该城市的此服务将不可用'
  
  try {
    // 先还原状态，等用户确认后再修改
    row.is_enabled = newStatus === 1 ? 0 : 1
    
    // 确认对话框
    await ElMessageBox.confirm(
      `确定要${statusText}「${row.city_name}」的「${row.service_name}」服务吗？\n${actionText}`, 
      `${statusText}服务确认`, 
      {
        confirmButtonText: `确定${statusText}`,
        cancelButtonText: '取消',
        type: newStatus === 1 ? 'success' : 'warning',
        distinguishCancelAndClose: true,
      }
    )
    
    // 用户确认后，恢复新状态并提交
    row.is_enabled = newStatus
    
    await updateServiceCitySettings(row.service_id, row.city_code, {
      is_enabled: row.is_enabled,
      note: row.note
    })
    
    ElMessage.success({
      message: `${statusText}成功！「${row.city_name}」的「${row.service_name}」服务已${statusText}`,
      duration: 3000,
    })
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      // 用户取消操作，状态已经还原，无需处理
      ElMessage.info('操作已取消')
    } else {
      // 操作失败，还原状态
      row.is_enabled = newStatus === 1 ? 0 : 1
      ElMessage.error({
        message: `${statusText}失败，请稍后重试`,
        duration: 3000,
      })
      console.error('状态更新失败:', error)
    }
  }
}

// 编辑配置
const handleEdit = (row) => {
  Object.assign(editForm, {
    service_id: row.service_id,
    city_code: row.city_code,
    city_name: row.city_name,
    service_name: row.service_name,
    is_enabled: row.is_enabled,
    note: row.note || ''
  })
  
  // 保存原始值用于确认对话框
  Object.assign(originalEditForm, {
    is_enabled: row.is_enabled,
    note: row.note || ''
  })
  
  editDialogVisible.value = true
}

// 绑定模板
const handleBindTemplate = (row) => {
  // 判断是否已绑定模板
  const isUpdate = !!row.template_name
  
  Object.assign(templateForm, {
    service_id: row.service_id,
    city_code: row.city_code,
    city_name: row.city_name,
    service_name: row.service_name,
    price_template_id: isUpdate ? row.template_id || '' : '',
    isUpdate: isUpdate
  })
  templateDialogVisible.value = true
}

// 批量配置
const handleBatchAdd = () => {
  Object.assign(batchForm, {
    service_id: '',
    city_codes: [],
    is_enabled: 1,
    price_template_id: '',
    note: ''
  })
  batchDialogVisible.value = true
}

// 城市选择相关方法
const handleSelectAllCities = () => {
  batchForm.city_codes = cityOptions.value.map(city => city.city_code)
  ElMessage.success(`已选择全部 ${cityOptions.value.length} 个城市`)
}

const handleClearCities = () => {
  batchForm.city_codes = []
  ElMessage.info('已清空城市选择')
}

const handleRemoveCity = (cityCode) => {
  const index = batchForm.city_codes.indexOf(cityCode)
  if (index > -1) {
    batchForm.city_codes.splice(index, 1)
  }
}

const getCityNameByCode = (cityCode) => {
  const city = cityOptions.value.find(city => city.city_code === cityCode)
  return city ? city.name : cityCode
}



// 编辑提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    
    // 检查是否有修改
    const isStatusChanged = editForm.is_enabled !== originalEditForm.is_enabled
    const isNoteChanged = editForm.note !== originalEditForm.note
    
    if (!isStatusChanged && !isNoteChanged) {
      ElMessage.info('没有检测到任何修改')
      return
    }
    
    // 构建确认信息
    let confirmMessage = `确定要保存对「${editForm.city_name}」的「${editForm.service_name}」服务配置的修改吗？\n\n修改内容：`
    
    if (isStatusChanged) {
      const oldStatusText = originalEditForm.is_enabled === 1 ? '启用' : '禁用'
      const newStatusText = editForm.is_enabled === 1 ? '启用' : '禁用'
      confirmMessage += `\n• 服务状态：${oldStatusText} → ${newStatusText}`
    }
    
    if (isNoteChanged) {
      const oldNote = originalEditForm.note || '(无)'
      const newNote = editForm.note || '(无)'
      confirmMessage += `\n• 备注信息：${oldNote} → ${newNote}`
    }
    
    // 确认对话框
    await ElMessageBox.confirm(
      confirmMessage,
      '保存修改确认',
      {
        confirmButtonText: '确定保存',
        cancelButtonText: '取消',
        type: 'warning',
        distinguishCancelAndClose: true,
      }
    )
    
    editLoading.value = true
    
    await updateServiceCitySettings(editForm.service_id, editForm.city_code, {
      is_enabled: editForm.is_enabled,
      note: editForm.note
    })
    
    ElMessage.success({
      message: `更新成功！「${editForm.city_name}」的「${editForm.service_name}」服务配置已保存`,
      duration: 3000,
    })
    
    editDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      ElMessage.info('操作已取消')
    } else if (error !== false) {
      ElMessage.error({
        message: '更新失败，请稍后重试',
        duration: 3000,
      })
      console.error('更新失败:', error)
    }
  } finally {
    editLoading.value = false
  }
}

// 删除配置
const handleDeleteConfig = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除「${editForm.city_name}」的「${editForm.service_name}」服务配置吗？\n删除后该城市的此服务将完全不可用，且相关的价格模板绑定也将被删除。`, 
      '删除服务配置确认', 
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        distinguishCancelAndClose: true,
      }
    )
    
    deleteLoading.value = true
    
    await deleteServiceCitySettings(editForm.service_id, editForm.city_code)
    
    ElMessage.success({
      message: `删除成功！「${editForm.city_name}」的「${editForm.service_name}」服务配置已删除`,
      duration: 3000,
    })
    
    editDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      ElMessage.info('操作已取消')
    } else {
      ElMessage.error({
        message: '删除失败，请稍后重试',
        duration: 3000,
      })
      console.error('删除服务配置失败:', error)
    }
  } finally {
    deleteLoading.value = false
  }
}

// 模板绑定提交
const handleTemplateSubmit = async () => {
  if (!templateFormRef.value) return
  
  try {
    await templateFormRef.value.validate()
    
    // 如果是重新绑定操作，显示确认对话框
    if (templateForm.isUpdate) {
      // 获取选中的模板名称
      const selectedTemplate = templateOptions.value.find(
        item => item.id === templateForm.price_template_id
      )
      const templateName = selectedTemplate ? selectedTemplate.name : '所选模板'
      
      await ElMessageBox.confirm(
        `确定要将「${templateForm.city_name}」的「${templateForm.service_name}」服务重新绑定到价格模板「${templateName}」吗？\n重新绑定后，原有的价格配置将被替换。`,
        '重新绑定价格模板确认',
        {
          confirmButtonText: '确定重新绑定',
          cancelButtonText: '取消',
          type: 'warning',
          distinguishCancelAndClose: true,
        }
      )
    }
    
    templateLoading.value = true
    
    const params = {
      service_id: templateForm.service_id,
      city_code: templateForm.city_code,
      price_template_id: templateForm.price_template_id
    }
    
    if (templateForm.isUpdate) {
      // 更新已有的模板绑定
      await updateServiceCityTemplate(templateForm.service_id, templateForm.city_code, {
        price_template_id: templateForm.price_template_id
      })
      ElMessage.success({
        message: `重新绑定成功！「${templateForm.city_name}」的「${templateForm.service_name}」服务已绑定新的价格模板`,
        duration: 3000,
      })
    } else {
      // 新建模板绑定
      await addServiceCityTemplate(params)
      ElMessage.success({
        message: `绑定成功！「${templateForm.city_name}」的「${templateForm.service_name}」服务已绑定价格模板`,
        duration: 3000,
      })
    }
    
    templateDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      ElMessage.info('操作已取消')
    } else if (error !== false) {
      const action = templateForm.isUpdate ? '重新绑定' : '绑定'
      ElMessage.error({
        message: `${action}失败，请稍后重试`,
        duration: 3000,
      })
      console.error(`${action}失败:`, error)
    }
  } finally {
    templateLoading.value = false
  }
}

// 批量配置提交
const handleBatchSubmit = async () => {
  if (!batchFormRef.value) return
  
  try {
    await batchFormRef.value.validate()
    batchLoading.value = true
    
    // 构建批量配置数据
    const settings = batchForm.city_codes.map(cityCode => ({
      service_id: batchForm.service_id,
      city_code: cityCode,
      is_enabled: batchForm.is_enabled,
      note: batchForm.note
    }))
    
    // 1. 首先更新服务城市设置
    await batchUpdateServiceCitySettings({ settings })
    
    // 2. 如果选择了价格模板，批量创建/更新模板绑定
    if (batchForm.price_template_id) {
      const templates = batchForm.city_codes.map(cityCode => ({
        service_id: batchForm.service_id,
        city_code: cityCode,
        price_template_id: batchForm.price_template_id
      }))
      
      await batchUpdateServiceCityTemplates({ templates })
    }
    
    ElMessage.success('批量配置成功')
    batchDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('批量配置失败')
      console.error('批量配置失败:', error)
    }
  } finally {
    batchLoading.value = false
  }
}

// 查看价格模板详情
const handleViewPriceTemplate = (row) => {
  if (row.template_id) {
    // 使用 router.push 跳转到价格模板详情页面
    router.push(`/service/price-template/detail/${row.template_id}`)
  } else {
    ElMessage.warning('该配置未绑定价格模板')
  }
}

// 查看服务详情
const handleViewService = (row) => {
  if (row.service_id) {
    // 使用 router.push 跳转到服务详情页面
    router.push(`/service/detail/${row.service_id}`)
  } else {
    ElMessage.warning('服务信息不完整')
  }
}

// 对话框关闭处理
const handleEditDialogClose = (done) => {
  done()
}

const handleTemplateDialogClose = (done) => {
  done()
}

const handleBatchDialogClose = (done) => {
  done()
}



// 组件挂载时初始化
onMounted(() => {
  init()
})
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  margin: 0;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

.template-name {
  color: #409EFF;
  font-weight: 500;
}

.template-link, .service-link {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.template-link:hover {
  background-color: #ecf5ff;
  color: #337ecc;
  text-decoration: underline;
}

.service-link {
  color: #409EFF;
  font-weight: 500;
}

.service-link:hover {
  background-color: #ecf5ff;
  color: #337ecc;
  text-decoration: underline;
}

.no-template {
  color: #909399;
  font-style: italic;
}

.price-text {
  color: #f56c6c;
  font-weight: 600;
}

.no-price {
  color: #909399;
  font-style: italic;
}

.note-text {
  color: #606266;
  font-size: 12px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.no-note {
  color: #909399;
  font-style: italic;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer-left {
  flex: none;
}

.dialog-footer-right {
  display: flex;
  gap: 12px;
}

.page-container {
  margin-top: 20px;
  text-align: right;
}

/* 城市选择组件样式 */
.city-select-container {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafbfc;
  transition: all 0.3s ease;
}

.city-select-container:hover {
  border-color: #409eff;
}

.city-select-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.selected-count {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.total-count {
  color: #909399;
  font-size: 13px;
  margin-left: 4px;
}

.city-select-actions {
  display: flex;
  margin-left: 30px;
}

.select-wrapper {
  margin-bottom: 12px;
}

.selected-cities-display {
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #d0d7de;
  min-height: 50px;
  margin-bottom: 12px;
}

.cities-display-header {
  margin-bottom: 8px;
}

.cities-display-title {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.selected-cities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 150px;
  overflow-y: auto;
  padding: 2px;
}

.selected-cities-tags::-webkit-scrollbar {
  width: 6px;
}

.selected-cities-tags::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.selected-cities-tags::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.selected-cities-tags::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.city-tag {
  margin: 0;
  font-size: 12px;
  padding: 4px 8px;
  background-color: #e8f4fd;
  border-color: #b3d8ff;
  color: #409eff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.city-tag:hover {
  background-color: #d1ecf1;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

.empty-state {
  padding: 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #d0d7de;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 13px;
  color: #909399;
  font-style: italic;
}

/* 下拉框弹出层样式 */
:deep(.city-select-popper) {
  max-height: 300px;
}

:deep(.city-select-popper .el-select-dropdown__item) {
  padding: 8px 12px;
  font-size: 13px;
}

:deep(.city-select-popper .el-select-dropdown__item.selected) {
  background-color: #e8f4fd;
  color: #409eff;
  font-weight: 500;
}
</style> 