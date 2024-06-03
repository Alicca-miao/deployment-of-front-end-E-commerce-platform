<template>
  <!-- 轮播图容器 -->
  <swiper class="swiper" :options="swiperOption" v-if="imgList?.length">
    <!-- 每一屏 -->
    <swiper-slide class="item" v-for="img in imgList" :key="img.id">
      <img :src="img.imgUrl" @click="$bus.$emit('send-imgurl',img.imgUrl)">
    </swiper-slide>
    <!-- 上一张 -->
    <div class="swiper-button-prev" slot="button-prev"></div>
    <!-- 下一张 -->
    <div class="swiper-button-next" slot="button-next"></div>
  </swiper>
</template>

<script>
  export default {
    name: "ImageList",
    props:['imgList'],
    data() {
      return {
        swiperOption:{
          slidesPerView: 5, // 同时展示几屏
          // 上一张与下一张
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .swiper-container {
    --swiper-theme-color:#e1251b;
    font-weight: 900;
    height: 55px;
    width: 402px;
    box-sizing: border-box;
    padding: 0 12px;
    margin-top: 5px;
    border: 1px solid #ccc;

    .swiper-slide {
      width: 56px;
      height: 56px;

      img {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        border-top: 0;
        border-bottom: 0;
        padding: 2px;
        width: 50px;
        height: 50px;
        display: block;
        
        &:hover {
          // border: 2px solid #f60;
          // padding: 1px;
          box-shadow: 0 0 10px #ccc;
        }
      }
    }

    .swiper-button-next {
      left: auto;
      right: 0;
      border-left: 1px #ddd solid;
    }

    .swiper-button-prev {
      left: 0;
      right: auto;
      border-right: 1px #ddd solid;
    }

    .swiper-button-next,
    .swiper-button-prev {
      box-sizing: border-box;
      width: 12px;
      height: 56px;
      background: white;
      // border: 1px solid rgb(204, 204, 204);
      top: 0;
      margin-top: 0;
      &::after {
        font-size: 12px;
      }
    }
  }
</style>