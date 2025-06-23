<template>
  <div class="app-container">
    <p class="page-title">城市服务配置</p>

    <!-- 搜索和操作区域 -->
    <div class="filter-container">
      <el-input
        v-model="params.keyword"
        placeholder="搜索城市或服务名称"
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
        placeholder="选择城市"
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
      <el-button
        type="warning"
        :icon="ElIconCopyDocument"
        class="filter-item"
        @click="handleCopyConfig"
      >
        复制配置
      </el-button>
      <el-button
        type="info"
        class="filter-item"
        @click="handleViewTemplatesList"
      >
        查看模板绑定
      </el-button>
    </div>

    <!-- 配置列表表格 -->
    <el-table
      v-loading="table_loading"
      :data="list"
      border
      element-loading-text="加载中..."
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="城市代码" prop="city_code" align="center" width="100" />
      <el-table-column label="城市名称" prop="city_name" align="center" width="120" />
      <el-table-column label="服务名称" prop="service_name" align="center" min-width="150" />
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
          <span v-if="scope.row.template_name" class="template-name">
            {{ scope.row.template_name }}
          </span>
          <span v-else class="no-template">未绑定</span>
        </template>
      </el-table-column>
      <el-table-column label="最低价格" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.template_min_price" class="price-text">
            ¥{{ scope.row.template_min_price }}
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
          <el-button size="small" type="success" @click="handleBindTemplate(scope.row)">
            绑定模板
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
      title="编辑城市服务配置"
      width="600px"
      :before-close="handleEditDialogClose"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
      >
        <el-form-item label="城市名称">
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
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit" :loading="editLoading">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 绑定模板对话框 -->
    <el-dialog
      v-model="templateDialogVisible"
      title="绑定价格模板"
      width="500px"
      :before-close="handleTemplateDialogClose"
    >
      <el-form
        ref="templateFormRef"
        :model="templateForm"
        :rules="templateRules"
        label-width="100px"
      >
        <el-form-item label="城市名称">
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
      title="批量配置城市服务"
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
        <el-form-item label="选择城市" prop="city_codes">
          <el-select
            v-model="batchForm.city_codes"
            placeholder="请选择城市"
            style="width: 100%;"
            multiple
            collapse-tags
            collapse-tags-tooltip
          >
            <el-option
              v-for="item in cityOptions"
              :key="item.city_code"
              :label="item.name"
              :value="item.city_code"
            />
          </el-select>
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

    <!-- 服务城市模板列表对话框 -->
    <el-dialog
      v-model="templatesListDialogVisible"
      title="服务城市模板绑定列表"
      width="1000px"
      :before-close="handleTemplatesListDialogClose"
    >
      <!-- 模板列表搜索区域 -->
      <div class="filter-container" style="margin-bottom: 20px;">
        <el-select
          v-model="templatesParams.service_id"
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
          v-model="templatesParams.price_template_id"
          placeholder="选择价格模板"
          style="width: 200px;"
          clearable
        >
          <el-option
            v-for="item in templateOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          type="primary"
          :icon="ElIconSearch"
          class="filter-item"
          @click="handleTemplatesFilter"
        >
          搜索
        </el-button>
      </div>

      <!-- 模板列表表格 -->
      <el-table
        v-loading="templatesTableLoading"
        :data="templatesList"
        border
        element-loading-text="加载中..."
        style="width: 100%"
      >
        <el-table-column label="城市代码" prop="city_code" align="center" width="100" />
        <el-table-column label="城市名称" prop="city_name" align="center" width="120" />
        <el-table-column label="服务名称" prop="service_name" align="center" min-width="150" />
        <el-table-column label="模板名称" prop="template_name" align="center" min-width="150" />
        <el-table-column label="模板单位" prop="template_unit" align="center" width="100" />
        <el-table-column label="最低价格" align="center" width="120">
          <template v-slot="scope">
            <span class="price-text">¥{{ scope.row.template_min_price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="160" />
      </el-table>



      <template #footer>
        <div class="dialog-footer">
          <el-button @click="templatesListDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search as ElIconSearch, 
  Plus as ElIconPlus, 
  CopyDocument as ElIconCopyDocument 
} from '@element-plus/icons-vue'
import { getServiceList } from '@/api/service'
import { getPriceTemplateList } from '@/api/service'
import { 
  getCityList,
  getServiceCitySettingsList,
  updateServiceCitySettings,
  addServiceCitySettings,
  batchUpdateServiceCitySettings,
  addServiceCityTemplate,
  updateServiceCityTemplate,
  getServiceCityTemplatesList
} from '@/api/cityService'

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
const selectedRows = ref([])

// 选项数据
const serviceOptions = ref([])
const cityOptions = ref([])
const templateOptions = ref([])

// 编辑对话框
const editDialogVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref()
const editForm = reactive({
  service_id: '',
  city_code: '',
  city_name: '',
  service_name: '',
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
  price_template_id: ''
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
  city_codes: [{ required: true, message: '请选择城市', trigger: 'change' }]
}

// 服务城市模板列表对话框
const templatesListDialogVisible = ref(false)
const templatesTableLoading = ref(false)
const templatesParams = reactive({
  service_id: '',
  price_template_id: '',
})
const templatesList = ref([])

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
  try {
    await updateServiceCitySettings(row.service_id, row.city_code, {
      is_enabled: row.is_enabled,
      note: row.note
    })
    
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 还原状态
    row.is_enabled = row.is_enabled === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
    console.error('状态更新失败:', error)
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
  editDialogVisible.value = true
}

// 绑定模板
const handleBindTemplate = (row) => {
  Object.assign(templateForm, {
    service_id: row.service_id,
    city_code: row.city_code,
    city_name: row.city_name,
    service_name: row.service_name,
    price_template_id: ''
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

// 复制配置
const handleCopyConfig = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要复制的配置')
    return
  }
  
  ElMessage.info('复制配置功能开发中...')
}

// 查看模板列表
const handleViewTemplatesList = () => {
  // 重置搜索参数
  Object.assign(templatesParams, {
    service_id: '',
    price_template_id: '',
  })
  
  templatesListDialogVisible.value = true
  _getTemplatesData()
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 编辑提交
const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    editLoading.value = true
    
    await updateServiceCitySettings(editForm.service_id, editForm.city_code, {
      is_enabled: editForm.is_enabled,
      note: editForm.note
    })
    
    ElMessage.success('更新成功')
    editDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('更新失败')
      console.error('更新失败:', error)
    }
  } finally {
    editLoading.value = false
  }
}

// 模板绑定提交
const handleTemplateSubmit = async () => {
  if (!templateFormRef.value) return
  
  try {
    await templateFormRef.value.validate()
    templateLoading.value = true
    
    await addServiceCityTemplate({
      service_id: templateForm.service_id,
      city_code: templateForm.city_code,
      price_template_id: templateForm.price_template_id
    })
    
    ElMessage.success('绑定成功')
    templateDialogVisible.value = false
    _getData()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('绑定失败')
      console.error('绑定失败:', error)
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
    
    await batchUpdateServiceCitySettings({ settings })
    
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

// 服务城市模板列表相关方法
const handleTemplatesFilter = () => {
  _getTemplatesData()
}

const _getTemplatesData = async () => {
  templatesTableLoading.value = true
  try {
    const filteredParams = filterEmptyParams(templatesParams)
    // 为模板列表也添加默认分页参数
    if (!filteredParams.page) filteredParams.page = 1
    if (!filteredParams.pageSize) filteredParams.pageSize = 10
    const res = await getServiceCityTemplatesList(filteredParams)
    if (res.code === 0) {
      templatesList.value = res.data.list || []
    }
  } catch (error) {
    ElMessage.error('获取模板列表失败')
    console.error('获取模板列表失败:', error)
  } finally {
    templatesTableLoading.value = false
  }
}

const handleTemplatesListDialogClose = (done) => {
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
  text-align: right;
}

.page-container {
  margin-top: 20px;
  text-align: right;
}
</style> 