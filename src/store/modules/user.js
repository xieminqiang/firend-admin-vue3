import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Base64 } from 'js-base64'
const getDefaultState = () => {
    return {
        token: getToken(),
        id: 0,
        user_id: '',
        user_name: '',
        real_name: '',
        role: [],
        auth: [],
        tel: '',
        sub: '',
        exp: 0 // 过期时间
    }
}

const state = getDefaultState()

const parseToken = token => {
    if (!token) {
        return { id: 0 }
    }
    const jwt_arr = token.split('.')
    return JSON.parse(Base64.decode(jwt_arr[1]))
}

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
        Object.assign(state, parseToken(state.token))
    },
    SET_USER_INFO: (state, user) => {
        state.id = user.userInfo.id
        state.user_id = user.userInfo.user_id
        state.user_name = user.userInfo.user_name
        state.real_name = user.userInfo.real_name
        state.tel = user.userInfo.tel
        state.role = user.role
        state.auth = user.auth

        console.log("role:",user.role)
        console.log("auth:",user.auth)
    }
}

const actions = {
    // user login
    async login({ commit, dispatch }, userInfo) {
        try {
            const { data } = await login(userInfo)
            commit('SET_TOKEN', data)
            setToken(data)
            await dispatch('getUserInfo')
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    },

    async getUserInfo({ commit }) {
        try {
            const { data } = await getUserInfo()
            commit('SET_USER_INFO', data)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    },

    // user logout
    async logout({ commit }) {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        return Promise.resolve()
    },

    // remove token
    async resetToken({ commit }) {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        return Promise.resolve()
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

