<template>
  <div class="list-container">
    <div class="sortList clearfix">
      <div class="center">
        <!-- 轮播图容器 -->
        <swiper class="swiper" :options="swiperOption" v-if="slideList.length">
          <!-- 每一屏 -->
          <swiper-slide class="item" v-for="s in slideList" :key="s.id">
            <img :src="s.imgUrl" alt="">
          </swiper-slide>
          <!-- 小圆点 -->
          <div class="swiper-pagination" slot="pagination"></div>
          <!-- 上一张 -->
          <div class="swiper-button-prev" slot="button-prev"></div>
          <!-- 下一张 -->
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
      <div class="right">
        <div class="news">
          <h4>
            <em class="fl">尚品汇快报</em>
            <a href="#" class="fr tip">更多 ></a>
          </h4>
          <div class="clearix"></div>
          <ul class="news-list unstyled">
            <li>
              <span class="bold">[特惠]</span
              ><a href="#">备战开学季 全民半价购数码</a>
            </li>
            <li>
              <span class="bold">[公告]</span
              ><a href="#">备战开学季 全民半价购数码</a>
            </li>
            <li>
              <span class="bold">[特惠]</span
              ><a href="#">备战开学季 全民半价购数码</a>
            </li>
            <li>
              <span class="bold">[公告]</span
              ><a href="#">备战开学季 全民半价购数码</a>
            </li>
            <li>
              <span class="bold">[特惠]</span
              ><a href="#">备战开学季 全民半价购数码</a>
            </li>
          </ul>
        </div>
        <ul class="lifeservices">
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">话费</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">机票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">电影票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">游戏</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">彩票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">加油站</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">酒店</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">火车票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">众筹</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">理财</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">礼品卡</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">白条</span>
          </li>
        </ul>
        <div class="ads">
          <img src="./images/ad.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: "ListContainer",
    data() {
      return {
        swiperOption: {
          slidesPerView: 1, // 同时展示几屏
          spaceBetween: 10, // 屏与屏之间的距离
          loop: true, // 是否开启循环轮播
          speed:1000,
          autoplay: {
            delay: 2000,// 每一屏看多久（单位：毫秒）
            disableOnInteraction: false, //鼠标点击小圆点后，是否禁用自动轮播
          },
          // 小圆点配置
          pagination: {
            el: '.swiper-pagination', //小圆点放在哪个容器里
            clickable: true //小圆点是否可以点击
          },
          // 上一张与下一张
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
    computed:{
      ...mapState('home',['slideList'])
    },
    mounted() {
      // ListContainer组件一挂载就联系getSlideList获取轮播图数据，并存入Vuex
      this.$store.dispatch('home/getSlideList')
    },
  };
</script>

<style lang="less" scoped>
  .list-container {
    width: 1200px;
    margin: 0 auto;

    .sortList {
      height: 464px;
      padding-left: 210px;

      .center {
        box-sizing: border-box;
        width: 740px;
        height: 100%;
        padding: 5px;
        float: left;
        .swiper-container {
          --swiper-theme-color:white;
        }
      }

      .right {
        float: left;
        width: 250px;

        .news {
          border: 1px solid #e4e4e4;
          margin-top: 5px;

          h4 {
            border-bottom: 1px solid #e4e4e4;
            padding: 5px 10px;
            margin: 5px 5px 0;
            line-height: 22px;
            overflow: hidden;
            font-size: 14px;

            .fl {
              float: left;
            }

            .fr {
              float: right;
              font-size: 12px;
              font-weight: 400;
            }
          }

          .news-list {
            padding: 5px 15px;
            line-height: 26px;

            .bold {
              font-weight: 700;
            }
          }
        }

        .lifeservices {
          border-right: 1px solid #e4e4e4;
          overflow: hidden;
          display: flex;
          flex-wrap: wrap;

          .life-item {
            border-left: 1px solid #e4e4e4;
            border-bottom: 1px solid #e4e4e4;
            height: 64px;
            text-align: center;
            position: relative;
            cursor: pointer;
            width: 25%;
            box-sizing: border-box;

            .list-item {
              background-image: url(./images/icons.png);
              width: 61px;
              height: 40px;
              display: block;
            }

            .service-intro {
              line-height: 22px;
              width: 60px;
              display: block;
            }

            &:nth-child(1) {
              .list-item {
                background-position: 0px -5px;
              }
            }

            &:nth-child(2) {
              .list-item {
                background-position: -62px -5px;
              }
            }

            &:nth-child(3) {
              .list-item {
                background-position: -126px -5px;
              }
            }

            &:nth-child(4) {
              .list-item {
                background-position: -190px -5px;
              }
            }

            &:nth-child(5) {
              .list-item {
                background-position: 0px -76px;
              }
            }

            &:nth-child(6) {
              .list-item {
                background-position: -62px -76px;
              }
            }

            &:nth-child(7) {
              .list-item {
                background-position: -126px -76px;
              }
            }

            &:nth-child(8) {
              .list-item {
                background-position: -190px -76px;
              }
            }

            &:nth-child(9) {
              .list-item {
                background-position: 0px -146px;
              }
            }

            &:nth-child(10) {
              .list-item {
                background-position: -62px -146px;
              }
            }

            &:nth-child(11) {
              .list-item {
                background-position: -126px -146px;
              }
            }

            &:nth-child(12) {
              .list-item {
                background-position: -190px -146px;
              }
            }
          }
        }

        .ads {
          margin-top: 5px;

          img {
            opacity: 0.8;
            transition: all 400ms;

            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
  }
</style>