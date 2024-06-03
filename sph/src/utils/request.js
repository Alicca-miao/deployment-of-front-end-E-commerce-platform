/* 
   该文件是对axios的二次封装，封装的目的是：
      1.让每次请求都加上固定代理前缀/sph
      2.让每次请求都加上超时时间
      3.让每次请求都加上请求头school值为atguigu
      4.让每次请求都加上进度条效果
      5.让每次请求都将真正的数据返回给使用者（response.data）
      6.让每次请求都能自动处理异常
*/
import axios from 'axios'
import NProgress from 'nprogress'
import '@/theme/color.css'
import {getUserTempId,readToken} from '@/utils/auth'
import store from '@/store'

// 创建一个axios实例对象 —— request
const request = axios.create({
  baseURL:'/dev',
  timeout:10000
})

// 请求拦截器 —— 本质就是一函数
request.interceptors.request.use((config)=>{
  // 进度条走起
  NProgress.start()
  // 在请求头中添加userTempId —— 含义是：用户的临时身份
  config.headers.userTempId = getUserTempId()
  // 在请求头中添加token —— 含义是：用户的真实身份
  config.headers.token = readToken()
  // 返回本次请求的配置,config是本次请求所有的详细配置
  return config
})

// 响应拦截器 —— 本质就是一函数
request.interceptors.response.use(
  // 响应成功的回调
  response => {
    // 进度条停止
    NProgress.done()
    if(response.data.code === 208){
      // 代码能执行到这里，就证明，你一定发出去了一个需要身份(token)的请求，但身份过期了
      // 强制退出登录
      store.dispatch('user/logout','您的身份过期，请重新登录！')
      return new Promise(()=>{})
    }else{
      // 返回真正的数据
      return response.data
    }
  },
  // 响应失败的回调
  error => {
    // 进度条停止
    NProgress.done()
    // 第一种返回方式：将错误继续传递下去，让使用者，进一步做处理
    // return Promise.reject(error.message)

    // 第二种返回方式：直接提示将错误，终止Promise链，使用者无需配置失败的回调
    alert(error.message)
    return new Promise(()=>{})
  }
)

export default request