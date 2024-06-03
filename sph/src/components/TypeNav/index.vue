<template>
  <div class="type-nav">
    <div class="container">
      <div class="nav-left" @mouseleave="hideSort">
        <h2 class="all" @mouseenter="isShowSort = true">
          全部商品分类
        </h2>
        <div class="sort" v-show="isShowSort">
          <div class="all-sort-list2" @click="toSearch">

            <!-- 每一个item就是一个一级级分类 -->
            <div class="item" v-for="c1 in categoryList.slice(0,15)" :key="c1.categoryId">
              <h3>
                <!-- 能点击的一级分类 -->
                <a data-level="1" :data-id="c1.categoryId">{{c1.categoryName}}</a>
              </h3>
              <div class="item-list clearfix">
                <!-- 每一个subitem就是一个二级分类 -->
                <div class="subitem" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                  <dl class="fore">
                    <dt>
                       <!-- 能点击的二级级分类 -->
                      <a data-level="2" :data-id="c2.categoryId">{{c2.categoryName}}</a>
                    </dt>
                    <dd>
                      <!-- 每一个em就是一个三级分类 -->
                      <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                        <!-- 能点击的三级级分类 -->
                        <a data-level="3" :data-id="c3.categoryId">{{c3.categoryName}}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: "TypeNav",
    data() {
      return {
        // isShowSort控制的导航框，只有路径为/home时，才为真
        isShowSort:this.$route.path === '/home'
      }
    },
    methods: {
      // 点击：一级分类、二级分类、三级分类的名字跳转搜索路由
      toSearch(event){
        // 获取点击分类的：名字、级别、id
        const {innerText,dataset:{level,id}} = event.target
        // 判断点击的是否是分类名（判断其是否拥有level值，因为只有分类名的a标签，才拥有data-level）
        if(level){
          // 获取当前路由query参数的keyword值
          const {keyword} = this.$route.query
          // 跳转路由
          this.$router.push({
            path:'/search',
            query:{
              [`category${level}Id`]:id, //动态拼接出级别
              categoryName:innerText,
              keyword
            }
          })
          // 隐藏三级分类
          this.isShowSort = false
        }
      },
      // 鼠标移出导航区，就隐藏导航区
      hideSort(){
        // 判断当前所处位置是不是/home，若不是才可以隐藏导航区
        if(this.$route.path !== '/home'){
          // 隐藏导航区
          this.isShowSort = false
        }
      }
    },
    computed:{
      // 从state中读取三级分类列表
      ...mapState('home',['categoryList'])
    },
    mounted() {
      // 组件一挂载就联系getCategoryList去获取三级分类数据并存入vuex
      this.$store.dispatch('home/getCategoryList')
    },
  };
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            &:hover {
              background-color: #e1251b;
            }

            &:hover a {
              color: white;
            }

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;

                  &:hover {
                    a {
                      color: #c81623;
                    }
                  }
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;

                    &:hover {
                      a {
                        color: #c81623;
                      }
                    }
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>