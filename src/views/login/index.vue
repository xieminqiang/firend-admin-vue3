<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <div class="welcome-text">
          <h2>欢迎使用</h2>
          <h1>随伴行系统</h1>
          <p>让管理更简单，让工作更高效</p>
          <div class="decoration-circles">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">系统登录</h3>
            <p class="subtitle">请使用您的账号密码登录系统</p>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="usernameRef"
              v-model="loginForm.user_name"
              type="text"
              placeholder="请输入用户名"
              class="custom-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="passwordRef"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              class="custom-input"
              @keyup.enter="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>

          <el-form-item prop="verify_code">
            <span class="svg-container">
              <svg-icon icon-class="verify" />
            </span>
            <el-input
              ref="verifyCodeRef"
              v-model="loginForm.verify_code"
              type="text"
              placeholder="请输入验证码"
              class="custom-input"
              @keyup.enter="handleLogin"
            />
            <span class="show-virify" @click="changeVerify">
              <img :src="verify_code" alt="验证码">
            </span>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click.prevent="handleLogin"
          >
            <span class="button-text">{{ loading ? '登录中...' : '登录' }}</span>
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/modules/useUserStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loginFormRef = ref(null)
const usernameRef = ref(null)
const passwordRef = ref(null)
const verifyCodeRef = ref(null)

const loginForm = reactive({
  user_name: 'admin',
  password: 'admin',
  verify_code: '9527'
})

const loginRules = {
  user_name: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [{ required: true, trigger: 'blur', min: 4, message: '长度至少为4位' }],
  verify_code: [{ required: true, trigger: 'blur', len: 4, message: '请输入合法的验证码' }]
}

const loading = ref(false)
const passwordType = ref('password')
const redirect = ref(undefined)
const verify_code = ref('/api/captcha?' + Math.random())

// 监听路由变化
watch(
  () => route.query,
  (query) => {
    redirect.value = query?.redirect
  },
  { immediate: true }
)

// 显示密码
const showPwd = () => {
  passwordType.value = passwordType.value === 'password' ? '' : 'password'
  nextTick(() => {
    passwordRef.value?.focus()
  })
}

// 刷新验证码
const changeVerify = () => {
  verify_code.value = '/api/captcha?' + Math.random()
}

// 登录
const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    await userStore.userLogin(loginForm)
    router.push({ path: redirect.value || '/' })
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || '登录失败')
  } finally {
    changeVerify()
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$primary-color: #409EFF;
$hover-color: #66b1ff;
$gradient-start: #ff6b9d;
$gradient-end: #4facee;
$gradient-start-dark: #e55a8d;
$gradient-end-dark: #3f9eee;

.login-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1e2139 0%, #2a2d5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba($gradient-start, 0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .login-box {
    width: 1000px;
    height: 600px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    display: flex;
    overflow: hidden;
    position: relative;
    animation: fadeIn 0.8s ease-out;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, rgba($gradient-start, 0.1), rgba($gradient-end, 0.1));
      z-index: 1;
    }
  }

  .login-left {
    flex: 1;
    padding: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;

    .welcome-text {
      color: white;
      text-align: center;
      position: relative;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

      h2 {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 20px;
        opacity: 0.9;
        animation: slideUp 0.8s ease-out 0.2s both;
        letter-spacing: 2px;
        background: linear-gradient(45deg, #ffffff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      h1 {
        font-size: 52px;
        font-weight: 700;
        margin-bottom: 30px;
        background: linear-gradient(45deg, $gradient-start, $gradient-end);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: slideUp 0.8s ease-out 0.4s both;
        text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        letter-spacing: 3px;
      }

      p {
        font-size: 18px;
        opacity: 0.9;
        line-height: 1.8;
        animation: slideUp 0.8s ease-out 0.6s both;
        color: #ffffff;
        font-weight: 500;
        letter-spacing: 1px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        background: linear-gradient(45deg, #ffffff, #e0e0e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .decoration-circles {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -1;

        .circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, $gradient-start, $gradient-end);
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;

          &-1 {
            width: 100px;
            height: 100px;
            top: -20px;
            left: -20px;
            animation-delay: 0s;
          }

          &-2 {
            width: 150px;
            height: 150px;
            bottom: -40px;
            right: -40px;
            animation-delay: 2s;
          }

          &-3 {
            width: 70px;
            height: 70px;
            bottom: 50%;
            right: 30%;
            animation-delay: 4s;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      }
    }
  }

  .login-right {
    flex: 1;
    padding: 60px;
    position: relative;
    z-index: 2;
  }

  .login-form {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    margin-bottom: 40px;
    text-align: center;

    .title {
      font-size: 28px;
      color: $light_gray;
      margin: 0 0 10px;
      font-weight: 600;
      background: linear-gradient(45deg, $gradient-start, $gradient-end);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: fadeIn 0.8s ease-out;
    }

    .subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      margin: 0;
      animation: fadeIn 0.8s ease-out 0.2s both;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    transition: all 0.3s ease;

    &:hover {
      color: $primary-color;
      transform: scale(1.1);
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    padding: 5px;

    &:hover {
      color: $primary-color;
      transform: scale(1.1);
    }
  }

  .show-virify {
    position: absolute;
    right: 2px;
    top: 2px;
    bottom: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    padding: 2px;

    &:hover {
      opacity: 0.8;
      transform: scale(1.02);
    }

    img {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }
  }

  .login-button {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
    background: linear-gradient(45deg, $gradient-start, $gradient-end);
    border: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    .button-text {
      position: relative;
      z-index: 1;
      transition: all 0.3s ease;
    }

    &:hover {
      background: linear-gradient(45deg, $gradient-start-dark, $gradient-end-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba($gradient-start, 0.3);

      .button-text {
        transform: scale(1.05);
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
$primary-color: #409EFF;
$hover-color: #66b1ff;
$gradient-start: #ff6b9d;
$gradient-end: #4facee;
$gradient-start-dark: #e55a8d;
$gradient-end-dark: #3f9eee;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      font-size: 14px;
      letter-spacing: 0.5px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.3s ease;
      }

      &:focus::placeholder {
        opacity: 0.7;
        transform: translateX(5px);
      }
    }

    .el-input__wrapper {
      background: transparent !important;
      box-shadow: none !important;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    color: #454545;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 25px;
    overflow: hidden;

    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    &:focus-within {
      border-color: $primary-color;
      background: rgba(0, 0, 0, 0.2);
      box-shadow: 0 0 15px rgba($primary-color, 0.1);
    }
  }

  .el-button {
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: 0.5s;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba($primary-color, 0.3);

      &::before {
        left: 100%;
      }
    }

    &:active {
      transform: translateY(1px);
    }
  }
}
</style>
