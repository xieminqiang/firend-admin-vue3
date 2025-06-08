<template>
    <div class="app-container">
        <p class="page-title">服务列表</p>
        
        <!-- 搜索和操作区域 -->
        <div class="filter-container">
            <el-input
                v-model="params.keyword"
                placeholder="请输入服务名称"
                style="width: 200px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"
            />
            <el-select
                v-model="params.category_id"
                placeholder="服务分类"
                clearable
                style="width: 150px;"
                class="filter-item"
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
                icon="el-icon-search"
                class="filter-item"
                @click="handleFilter"
            >
                搜索
            </el-button>
            <el-button
                type="primary"
                icon="el-icon-plus"
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
            <el-table-column
                label="ID"
                prop="id"
                align="center"
                width="80"
            />
            <el-table-column
                label="服务名称"
                prop="name"
                align="center"
                min-width="150"
            />
            <el-table-column
                label="服务分类"
                prop="category_name"
                align="center"
                width="120"
            />
            <el-table-column
                label="价格"
                prop="price"
                align="center"
                width="100"
            >
                <template slot-scope="scope">
                    ¥{{ scope.row.price }}
                </template>
            </el-table-column>
            <el-table-column
                label="状态"
                prop="status"
                align="center"
                width="100"
            >
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.status === 1 ? 'success' : 'danger'"
                        size="small"
                    >
                        {{ scope.row.status === 1 ? '启用' : '禁用' }}
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
                <template slot-scope="scope">
                    <!-- <el-button  size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->
               
                    <el-button
                        size="mini"
                        type="success"
                        @click="handleEdit(scope.row)"
                    >
                        编辑
                    </el-button>
                </template>
            </el-table-column>
           
        </el-table>

        <!-- 分页组件 -->
        <div class="page-container">
            <el-pagination
                background
                :current-page.sync="params.page"
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

<script>
import { getServiceList, getServiceCategories } from '@/api/service'
import { pageMixin } from '@/utils/mixin'
import checkPermission from '@/utils/permission'

export default {
    name: 'ServiceList',
    mixins: [pageMixin],
    data() {
        return {
            params: {
                keyword: '',
                category_id: '',
                page: 1,
                pageSize: 10
            },
            categoryOptions: []
        }
    },
    created() {
        this.init()
    },
    methods: {
        checkPermission,
        // 初始化
        async init() {
            await this.getCategories()
            this._getData()
        },
        // 获取服务分类
        async getCategories() {
            try {
                const res = await getServiceCategories()
                if (res.code === 0) {
                    this.categoryOptions = res.data || []
                }
            } catch (error) {
                console.error('获取服务分类失败:', error)
            }
        },
        // 获取服务列表数据
        async _getData() {
            this.table_loading = true
            try {
                const res = await getServiceList(this.params)
                if (res.code === 0) {
                    this.list = res.data.list || []
                    this.total = res.data.total || 0
                    this.params.page = res.data.page || 1
                }
            } catch (error) {
                this.$message.error('获取服务列表失败')
                console.error('获取服务列表失败:', error)
            } finally {
                this.table_loading = false
            }
        },
        // 搜索过滤
        handleFilter() {
            this.params.page = 1
            this._getData()
        },
        // 添加服务
        handleAdd() {
            if (!checkPermission('service-add')) {
                this.$message.error('您没有添加服务的权限')
                return
            }
            this.$router.push('/service/add')
        },
        // 编辑服务
        handleEdit(row) {
            if (!checkPermission('service-edit')) {
                this.$message.error('您没有编辑服务的权限')
                return
            }
            this.$router.push(`/service/edit/${row.id}`)
        }
    }
}
</script>

<style scoped>
.filter-container {
    margin-bottom: 20px;
}

.filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
}

.page-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #303133;
}
</style> 