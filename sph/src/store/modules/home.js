import {reqCategoryList,reqSlideList,reqFloorList} from '@/api'

export default {
  namespaced:true,
  // actions中存的是：用于响应组件中“动作”的函数 —— 服务员
  actions:{
    // 获取三级分类列表
    async getCategoryList({commit}){
      // 发请求获取三级分类列表，并解构code,message,data以供使用
      let {code,message,data} = await reqCategoryList()
      // 判断业务逻辑是否成功
      if(code === 200){
        commit('SAVE_CATEGORY_LIST',data)
      }else{
        alert(`获取三级分类数据失败：${message}`)
      }
    },
    // 获取轮播图列表
    async getSlideList({commit}){
      // 发请求获取数据
      let {code,message,data} = await reqSlideList()
      // 判断业务逻辑是否成功
      code === 200 ? commit('SAVE_SLIDE_LIST',data) : alert(`加载轮播图数据失败：${message}`)
    },
    // 获取楼层列表
    async getFloorList({commit}){
      // 发请求获取数据
      const {code,message,data} = await reqFloorList()
      // 判断业务逻辑是否成功
      if(code === 200){
        commit('SAVE_FLOOT_LIST',data)
      }else{
        alert(`楼层数据加载失败：${message}`)
      }
    }
  },
  // mutations中存的是：用于修改数据的函数 —— 厨师
  mutations:{
    SAVE_CATEGORY_LIST(state,value){
      state.categoryList = value
    },
    SAVE_SLIDE_LIST(state,value){
      state.slideList = value
    },
    SAVE_FLOOT_LIST(state,value){
      state.floorList = value
    }
  },
  // state中配置的是初始化的数据 —— 原材料
  state:{
    categoryList:[], //三级分类数据
    slideList:[], //轮播图数据
    floorList:[]
  }
}