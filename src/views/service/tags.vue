<template>
  <div class="app-container">
    <div class="page-header">
      <div class="header-left">
        <span class="page-title">服务标签管理</span>
      </div>
      <div class="header-actions">
        <el-button type="success" @click="handleBatchImport" v-permission="'service-tags-batch-import'">
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button type="primary" @click="handleAdd" v-permission="'service-tags-add'">
          <el-icon><Plus /></el-icon>
          添加标签
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="标签名称">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入标签名称"
            style="width: 200px"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select 
            v-model="searchForm.tag_type" 
            placeholder="请选择类型" 
            style="width: 150px"
            clearable
          >
            <el-option label="全部" :value="0" />
            <el-option label="服务类" :value="1" />
            <el-option label="娱乐类" :value="2" />
            <el-option label="运动类" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 批量操作栏 -->
    <el-card v-if="selectedTags.length > 0" class="batch-actions-card">
      <div class="batch-actions">
        <span class="selected-info">已选择 {{ selectedTags.length }} 个标签</span>
        <div class="actions">
          <el-button 
            type="warning" 
            size="small" 
            @click="handleBatchDelete"
            v-permission="'service-tags-batch-delete'"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button size="small" @click="clearSelection">取消选择</el-button>
        </div>
      </div>
    </el-card>

    <!-- 标签列表 - 表格视图 -->

      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tagList"
        border
        style="width: 100%"
        empty-text="暂无数据"
        @selection-change="handleSelectionChange"
        row-key="id"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="tag_name" label="标签名称" min-width="150">
          <template #default="{ row }">
            <div class="tag-name-cell">
              <el-tag 
                :type="getTagTypeColor(row.tag_type)" 
                size="small"
                round
              >
                {{ row.tag_name }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tag_type" label="标签类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTagTypeColor(row.tag_type)" effect="light">
              {{ getTagTypeName(row.tag_type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序" width="100">
          <template #default="{ row }">
            <span>{{ row.sort_order }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            <div class="time-cell">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatDate(row.created_at) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              @click="handleEdit(row)"
              v-permission="'service-tags-edit'"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button 
              type="danger" 
              size="small" 
              @click="handleDelete(row)"
              v-permission="'service-tags-delete'"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
   

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑标签' : '添加标签'"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="标签名称" prop="tag_name">
          <el-input
            v-model="form.tag_name"
            placeholder="请输入标签名称"
            maxlength="50"
            show-word-limit
          >
            <template #prefix>
              <el-icon><PriceTag /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="标签类型" prop="tag_type">
          <el-select v-model="form.tag_type" placeholder="请选择类型" style="width: 100%">
            <el-option label="服务类" :value="1">
              <div class="option-item">
                <el-tag type="primary" size="small">服务类</el-tag>
                <span>提供各种服务的标签</span>
              </div>
            </el-option>
            <el-option label="娱乐类" :value="2">
              <div class="option-item">
                <el-tag type="success" size="small">娱乐类</el-tag>
                <span>娱乐活动相关的标签</span>
              </div>
            </el-option>
            <el-option label="运动类" :value="3">
              <div class="option-item">
                <el-tag type="warning" size="small">运动类</el-tag>
                <span>运动健身相关的标签</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number
            v-model="form.sort_order"
            :min="0"
            :max="999"
            style="width: 100%"
            placeholder="数值越小越靠前"
          />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            排序值越小越靠前显示，0表示最高优先级
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入标签"
      width="600px"
      @close="handleImportDialogClose"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <div class="import-tips">
              <p>1. 请按照格式：标签名称,类型,排序 每行一个标签</p>
              <p>2. 类型：1=服务类，2=娱乐类，3=运动类</p>
              <p>3. 排序：数字越小越靠前，默认为0</p>
              <p>4. 示例：礼仪模特,1,10</p>
            </div>
          </template>
        </el-alert>
        
        <el-form-item label="导入内容" style="margin-top: 20px;">
          <el-input
            v-model="importContent"
            type="textarea"
            :rows="8"
            placeholder="请输入要导入的标签内容，每行一个标签&#10;格式：标签名称,类型,排序&#10;例如：&#10;礼仪模特,1,10&#10;唱歌,2,20&#10;篮球,3,30"
          />
        </el-form-item>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="importing" @click="handleConfirmImport">
            <el-icon><Upload /></el-icon>
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Search,
  Upload,
  Delete,
  Edit,
  Calendar,
  PriceTag,
  InfoFilled,
  Check
} from '@element-plus/icons-vue'
import { 
  getServiceTags,
  createServiceTag,
  updateServiceTag,
  deleteServiceTag 
} from '@/api/service'

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const importing = ref(false)
const dialogVisible = ref(false)
const importDialogVisible = ref(false)
const isEdit = ref(false)
const tagList = ref([])
const selectedTags = ref([])
const importContent = ref('')

// 搜索表单
const searchForm = reactive({
  keyword: '',
  tag_type: 0
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 表单引用
const formRef = ref(null)
const tableRef = ref(null)

// 表单数据
const form = reactive({
  id: null,
  tag_name: '',
  tag_type: 1,
  sort_order: 0
})

// 表单验证规则
const rules = {
  tag_name: [
    { required: true, message: '请输入标签名称', trigger: 'blur' },
    { min: 1, max: 50, message: '标签名称长度在1-50个字符之间', trigger: 'blur' }
  ],
  tag_type: [
    { required: true, message: '请选择标签类型', trigger: 'change' }
  ],
  sort_order: [
    { required: true, message: '请输入排序值', trigger: 'blur' }
  ]
}

// 计算属性
const selectedTagIds = computed(() => selectedTags.value.map(tag => tag.id))

// 获取标签类型名称
const getTagTypeName = (type) => {
  const typeMap = {
    1: '服务类',
    2: '娱乐类',
    3: '运动类'
  }
  return typeMap[type] || '未知'
}

// 获取标签类型颜色
const getTagTypeColor = (type) => {
  const colorMap = {
    1: 'primary',
    2: 'success',
    3: 'warning'
  }
  return colorMap[type] || 'info'
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取标签列表
const getTagList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize
    }
    
    // 如果tag_type为0，则不传递该参数
    if (params.tag_type === 0) {
      delete params.tag_type
    }

    const res = await getServiceTags(params)
    if (res.code === 0) {
      tagList.value = res.data.list || []
      pagination.total = res.data.total || 0
    } else {
      ElMessage.error(res.msg || '获取标签列表失败')
    }
  } catch (error) {
    ElMessage.error('获取标签列表失败')
    console.error('获取标签列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  clearSelection()
  getTagList()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.tag_type = 0
  pagination.page = 1
  clearSelection()
  getTagList()
}

// 分页处理
const handleSizeChange = (newSize) => {
  pagination.pageSize = newSize
  pagination.page = 1
  clearSelection()
  getTagList()
}

const handleCurrentChange = (newPage) => {
  pagination.page = newPage
  clearSelection()
  getTagList()
}

// 选择处理
const handleSelectionChange = (selection) => {
  selectedTags.value = selection
}

const clearSelection = () => {
  selectedTags.value = []
  if (tableRef.value) {
    tableRef.value.clearSelection()
  }
}

// 添加标签
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row) => {
  isEdit.value = true
  form.id = row.id
  form.tag_name = row.tag_name
  form.tag_type = row.tag_type
  form.sort_order = row.sort_order
  dialogVisible.value = true
}

// 删除标签
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签"${row.tag_name}"吗？删除后不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteServiceTag(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      getTagList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除标签失败:', error)
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedTags.value.length === 0) {
    ElMessage.warning('请先选择要删除的标签')
    return
  }

  try {
    const tagNames = selectedTags.value.map(tag => tag.tag_name).join('、')
    await ElMessageBox.confirm(
      `确定要删除以下 ${selectedTags.value.length} 个标签吗？\n${tagNames}`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 这里应该调用批量删除API，目前用循环删除代替
    const deletePromises = selectedTags.value.map(tag => deleteServiceTag(tag.id))
    await Promise.all(deletePromises)
    
    ElMessage.success(`成功删除 ${selectedTags.value.length} 个标签`)
    clearSelection()
    getTagList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除失败:', error)
    }
  }
}

// 批量导入
const handleBatchImport = () => {
  importContent.value = ''
  importDialogVisible.value = true
}

const handleConfirmImport = async () => {
  if (!importContent.value.trim()) {
    ElMessage.warning('请输入要导入的内容')
    return
  }

  importing.value = true
  try {
    const lines = importContent.value.trim().split('\n')
    const importData = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const parts = line.split(',')
      if (parts.length !== 3) {
        ElMessage.error(`第 ${i + 1} 行格式错误，应为：标签名称,类型,排序`)
        return
      }
      
      const [tagName, tagType, sortOrder] = parts
      importData.push({
        tag_name: tagName.trim(),
        tag_type: parseInt(tagType.trim()),
        sort_order: parseInt(sortOrder.trim()) || 0
      })
    }
    
    // 这里应该调用批量导入API，目前用循环创建代替
    const createPromises = importData.map(data => createServiceTag(data))
    await Promise.all(createPromises)
    
    ElMessage.success(`成功导入 ${importData.length} 个标签`)
    importDialogVisible.value = false
    getTagList()
  } catch (error) {
    ElMessage.error('导入失败')
    console.error('批量导入失败:', error)
  } finally {
    importing.value = false
  }
}

const handleImportDialogClose = () => {
  importContent.value = ''
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true

    const data = {
      tag_name: form.tag_name,
      tag_type: form.tag_type,
      sort_order: form.sort_order
    }

    let res
    if (isEdit.value) {
      res = await updateServiceTag(form.id, data)
    } else {
      res = await createServiceTag(data)
    }

    if (res.code === 0) {
      ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
      dialogVisible.value = false
      getTagList()
    } else {
      ElMessage.error(res.msg || (isEdit.value ? '更新失败' : '创建失败'))
    }
  } catch (error) {
    if (error !== false) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      console.error('提交表单失败:', error)
    }
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  form.id = null
  form.tag_name = ''
  form.tag_type = 1
  form.sort_order = 0
}

// 对话框关闭处理
const handleDialogClose = () => {
  resetForm()
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getTagList()
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-card .el-form {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.batch-actions-card {
  margin-bottom: 20px;
  background: linear-gradient(90deg, #e8f3ff 0%, #f0f9ff 100%);
  border: 1px solid #b3d8ff;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-info {
  color: #409eff;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 10px;
}

.table-card {
  margin-bottom: 20px;
}

.tag-name-cell {
  display: flex;
  align-items: center;
}

.time-cell {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  text-align: right;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.import-content {
  padding: 0 4px;
}

.import-tips {
  line-height: 1.6;
}

.import-tips p {
  margin: 4px 0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .header-left {
    width: 100%;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .search-card .el-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-card .el-form-item {
    margin-bottom: 10px;
  }
  
  .batch-actions {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
}
</style> 