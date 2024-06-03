<template>
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <p v-if="!info.id">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">注册</router-link>
          </p>
          <p v-if="info.id">
            <span>欢迎，{{info.name}}</span>
            <a class="register" @click="logout">退出登录</a>
          </p>
          <div></div>
        </div>
        <div class="typeList">
          <router-link to="/myorder">我的订单</router-link>
          <router-link to="/shopcart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link class="logo" title="尚品汇" to="/home">
          <img src="./images/logo.png" alt="" />
        </router-link>
      </h1>
      <div class="searchArea">
        <form class="searchForm" @submit.prevent="toSearch">
          <input
            type="text"
            id="autocomplete"
            class="input-error input-xxlarge"
            v-model="keyword"
          />
          <button class="sui-btn btn-xlarge btn-danger" type="submit">
            搜索
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
  export default {
    name: "Header",
    data() {
      return {
        keyword:''
      }
    },
    computed:{
      ...mapState('user',['info'])
    },
    methods: {
      // 点击搜索按钮，携带关键词跳转到搜索路由
      toSearch(){
        // 获取当前路由中的所有参数
        const {query} = this.$route
        // 跳转路由
        this.$router.replace({
          path:'/search',
          query:{
            /* 
              undefined的作用在于：如果用户不输入关键词，那么就把值设置为undefined。
              路由不会把undefined呈现到路径中，也不会呈现到页面上，但通过js代码，是依然可以获取到的。
            */
            ...query, //携带之前的所有参数
            keyword:this.keyword || undefined,
          }
        })
      },
      // 用于清空关键词
      clearKeyword(){
        // 清空关键词
        this.keyword = ''
      },
      // 用于退出登录
      logout(){
        if(confirm('确认退出登录吗？')){
          this.$store.dispatch('user/logout')
        }
      }
    },
    created(){
      // 给总线绑事件
      this.$bus.$on('clear-keyword',this.clearKeyword)
    },
    beforeDestroy() {
      // 解绑总线事件
      this.$bus.$off('clear-keyword')
    },
  };
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: px;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 135px;
          margin: 14px 28px 10px 15px;
        }
      }
    }

    .searchArea {
      float: right;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>