<template>
  <div>
    <Header/>
    <router-view></router-view>
    <!-- 第一种写法：通过路径进行判断 -->
    <!-- <Footer v-if="$route.path !== '/login' && $route.path !== '/register'"/> -->
    
    <Footer v-if="!$route.meta.isHideFooter"/>
  </div>
</template>

<script>
  import Header from './components/Header'
  import Footer from './components/Footer'

  export default {
    name:'App',
    components:{Header,Footer},
  }
</script>

