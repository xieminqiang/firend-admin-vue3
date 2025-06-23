<template>
  <div class="app-container">
    <p class="page-title">等级价格管理</p>

    <!-- 搜索和操作区域 -->
    <div class="filter-container">
      <el-input
        v-model="params.keyword"
        placeholder="请输入模板名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button
        type="primary"
        :icon="ElIconSearch"
        class="filter-item"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        :icon="ElIconPlus"
        class="filter-item"
        @click="handleAdd"
      >
        添加模板
      </el-button>
    </div>

    <!-- 价格模板列表表格 -->
    <el-table
      v-loading="table_loading"
      :data="list"
      border
      element-loading-text="加载中..."
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column
        label="模板名称"
        prop="name"
        align="center"
        min-width="200"
      >
        <template v-slot="scope">
          <span 
            class="template-name-link" 
            @click="handleDetail(scope.row)"
          >
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="最小购买数量"
        prop="min_quantity"
        align="center"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.min_quantity || 1 }}
        </template>
      </el-table-column>
      <el-table-column
        label="计费单位"
        prop="unit"
        align="center"
        width="100"
      >
        <template v-slot="scope">
          {{ scope.row.unit || '小时' }}
        </template>
      </el-table-column>
      <el-table-column
        label="最低价格"
        prop="min_price"
        align="center"
        width="120"
      >
        <template v-slot="scope">
          <span class="price-text">¥{{ scope.row.min_price || '0.00' }}</span>
        </template>
      </el-table-column>
     
      <el-table-column
        label="创建时间"
        prop="created_at"
        align="center"
        width="160"
      >
        <template v-slot="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        prop="updated_at"
        align="center"
        width="160"
      >
        <template v-slot="scope">
          {{ formatDate(scope.row.updated_at) }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="220px" label="操作">
        <template v-slot="scope">
          <el-button 
            size="mini" 
            type="success" 
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button 
            size="mini" 
            type="warning" 
            @click="handleSyncServices(scope.row)"
            :loading="scope.row.syncing"
          >
            同步价格
          </el-button>
          <!-- <el-button 
            size="mini" 
            type="danger" 
            @click="handleDelete(scope.row)"
          >
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="page-container">
      <el-pagination
        background
        v-model:current-page="params.page"
        :page-sizes="page_sizes"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search as ElIconSearch, Plus as ElIconPlus } from '@element-plus/icons-vue'
import { getPriceTemplateList, deletePriceTemplate, syncServiceMinPricesForTemplate } from '@/api/service'

// 响应式数据
const router = useRouter()
const table_loading = ref(false)
const list = ref([])
const total = ref(0)
const page_sizes = [10, 20, 50, 100]

const params = reactive({
  keyword: '',
  page: 1,
  pageSize: 10,
})

// 方法
const init = async () => {
  await _getData()
}

// 获取价格模板列表数据
const _getData = async () => {
  table_loading.value = true
  try {
    const res = await getPriceTemplateList(params)
    if (res.code === 0) {
      list.value = res.data || []
      total.value = res.data?.length || 0
    }
  } catch (error) {
    ElMessage.error('获取价格模板列表失败')
    console.error('获取价格模板列表失败:', error)
  } finally {
    table_loading.value = false
  }
}

// 搜索过滤
const handleFilter = () => {
  params.page = 1
  _getData()
}

// 添加模板
const handleAdd = () => {
  router.push('/service/price-template/add')
}

// 编辑模板
const handleEdit = (row) => {
  router.push(`/service/price-template/edit/${row.id}`)
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/service/price-template/detail/${row.id}`)
}

// 删除模板
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除这个价格模板吗？删除后不可恢复。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    const res = await deletePriceTemplate(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      _getData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除价格模板失败:', error)
    }
  }
}

// 同步服务价格
const handleSyncServices = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要同步价格模板「${row.name}」相关服务的最低价格吗？\n这将根据模板的1级价格更新所有关联服务的最低价格。`, 
      '同步价格确认', 
      {
        confirmButtonText: '确定同步',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    // 设置加载状态
    row.syncing = true
    
    const res = await syncServiceMinPricesForTemplate(row.id)
    if (res.code === 0) {
      const data = res.data
      ElMessage.success({
        message: data.message || `同步成功！已更新 ${data.updated_services_count} 个服务的最低价格`,
        duration: 3000,
      })
    } else {
      ElMessage.error(res.message || '同步失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('同步失败')
      console.error('同步服务价格失败:', error)
    }
  } finally {
    // 清除加载状态
    row.syncing = false
  }
}

// 分页处理
const handleSizeChange = (val) => {
  params.pageSize = val
  _getData()
}

const handleCurrentChange = (val) => {
  params.page = val
  _getData()
}

// 格式化时间
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 生命周期
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

.template-name-link {
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.template-name-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style> 