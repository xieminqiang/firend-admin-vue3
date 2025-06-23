<template>
  <div class="app-container">
    <p class="page-title">话题管理</p>
    <div class="filter-container">
      <el-input
        v-model="searchParams.parent_id"
        placeholder="话题PID"
        class="filter-item"
        clearable
        style="width: 200px"
      />
      <el-input
        v-model="searchParams.topic_id"
        placeholder="话题ID"
        class="filter-item"
        clearable
        style="width: 200px"
      />
      <el-button
        type="primary"
        :icon="ElIconSearch"
        class="filter-item"
        @click="handleSearch"
        :loading="loading.search"
      >
        搜索
      </el-button>
      <el-button
        type="primary"
        :icon="ElIconPlus"
        class="filter-item"
        @click="handleAdd"
        :loading="loading.add"
      >
        添加话题
      </el-button>
    </div>
    <el-table
      v-loading="loading.table"
      element-loading-text="加载中..."
      border
      :data="topicList"
    >
      <el-table-column
        label="话题PID"
        prop="parent_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="话题ID"
        prop="topic_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="话题描述"
        prop="topic_desc"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="话题图标"
        prop="topic_icon"
        align="center"
        width="100px"
      >
        <template #default="{ row }">
          <el-avatar
            v-if="row.topic_icon"
            shape="square"
            :src="row.topic_icon"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" width="120px" label="操作">
        <template #default="{ row, $index }">
          <el-button
            size="small"
            type="danger"
            @click="handleDelete($index, row)"
            :loading="loading.delete"
            round
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search as ElIconSearch, Plus as ElIconPlus } from '@element-plus/icons-vue'
import { queryTopicPage, deleteTopic } from '@/api/moment'

// 定义响应式数据
const router = useRouter()
const topicList = ref([])

// 搜索参数
const searchParams = reactive({
  parent_id: '',
  topic_id: '',
})

// 分页参数
const pagination = reactive({
  current: 1,
  size: 20,
  total: 0
})

// 加载状态
const loading = reactive({
  table: false,
  search: false,
  add: false,
  delete: false
})

// 计算属性 - 获取请求参数
const requestParams = computed(() => ({
  page: pagination.current,
  pageSize: pagination.size,
  ...searchParams
}))

// 获取话题列表数据
const fetchTopicList = async () => {
  try {
    loading.table = true
    const response = await queryTopicPage(requestParams.value)
    
    if (response.code === 0) {
      topicList.value = response.data.list || []
      pagination.total = response.data.total || 0
      pagination.size = response.data.per_page || 20
      pagination.current = response.data.page || 1
    }
  } catch (error) {
    ElMessage.error('获取话题列表失败：' + (error.message || '未知错误'))
    console.error('获取话题列表失败:', error)
  } finally {
    loading.table = false
  }
}

// 搜索话题
const handleSearch = async () => {
  try {
    loading.search = true
    pagination.current = 1 // 重置到第一页
    await fetchTopicList()
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.search = false
  }
}

// 添加话题
const handleAdd = async () => {
  try {
    loading.add = true
    await router.push('/topic/add')
  } catch (error) {
    ElMessage.error('跳转失败')
  } finally {
    loading.add = false
  }
}

// 删除话题
const handleDelete = async (index, topic) => {
  try {
    await ElMessageBox.confirm(
      '删除话题不可恢复',
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.delete = true
    const response = await deleteTopic({ topic_id: topic.topic_id })
    
    if (response.msg) {
      ElMessage.success(response.msg)
      topicList.value.splice(index, 1)
      pagination.total--
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除话题失败：' + (error.message || '未知错误'))
      console.error('删除话题失败:', error)
    }
  } finally {
    loading.delete = false
  }
}

// 处理页面大小变化
const handleSizeChange = (newSize) => {
  pagination.size = newSize
  pagination.current = 1
  fetchTopicList()
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  pagination.current = newPage
  fetchTopicList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTopicList()
})

// 导出供模板使用的变量和方法
defineExpose({
  fetchTopicList,
  handleSearch
})
</script>

<style lang="scss" scoped>
.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  .filter-item {
    margin: 0;
  }
}

.page-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}
</style>
