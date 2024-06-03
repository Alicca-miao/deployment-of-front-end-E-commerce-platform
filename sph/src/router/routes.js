// 该文件专门用于管理路由规则
// import Home from '@/pages/Home'
// import Login from '@/pages/Login'
// import Register from '@/pages/Register'
// import Search from '@/pages/Search'
// import Test from '@/pages/Test'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import MyOrder from '@/pages/MyOrder'

export default [
  {
    path:'/home',
    component:() => import('@/pages/Home'),
  },
  {
    path:'/login',
    component:() => import('@/pages/Login'),
    meta:{isHideFooter:true}
  },
  {
    path:'/register',
    component:() => import('@/pages/Register'),
    meta:{isHideFooter:true}
  },
  {
    path:'/search',
    component:() => import('@/pages/Search'),
  },
  {
    path:'/test',
    component:() => import('@/pages/Test'),
  },
  {
    name:'detail',
    path:'/detail/:id',
    component:() => import('@/pages/Detail'),
  },
  {
    path:'/addcart_success',
    component:() => import('@/pages/AddCartSuccess'),
    beforeEnter: (to, from, next) => {
      if(from.path.slice(0,7) === '/detail'){
        next()
      }else{
        next('/home')
      }
    }
  },
  {
    path:'/shopcart',
    component:() => import('@/pages/ShopCart'),
  },
  {
    path:'/trade',
    component:() => import('@/pages/Trade'),
  },
  {
    path:'/pay',
    component:() => import('@/pages/Pay'),
    beforeEnter: (to, from, next) => {
      if(from.path === '/trade'){
        next()
      }else{
        next('/home')
      }
    }
  },
  {
    path:'/paysuccess',
    component:() => import('@/pages/PaySuccess'),
  },
  {
    path:'/myorder',
    component:() => import('@/pages/MyOrder'),
  },
  {
    path:'/',
    redirect:'/home',
  }
]