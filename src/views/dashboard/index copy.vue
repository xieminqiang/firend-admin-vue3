<template>
  <div class="dashboard-container">
    <!-- 🎨 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <h1>欢迎回来，{{ user.real_name || '亲爱的' }}</h1>
        <p class="date-time">{{ getCurrentDate() }} {{ getCurrentTime() }}</p>
      </div>
      <div class="floating-hearts">
        <span class="heart">💖</span>
        <span class="heart">💝</span>
        <span class="heart">💗</span>
        <span class="heart">💓</span>
      </div>
    </div>

    <!-- 📊 数据统计卡片 -->
    <!-- <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">1,234</h3>
          <p class="stat-label">用户总数</p>
          <span class="stat-change positive">+12%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <el-icon><ChatLineRound /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">5,678</h3>
          <p class="stat-label">消息总数</p>
          <span class="stat-change positive">+8%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <el-icon><CollectionTag /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">892</h3>
          <p class="stat-label">话题数量</p>
          <span class="stat-change positive">+15%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger">
          <el-icon><Star /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">4.8</h3>
          <p class="stat-label">用户评分</p>
          <span class="stat-change positive">+0.2</span>
        </div>
      </div>
    </div> -->

    <!-- 📈 图表区域 -->
    <div class="chart-section">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>📈 用户增长趋势</span>
                <el-button style="float: right; padding: 3px 0" link>查看详情</el-button>
              </div>
            </template>
            <div class="chart-container">
              <!-- 这里放置图表组件 -->
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>📊 用户分布</span>
                <el-button style="float: right; padding: 3px 0" link>查看详情</el-button>
              </div>
            </template>
            <div class="chart-container">
              <!-- 这里放置饼图组件 -->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 📝 最新动态 -->
    <div class="activity-section">
      <el-card class="activity-card">
        <template #header>
          <div class="card-header">
            <span>📝 最新动态</span>
            <el-button style="float: right; padding: 3px 0" link>查看全部</el-button>
          </div>
        </template>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-avatar">💕</div>
            <div class="activity-content">
              <p class="activity-text">用户小美发布了新的动态</p>
              <span class="activity-time">2分钟前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">🌟</div>
            <div class="activity-content">
              <p class="activity-text">话题"如何保持长距离恋爱"获得100个点赞</p>
              <span class="activity-time">5分钟前</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-avatar">💖</div>
            <div class="activity-content">
              <p class="activity-text">系统已成功匹配10对新情侣</p>
              <span class="activity-time">10分钟前</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import {
  User,
  ChatLineRound,
  CollectionTag,
  Star,
  Plus,
  ChatDotSquare,
  View,
  Setting,
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/useUserStore'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const userStore = useUserStore()
const currentTime = ref('')
let timer = null

const user = computed(() => userStore.userInfo || {})

const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getCurrentTime = () => {
  return currentTime.value
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
@use '../../styles/variables.scss' as *;
.dashboard-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px);
} /*// 🎨 欢迎横幅样式*/
.welcome-banner {
  background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
  border-radius: $borderRadiusLarge;
  padding: 40px;
  color: white;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  box-shadow: $shadowHeavy;

  .welcome-content {
    position: relative;
    z-index: 1;

    h1 {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 10px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .date-time {
      font-size: 16px;
      opacity: 0.9;
    }
  }

  .floating-hearts {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 48px;
    opacity: 0.2;
  }
} /*// 📊 统计卡片样式*/
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  border-radius: $borderRadiusLarge;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: $shadowLight;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadowHeavy;
  }

  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    font-size: 24px;

    &.primary {
      background: linear-gradient(135deg, $primaryColor 0%, #ff5a8a 100%);
      color: white;
    }

    &.success {
      background: linear-gradient(135deg, $successColor 0%, #4caf50 100%);
      color: white;
    }

    &.warning {
      background: linear-gradient(135deg, $warningColor 0%, #ffa726 100%);
      color: white;
    }

    &.danger {
      background: linear-gradient(135deg, $errorColor 0%, #ff5252 100%);
      color: white;
    }
  }

  .stat-info {
    flex: 1;

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 5px;
    }

    .stat-label {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 5px;
    }

    .stat-change {
      font-size: 12px;
      font-weight: 500;

      &.positive {
        color: $successColor;
      }

      &.negative {
        color: $errorColor;
      }
    }
  }
} /*// 📈 图表区域样式*/
.chart-section {
  margin-bottom: 30px;

  .chart-card {
    border-radius: $borderRadiusLarge;
    box-shadow: $shadowLight;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadowMedium;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #1e293b;
    }

    .chart-container {
      height: 300px;
      padding: 20px 0;
    }
  }
}
.activity-section {
  .activity-card {
    border-radius: $borderRadiusLarge;
    box-shadow: $shadowLight;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadowMedium;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #1e293b;
    }

    .activity-list {
      .activity-item {
        display: flex;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
          border-bottom: none;
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 20px;
        }

        .activity-content {
          flex: 1;

          .activity-text {
            margin: 0 0 5px;
            color: #1e293b;
            font-weight: 500;
          }

          .activity-time {
            font-size: 12px;
            color: #64748b;
          }
        }
      }
    }
  }
} /*// 🎭 动画效果*/
@keyframes float-heart {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
} /*// 📱 响应式设计*/
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .welcome-banner {
    padding: 24px;

    .welcome-content {
      flex-direction: column;
      text-align: center;
    }

    .welcome-title {
      font-size: 2rem;
    }

    .welcome-stats {
      justify-content: center;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-section {
    grid-template-columns: 1fr;
  }
}
</style>
