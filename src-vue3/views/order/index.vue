<template>
  <div class="app-container">
    <p class="page-title">订单列表</p>
    <div class="filter-container">
      <div style="float: right; display: flex">
        <el-input
          v-model:value="params.order_id"
          placeholder="订单编号"
          style="width: 200px; margin: 0 3px"
          class="filter-item"
        />
        <el-input
          v-model:value="params.phone"
          placeholder="手机号"
          style="width: 200px; margin: 0 3px"
          class="filter-item"
        />
        <el-input
          v-model:value="params.user_name"
          placeholder="用户名"
          style="width: 200px; margin: 0 3px"
          class="filter-item"
        />
        <el-date-picker
          v-model:value="date_select"
          type="datetimerange"
          value-format="timestamp"
          @change="dateChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

        <el-select v-model:value="params.pay_status" placeholder="订单状态">
          <el-option
            v-for="item in payStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>

        <el-button type="primary" class="filter-item" @click="search()"
          >搜索
        </el-button>
      </div>
    </div>
    <el-table
      v-loading="table_loading"
      element-loading-text="加载中..."
      border
      :data="list"
    >
      <el-table-column
        label="订单编号"
        prop="order_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="用户id"
        prop="user_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="商品id"
        prop="goods_id"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="商品名称"
        prop="goods_type"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column label="手机号" prop="phone" align="center" />
      <el-table-column label="用户名" prop="user_name" align="center" />
      <el-table-column label="支付方式" prop="pay_typ" align="center" />
      <el-table-column
        label="支付状态"
        prop="pay_status"
        align="center"
        :formatter="getOrderType"
      />
      <el-table-column
        label="交易流水号"
        prop="out_trade_no"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        prop="create_time"
        :formatter="dateFormat"
        align="center"
        width="160px"
      />
      <el-table-column
        label="付款时间"
        prop="payment_time"
        :formatter="dateFormat"
        align="center"
        width="160px"
      />
      <el-table-column
        label="总金额"
        prop="payment"
        :formatter="handelPayment"
        align="center"
        width="100px"
      />

      <!--            <el-table-column align="center"-->
      <!--                             width="300px"-->
      <!--                             label="操作">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <el-button-->
      <!--                        size="mini"-->
      <!--                        type="info"-->
      <!--                        @click="orderDetail(scope.row)">订单详情-->
      <!--                    </el-button>-->
      <!--                </template>-->
      <!--            </el-table-column>-->
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
import { pageMixin } from '@/utils/mixin'
import checkPermission from '@/utils/permission'
import { getOrderList, getOrderDetail } from '@/api/order'
import { formatTimeToStr } from '@/utils/time'

export default {
  name: 'index',
  mixins: [pageMixin],
  data() {
    return {
      params: {
        order_id: '',
        phone: '',
        user_name: '',
        pay_status: 1,
        start_time: 0,
        end_time: 0,
      },
      date_select: [],
      payStatusOptions: [
        {
          value: 1,
          label: '未支付',
        },
        {
          value: 2,
          label: '支付成功',
        },
      ],
      isFullScreen: false,
      order_list: [],
      table_loading: true,
    }
  },
  methods: {
    checkPermission,
    async orderDetail(row) {
      this.dialogTableVisible = true
      const params = {
        order_id: '',
      }
      params.order_id = row.order_id
      const data = await getOrderDetail(params)
      this.order_list = data.data
      this.params.order_id = ''
    },
    // 获取数据
    async _getData() {
      console.log('params:', this.params)

      const res = await getOrderList(this.params)
      this.list = res.data.list
      this.total = res.data.total
      this.table_loading = false

      console.log('data:', this.list)
    },
    handelPayment(row, column) {
      var payment = row[column.property]

      return payment / 100
    },
    dateFormat(row, column) {
      var date = row[column.property]
      if (date === undefined || date === 0) {
        return '未支付'
      }
      return formatTimeToStr(date * 1000, 'yyyy-MM-dd hh:mm:ss')
    },
    dateChange() {
      this.params.start_time = this.date_select[0] / 1000
      this.params.end_time = this.date_select[1] / 1000
      console.log('date:', this.date_select)
    },
    getOrderType(row, column) {
      switch (row[column.property]) {
        case 1:
          return '未支付'
        case 2:
          return '支付成功'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.order_detail {
  .order_list {
    line-height: 20px;
  }

  .order_payment_time {
    margin-top: 10px;
  }
}
</style>
