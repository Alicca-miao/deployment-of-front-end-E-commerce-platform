<template>
  <div class="spec-preview">
    <img :src="imgUrl||url" />
    <div class="event" @mousemove="move"></div>
    <div class="big">
      <img :src="imgUrl||url" ref="bigImg"/>
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
  export default {
    name: "Zoom",
    props:['url'],
    data() {
      return {
        imgUrl:''
      }
    },
    // watch:{
    //   url(value){
    //     this.imgUrl = value
    //   }
    // },
    methods: {
      // 放大镜移动鼠标的回调
      move(event){
        // 获取鼠标的位置
        let mouseX = event.offsetX
        let mouseY = event.offsetY

        // 获取到mask遮罩元素
        let {mask,bigImg} = this.$refs

        // 计算遮罩的位置
        let maskX = mouseX - mask.offsetWidth/2
        let maskY = mouseY - mask.offsetHeight/2

        // 控制mask不能超出父容器
        if(maskX < 0){
          maskX = 0
        }else if(maskX > mask.offsetWidth){
          maskX = mask.offsetWidth
        }
        if(maskY < 0){
          maskY = 0
        }else if(maskY > mask.offsetHeight){
          maskY = mask.offsetHeight
        }

        // 让mask动起来
        mask.style.left = maskX + 'px'
        mask.style.top = maskY + 'px'

        // 让大图也动起来
        bigImg.style.left = -2*maskX + 'px'
        bigImg.style.top = -2*maskY + 'px'

      },
      // 保存ImgList组件传递过来的图片地址
      saveImgUrl(value){
        this.imgUrl = value
      }
    },
    created() {
      this.$bus.$on('send-imgurl',this.saveImgUrl)
    },
    beforeDestroy() {
      this.$bus.$off('send-imgurl')
    },
  }
</script>

<style lang="less">
  .spec-preview {
    position: relative;
    width: 400px;
    height: 400px;
    border: 1px solid #ccc;

    img {
      width: 100%;
      height: 100%;
    }

    .event {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 998;
    }

    .mask {
      width: 50%;
      height: 50%;
      background-color: rgba(0, 255, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
      display: none;
    }

    .big {
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: 100%;
      border: 1px solid #aaa;
      overflow: hidden;
      z-index: 998;
      display: none;
      background: white;

      img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    .event:hover~.mask,
    .event:hover~.big {
      display: block;
    }
  }
</style>