<template>
    <div class="navbar">
        <hamburger :is-active="sidebar.opened"
                   class="hamburger-container"
                   @toggleClick="toggleSideBar" />

        <breadcrumb class="breadcrumb-container" />

        <div class="right-menu">
            <el-dropdown class="avatar-container"
                         trigger="click">
                <div class="avatar-wrapper">
                    <div class="user-avatar">
                        {{ user.real_name }}
                    </div>
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-dropdown-menu slot="dropdown"
                                  class="user-dropdown">
                    <router-link to="/">
                        <el-dropdown-item>
                            主页
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item divided
                                      @click.native="logout">
                        <span style="display:block;">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
    components: {
        Breadcrumb,
        Hamburger
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'user'
        ])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            location.reload()
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../styles/variables.scss";

.navbar {
    height: 60px;
    overflow: hidden;
    position: relative;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 2px 20px rgba(0, 21, 41, 0.08);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 107, 157, 0.1);

    .hamburger-container {
        line-height: 56px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -webkit-tap-highlight-color: transparent;
        padding: 0 15px;
        border-radius: $borderRadiusMedium;
        margin: 8px;

        &:hover {
            background: rgba(255, 107, 157, 0.05);
            transform: scale(1.05);
        }
    }

    .breadcrumb-container {
        float: left;
        margin-left: 10px;
        line-height: 60px;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 60px;
        display: flex;
        align-items: center;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 12px;
            height: 40px;
            font-size: 18px;
            color: #64748b;
            vertical-align: text-bottom;
            border-radius: $borderRadiusMedium;
            transition: all 0.3s ease;
            margin: 0 4px;

            &.hover-effect {
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

                &:hover {
                    background: rgba(255, 107, 157, 0.05);
                    color: $primaryColor;
                    transform: translateY(-2px);
                }
            }
        }

        .avatar-container {
            margin-right: 25px;

            .avatar-wrapper {
                margin-top: 0;
                position: relative;
                display: flex;
                align-items: center;
                padding: 8px 15px;
                background: linear-gradient(135deg, rgba(255, 107, 157, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%);
                border-radius: $borderRadiusLarge;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;

                &:hover {
                    background: linear-gradient(135deg, rgba(255, 107, 157, 0.15) 0%, rgba(79, 172, 254, 0.15) 100%);
                    transform: translateY(-2px);
                    box-shadow: $shadowMedium;
                }

                .user-avatar {
                    cursor: pointer;
                    height: 36px;
                    padding: 0 12px;
                    border-radius: $borderRadiusMedium;
                    background: linear-gradient(135deg, $primaryColor 0%, $secondaryColor 100%);
                    color: white;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    box-shadow: $shadowLight;
                    transition: all 0.3s ease;

                    &:hover {
                        transform: scale(1.05);
                        box-shadow: $shadowMedium;
                    }
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    margin-left: 8px;
                    font-size: 14px;
                    color: $primaryColor;
                    transition: all 0.3s ease;
                }

                &:hover .el-icon-caret-bottom {
                    transform: rotate(180deg);
                }
            }
        }
    }
}

// 下拉菜单样式
:deep(.user-dropdown) {
    margin-top: 10px !important;
    border-radius: $borderRadiusMedium !important;
    border: none !important;
    box-shadow: $shadowHeavy !important;
    background: white !important;
    
    .el-dropdown-menu__item {
        padding: 12px 20px !important;
        color: #475569 !important;
        font-weight: 500 !important;
        transition: all 0.3s ease !important;
        
        &:hover {
            background: rgba(255, 107, 157, 0.05) !important;
            color: $primaryColor !important;
        }
        
        &:not(:last-child) {
            border-bottom: 1px solid #f1f5f9 !important;
        }
    }
}
</style>
