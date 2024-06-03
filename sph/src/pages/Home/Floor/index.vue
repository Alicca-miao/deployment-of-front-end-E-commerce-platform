<template>
  <div class="floor">
    <div class="py-container">
      <div class="title clearfix">
        <!-- 楼层的名字 -->
        <h3 class="fl">{{floor.name}}</h3>
        <div class="fr">
          <ul class="nav-tabs clearfix">
            <!-- 每一个右上角的导航 -->
            <li v-for="(nav,index) in floor.navList" :key="index">
              <a :href="nav.url" data-toggle="tab">{{nav.text}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane">
          <div class="floor-1">
            <div class="blockgary">
              <ul class="jd-list">
                <!-- 每一个关键词 -->
                <li v-for="(keyword,index) in floor.keywords" :key="index">{{keyword}}</li>
              </ul>
              <img :src="floor.imgUrl" />
            </div>
            <div class="floorBanner">


              <!-- 轮播图区域 -->
              <swiper class="swiper" :options="swiperOption">
                <!-- 每一屏 -->
                <swiper-slide class="item" v-for="carouse in floor.carouselList" :key="carouse.id">
                  <img :src="carouse.imgUrl" alt="">
                </swiper-slide>
                <!-- 小圆点 -->
                <div class="swiper-pagination" slot="pagination"></div>
                <!-- 上一张 -->
                <div class="swiper-button-prev" slot="button-prev"></div>
                <!-- 下一张 -->
                <div class="swiper-button-next" slot="button-next"></div>
              </swiper>


            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[0]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[1]" />
              </div>
            </div>
            <div class="split center">
              <img :src="floor.bigImg" />
            </div>
            <div class="split">
              <span class="floor-x-line"></span>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[2]" />
              </div>
              <div class="floor-conver-pit">
                <img :src="floor.recommendList[3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		name: "Floor",
    data() {
      return {
        swiperOption:{
          slidesPerView: 1, // 同时展示几屏
          spaceBetween: 10, // 屏与屏之间的距离
          loop: true, // 是否开启循环轮播
          speed:1000,
          autoplay: {
            delay: 2000,// 每一屏看多久（单位：毫秒）
            disableOnInteraction: false, //鼠标点击小圆点后，是否禁用自动轮播
            reverseDirection:this.index % 2,
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
    props:['floor','index']
	};
</script>

<style lang="less" scoped>
.floor {
  margin-top: 15px;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .title {
      .fl {
        float: left;
        color: #c81623;
        font-size: 20px;
        line-height: 30px;
        margin: 9px 0;
        font-weight: 700;
      }

      .fr {
        float: right;

        .nav-tabs {
          margin: 10px 0 0;
          display: inline-block;

          li {
            float: left;
            line-height: 18px;

            a {
              padding-top: 1px;
              font-weight: 400;
              background-color: #fff;

              &::after {
                content: "|";
                padding: 0 10px;
              }
            }

            &:nth-child(7) {
              a {
                &::after {
                  content: "";
                }
              }
            }

            &.active {
              a {
                color: #e1251b;
              }
            }
          }
        }
      }
    }

    .tab-content {
      border-top: 2px solid #c81623;
      border-bottom: 1px solid #e4e4e4;

      .tab-pane {
        .floor-1 {
          height: 360px;
          display: flex;

          .blockgary {
            width: 210px;
            height: 100%;
            background: #f7f7f7;

            .jd-list {
              padding: 15px 0;
              overflow: hidden;

              li {
                list-style-type: none;
                float: left;
                width: 40%;
                margin: 0 10px;
                border-bottom: 1px solid #e4e4e4;
                text-align: center;
                line-height: 26px;
              }
            }

            img {
              width: 100%;
            }
          }

          .floorBanner {
            width: 330px;
            height: 100%;
          }

          .split {
            width: 220px;
            height: 100%;
            position: relative;

            .floor-x-line {
              position: absolute;
              background: #e4e4e4;
              width: 220px;
              height: 1px;
              top: 180px;
            }

            .floor-conver-pit {
              width: 100%;
              height: 50%;

              img {
                width: 100%;
                height: 100%;
                transition: all 400ms;

                &:hover {
                  opacity: 0.8;
                }
              }
            }
          }

          .center {
            border: 1px solid #e4e4e4;
          }
        }
      }
    }
  }
}
</style>