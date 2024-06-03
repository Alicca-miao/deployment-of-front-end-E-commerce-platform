import Vue from 'vue'
import Vuex,{Store} from 'vuex'
import user from './modules/user'
import home from './modules/home'

Vue.use(Vuex)

export default new Store({
  // actions中存的是：用于响应组件中“动作”的函数 —— 服务员
  actions:{
    add({commit,state},value){
      if(state.x < 10){
        commit('ADD',value)
      }else{
        // alert('不能比10再大了')
        return Promise.reject('不能比10再大了')
      }
    }
  },
  // mutations中存的是：用于修改数据的函数 —— 厨师
  mutations:{
    ADD(state,value){
      state.x += value
    }
  },
  // state中配置的是初始化的数据 —— 原材料
  state:{x:1},
  // 模块化配置
  modules:{user,home}
})