<template>
  <div class="app-container">
    <p class="page-title">前台用户统计</p>
    <div class="filter-container">
      <div style="float: right; display: flex">
        <!-- <el-select v-model="params.groupType" placeholder="月|日">
                      <el-option label="月" value="year"></el-option>
                      <el-option label="日" value="month"></el-option>
                  </el-select> -->

        <el-date-picker
          v-model:value="params.times"
          type="monthrange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>

        <el-select v-model:value="params.is_admin_proxy" placeholder="真人||AI">
          <el-option label="真人" value="N"></el-option>
          <el-option label="AI" value="Y"></el-option>
        </el-select>

        <el-button type="primary" class="filter-item" @click="click()"
          >搜索
        </el-button>
      </div>
    </div>

    <div class="main_container" id="maychar"></div>
  </div>
</template>

<script>
import { getFrontUserListGroup } from '@/api/user'
export default {
  name: 'AdminUserGroup',
  data() {
    return {
      params: {
        times: [1672502400000, 1701360000000],
        groupType: '',
        is_admin_proxy: 'N',
      },
      data: {
        xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [23, 24, 18, 25, 27, 28, 25],
      },
    }
  },
  mounted() {
    var start = new Date()
    start.setFullYear(start.getFullYear() - 1)
    start.setMonth(start.getMonth() + 1)
    this.initTime(start, new Date())
    this.click()
  },
  methods: {
    // 使用柱形图，关于其他配置可以去官网查看
    getCharts() {
      const chartBox = this.$echarts.init(document.getElementById('maychar'))
      const option = {
        xAxis: {
          data: this.data.xAxis,
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: this.data.series,
          },
        ],
      }
      chartBox.setOption(option)
      // 根据页面大小自动响应图表大小
      window.addEventListener('resize', function () {
        chartBox.resize()
      })
    },
    getMonthStart(today) {
      today.setMonth(today.getMonth())
      today.setDate(1)
      today.setHours(0)
      today.setSeconds(0)
      today.setMinutes(0)
      return today.getTime()
    },
    click() {
      var param = {
        is_admin_proxy: this.params.is_admin_proxy,
      }
      if (this.params.times.length >= 1) {
        param.start_time = Math.floor(this.params.times[0] / 1000)
        param.end_time = Math.floor(this.params.times[1] / 1000)
      }
      getFrontUserListGroup(param).then((res) => {
        console.log(res)
        this.data.series = res.data.series
        this.data.xAxis = res.data.x_axis
        this.getCharts()
      })
    },
    initTime(start, end) {
      let tmpArr = []
      tmpArr.push(this.getMonthStart(start))
      tmpArr.push(this.getMonthStart(end))
      this.params.times = tmpArr
    },
  },
}
</script>

<style lang="scss" scoped>
.main_container {
  width: 100%;
  height: 500px;
  overflow: hidden;
}
</style>
