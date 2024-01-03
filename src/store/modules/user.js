import { login } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

import Cookies from "js-cookie";
const user = {
  state: {
    token: getToken(),
 
 
    rescode:localStorage.getItem('rescode')?localStorage.getItem('rescode') :"",
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
    
    SET_rescode: (state, permissions) => {
        state.rescode = permissions
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
          commit('SET_rescode', res.rescode)
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
          Cookies.remove('userInfo')
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
