import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import {readToken,deleteToken} from '@/utils/auth'
import store from '@/store'
import {Message} from 'element-ui'

Vue.use(VueRouter)

// 对VueRouter原型上的方法进行增强
function enhance (name){
  // 第一步：保存一下原始的方法（至于原始的方法是谁，得看name）
  const origin = VueRouter.prototype[name]
  // 第二步：进行修改
  VueRouter.prototype[name] = function(location,onSuccess,onError){
    if(onSuccess || onError){
      // 第三步：调用原始的push实现跳转
      return origin.call(this,location,onSuccess,onError)
    }else{
      // 第三步：调用原始的push实现跳转
      return origin.call(this,location).catch(_=>{})
    }
  }
}
enhance('push')
enhance('replace')


const router = new VueRouter({
  mode:'history',
  routes,
  // scrollBehavior什么时候执行：①整个应用一上来就执行。②每次路由跳转时都执行
  scrollBehavior(to,from){
    return {x:0,y:0} //x控制横向滚动条，y控制纵向滚动条
  }
})

// 敏感路由名单，只有登录才能看
let authPath = ['/trade','/pay','/paysuccess','/myorder']

router.beforeEach(async(to,from,next)=>{
  // 从localStorage中读取token
  const token = readToken()
  // 判断token是否存在
  if(token){
    // 证明有token，用户一定登录了
    // 读取vuex中的用户信息
    const {info} = store.state.user
    // 判断用户信息是否存在
    if(info.id){
      // 用户信息存在
      // 直接放行
      next()
    }else{
      // 用户信息不存在   
      try {
        // 联系getUserInfo这个action去获取用户信息
        await store.dispatch('user/getUserInfo')
        // 直接放行
        next()
      } catch (error) {
        // 删除已经靠不住（过期的）token
        deleteToken()
        // 放行到登录路由
        next('/login')
      }
    }
  }else{
    // 无token，证明用户压根就没有登录
    if(authPath.includes(to.path)){
      Message.error('请您先登录！')
      next('/login')
    }else{
      next()
    }
  }
})

export default router