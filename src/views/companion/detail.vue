<template>
  <div class="app-container">
    <div class="page-header">
      <el-button @click="goBack" icon="ArrowLeft">返回</el-button>
      <h2 class="page-title">友伴师申请详情</h2>
    </div>

    <div v-loading="loading" class="detail-container">
      <el-row :gutter="20">
        <!-- 基本信息 -->
        <el-col :span="16">
          <el-card class="detail-card">
            <template #header>
              <div class="card-header">
                <span>基本信息</span>
            
              </div>
            </template>
            
            <el-descriptions :column="2" border>
              <el-descriptions-item label="申请ID">
                {{ detail.id }}
              </el-descriptions-item>
              <el-descriptions-item label="申请时间">
                {{ detail.created_at }}
              </el-descriptions-item>
              <el-descriptions-item label="昵称">
                {{ detail.nickname || '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号码">
                {{ detail.phone || '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ detail.gender || '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                {{ detail.age || '未填写' }}岁
              </el-descriptions-item>
              <el-descriptions-item label="身高">
                {{ detail.height ? `${detail.height}cm` : '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="体重">
                {{ detail.weight ? `${detail.weight}kg` : '未填写' }}
              </el-descriptions-item>
              <el-descriptions-item label="申请区域" :span="2">
                {{ detail.service_area_names && detail.service_area_names.length > 0 ? detail.service_area_names.join('、') : (detail.service_areas && detail.service_areas.length > 0 ? detail.service_areas.join('、') : '未填写') }}
              </el-descriptions-item>
              <el-descriptions-item label="申请服务" :span="2">
                <div v-if="detail.service_names && detail.service_names.length > 0" class="service-names-container">
                  <span 
                    v-for="(serviceName, index) in detail.service_names" 
                    :key="index"
                    class="service-name-link"
                    @click="handleServiceDetail(detail.services[index])"
                  >
                    {{ serviceName }}
                  </span>
                 
                </div>
                <div v-else-if="detail.services && detail.services.length > 0" class="service-ids-container">
                  <span 
                    v-for="(serviceId, index) in detail.services" 
                    :key="index"
                    class="service-id-link"
                    @click="handleServiceDetail(serviceId)"
                  >
                    {{ serviceId }}
                  </span>
                  <span v-if="detail.services.length > 1" class="service-separator">、</span>
                </div>
                <span v-else>未填写</span>
              </el-descriptions-item>
              <el-descriptions-item label="个人标签" :span="2">
                {{ detail.tags && detail.tags.length > 0 ? detail.tags.join('、') : '未填写' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 审核状态 -->
          <el-card class="detail-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>视频审核状态</span>
              </div>
            </template>
            
            <el-descriptions :column="2" border>
         
              <el-descriptions-item label="视频审核状态">
                <el-tag
                  :type="getVideoReviewStatusType(detail.intro_video_url, detail.video_review_status)"
                  size="small"
                >
                  {{ getVideoReviewStatusText(detail.intro_video_url, detail.video_review_status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="接单状态">
                <el-tag
                  :type="getOrderStatusType(detail.can_accept_orders)"
                  size="small"
                >
                  {{ detail.can_accept_orders_name || getOrderStatusText(detail.can_accept_orders) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="在线状态">
                <el-tag
                  :type="detail.is_online === 1 ? 'success' : 'info'"
                  size="small"
                >
                  {{ detail.is_online_name || (detail.is_online === 1 ? '在线' : '离线') }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="审核时间" :span="2">
                {{ detail.last_reviewed_at|| '未审核' }}
              </el-descriptions-item>
              <el-descriptions-item label="审核备注" :span="2">
                {{ detail.remark || '无' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 操作区域 -->
          <el-card class="detail-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>操作</span>
              </div>
            </template>
            
            <div class="action-buttons">
              <el-button 
                v-if="detail.status === 'pending'"
                type="success" 
                @click="handleApprove"
                :loading="actionLoading"
              >
                通过审核
              </el-button>
              <el-button 
                v-if="detail.status === 'pending'"
                type="danger" 
                @click="handleReject"
                :loading="actionLoading"
              >
                拒绝审核
              </el-button>
              <el-button 
                type="warning" 
                @click="handleDelete"
                :loading="actionLoading"
              >
                删除申请
              </el-button>
              <el-button 
                v-if="detail.intro_video_url && detail.intro_video_url !== ''"
                type="primary" 
                @click="handleVideoReview"
                :loading="actionLoading"
              >
                视频审核
              </el-button>
            </div>
          </el-card>
        </el-col>

        <!-- 图片 -->
        <el-col :span="8">
          <el-card class="detail-card">
            <template #header>
              <div class="card-header">
                <span>生活照片</span>
              </div>
            </template>
            
            <div class="image-container">
              <div v-if="detail.photos && detail.photos.length > 0" class="image-grid">
                <div 
                  v-for="(photo, index) in detail.photos" 
                  :key="index" 
                  class="image-item"
                >
                  <el-image
                    :src="photo"
                    :preview-src-list="detail.photos"
                    :preview-teleported="true"
                    fit="cover"
                    class="photo-image"
                  />
                </div>
              </div>
              <div v-else class="no-images">
                <el-empty description="暂无个人照片" />
              </div>
            </div>
          </el-card>

          <!-- 视频介绍 -->
          <el-card v-if="detail.intro_video_url && detail.intro_video_url !== ''" class="detail-card" style="margin-top: 20px;">
            <template #header>
              <div class="card-header">
                <span>介绍视频</span>
              </div>
            </template>
            
            <div class="video-container">
              <video 
                :src="detail.intro_video_url" 
                controls 
                class="intro-video"
                preload="metadata"
              >
                您的浏览器不支持视频播放
              </video>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
      width="500px"
    >
      <el-form :model="videoReviewForm" label-width="100px">
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { 
  getCompanionApplicationDetail,
  updateCompanionApplicationStatus,
  updateCompanionVideoReviewStatus,
  deleteCompanionApplication
} from '@/api/companion'

// 路由
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const actionLoading = ref(false)
const detail = ref({})

// 对话框相关
const statusDialogVisible = ref(false)
const statusDialogTitle = ref('')
const statusForm = reactive({
  id: null,
  status: 'approved',
  remark: ''
})

const videoReviewDialogVisible = ref(false)
const videoReviewForm = reactive({
  id: null,
  video_review_status: 'approved',
  remark: ''
})

// 获取详情
const getDetail = async () => {
  loading.value = true
  try {
    const id = route.params.id
    const res = await getCompanionApplicationDetail(id)
    if (res.code === 0) {
      detail.value = res.data
    } else {
      ElMessage.error(res.message || '获取详情失败')
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
    console.error('获取详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 通过审核
const handleApprove = () => {
  statusForm.id = detail.value.id
  statusForm.status = 'approved'
  statusForm.remark = ''
  statusDialogTitle.value = '通过审核'
  statusDialogVisible.value = true
}

// 拒绝审核
const handleReject = () => {
  statusForm.id = detail.value.id
  statusForm.status = 'rejected'
  statusForm.remark = ''
  statusDialogTitle.value = '拒绝审核'
  statusDialogVisible.value = true
}

// 确认状态更新
const confirmStatusUpdate = async () => {
  actionLoading.value = true
  try {
    const res = await updateCompanionApplicationStatus(statusForm.id, {
      status: statusForm.status,
      remark: statusForm.remark
    })
    if (res.code === 0) {
      ElMessage.success('审核状态更新成功')
      statusDialogVisible.value = false
      getDetail()
    } else {
      ElMessage.error(res.message || '审核状态更新失败')
    }
  } catch (error) {
    ElMessage.error('审核状态更新失败')
    console.error('审核状态更新失败:', error)
  } finally {
    actionLoading.value = false
  }
}

// 视频审核
const handleVideoReview = () => {
  videoReviewForm.id = detail.value.id
  videoReviewForm.video_review_status = 'approved'
  videoReviewForm.remark = ''
  videoReviewDialogVisible.value = true
}

// 确认视频审核更新
const confirmVideoReviewUpdate = async () => {
  actionLoading.value = true
  try {
    const res = await updateCompanionVideoReviewStatus(videoReviewForm.id, {
      video_review_status: videoReviewForm.video_review_status,
      remark: videoReviewForm.remark
    })
    if (res.code === 0) {
      ElMessage.success('视频审核状态更新成功')
      videoReviewDialogVisible.value = false
      getDetail()
    } else {
      ElMessage.error(res.message || '视频审核状态更新失败')
    }
  } catch (error) {
    ElMessage.error('视频审核状态更新失败')
    console.error('视频审核状态更新失败:', error)
  } finally {
    actionLoading.value = false
  }
}

// 删除申请
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个友伴师申请吗？删除后无法恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    actionLoading.value = true
    const res = await deleteCompanionApplication(detail.value.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      router.back()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除失败:', error)
    }
  } finally {
    actionLoading.value = false
  }
}

// 跳转到服务详情
const handleServiceDetail = (serviceId) => {
  if (serviceId) {
    router.push(`/service/detail/${serviceId}`)
  }
}

// 状态相关方法
const getStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || '未知'
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
  getDetail()
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.detail-container {
  min-height: 400px;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.image-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.image-item {
  text-align: center;
}

.photo-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.no-images {
  padding: 40px 0;
}

.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.intro-video {
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.service-names-container,
.service-ids-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.service-name-link,
.service-id-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.service-name-link:hover,
.service-id-link:hover {
  color: #66b1ff;
  background-color: #ecf5ff;
  text-decoration: underline;
}

.service-separator {
  color: #606266;
  margin: 0 2px;
}
</style> 