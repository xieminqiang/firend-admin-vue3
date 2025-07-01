<template>
  <div class="app-container">
    <p class="page-title">友伴师列表</p>

        <!-- 统计信息卡片 -->
    <div class="statistics-container" v-if="statistics">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.total_applications || 0 }}</div>
              <div class="stat-label">总申请数</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.pending_applications || 0 }}</div>
              <div class="stat-label">视频待审核</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.approved_applications || 0 }}</div>
              <div class="stat-label">审核通过</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.video_not_uploaded || 0 }}</div>
              <div class="stat-label">视频未上传</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.online_companions || 0 }}</div>
              <div class="stat-label">在线友伴师</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ statistics.can_accept_orders || 0 }}</div>
              <div class="stat-label">允许接单</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索和操作区域 -->
    <div class="filter-container">
      <el-input
        v-model="params.keyword"
        placeholder="请输入昵称或手机号"
        style="width: 200px"
        class="filter-item"
        @keyup.enter="handleFilter"
      />

      <el-select
        v-model="params.video_review_status"
        placeholder="视频审核状态"
        style="width: 150px;"
        clearable
      >
        <el-option label="待审核" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
        <el-option label="未上传" value="not_uploaded" />
      </el-select>
      <el-select
        v-model="params.can_accept_orders"
        placeholder="接单状态"
        style="width: 150px;"
        clearable
      >
        <el-option label="允许接单" value="Y" />
        <el-option label="不允许接单" value="N" />
      </el-select>
      <el-button
        type="primary"
        :icon="ElIconSearch"
        class="filter-item"
        @click="handleFilter"
      >
        搜索
      </el-button>
  
    </div>

    <!-- 友伴师列表表格 -->
    <el-table
      v-loading="table_loading"
      :data="list"
      border
      element-loading-text="加载中..."
    >
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column label="头像" align="center" width="80">
        <template v-slot="scope">
          <div class="avatar-cell">
            <el-avatar
              v-if="scope.row.photos && scope.row.photos[0]"
              :src="scope.row.photos[0]"
              :size="50"
            />
            <el-avatar v-else :size="50" icon="UserFilled" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="昵称"
        prop="nickname"
        align="center"
        min-width="100"
      >
        <template v-slot="scope">
          <span 
            class="name-link" 
            @click="handleDetail(scope.row)"
          >
            {{ scope.row.nickname || '未填写' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机号码"
        prop="phone"
        align="center"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.phone || '未填写' }}
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        prop="gender"
        align="center"
        width="80"
      >
        <template v-slot="scope">
          {{ scope.row.gender || '未填写' }}
        </template>
      </el-table-column>
      <el-table-column
        label="年龄"
        prop="age"
        align="center"
        width="80"
      >
        <template v-slot="scope">
          {{ scope.row.age || '未填写' }}
        </template>
      </el-table-column>
      <el-table-column
        label="申请区域"
        prop="service_areas"
        align="center"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.service_area_names && scope.row.service_area_names.length > 0 ? scope.row.service_area_names.slice(0, 2).join('、') + (scope.row.service_area_names.length > 2 ? '...' : '') : (scope.row.service_areas && scope.row.service_areas.length > 0 ? `${scope.row.service_areas.length}个区域` : '未填写') }}
        </template>
      </el-table-column>

      <el-table-column
        label="视频审核"
        prop="video_review_status"
        align="center"
        width="100"
      >
        <template v-slot="scope">
          <el-tag
            :type="getVideoReviewStatusType(scope.row.intro_video_url, scope.row.video_review_status)"
            size="small"
          >
            {{ getVideoReviewStatusText(scope.row.intro_video_url, scope.row.video_review_status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="接单状态"
        prop="can_accept_orders"
        align="center"
        width="100"
      >
        <template v-slot="scope">
          <el-tag
            :type="getOrderStatusType(scope.row.can_accept_orders)"
            size="small"
          >
            {{ scope.row.can_accept_orders_name || getOrderStatusText(scope.row.can_accept_orders) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="在线状态"
        prop="is_online"
        align="center"
        width="100"
      >
        <template v-slot="scope">
          <el-tag
            :type="scope.row.is_online === 1 ? 'success' : 'info'"
            size="small"
          >
            {{ scope.row.is_online_name || (scope.row.is_online === 1 ? '在线' : '离线') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="申请时间"
        prop="created_at"
        align="center"
        width="160"
      />

      <el-table-column align="center" width="200px" label="操作">
        <template v-slot="scope">
          <el-button size="mini" type="primary" @click="handleDetail(scope.row)">
            详情
          </el-button>
          <el-button 
            v-if="scope.row.status === 'pending'"
            size="mini" 
            type="success" 
            @click="handleApprove(scope.row)"
          >
            通过
          </el-button>
          <el-button 
            v-if="scope.row.status === 'pending'"
            size="mini" 
            type="danger" 
            @click="handleReject(scope.row)"
          >
            拒绝
          </el-button>
          <el-button 
            v-if="scope.row.intro_video_url && scope.row.intro_video_url !== '' && scope.row.video_review_status === 'pending'"
            size="mini" 
            type="warning" 
            @click="handleVideoReview(scope.row)"
          >
            审核视频
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

    <!-- 审核状态更新对话框 -->
    <el-dialog
      v-model="statusDialogVisible"
      :title="statusDialogTitle"
      width="500px"
    >
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="审核状态">
          <el-radio-group v-model="statusForm.status">
            <el-radio value="approved">通过</el-radio>
            <el-radio value="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input
            v-model="statusForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="statusDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmStatusUpdate">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 视频审核状态更新对话框 -->
    <el-dialog
      v-model="videoReviewDialogVisible"
      title="视频审核"
      width="600px"
    >
      <div class="video-review-header">
        <h4>介绍视频</h4>
      </div>
      <div class="video-container" v-if="videoReviewForm.intro_video_url">
        <video 
          :src="videoReviewForm.intro_video_url" 
          controls 
          class="intro-video"
          preload="metadata"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
      <el-form :model="videoReviewForm" label-width="100px" style="margin-top: 20px;">
        <el-form-item label="审核状态">
          <el-radio-group v-model="videoReviewForm.video_review_status">
            <el-radio value="approved">通过</el-radio>
            <el-radio value="rejected">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input
            v-model="videoReviewForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="videoReviewDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmVideoReviewUpdate">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search as ElIconSearch, Refresh as ElIconRefresh } from '@element-plus/icons-vue'
import { 
  getCompanionApplicationList, 
  updateCompanionApplicationStatus,
  deleteCompanionApplication,
  getCompanionStatistics
} from '@/api/companion'

// 路由
const router = useRouter()

// 响应式数据
const params = reactive({
  keyword: '',
  video_review_status: '',
  can_accept_orders: '',
  page: 1,
  pageSize: 20,
})

const list = ref([])
const total = ref(0)
const table_loading = ref(false)
const page_sizes = ref([10, 20, 50, 100])
const statistics = ref(null)

// 审核对话框相关
const statusDialogVisible = ref(false)
const statusDialogTitle = ref('')
const statusForm = reactive({
  id: null,
  status: 'approved',
  remark: ''
})

// 视频审核对话框相关
const videoReviewDialogVisible = ref(false)
const videoReviewForm = reactive({
  id: null,
  intro_video_url: '',
  video_review_status: 'approved',
  remark: ''
})

// 初始化
const init = async () => {
  await Promise.all([
    getStatistics(),
    _getData()
  ])
}

// 获取统计信息
const getStatistics = async () => {
  try {
    const res = await getCompanionStatistics()
    if (res.code === 0) {
      statistics.value = res.data
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 获取友伴师列表数据
const _getData = async () => {
  table_loading.value = true
  try {
    const res = await getCompanionApplicationList(params)
    if (res.code === 0) {
      list.value = res.data.list || []
      total.value = res.data.total || 0
      params.page = res.data.page || 1
    }
  } catch (error) {
    ElMessage.error('获取友伴师列表失败')
    console.error('获取友伴师列表失败:', error)
  } finally {
    table_loading.value = false
  }
}

// 搜索过滤
const handleFilter = () => {
  params.page = 1
  _getData()
}

// 刷新
const handleRefresh = () => {
  params.page = 1
  init()
}

// 查看详情
const handleDetail = (row) => {
  router.push(`/companion/detail/${row.id}`)
}

// 通过审核
const handleApprove = (row) => {
  statusForm.id = row.id
  statusForm.status = 'approved'
  statusForm.remark = ''
  statusDialogTitle.value = '通过审核'
  statusDialogVisible.value = true
}

// 拒绝审核
const handleReject = (row) => {
  statusForm.id = row.id
  statusForm.status = 'rejected'
  statusForm.remark = ''
  statusDialogTitle.value = '拒绝审核'
  statusDialogVisible.value = true
}

// 视频审核
const handleVideoReview = (row) => {
  videoReviewForm.id = row.id
  videoReviewForm.intro_video_url = row.intro_video_url
  videoReviewForm.video_review_status = 'approved'
  videoReviewForm.remark = ''
  videoReviewDialogVisible.value = true
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  try {
    const res = await updateCompanionApplicationStatus(statusForm.id, {
      status: statusForm.status,
      remark: statusForm.remark
    })
    if (res.code === 0) {
      ElMessage.success('审核状态更新成功')
      statusDialogVisible.value = false
      _getData()
      getStatistics()
    } else {
      ElMessage.error(res.message || '审核状态更新失败')
    }
  } catch (error) {
    ElMessage.error('审核状态更新失败')
    console.error('审核状态更新失败:', error)
  }
}

// 确认视频审核更新
const confirmVideoReviewUpdate = async () => {
  try {
    const res = await updateCompanionVideoReviewStatus(videoReviewForm.id, {
      video_review_status: videoReviewForm.video_review_status,
      remark: videoReviewForm.remark
    })
    if (res.code === 0) {
      ElMessage.success('视频审核状态更新成功')
      videoReviewDialogVisible.value = false
      _getData()
      getStatistics()
    } else {
      ElMessage.error(res.message || '视频审核状态更新失败')
    }
  } catch (error) {
    ElMessage.error('视频审核状态更新失败')
    console.error('视频审核状态更新失败:', error)
  }
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



const getVideoReviewStatusType = (introVideoUrl, videoReviewStatus) => {
  // 如果没有上传视频，显示未上传
  if (!introVideoUrl || introVideoUrl === '') {
    return 'info'
  }
  
  const statusMap = {
    'not_uploaded': 'info',
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return statusMap[videoReviewStatus] || 'info'
}

const getVideoReviewStatusText = (introVideoUrl, videoReviewStatus) => {
  // 如果没有上传视频，显示未上传
  if (!introVideoUrl || introVideoUrl === '') {
    return '未上传'
  }
  
  const statusMap = {
    'not_uploaded': '未上传',
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[videoReviewStatus] || '未知'
}

const getOrderStatusType = (canAcceptOrders) => {
  const statusMap = {
    'Y': 'success',
    'N': 'danger'
  }
  return statusMap[canAcceptOrders] || 'info'
}

const getOrderStatusText = (canAcceptOrders) => {
  const statusMap = {
    'Y': '允许接单',
    'N': '不允许接单'
  }
  return statusMap[canAcceptOrders] || '未知'
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

.statistics-container {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.name-link {
  color: #409EFF;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.name-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.avatar-cell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-container {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.video-review-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.video-review-header h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.intro-video {
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}
</style> 