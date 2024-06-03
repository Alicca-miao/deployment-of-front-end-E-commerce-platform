import {reqUserInfo,reqLogout} from '@/api'
import {Message} from 'element-ui'
import {deleteToken} from '@/utils/auth'
import router from '@/router'

export default {
  namespaced:true,
  // actions中存的是：用于响应组件中“动作”的函数 —— 服务员
  actions:{
    // 专门用于获取用户信息的
    async getUserInfo({commit}){
      // 发请求
      const {code,message,data} = await reqUserInfo()
      // 判断业务逻辑
      if(code === 200){
        commit('SAVE_USER_INFO',data)
      }else{
        Message.error(`获取用户信息失败：${message}`)
        return Promise.reject()
      }
    },
    // 专门用于退出登录
    async logout({commit},value){
      // 联系服务器，删除token，成功了
      const {code,message} = await reqLogout()
      if(code === 200){
        // 提示
        value ? Message.warning(value) : Message.success('退出登录成功！')
        // 删除vuex中的数据
        commit('CLEAR_USER_INFO')
        // 删除本地的token
        deleteToken()
        // 跳转路由到/login
        router.push('/login')
      }else{
        Message.error(`退出登录失败：${message}`)
      }
    }
  },

  // mutations中存的是：用于修改数据的函数 —— 厨师
  mutations:{
    // 保存用户信息
    SAVE_USER_INFO(state,value){
      state.info = value
    },
    // 清除用户信息
    CLEAR_USER_INFO(state){
      state.info = {}
    }
  },

  // state中配置的是初始化的数据 —— 原材料
  state:{
    info:{}
  }
}