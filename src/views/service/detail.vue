<template>
    <div class="app-container">
        <div class="page-header">
            <el-button icon="el-icon-arrow-left" @click="handleBack">返回</el-button>
            <span class="page-title">服务详情</span>
        </div>
        
        <el-card v-loading="loading">
            <div v-if="!loading && serviceData">
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-descriptions title="基本信息" :column="2" border>
                            <el-descriptions-item label="服务ID">
                                {{ serviceData.id }}
                            </el-descriptions-item>
                            <el-descriptions-item label="服务名称">
                                {{ serviceData.name }}
                            </el-descriptions-item>
                            <el-descriptions-item label="服务分类">
                                {{ serviceData.category_name }}
                            </el-descriptions-item>
                            <el-descriptions-item label="服务价格">
                                <span style="color: #f56c6c; font-weight: bold;">
                                    ¥{{ serviceData.price }}
                                </span>
                            </el-descriptions-item>
                            <el-descriptions-item label="服务状态">
                                <el-tag
                                    :type="serviceData.status === 1 ? 'success' : 'danger'"
                                    size="small"
                                >
                                    {{ serviceData.status === 1 ? '启用' : '禁用' }}
                                </el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="排序值">
                                {{ serviceData.sort }}
                            </el-descriptions-item>
                            <el-descriptions-item label="创建时间">
                                {{ serviceData.created_at }}
                            </el-descriptions-item>
                            <el-descriptions-item label="更新时间">
                                {{ serviceData.updated_at }}
                            </el-descriptions-item>
                        </el-descriptions>

                        <el-descriptions title="详细信息" :column="1" border style="margin-top: 20px;">
                            <el-descriptions-item label="服务描述">
                                <div class="description-content">
                                    {{ serviceData.description }}
                                </div>
                            </el-descriptions-item>
                            <el-descriptions-item label="服务详情">
                                <div class="content-area">
                                    <pre>{{ serviceData.content }}</pre>
                                </div>
                            </el-descriptions-item>
                            <el-descriptions-item label="标签" v-if="serviceData.tags">
                                <div class="tags-container">
                                    <el-tag
                                        v-for="tag in tagList"
                                        :key="tag"
                                        size="small"
                                        style="margin-right: 10px; margin-bottom: 5px;"
                                    >
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-col>
                    
                    <el-col :span="8">
                        <el-card header="服务图片" v-if="serviceData.image">
                            <div class="image-container">
                                <img :src="serviceData.image" alt="服务图片" class="service-image">
                            </div>
                        </el-card>
                        
                        <el-card header="操作" style="margin-top: 20px;">
                            <div class="action-buttons">
                                <el-button 
                                    type="primary" 
                                    icon="el-icon-edit"
                                    @click="handleEdit"
                                    v-if="checkPermission('service-edit')"
                                >
                                    编辑服务
                                </el-button>
                                <el-button 
                                    type="danger" 
                                    icon="el-icon-delete"
                                    @click="handleDelete"
                                    v-if="checkPermission('service-delete')"
                                >
                                    删除服务
                                </el-button>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getServiceDetail, deleteService } from '@/api/service'
import checkPermission from '@/utils/permission'

export default {
    name: 'ServiceDetail',
    data() {
        return {
            serviceData: null,
            loading: false,
            serviceId: null
        }
    },
    computed: {
        tagList() {
            if (!this.serviceData || !this.serviceData.tags) return []
            return this.serviceData.tags.split(',').filter(tag => tag.trim())
        }
    },
    created() {
        this.serviceId = this.$route.params.id
        this.getServiceData()
    },
    methods: {
        checkPermission,
        // 获取服务详情
        async getServiceData() {
            if (!this.serviceId) {
                this.$message.error('服务ID不存在')
                this.$router.go(-1)
                return
            }
            
            this.loading = true
            try {
                const res = await getServiceDetail(this.serviceId)
                if (res.code === 0) {
                    this.serviceData = res.data
                } else {
                    this.$message.error(res.msg || '获取服务详情失败')
                    this.$router.go(-1)
                }
            } catch (error) {
                this.$message.error('获取服务详情失败')
                console.error('获取服务详情失败:', error)
                this.$router.go(-1)
            } finally {
                this.loading = false
            }
        },
        // 返回上一页
        handleBack() {
            this.$router.go(-1)
        },
        // 编辑服务
        handleEdit() {
            this.$router.push(`/service/edit/${this.serviceId}`)
        },
        // 删除服务
        async handleDelete() {
            try {
                await this.$confirm('确定要删除该服务吗？删除后不可恢复！', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                
                const res = await deleteService(this.serviceId)
                if (res.code === 0) {
                    this.$message.success(res.msg || '删除成功')
                    this.$router.push('/service/list')
                } else {
                    this.$message.error(res.msg || '删除失败')
                }
            } catch (error) {
                if (error !== 'cancel') {
                    this.$message.error('删除服务失败')
                    console.error('删除服务失败:', error)
                }
            }
        }
    }
}
</script>

<style scoped>
.page-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.page-title {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
    color: #303133;
}

.description-content {
    line-height: 1.6;
    color: #606266;
}

.content-area pre {
    background-color: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    padding: 15px;
    line-height: 1.6;
    color: #606266;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
}

.tags-container {
    line-height: 1.8;
}

.image-container {
    text-align: center;
}

.service-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-buttons .el-button {
    width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .page-title {
        margin-left: 0;
        margin-top: 10px;
    }
}
</style> 