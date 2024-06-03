/* 
   该文件是对axios的二次封装，封装的目的是：
      1.让每次请求都加上固定mock前缀:http://www.0410.com
      2.让每次请求都加上超时时间
      3.让每次请求都加上请求头school值为atguigu
      4.让每次请求都加上进度条效果
      5.让每次请求都将真正的数据返回给使用者（response.data）
      6.让每次请求都能自动处理异常
*/
import axios from 'axios'
import NProgress from 'nprogress'
import '@/theme/color.css'

// 创建一个axios实例对象 —— request
const request = axios.create({
  baseURL:'http://www.0410.com',
  timeout:10000
})

// 请求拦截器 —— 本质就是一函数
request.interceptors.request.use((config)=>{
  // 进度条走起
  NProgress.start()
  // 请求头上追加school字段，值为atguigu，现在我们追加的是school，看似很无聊，但以后要追加的是token
  config.headers.school = 'atguigu'
  // 返回本次请求的配置,config是本次请求所有的详细配置
  return config
})

// 响应拦截器 —— 本质就是一函数
request.interceptors.response.use(
  // 响应成功的回调
  response => {
    // 进度条停止
    NProgress.done()
    // 返回真正的数据
    return response.data
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