import { login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

import Cookies from "js-cookie";
const user = {
  state: {
    token: getToken(),
 
 
    username:localStorage.getItem('username')?localStorage.getItem('username') :"",
    roles: [],
    permissions: [],
    userInfo:Cookies.get('userInfo')? JSON.parse(Cookies.get('userInfo')) :{}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_userInfo: (state, userInfo) => {
        state.userInfo = userInfo
    },
    
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    
    SET_username: (state, permissions) => {
        state.username = permissions
      },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) { 
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          console.log(res);
          commit('SET_TOKEN', res.token)
          setToken(res.token)
          commit('SET_username', userInfo.username)
          window.localStorage.setItem('username', userInfo.username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(res => {
    //       const user = res.user
    //       const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
    //       if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //         commit('SET_ROLES', res.roles)
    //         commit('SET_PERMISSIONS', res.permissions)
    //       } else {
    //         commit('SET_ROLES', ['ROLE_DEFAULT'])
    //       }
    //       commit('SET_ID', user.userId)
    //       commit('SET_NAME', user.userName)
    //       commit('SET_AVATAR', avatar)
    //       resolve(res)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => { 
          removeToken()
          resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
