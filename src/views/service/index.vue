<template>
  <div class="app-container">
    <p class="page-title">服务列表</p>

    <!-- 搜索和操作区域 -->
    <div class="filter-container">
      <el-input
        v-model="params.keyword"
        placeholder="请输入服务名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="params.category_id"
        placeholder="服务分类"
        style="width: 200px;"
      
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
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
        type="primary"
        :icon="ElIconPlus"
        class="filter-item"
        @click="handleAdd"
      >
        添加服务
      </el-button>
    </div>

    <!-- 服务列表表格 -->
    <el-table
      v-loading="table_loading"
      :data="list"
      border
      element-loading-text="加载中..."
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="图片" align="center" width="100">
        <template v-slot="scope">
          <div class="image-cell">
            <el-image
              v-if="scope.row.image_url"
              :src="$getImageUrl(scope.row.image_url)"
              :preview-src-list="[$getImageUrl(scope.row.image_url)]"
              :preview-teleported="true"
              alt="服务图片"
              class="service-thumbnail"
              fit="cover"
            >
              <template #placeholder>
                <div class="image-placeholder">
                  <el-icon size="16" color="#c0c4cc">
                    <Picture />
                  </el-icon>
                </div>
              </template>
              <template #error>
                <div class="image-error">
                  <el-icon size="16" color="#c0c4cc">
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="no-image">
              <el-icon size="16" color="#d3d3d3">
                <Picture />
              </el-icon>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="服务名称"
        prop="name"
        align="center"
        min-width="150"
      >
        <template v-slot="scope">
          <span 
            class="service-name-link" 
            @click="handleDetail(scope.row)"
          >
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="服务分类"
        prop="category_name"
        align="center"
        width="120"
      />

      <el-table-column label="状态" prop="status" align="center" width="90">
        <template v-slot="scope">
          <el-tag
            :type="scope.row.status === 1 ? 'success' : 'danger'"
            size="small"
          >
            {{ scope.row.status === 1 ? '已启用' : '已关闭' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="created_at"
        align="center"
        width="160"
      />

      <el-table-column align="center" width="120px" label="操作">
        <template v-slot="scope">
          <!-- <el-button  size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->

          <el-button size="mini" type="success" @click="handleEdit(scope.row)">
            编辑
          </el-button>
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
import { ElMessage } from 'element-plus'
import { Search as ElIconSearch, Plus as ElIconPlus, Picture } from '@element-plus/icons-vue'
import { getServiceList, getServiceCategories } from '@/api/service'
import checkPermission from '@/utils/permission'

// 路由
const router = useRouter()

// 响应式数据
const params = reactive({
        keyword: '',
        category_id: '',
        page: 1,
        pageSize: 20,
})

const categoryOptions = ref([])
const list = ref([])
const total = ref(0)
const table_loading = ref(false)
const page_sizes = ref([10, 20, 50, 100])

// 初始化
const init = async () => {
  await getCategories()
  _getData()
}

    // 获取服务分类
const getCategories = async () => {
      try {
        const res = await getServiceCategories()
        if (res.code === 0) {
      categoryOptions.value = res.data || []
        }
      } catch (error) {
        console.error('获取服务分类失败:', error)
      }
}

    // 获取服务列表数据
const _getData = async () => {
  table_loading.value = true
      try {
    const res = await getServiceList(params)
        if (res.code === 0) {
      list.value = res.data.list || []
      total.value = res.data.total || 0
      params.page = res.data.page || 1
        }
      } catch (error) {
    ElMessage.error('获取服务列表失败')
        console.error('获取服务列表失败:', error)
      } finally {
    table_loading.value = false
  }
      }

    // 搜索过滤
const handleFilter = () => {
  params.page = 1
  _getData()
}

    // 添加服务
const handleAdd = () => {
      // 临时移除权限检查
      // if (!checkPermission('service-add')) {
  //   ElMessage.error('您没有添加服务的权限')
      //   return
      // }
  router.push('/service/add')
}

    // 查看详情
const handleDetail = (row) => {
  router.push(`/service/detail/${row.id}`)
}

    // 编辑服务
const handleEdit = (row) => {
      // 临时移除权限检查
      // if (!checkPermission('service-edit')) {
  //   ElMessage.error('您没有编辑服务的权限')
      //   return
      // }
  router.push(`/service/edit/${row.id}`)
}

// 分页相关方法
const handleSizeChange = (newSize) => {
  params.pageSize = newSize
  params.page = 1
  _getData()
}

const handleCurrentChange = (newPage) => {
  params.page = newPage
  _getData()
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

.service-name-link {
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.service-name-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.price-text {
  color: #f56c6c;
  font-weight: 600;
}

/* 图片相关样式 */
.image-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.service-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-thumbnail:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-placeholder,
.image-error,
.no-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: #f5f7fa;
  border: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
