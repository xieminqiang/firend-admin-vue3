<template>
  <div class="app-container">
    <p class="page-title">编辑服务</p>

    <el-card v-loading="loading">
      <el-form
        ref="serviceForm"
        :model="formData"
        :rules="rules"
        label-position="left"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="服务名称" prop="name">
              <el-input 
                v-model="formData.name" 
                placeholder="请输入服务名称" 
                maxlength="20"
                show-word-limit
                style="width: 350px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="服务状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">已启用</el-radio>
                <el-radio :label="0">已关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="服务分类" prop="category_id">
              <el-select
                v-model="formData.category_id"
                placeholder="请选择服务分类"
                style="width: 300px"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序" prop="sort_order">
              <el-input-number
                v-model="formData.sort_order"
                :min="0"
                :max="9999"
                :step="1"
                placeholder="排序值"
                style="width: 150px"
                controls-position="right"
              />
              <div class="form-item-tip">数值越小越靠前</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="价格模板" prop="price_template_id">
              <el-select
                v-model="formData.price_template_id"
                placeholder="请选择价格模板"
                style="width: 300px"
                clearable
              >
                <el-option
                  v-for="template in priceTemplateOptions"
                  :key="template.id"
                  :label="template.name"
                  :value="template.id"
                >
                  <span>{{ template.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ template.unit }}</span>
                </el-option>
              </el-select>
              <div class="form-item-tip">选择价格模板后，系统将按模板设置的等级价格计费</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低价格" prop="min_price">
              <span class="readonly-value">{{ formData.min_price || '0.00' }}</span>
              <div class="form-item-tip">由价格模板设置</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最小数量" prop="min_quantity">
              <span class="readonly-value">{{ formData.min_quantity }}</span>
              <div class="form-item-tip">由价格模板设置</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计价单位" prop="unit">
              <span class="readonly-value">{{ formData.unit }}</span>
              <div class="form-item-tip">由价格模板设置</div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="服务图片" prop="image_url">
              <upload
                v-model:value="formData.image_url"
                @on-success="handleUploadSuccess"
              ></upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item label="服务描述" prop="description">
              <el-input
                v-model="formData.description"
                type="textarea"
                :rows="6"
                placeholder="请输入服务描述"
              />
            </el-form-item>
          </el-col>
        </el-row>



        <el-form-item label="标签" prop="tags">
          <div class="tag-main-container">
            <!-- 已选择的标签显示区域 -->
            <div class="selected-tags-container">
              <div class="selected-tags">
                <div
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  class="tag-item selected"
                  @click="removeTag(index)"
                >
                  <span class="tag-text">{{ tag }}</span>
                  <el-icon class="tag-close"><ElIconClose /></el-icon>
                </div>
                <div
                  v-if="formData.tags.length < 5"
                  class="tag-add-btn"
                  @click="showTagSelector = true"
                >
                  <el-icon><ElIconPlus /></el-icon>
                  <span>添加标签</span>
                </div>
              </div>
            </div>
            
            <!-- 标签设置提示 -->
            <div class="tag-tips">
              <p class="tips-text">🏷️ 标签设置</p>
              <p class="tips-content">• 建议选择3-5个相关标签，精准描述服务特色</p>
              <p class="tips-content">• 点击标签可移除，支持自定义标签内容</p>
              <p class="tips-content">• 请先选择服务分类，才有更好的推荐标签</p>
            </div>
          </div>
          
          <!-- 标签选择器弹出层 -->
          <div v-if="showTagSelector" class="tag-selector-overlay" @click="closeTagSelector">
            <div class="tag-selector" @click.stop>
              <div class="selector-header">
                <h4>选择标签</h4>
                <el-icon @click="closeTagSelector"><ElIconClose /></el-icon>
              </div>
              
              <!-- 自定义输入框 -->
              <div class="custom-input-section">
          <el-input
                  v-model="customTagInput"
                  placeholder="输入自定义标签"
                  @keyup.enter="addCustomTag"
                  maxlength="20"
                  show-word-limit
                />
                <el-button
                  type="primary"
                  size="small"
                  @click="addCustomTag"
                  :disabled="!customTagInput.trim()"
                >
                  添加
                </el-button>
              </div>
              
              <!-- 推荐标签 -->
              <div class="recommended-tags">
                <div class="tags-header">
                  <h5>标签列表</h5>
                </div>
                <div v-if="!formData.category_id" class="no-category-tip">
                  <p>请先选择服务分类，系统将为您推荐相关标签</p>
                </div>
                <div v-else class="tags-grid">
                  <div
                    v-for="tag in availableTagsForSelection"
                    :key="tag.id"
                    class="tag-item recommended"
                    :class="{ 
                      'disabled': isTagSelected(tag.tag_name),
                      'temp-selected': isTempSelected(tag.tag_name)
                    }"
                    @click="toggleTagSelection(tag.tag_name)"
                  >
                    <span class="tag-text">{{ tag.tag_name }}</span>
                    <el-icon v-if="isTagSelected(tag.tag_name)" class="tag-check"><ElIconCheck /></el-icon>
                    <el-icon v-else-if="isTempSelected(tag.tag_name)" class="tag-check"><ElIconCheck /></el-icon>
                  </div>
                </div>
                
                <!-- 加载更多按钮 -->
                <div class="load-more-section" v-if="tagPagination.total > 0">
                  <el-button 
                    v-if="tagPagination.page * tagPagination.pageSize < tagPagination.total"
                    type="text" 
                    :loading="tagPagination.loading"
                    @click="loadMoreTags"
                    class="load-more-btn"
                  >
                    <el-icon v-if="!tagPagination.loading"><ArrowDown /></el-icon>
                    {{ tagPagination.loading ? '加载中...' : '加载更多' }}
                  </el-button>
                </div>
              </div>
              
              <!-- 选择状态和确认按钮 -->
              <div class="selector-footer">
                <div class="selection-info">
                  <span class="selection-count">
                    已选择 {{ tempSelectedTags.length }} 个标签
                    <span class="selection-limit">（最多5个，当前总数：{{ formData.tags.length + tempSelectedTags.length }}/5）</span>
                  </span>
                </div>
                <div class="footer-actions">
                  <el-button @click="closeTagSelector">取消</el-button>
                  <el-button 
                    type="primary" 
                    :disabled="tempSelectedTags.length === 0"
                    @click="confirmTagSelection"
                  >
                    确认选择
                  </el-button>
                </div>
              </div>

            </div>
          </div>
        </el-form-item>

      </el-form>

      <div class="form-actions">
        <div class="left-actions">
          <el-button 
            type="danger" 
            :loading="deleting" 
            @click="handleDelete"
            :icon="ElIconDelete"
          >
            删除服务
          </el-button>
        </div>
        <div class="right-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            保存
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close, Check, Delete, ArrowDown } from '@element-plus/icons-vue'
import {
  editService,
  getServiceDetail,
  getServiceCategories,
  getTagsByType,
  getPriceTemplateList,
  getPriceTemplateDetail,
  deleteService,
} from '@/api/service'
import upload from '@/components/Upload/icon-upload.vue'
import { getImageUrl, getRelativePath } from '@/utils/image'

// 组件别名
const ElIconPlus = Plus
const ElIconClose = Close
const ElIconCheck = Check
const ElIconDelete = Delete

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const serviceForm = ref(null)

// 响应式数据
const formData = reactive({
  name: '',
  category_id: '',
  status: 1,
  image_url: '',
  description: '',
  tags: [],
  sort_order: 0,
  price_template_id: null,
  min_price: 0,
  min_quantity: 1,
  unit: '小时',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入服务名称', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '服务名称长度在 2 到 20 个字符',
      trigger: 'blur',
    },
  ],
  category_id: [
    { required: true, message: '请选择服务分类', trigger: 'change' },
  ],
  description: [
    { required: true, message: '请输入服务描述', trigger: 'blur' },
    {
      min: 10,
      max: 800,
      message: '服务描述长度在 10 到 800 个字符',
      trigger: 'blur',
    },
  ],
  price_template_id: [
    { required: true, message: '请选择价格模板', trigger: 'change' },
  ],
  tags: [
    { 
      type: 'array', 
      required: true, 
      message: '请至少选择一个标签', 
      trigger: 'change',
      min: 1
    },
  ],
}

// 其他响应式数据
const categoryOptions = ref([])
const priceTemplateOptions = ref([])
const availableTags = ref([])
const availableTagsForSelection = ref([])
const showTagSelector = ref(false)
const customTagInput = ref('')
const tempSelectedTags = ref([])
const loading = ref(false)
const tagPagination = reactive({
  page: 1,
  pageSize: 80,
  total: 0,
  loading: false
})
const submitting = ref(false)
const deleting = ref(false)
const serviceId = ref(null)

    // 初始化
const init = async () => {
  // 先加载分类和价格模板选项，再加载服务数据
  await Promise.all([getCategories(), getPriceTemplates()])
  // 确保分类选项加载完成后再加载服务数据，这样分类回显才能正常工作
  await getServiceData()
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

// 获取价格模板列表
const getPriceTemplates = async () => {
  try {
    const res = await getPriceTemplateList()
    if (res.code === 0) {
      priceTemplateOptions.value = (res.data || []).map(template => ({
        ...template,
        id: Number(template.id) // 确保ID是数字类型
      }))
    }
  } catch (error) {
    console.error('获取价格模板失败:', error)
  }
}

// 加载价格模板详情并设置最低价格、最小数量和单位
const loadPriceTemplateDetails = async (templateId) => {
  try {
    const res = await getPriceTemplateDetail(templateId)
    if (res.code === 0 && res.data) {
      const templateData = res.data
      
      // 设置最小数量和单位
      if (templateData.min_quantity !== undefined) {
        formData.min_quantity = templateData.min_quantity
      }
      if (templateData.unit) {
        formData.unit = templateData.unit
      }
      
      // 设置最低价格
      if (templateData.levels && templateData.levels.length > 0) {
        // 查找 level_id == 1 的价格作为最低价格
        const level1Price = templateData.levels.find(level => level.level_id === 1)
        if (level1Price) {
          formData.min_price = level1Price.price
        } else {
          // 如果没有level_id=1，取第一个等级的价格
          const firstLevel = templateData.levels[0]
          if (firstLevel) {
            formData.min_price = firstLevel.price
          }
        }
      }
    }
  } catch (error) {
    console.error('获取价格模板详情失败:', error)
    ElMessage.error('获取价格模板详情失败')
  }
}

    // 获取服务详情
const getServiceData = async () => {
  if (!serviceId.value) return

  loading.value = true
      try {
    const res = await getServiceDetail(serviceId.value)
        if (res.code === 0) {
      const serviceData = res.data
      // 处理标签数据，确保是数组格式
      if (serviceData.tags) {
        serviceData.tags = Array.isArray(serviceData.tags) 
          ? serviceData.tags 
          : serviceData.tags.split(',').filter(tag => tag.trim())
      } else {
        serviceData.tags = []
      }
      
      // 处理分类字段映射：后端返回category，前端使用category_id
      if (serviceData.category !== undefined) {
        serviceData.category_id = Number(serviceData.category)
      }
      
      // 处理价格模板字段：确保是数字类型以便正确回显
      if (serviceData.price_template_id !== undefined && serviceData.price_template_id !== null) {
        serviceData.price_template_id = Number(serviceData.price_template_id)
      }
      
      // 处理图片URL，确保upload组件能正确回显
      if (serviceData.image_url) {
        serviceData.image_url = getImageUrl(serviceData.image_url)
        console.log('处理后的图片URL:', serviceData.image_url)
      }
      
      Object.assign(formData, serviceData)
      
      // 确保DOM更新完成，特别是图片回显
      await nextTick()
      
      // 获取当前分类的标签 - 移除直接调用，由watch监听器自动处理
      // 这样可以避免重复请求，因为Object.assign会触发watch监听器
      
      // 如果有价格模板，记录信息用于调试
      if (formData.price_template_id) {
        console.log('服务已绑定价格模板ID:', formData.price_template_id)
      }
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

// 根据分类获取标签
const getTagsByCategory = async (categoryId, resetPage = true) => {
  if (resetPage) {
    tagPagination.page = 1
  }
  
  tagPagination.loading = true
  try {
    const params = {
      page: tagPagination.page,
      pageSize: tagPagination.pageSize
    }
    
    const res = await getTagsByType(categoryId, params)
    if (res.code === 0) {
      const tagData = res.data || {}
      const tags = tagData.list || []
      
      if (resetPage || tagPagination.page === 1) {
        // 首次加载或重置，替换全部数据
        availableTagsForSelection.value = tags
      } else {
        // 加载更多，追加数据
        availableTagsForSelection.value.push(...tags)
      }
      
      tagPagination.total = tagData.total || 0
      availableTags.value = availableTagsForSelection.value
    }
  } catch (error) {
    console.error('获取标签列表失败:', error)
    ElMessage.error('获取标签列表失败')
  } finally {
    tagPagination.loading = false
  }
}



// 移除标签
const removeTag = (index) => {
  formData.tags.splice(index, 1)
}

// 添加自定义标签
const addCustomTag = () => {
  const tagName = customTagInput.value.trim()
  if (!tagName) return
  
  if (formData.tags.includes(tagName)) {
    ElMessage.warning('标签已存在')
    return
  }
  
  if (formData.tags.length >= 5) {
    ElMessage.warning('最多只能选择5个标签')
    return
  }
  
  formData.tags.push(tagName)
  customTagInput.value = ''
  closeTagSelector()
}

// 切换标签选中状态
const toggleTagSelection = (tagName) => {
  if (isTagSelected(tagName)) return // 已选择的标签不能取消
  
  const index = tempSelectedTags.value.indexOf(tagName)
  if (index > -1) {
    // 取消选中
    tempSelectedTags.value.splice(index, 1)
  } else {
    // 检查总数限制
    const totalTags = formData.tags.length + tempSelectedTags.value.length
    if (totalTags >= 5) {
      ElMessage.warning('最多只能选择5个标签')
      return
    }
    // 选中
    tempSelectedTags.value.push(tagName)
  }
}

// 检查标签是否已选择
const isTagSelected = (tagName) => {
  return formData.tags.includes(tagName)
}

// 检查标签是否在临时选中列表中
const isTempSelected = (tagName) => {
  return tempSelectedTags.value.includes(tagName)
}

// 确认选择的标签
const confirmTagSelection = () => {
  if (tempSelectedTags.value.length === 0) {
    ElMessage.warning('请至少选择一个标签')
    return
  }
  
  // 添加选中的标签到正式列表
  formData.tags.push(...tempSelectedTags.value)
  tempSelectedTags.value = []
  closeTagSelector()
}

// 加载更多标签
const loadMoreTags = async () => {
  if (tagPagination.loading) return
  
  const hasMore = tagPagination.page * tagPagination.pageSize < tagPagination.total
  if (!hasMore) return
  
  tagPagination.page += 1
  await getTagsByCategory(formData.category_id, false)
}

// 关闭标签选择器
const closeTagSelector = () => {
  showTagSelector.value = false
  customTagInput.value = ''
  tempSelectedTags.value = []
}

// 上传成功回调
const handleUploadSuccess = () => {
  serviceForm.value?.clearValidate('image_url')
}

    // 提交表单
const handleSubmit = async () => {
      try {
    await serviceForm.value.validate()
    submitting.value = true

    // 准备提交数据，处理字段映射
    const submitData = { ...formData }
    // 前端使用category_id，后端期望category
    if (submitData.category_id !== undefined) {
      submitData.category = submitData.category_id
    }
    // 处理图片URL：提交时只发送相对路径，不包含域名
    if (submitData.image_url) {
      submitData.image_url = getRelativePath(submitData.image_url)
    }
    


    const res = await editService(serviceId.value, submitData)
        if (res.code === 0) {
      ElMessage.success(res.msg || '编辑服务成功')
      router.go(-1)
        } else {
      ElMessage.error(res.msg || '编辑服务失败')
        }
      } catch (error) {
        if (error !== false) {
          // 表单验证失败时返回false
      ElMessage.error('编辑服务失败')
          console.error('编辑服务失败:', error)
        }
      } finally {
    submitting.value = false
  }
      }

// 删除服务
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除服务「${formData.name}」吗？\n删除后将无法恢复，请谨慎操作！`, 
      '删除确认', 
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false,
      }
    )
    
    deleting.value = true
    
    const res = await deleteService(serviceId.value)
    if (res.code === 0) {
      ElMessage.success('删除服务成功')
      router.go(-1)
    } else {
      ElMessage.error(res.msg || '删除服务失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除服务失败')
      console.error('删除服务失败:', error)
    }
  } finally {
    deleting.value = false
  }
}

    // 取消操作
const handleCancel = () => {
  router.go(-1)
}

// 监听分类变化
watch(
  () => formData.category_id,
  (newVal) => {
    if (newVal) {
      getTagsByCategory(newVal)
    }
  }
)

// 监听价格模板变化
watch(
  () => formData.price_template_id,
  async (newVal) => {
    if (newVal) {
      await loadPriceTemplateDetails(newVal)
    }
  }
)

// 组件挂载时初始化
onMounted(() => {
  serviceId.value = route.params.id
  init()
})
</script>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-actions .el-button + .el-button {
  margin-left: 12px;
}

.form-actions .left-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-actions .right-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
/* 原图片上传样式已移除，现在使用统一的upload组件 */

/* 标签主容器布局 */
.tag-main-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

/* 标签选择区域 */
.selected-tags-container {
  flex: 1;
  min-width: 0;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 40px;
  align-items: flex-start;
}

.tag-item {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.tag-item.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.tag-item.selected:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.tag-item.recommended {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  position: relative;
}

.tag-item.recommended:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.tag-item.recommended.disabled {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
  opacity: 0.6;
}

.tag-item.temp-selected {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-color: #10b981;
}

.tag-item.temp-selected:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
}

/* 选择器底部样式 */
.selector-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-info {
  flex: 1;
}

.selection-count {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.selection-limit {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 加载更多相关样式 */
.load-more-section {
  text-align: center;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
}

.load-more-btn {
  color: #666;
  font-size: 14px;
  padding: 8px 16px;
}

.load-more-btn:hover {
  color: #409eff;
  background-color: #f5f7fa;
}

.tag-item.more-tag {
  background-color: #fff7ed;
  border: 1px solid #fed7aa;
  color: #ea580c;
}

.tag-item.more-tag:hover {
  background-color: #ffedd5;
  border-color: #fdba74;
  transform: translateY(-1px);
}

.tag-item.more-tag.disabled {
  background-color: #fef3f2;
  color: #f87171;
  cursor: not-allowed;
  opacity: 0.6;
}

.tag-text {
  margin-right: 6px;
}

.tag-close {
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
}

.tag-close:hover {
  opacity: 1;
}

.tag-check {
  color: #10b981;
  font-size: 14px;
  margin-left: 4px;
}

.tag-add-btn {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 6px 12px;
  border: 2px dashed #d1d5db;
  border-radius: 16px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tag-add-btn:hover {
  border-color: #9ca3af;
  color: #4b5563;
  background-color: #f9fafb;
}

.tag-add-btn .el-icon {
  margin-right: 4px;
  font-size: 12px;
}

/* 标签选择器弹出层 */
.tag-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.tag-selector {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.selector-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.selector-header .el-icon {
  font-size: 20px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
}

.selector-header .el-icon:hover {
  color: #374151;
}

.custom-input-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: flex-end;
}

.custom-input-section .el-input {
  flex: 1;
}

.recommended-tags h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.tags-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.tags-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.manage-tags-btn {
  color: #667eea;
  font-size: 12px;
  padding: 4px 8px;
}

.manage-tags-btn:hover {
  color: #5a6fd8;
  background-color: rgba(102, 126, 234, 0.1);
}

.manage-tags-btn .el-icon {
  margin-right: 4px;
  font-size: 12px;
}

.tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

/* 更多标签区域 */
.more-tags-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h5 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.section-header .el-button {
  color: #ea580c;
  font-size: 12px;
  padding: 4px 8px;
}

.section-header .el-button:hover {
  color: #dc2626;
  background-color: rgba(234, 88, 12, 0.1);
}

.more-tags-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 标签提示样式 */
.tag-tips {
  flex-shrink: 0;
  width: 280px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 1px solid #e1f5fe;
  border-radius: 8px;
  margin-left: 20px;
}

.tips-text {
  margin: 0 0 8px 0;
  font-weight: 600;
  color: #1976d2;
  font-size: 14px;
}

.tips-content {
  margin: 4px 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

/* 表单提示文字 */
.form-item-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.2;
  margin-left: 10px;
}

/* 只读值样式 */
.readonly-value {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
  font-size: 14px;
  color: #606266;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  min-width: 150px;
}

/* 没有分类的提示 */
.no-category-tip {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
  background-color: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #d3d4d6;
}

.no-category-tip p {
  margin: 0;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .tag-main-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .tag-tips {
    width: 100%;
    margin-left: 0;
  }
}
</style>
