<template>
  <div class="dashboard-container">
    <!-- 🎨 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-content">
        <div class="welcome-info">
          <h1 class="welcome-title">🌟 欢迎回来，{{ user.real_name }}</h1>
          <p class="welcome-subtitle">
            让每一次兴趣相遇，都成为温暖的陪伴时光～
          </p>
          <div class="welcome-stats">
            <div class="stat-item">
              <span class="stat-number">{{ getCurrentDate() }}</span>
              <span class="stat-label">今日日期</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getCurrentTime() }}</span>
              <span class="stat-label">当前时间</span>
            </div>
          </div>
        </div>
        <div class="welcome-image">
          <div class="floating-hearts">
            <span class="heart">💕</span>
            <span class="heart">💖</span>
            <span class="heart">💗</span>
            <span class="heart">💝</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 📊 数据统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <el-icon><el-icon-user /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">1,234</h3>
          <p class="stat-label">用户总数</p>
          <span class="stat-change positive">+12%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon success">
          <el-icon><el-icon-chat-line-round /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">5,678</h3>
          <p class="stat-label">消息总数</p>
          <span class="stat-change positive">+8%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon warning">
          <el-icon><el-icon-collection-tag /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">892</h3>
          <p class="stat-label">话题数量</p>
          <span class="stat-change positive">+15%</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon danger">
          <el-icon><el-icon-star-on /></el-icon>
        </div>
        <div class="stat-info">
          <h3 class="stat-value">4.8</h3>
          <p class="stat-label">用户评分</p>
          <span class="stat-change positive">+0.2</span>
        </div>
      </div>
    </div>

    <!-- 📈 图表区域 -->
    <div class="charts-section">
      <div class="chart-container">
        <el-card class="chart-card">
          <template v-slot:header>
            <div class="card-header">
              <span>📈 用户增长趋势</span>
              <el-button style="float: right; padding: 3px 0" type="text"
                >查看详情</el-button
              >
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="chart-content">
              <div class="chart-bars">
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 75%"></div>
                <div class="bar" style="height: 95%"></div>
                <div class="bar" style="height: 85%"></div>
              </div>
              <div class="chart-labels">
                <span>周一</span>
                <span>周二</span>
                <span>周三</span>
                <span>周四</span>
                <span>周五</span>
                <span>周六</span>
                <span>周日</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div class="quick-actions">
        <el-card class="action-card">
          <template v-slot:header>
            <div class="card-header">
              <span>🚀 快速操作</span>
            </div>
          </template>
          <div class="action-buttons">
            <el-button type="primary" size="medium" class="action-btn">
              <el-icon><el-icon-plus /></el-icon>
              新增用户
            </el-button>
            <el-button type="success" size="medium" class="action-btn">
              <el-icon><el-icon-chat-dot-square /></el-icon>
              发布话题
            </el-button>
            <el-button type="warning" size="medium" class="action-btn">
              <el-icon><el-icon-view /></el-icon>
              系统监控
            </el-button>
            <el-button type="info" size="medium" class="action-btn">
              <el-icon><el-icon-setting /></el-icon>
              系统设置
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 📝 最新动态 -->
    <div class="activity-section">
      <el-card class="activity-card">
        <template v-slot:header>
          <div class="card-header">
            <span>📝 最新动态</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >查看全部</el-button
            >
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

<script>
import {
  User as ElIconUser,
  ChatLineRound as ElIconChatLineRound,
  CollectionTag as ElIconCollectionTag,
  StarOn as ElIconStarOn,
  Plus as ElIconPlus,
  ChatDotSquare as ElIconChatDotSquare,
  View as ElIconView,
  Setting as ElIconSetting,
} from '@element-plus/icons'
import { mapGetters } from 'vuex'

export default {
  components: {
    ElIconUser,
    ElIconChatLineRound,
    ElIconCollectionTag,
    ElIconStarOn,
    ElIconPlus,
    ElIconChatDotSquare,
    ElIconView,
    ElIconSetting,
  },
  name: 'Dashboard',
  data() {
    return {
      currentTime: '',
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    getCurrentDate() {
      const now = new Date()
      return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    getCurrentTime() {
      return this.currentTime
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('zh-CN', {
        hour12: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.dashboard-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px);
} /*// 🎨 欢迎横幅样式*/
.welcome-banner {
  background: linear-gradient(135deg, #ff6b9d 0%, #4facfe 100%);
  border-radius: $borderRadiusLarge;
  padding: 40px;
  margin-bottom: 30px;
  color: white;
  box-shadow: $shadowHeavy;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100%;
    height: 200%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>')
      repeat;
    animation: float 20s infinite linear;
  }

  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .welcome-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 12px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .welcome-subtitle {
    font-size: 1.1rem;
    margin-bottom: 30px;
    opacity: 0.9;
  }

  .welcome-stats {
    display: flex;
    gap: 40px;

    .stat-item {
      text-align: center;

      .stat-number {
        display: block;
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }

  .floating-hearts {
    position: relative;

    .heart {
      position: absolute;
      font-size: 2rem;
      animation: float-heart 3s infinite ease-in-out;

      &:nth-child(1) {
        animation-delay: 0s;
        top: 0px;
        right: 0px;
      }
      &:nth-child(2) {
        animation-delay: 1s;
        top: 30px;
        right: 40px;
      }
      &:nth-child(3) {
        animation-delay: 2s;
        top: -20px;
        right: 80px;
      }
      &:nth-child(4) {
        animation-delay: 1.5s;
        top: 50px;
        right: 20px;
      }
    }
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
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 4px;
      color: #1e293b;
    }

    .stat-label {
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .stat-change {
      font-size: 0.9rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: $borderRadiusSmall;

      &.positive {
        background: rgba(107, 207, 126, 0.1);
        color: $successColor;
      }
    }
  }
} /*// 📈 图表区域样式*/
.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}
.chart-card,
.action-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    color: #1e293b;
  }
}
.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .chart-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .chart-bars {
      flex: 1;
      display: flex;
      align-items: end;
      justify-content: space-around;
      padding: 20px 0;

      .bar {
        width: 30px;
        background: $gradientPrimary;
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;

        &:hover {
          transform: scaleY(1.1);
        }
      }
    }

    .chart-labels {
      display: flex;
      justify-content: space-around;
      padding-top: 10px;
      color: #64748b;
      font-size: 0.9rem;
    }
  }
}
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  .action-btn {
    width: 100%;
    height: 48px;
    border-radius: $borderRadiusMedium;
    font-weight: 500;
    justify-content: flex-start;

    i {
      margin-right: 8px;
    }
  }
} /*// 📝 最新动态样式*/
.activity-section {
  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f1f5f9;

      &:last-child {
        border-bottom: none;
      }

      .activity-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 107, 157, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        font-size: 1.2rem;
      }

      .activity-content {
        flex: 1;

        .activity-text {
          color: #1e293b;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .activity-time {
          color: #64748b;
          font-size: 0.9rem;
        }
      }
    }
  }
} /*// 🎭 动画效果*/
@keyframes float {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-100px);
  }
}
@keyframes float-heart {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
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

  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>
