<template>
  <div class="app-container">
    <p class="page-title">聊天管理</p>
    <div class="filter-container">
      <el-input
        v-model="params.admin_user_id"
        placeholder="管理员ID"
        class="filter-item"
        clearable
        style="width: 200px"
      />
      <el-input
        v-model="params.user_id"
        placeholder="用户ID"
        class="filter-item"
        clearable
        style="width: 200px"
      />
      <el-button
        type="primary"
        class="filter-item"
        @click="search()"
      >
        <el-icon class="el-icon--left"><Search /></el-icon>
        搜索
      </el-button>
      <el-button
        type="primary"
        class="filter-item"
        @click="add()"
      >
        <el-icon class="el-icon--left"><Plus /></el-icon>
        添加
      </el-button>
    </div>
    <el-table
      v-loading="table_loading"
      element-loading-text="加载中..."
      border
      :data="list"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="管理员ID"
        prop="admin_user_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="用户ID"
        prop="user_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        prop="created_at"
        align="center"
        :formatter="(row, column) => formatDate(row.created_at)"
        show-overflow-tooltip
        width="160px"
      />
      <el-table-column align="center" label="昵称" prop="nick_name" />
      <el-table-column align="center" label="头像" width="80px">
        <template v-slot="scope">
          <el-avatar shape="square" :src="scope.row.head_img"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template v-slot="scope">
          <!-- <el-button  size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button> -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDel(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleGreet(scope.$index, scope.row)"
            >发消息</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        v-model:current-page="params.page"
        v-model:page-size="params.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange()"
        @current-change="handleCurrentChange()"
      />
    </div>
    <el-dialog title="发送一条消息" v-model="dialogVisible" width="60%">
      <el-form ref="elForm" label-width="100px">
        <el-form-item label="用户">
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          >
            <template v-slot="{ item }">
              <el-avatar
                :size="'medium'"
                :fit="'contain'"
                :src="item.head_img"
              ></el-avatar>
              <div class="name">{{ item.value }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入内容"
            v-model="greepForm.text"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 定</el-button>
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Search, Plus } from '@element-plus/icons-vue'
import { pageMixin } from '@/utils/mixin'
import checkPermission from '@/utils/permission'
import { chatAdd, chatDel, chatList, searchUser, chatGreet } from '@/api/chat'
import { formatTimeToStr, formatDate } from '@/utils/time'
import TencentCloudChat from '@tencentcloud/chat'

export default {
  name: 'index',
  mixins: [pageMixin],
  data() {
    return {
      params: {
        admin_user_id: '',
        user_id: '',
      },
      data: {
        list: [
          {
            id: 1,
            admin_user_id: '385f41aa-1360-11ee-be56-0242ac120002',
            user_id: '10008888',
          },
        ],
        total: 3,
      },
      dialogVisible: false,
      state: '',
      formatDate: formatDate,
      greepForm: {
        fromUserId: '',
        text: '',
        user: '',
      },
    }
  },
  methods: {
    checkPermission,
    async _getData() {
      let req = {}
      Object.assign(req, this.params)
      const res = await chatList(req)
      console.log('load...', req, res)
      if (res.code === 0) {
        this.list = res.data.list
        this.total = res.data.total
        this.params.page = res.data.page
      }
      this.table_loading = false
    },
    dateFormat(row, column) {
      var date = row[column.property]
      if (date === undefined || date === 0) {
        return ''
      }
      return formatTimeToStr(date * 1000, 'yyyy-MM-dd hh:mm:ss')
    },
    add() {
      console.log('add...')
      this.$router.push('/chat/add')
    },
    async handleDel(index, info) {
      await this.$confirm('删除记录不可恢复', '警告')
      const { msg } = await chatDel({ id: info.id })
      this.$message.success(msg)
      this.list.splice(index, 1)
    },
    async handleGreet(index, info) {
      console.log(info)
      this.greepForm.fromUserId = info.user_id
      this.dialogVisible = true
    },
    querySearchAsync(queryString, cb) {
      searchUser({ keyword: queryString }).then((res) => {
        cb(res.data)
      })
    },
    handleSelect(item) {
      console.log(item)
      this.greepForm.user = item
    },
    handleConfirm() {
      chatGreet({
        user_id: this.greepForm.fromUserId,
        to_user_id: this.greepForm.user.user_id,
        text: this.greepForm.text,
      }).then((res) => {
        this.dialogVisible = false
        this.greepForm.text = ''
      })
    },
  },
}
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

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>
