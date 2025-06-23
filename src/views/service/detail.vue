<template>
  <div class="app-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button @click="handleBack" :icon="ElIconArrowLeft">返回列表</el-button>
      <h2 class="page-title">服务详情</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleEdit" :icon="ElIconEdit">编辑</el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-loading="loading" class="loading-container">
      <!-- 服务详情内容 -->
      <div v-if="!loading && serviceData" class="service-detail">
        <!-- 服务基本信息卡片 -->
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">基本信息</span>
              <div class="header-actions">
                <!-- <el-button
                  type="primary"
                  :icon="ElIconEdit"
                  size="small"
                  @click="handleEdit"
                >
                  编辑
                </el-button> -->
              </div>
            </div>
          </template>
          
          <el-row :gutter="30">
            <!-- 左侧信息 -->
            <el-col :span="16">
              <div class="info-grid">
                <div class="info-item">
                  <label>服务名称</label>
                  <span class="value service-name">{{ serviceData.name }}</span>
                </div>
                <div class="info-item">
                  <label>服务分类</label>
                  <span class="value">{{ serviceData.category_name }}</span>
                </div>

                                 <div class="info-item">
                   <label>服务状态</label>
                  
                     <span class="value">{{ serviceData.status === 1 ? '已启用' : '已关闭' }}</span>
                 </div>
                <div class="info-item">
                  <label>排序值</label>
                  <span class="value">{{ serviceData.sort_order || '-' }}</span>
                </div>
                   <div class="info-item">
                    <label>申请数量</label>
                    <span class="value application-count">{{ serviceData.application_count || 0 }}</span>
                 </div>
                <div class="info-item">
                  <label>创建时间</label>
                  <span class="value">{{ formatDate(serviceData.created_at) }}</span>
                </div>
                <div class="info-item">
                  <label>更新时间</label>
                  <span class="value">{{ formatDate(serviceData.updated_at) }}</span>
                </div>
                <div class="info-item">
                
                </div>
              </div>
            </el-col>

            <!-- 右侧图片 -->
            <el-col :span="8">
              <div class="image-section">
                <div class="image-label">
                  服务图片
                  <span class="image-tip" v-if="serviceData.image_url">（点击查看大图）</span>
                </div>
                <div class="image-container" v-if="serviceData.image_url">
                  <el-image
                    :src="$getImageUrl(serviceData.image_url)"
                    :preview-src-list="[$getImageUrl(serviceData.image_url)]"
                    :preview-teleported="true"
                    alt="服务图片"
                    class="service-image"
                    fit="cover"
                  >
                    <template #placeholder>
                      <div class="image-placeholder">
                        <el-icon size="30" color="#c0c4cc">
                          <Picture />
                        </el-icon>
                        <p>加载中...</p>
                      </div>
                    </template>
                    <template #error>
                      <div class="image-error">
                        <el-icon size="30" color="#c0c4cc">
                          <Picture />
                        </el-icon>
                        <p>加载失败</p>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div v-else class="no-image">
                  <el-icon size="40" color="#d3d3d3">
                    <Picture />
                  </el-icon>
                  <p>暂无图片</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 详细信息卡片 -->
        <el-card class="detail-card" shadow="hover" v-if="serviceData.description || (serviceData.tags && serviceData.tags.length)">
          <template #header>
            <span class="card-title">详细信息</span>
          </template>
          
          <!-- 服务描述 -->
          <div v-if="serviceData.description" class="description-section">
            <h4>服务描述</h4>
            <div class="description-content">
              <pre class="description-text">{{ serviceData.description }}</pre>
            </div>
          </div>

          <!-- 服务标签 -->
          <div v-if="serviceData.tags && serviceData.tags.length" class="tags-section">
            <h4>服务标签</h4>
            <div class="tags-container">
              <el-tag
                v-for="tag in serviceData.tags"
                :key="tag"
                size="default"
                type="info"
                effect="plain"
                class="service-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </el-card>

        <!-- 绑定区域和价格模板卡片 -->
        <el-card class="detail-card" shadow="hover" v-if="serviceData">
          <template #header>
            <span class="card-title">
              绑定区域和价格模板
              <span class="region-count" v-if="boundRegions.length > 0">
                （共 {{ boundRegions.length }} 个区域）
              </span>
            </span>
          </template>
          
          <div v-loading="regionLoading">
            <div v-if="boundRegions.length === 0" class="empty-regions">
              <el-empty description="暂无配置区域" />
            </div>
            <div v-else class="regions-table">
              <el-table :data="boundRegions" stripe>
                <el-table-column label="区域名称" prop="city_name" align="center" min-width="120" />
                <el-table-column label="服务状态" align="center" width="100">
                  <template v-slot="scope">
                    <el-tag 
                      :type="scope.row.is_enabled === 1 ? 'success' : 'danger'"
                      size="small"
                    >
                      {{ scope.row.is_enabled_text }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="价格模板" align="center" min-width="150">
                  <template v-slot="scope">
                    <span 
                      v-if="scope.row.price_template_id" 
                      class="template-name"
                      @click="handleViewTemplate(scope.row.price_template_id)"
                    >
                      {{ scope.row.template_name }}
                    </span>
                    <span v-else class="no-template">未绑定模板</span>
                  </template>
                </el-table-column>
                <el-table-column label="模板价格" align="center" width="120">
                  <template v-slot="scope">
                    <span v-if="scope.row.price_template_id" class="price-text">
                      ¥{{ scope.row.template_min_price }}
                    </span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="计费单位" align="center" width="100">
                  <template v-slot="scope">
                    <span v-if="scope.row.price_template_id">
                      {{ scope.row.template_unit }}
                    </span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="备注" prop="note" align="center" min-width="150">
                  <template v-slot="scope">
                    <span class="note-text">{{ scope.row.note || '无' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft as ElIconArrowLeft,
  Edit as ElIconEdit,
  Delete as ElIconDelete,
  Picture,
} from '@element-plus/icons-vue'
import { getServiceDetail, deleteService, getServiceBoundRegions } from '@/api/service'
import checkPermission from '@/utils/permission'

// 路由
const router = useRouter()
const route = useRoute()

// 响应式数据
const serviceData = ref(null)
const loading = ref(false)
const regionLoading = ref(false)
const serviceId = ref(null)
const boundRegions = ref([])
// 由于tags现在是数组格式，不需要tagList计算属性

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

    // 获取服务详情
const getServiceData = async () => {
  if (!serviceId.value) {
    ElMessage.error('服务ID不存在')
    router.go(-1)
        return
      }

  loading.value = true
      try {
    const res = await getServiceDetail(serviceId.value)
        if (res.code === 0) {
      serviceData.value = res.data
        } else {
      ElMessage.error(res.msg || '获取服务详情失败')
      router.go(-1)
        }
      } catch (error) {
    ElMessage.error('获取服务详情失败')
        console.error('获取服务详情失败:', error)
    router.go(-1)
      } finally {
    loading.value = false
  }
      }

    // 返回上一页
const handleBack = () => {
  router.go(-1)
}

    // 编辑服务
const handleEdit = () => {
  router.push(`/service/edit/${serviceId.value}`)
}

    // 删除服务
const handleDelete = async () => {
      try {
    await ElMessageBox.confirm('确定要删除该服务吗？删除后不可恢复！', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

    const res = await deleteService(serviceId.value)
        if (res.code === 0) {
      ElMessage.success(res.msg || '删除成功')
      router.push('/service/list')
        } else {
      ElMessage.error(res.msg || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
      ElMessage.error('删除服务失败')
          console.error('删除服务失败:', error)
        }
      }
}

// 获取绑定区域列表
const getBoundRegions = async () => {
  regionLoading.value = true
  try {
    const res = await getServiceBoundRegions(serviceId.value)
    if (res.code === 0) {
      boundRegions.value = res.data.regions || []
    } else {
      ElMessage.error(res.message || '获取绑定区域失败')
    }
  } catch (error) {
    ElMessage.error('获取绑定区域失败')
    console.error('获取绑定区域失败:', error)
  } finally {
    regionLoading.value = false
  }
}

// 查看价格模板详情
const handleViewTemplate = (templateId) => {
  // 跳转到价格模板详情页面
  router.push(`/service/price-template/detail/${templateId}`)
}

// 组件挂载时初始化
onMounted(async () => {
  serviceId.value = route.params.id
  await getServiceData()
  await getBoundRegions()
})
</script>

<style scoped>
.app-container {
  /* 保持默认样式，与价格模板详情页面一致 */
}

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

.header-actions {
  display: flex;
  gap: 10px;
}

.loading-container {
  min-height: 400px;
}

.service-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.info-card, .detail-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
}

.info-item .value {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.service-name {
  color: #409eff;
  font-weight: 600;
}

.price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: 600;
}

.application-count {
  color: #67c23a;
  font-weight: 600;
}

.image-section {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-label {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.image-tip {
  font-size: 12px;
  color: #c0c4cc;
  font-weight: normal;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  min-height: 200px;
}

.service-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-image:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.image-placeholder,
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  height: 200px;
  width: 100%;
}

.image-placeholder p,
.image-error p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

.no-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  height: 100%;
}

.no-image p {
  margin: 8px 0 0 0;
  font-size: 14px;
}

.description-section,
.tags-section {
  margin-bottom: 24px;
}

.description-section:last-child,
.tags-section:last-child {
  margin-bottom: 0;
}

.description-section h4,
.tags-section h4 {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.description-content {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  line-height: 1.6;
  color: #606266;
  font-size: 14px;
}

.description-text {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: none;
  border: none;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-tag {
  background: #ecf5ff;
  border-color: #d9ecff;
  color: #409eff;
  font-weight: 500;
}

/* 绑定区域相关样式 */
.region-count {
  font-size: 14px;
  color: #909399;
  font-weight: normal;
}

.empty-regions {
  text-align: center;
  padding: 40px 0;
}

.regions-table {
  margin-top: 10px;
}

.template-name {
  color: #409eff;
  font-weight: 500;
  cursor: pointer;
}

.template-name:hover {
  text-decoration: underline;
}

.no-template {
  color: #909399;
  font-style: italic;
}

.price-text {
  font-weight: bold;
  color: #e6a23c;
}

.note-text {
  color: #606266;
  font-size: 13px;
}

@media (max-width: 768px) {
  .app-container {
    padding: 12px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 0;
  }
  
  .header-title {
    margin-left: 0;
    margin-top: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
