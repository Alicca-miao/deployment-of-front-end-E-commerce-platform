<template>
  <div>
    <button @click="cheng">点我将【程程】转为二维码</button>
    <img :src="url" alt="">
  </div>
</template>

<script>
  import QRCode from 'qrcode'

  export default {
    name:'Test',
    data() {
      return {
        url:''
      }
    },
    methods: {
      async cheng(){
        try {
          const x = await QRCode.toDataURL('程程啊，程程，程程啊，程程，为啥不让我放假啊！')
          this.url = x
        } catch (error) {
        }
      }
    },
  }
</script>