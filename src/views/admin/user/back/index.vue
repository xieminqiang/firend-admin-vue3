<template>
  <div class="app-container">
    <p class="page-title">用户列表</p>
    <div class="filter-container">
      <el-button
        v-permission="`admin-user-add`"
        type="primary"
        plain
        class="filter-item"
        @click="addUser"
        :loading="loading.add"
      >
        添加用户
      </el-button>
      <div style="float: right; display: flex">
        <el-input
          v-model="searchParams.name"
          placeholder="姓名|手机号"
          style="width: 200px; margin: 0 3px"
          class="filter-item"
          @keyup.enter="handleSearch"
          clearable
        />
        <el-button 
          type="primary" 
          class="filter-item" 
          @click="handleSearch"
          :loading="loading.search"
        >
          搜索
        </el-button>
      </div>
    </div>
    
    <el-table
      v-loading="loading.table"
      element-loading-text="加载中..."
      border
      :data="userList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="60px" />
      <el-table-column align="center" label="用户名" prop="user_name" />
      <el-table-column align="center" label="手机号" prop="tel" />
      <el-table-column align="center" label="真实姓名" prop="real_name" />
      <el-table-column align="center" label="所属角色">
        <template #default="{ row }">
          <el-tag 
            v-for="(role, index) in row.roles" 
            :key="index" 
            type="success"
            class="mr-1"
          >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.status == 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">停封</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="170px" label="操作">
        <template #default="{ row, $index }">
          <el-button
            v-permission="`admin-user-edit`"
            size="small"
            type="primary"
            @click="handleEdit(row)"
            :loading="loading.edit"
          >
            编辑
          </el-button>
          <el-button
            v-permission="`admin-user-del`"
            size="small"
            type="danger"
            @click="handleDelete($index, row)"
            :loading="loading.delete"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="page-container">
      <el-pagination
        background
        :current-page="pagination.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.size"
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
import { getList, del } from '@/api/user'
import checkPermission from '@/utils/permission'

// 定义响应式数据
const router = useRouter()
const userList = ref([])
const selectedUsers = ref([])

// 搜索参数
const searchParams = reactive({
  name: '',
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
  edit: false,
  delete: false
})

// 计算属性 - 获取请求参数
const requestParams = computed(() => ({
  page: pagination.current,
  pageSize: pagination.size,
  name: searchParams.name
}))

// 获取用户列表数据
const fetchUserList = async () => {
  try {
    loading.table = true
    const response = await getList(requestParams.value)
    
    if (response.data) {
      userList.value = response.data.data || []
      pagination.total = response.data.total || 0
      pagination.size = response.data.per_page || 20
      pagination.current = response.data.current_page || 1
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败：' + (error.message || '未知错误'))
    console.error('获取用户列表失败:', error)
  } finally {
    loading.table = false
  }
}

// 搜索用户
const handleSearch = async () => {
  try {
    loading.search = true
    pagination.current = 1 // 重置到第一页
    await fetchUserList()
  } catch (error) {
    ElMessage.error('搜索失败')
  } finally {
    loading.search = false
  }
}

// 添加用户
const addUser = async () => {
  try {
    loading.add = true
    await router.push('/admin/user/back/add')
  } catch (error) {
    ElMessage.error('跳转失败')
  } finally {
    loading.add = false
  }
}

// 编辑用户
const handleEdit = async (user) => {
  try {
    loading.edit = true
    await router.push({
      path: '/admin/user/back/edit',
      query: { id: user.id }
    })
  } catch (error) {
    ElMessage.error('跳转编辑页面失败')
  } finally {
    loading.edit = false
  }
}

// 删除用户
const handleDelete = async (index, user) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.user_name}" 吗？此操作不可恢复！`,
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    loading.delete = true
    const response = await del(user.id)
    
    if (response.msg) {
      ElMessage.success(response.msg)
      userList.value.splice(index, 1)
      pagination.total--
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除用户失败：' + (error.message || '未知错误'))
      console.error('删除用户失败:', error)
    }
  } finally {
    loading.delete = false
  }
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

// 处理页面大小变化
const handleSizeChange = (newSize) => {
  pagination.size = newSize
  pagination.current = 1
  fetchUserList()
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  pagination.current = newPage
  fetchUserList()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchUserList()
})

// 导出供模板使用的变量和方法
defineExpose({
  fetchUserList,
  handleSearch,
  checkPermission
})
</script>

<style scoped>
.mr-1 {
  margin-right: 4px;
}

.filter-container {
  margin-bottom: 20px;
}

.page-container {
  margin-top: 20px;
  text-align: right;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}
</style>
