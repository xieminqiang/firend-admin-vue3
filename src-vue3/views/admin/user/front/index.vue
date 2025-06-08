<template>
  <div class="app-container">
    <p class="page-title">前台用户列表</p>
    <div class="filter-container">
      <div style="float: right; display: flex">
        <el-date-picker
          v-model:value="params.month_date"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-select v-model:value="params.is_admin_proxy" placeholder="真人||AI">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-select v-model:value="params.sex" placeholder="性别">
          <el-option
            v-for="item in sex_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-input
          v-model:value="params.user_name"
          placeholder="姓名"
          style="width: 200px; margin: 0 3px"
          class="filter-item"
        />
        <el-button type="primary" class="filter-item" @click="search()"
          >搜索
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="table_loading"
      element-loading-text="加载中..."
      border
      stripe
      :data="list"
    >
      <el-table-column
        label="用户ID"
        prop="user_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="微信ID"
        prop="wx_open_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="苹果ID"
        prop="apple_open_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column align="center" label="真实姓名" prop="real_name" />
      <el-table-column align="center" label="昵称" prop="nick_name" />
      <el-table-column align="center" label="性别" prop="nick_name">
        <template v-slot="scope">
          <el-tag v-if="scope.row.sex == 'female'" type="success">女 </el-tag>
          <el-tag v-else type="success">男 </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号" prop="phone" />
      <el-table-column align="center" label="头像" width="80px">
        <template v-slot="scope">
          <el-avatar shape="square" :src="scope.row.head_img"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :formatter="dateFormat"
        label="生日"
        prop="birthday"
      >
      </el-table-column>
      <el-table-column align="center" label="填报状态" prop="is_complete_info">
        <template v-slot="scope">
          <el-tag v-if="scope.row.is_complete_info == 'Y'" type="success"
            >已完成
          </el-tag>
          <el-tag v-else type="danger">填报中 </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IM账号" prop="im_account">
      </el-table-column>
      <el-table-column
        align="center"
        label="IM密钥"
        prop="im_sign"
        show-overflow-tooltip
        width="150px"
      >
      </el-table-column>
      <el-table-column
        align="center"
        label="注册时间"
        prop="created_at"
        show-overflow-tooltip
        width="160px"
      >
      </el-table-column>
    </el-table>
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

<script>
import { getFrontUserList } from '@/api/user'
import { pageMixin } from '@/utils/mixin'
import checkPermission from '@/utils/permission'
import { formatTimeToStr } from '@/utils/time'

export default {
  name: 'AdminUser',
  mixins: [pageMixin],
  data() {
    return {
      params: {
        user_name: '',
        month_date: '',
        sex: '',
        is_admin_proxy: 'N',
        start_time: '',
        end_time: '',
      },
      options: [
        {
          value: 'N',
          label: '真人',
        },
        {
          value: 'Y',
          label: 'AI',
        },
      ],
      sex_options: [
        {
          value: 'male',
          label: '男',
        },
        {
          value: 'female',
          label: '女',
        },
      ],
    }
  },
  methods: {
    checkPermission,
    // 获取数据
    async _getData() {
      if (this.params.month_date != '') {
        this.params.start_time = this.params.month_date[0]
        this.params.end_time = this.params.month_date[1]
      }

      console.log('params:', this.params)
      const res = await getFrontUserList(this.params)
      this.list = res.data.list
      this.total = res.data.total
      this.pageSize = res.data.page
      this.page = res.data.pageSize
      this.table_loading = false

      console.log(this.list)
    },
    dateFormat(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return formatTimeToStr(date * 1000, 'yyyy-MM-dd')
    },
  },
}
</script>
