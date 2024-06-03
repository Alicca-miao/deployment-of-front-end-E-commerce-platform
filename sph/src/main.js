import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import TypeNav from './components/TypeNav'
import './mock'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import Pagination from './components/Pagination'
import 'swiper/css/swiper.css'
import {Button,Slider,Message,Loading,MessageBox,Notification} from 'element-ui'
import './utils/validate'
import VueLazyload  from 'vue-lazyload'
import tu from './assets/images/loading.gif'


Vue.config.productionTip = false
Vue.component('TypeNav',TypeNav)
Vue.component('Swiper',Swiper)
Vue.component('SwiperSlide',SwiperSlide)
Vue.component('Pagination',Pagination)
Vue.use(Button)
Vue.use(Slider)
Vue.use(VueLazyload,{
  loading:tu
})
// 配置element-ui相关的所有提示类方法
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;


new Vue({
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  el:'#app',
  render:h => h(App),
  router,
  store
})