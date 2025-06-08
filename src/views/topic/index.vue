<template>
    <div class="app-container">
        <p class="page-title">话题管理</p>
        <div class="filter-container">
            <el-button type="primary" plain class="filter-item" @click="add()">添加
            </el-button>
            <div style="float: right; display: flex">
                <el-input v-model="params.parent_id"
                          placeholder="话题PID"
                          style="width: 200px; margin: 0 3px"
                          class="filter-item"/>
                <el-input v-model="params.topic_id"
                          placeholder="话题ID"
                          style="width: 200px; margin: 0 3px"
                          class="filter-item"/>
                <el-button type="primary"
                            class="filter-item" 
                            @click="search()">搜索
                </el-button>
            </div>
        </div>
        <el-table v-loading="table_loading" element-loading-text="加载中..." border :data="list">
            <el-table-column label="话题PID" prop="parent_id" align="center" show-overflow-tooltip/>
            <el-table-column label="话题ID" prop="topic_id" align="center" show-overflow-tooltip/>
            <el-table-column label="话题描述" prop="topic_desc" align="center" show-overflow-tooltip/>
            <el-table-column label="话题图标" prop="topic_icon" align="center" width="100px">
                <template  slot-scope="scope">
                    <el-avatar v-if="scope.row.topic_icon" shape="square" :src="scope.row.topic_icon"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" label="操作">
                <template slot-scope="scope">
                    <!-- <el-button  size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->
                    <el-button  size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-container">
            <el-pagination background :current-page.sync="params.page" 
                           :page-size.sync="params.page_size" layout="total, sizes, prev, pager, next, jumper"
                           :total="total" 
                           @size-change="handleSizeChange()" @current-change="handleCurrentChange()"/>
        </div>
    </div>
</template>

<script>
import {pageMixin} from '@/utils/mixin'
import checkPermission from '@/utils/permission'
import {queryTopicPage,deleteTopic} from '@/api/moment'
import {formatTimeToStr} from '@/utils/time'

export default {
    name: 'index',
    mixins: [pageMixin],
    data() {
        return {
            params: {
                parent_id: '',
                topic_id: '',
            },
        }
    },
    methods: {
        checkPermission,
        async _getData(){
            let req = {}
            Object.assign(req,this.params)
            this.table_loading = true
            const res = await queryTopicPage(req)
            if (res.code === 0){
                this.list = res.data.list
                this.total = res.data.total
                this.params.page = res.data.page
            } 
            this.table_loading = false
        },
        dateFormat(row, column) {
            var date = row[column.property];
            if (date === undefined || date === 0) {
                return ''
            }
            return formatTimeToStr(date * 1000, "yyyy-MM-dd hh:mm:ss")
        },
        add() {
            this.$router.push('/topic/add')
        },
        async handleDel(index, info) {
            await this.$confirm('删除话题不可恢复', '警告')
            const { msg } = await deleteTopic({topic_id:info.topic_id})
            this.$message.success(msg)
            this.list.splice(index, 1)
        },
    }
}
</script>
