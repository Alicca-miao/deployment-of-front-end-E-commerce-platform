<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>

      <!-- 每个address容器，就是一个收货人信息 -->
      <div class="address clearFix" v-for="address in tradeInfo.userAddressList" :key="address.id">
        <span class="username" :class="{selected:address.isDefault === '1'}">{{address.consignee}}</span>
        <p @click="changeAddress(address.id)">
          <span class="s1">{{address.userAddress}}</span>
          <span class="s2">{{address.phoneNum}}</span>
          <span class="s3" v-show="address.isDefault === '1' ">默认地址</span>
        </p>
      </div>

      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected" style="cursor:pointer">在线支付</span>
      </div>
      <div class="line"></div>
      <h5 class="pay">商品清单</h5>
      <!-- 商品清单 -->
      <div class="detail">
        <!-- 一个ul就是一个商品 -->
        <ul class="list clearFix" v-for="detail in tradeInfo.detailArrayList" :key="detail.skuId">
          <li>
            <!-- 商品图片 -->
            <img :src="detail.imgUrl" alt="">
          </li>
          <li>
            <!-- 商品名称 -->
            <p> {{detail.skuName}}</p>
          </li>
          <li>
            <!-- 商品价格 -->
            <h3>￥{{detail.orderPrice}}</h3>
          </li>
          <!-- 商品数量 -->
          <li class="num">X{{detail.skuNum}}</li>
          <li class="status">有货</li>
        </ul>
      </div>

      <div class="bbs">
        <h5>买家留言：</h5>
        <!-- 留言 -->
        <textarea v-model="orderComment" placeholder="建议留言前先与商家沟通确认" class="remarks-cont"></textarea>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <!-- 总金额 -->
          <b><i>{{tradeInfo.totalNum}}</i>品类，总商品金额</b>
          <span>¥{{tradeInfo.originalTotalAmount}}</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <!-- 应付金额 -->
      <div class="price">应付金额:　<span>¥{{tradeInfo.totalAmount}}</span></div>
      <!-- 邮寄地址 -->
      <div class="receiveInfo">
        寄送至:<span>{{showAddress.userAddress}}</span>
        收货人：<span>{{showAddress.consignee}}</span><span>{{showAddress.phoneNum}}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a class="subBtn" @click="submitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
  import {reqTradeInfo,reqSubmitOrder} from '@/api'

  export default {
    name: 'Trade',
    data() {
      return {
        tradeInfo:{},
        orderComment:'' //买家留言
      }
    },
    computed: {
      showAddress(){
        return this.tradeInfo.userAddressList?.find((item)=>{
          return item.isDefault === '1'
        }) || {}
      }
    },
    methods: {
      // 用于获取交易信息
      async getTradeInfo(){
        const {code,message,data} = await reqTradeInfo()
        if(code === 200){
          this.tradeInfo = data
        }else{
          this.$message.error(`获取交易信息失败:${message}`)
        }
      },
      // 用户切换收货地址
      changeAddress(id){
        this.tradeInfo.userAddressList.forEach((item)=>{
          item.id === id ? item.isDefault = '1' : item.isDefault = '0'
        })
      },
      // 提交订单
      async submitOrder(){
        // 准备好所有提交订单需要的参数
        const {orderComment} = this
        const {tradeNo,detailArrayList} = this.tradeInfo
        const {userAddress,phoneNum,consignee} = this.showAddress
        // 准备一个包含着所有提交订单所需参数的对象
        const obj = {
          consignee,
          consigneeTel:phoneNum,
          deliveryAddress:userAddress,
          paymentWay:'ONLINE',
          orderComment,
          orderDetailList:detailArrayList
        }
        // 发请求去提交订单（记得要携带【交易编号】）返回的data是订单编号
        const {code,message,data} = await reqSubmitOrder(tradeNo,obj)
        if(code === 200){
          this.$router.push('/pay?id='+data)
        }else{
          this.$message.warning(`提交订单失败：${message}`)
        }
      }
    },
    mounted() {
      this.getTradeInfo()
    },
    beforeRouteEnter(to, from, next) {
      if(from.path === '/shopcart'){
        next()
      }else{
        next('/home')
      }
    }
  }
</script>

<style lang="less" scoped>
  .trade-container {
    .title {
      width: 1200px;
      margin: 0 auto;
      font-size: 14px;
      line-height: 21px;
    }

    .content {
      width: 1200px;
      margin: 10px auto 0;
      border: 1px solid rgb(221, 221, 221);
      padding: 25px;
      box-sizing: border-box;

      .receive,
      .pay {
        line-height: 36px;
        margin: 18px 0;
      }

      .address {
        padding-left: 20px;
        margin-bottom: 15px;

        .username {
          float: left;
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          position: relative;
        }

        .username::after {
          content: "";
          display: none;
          width: 13px;
          height: 13px;
          position: absolute;
          right: 0;
          bottom: 0;
          background: url(./images/choosed.png) no-repeat;
        }

        .username.selected {
          border-color: #e1251b;
        }

        .username.selected::after {
          display: block;
        }

        p {
          width: 610px;
          float: left;
          line-height: 30px;
          margin-left: 10px;
          padding-left: 5px;
          cursor: pointer;

          .s1 {
            float: left;

          }

          .s2 {
            float: left;
            margin: 0 5px;
          }

          .s3 {
            float: left;
            width: 56px;
            height: 24px;
            line-height: 24px;
            margin-left: 10px;
            background-color: #878787;
            color: #fff;
            margin-top: 3px;
            text-align: center;
          }
        }

        p:hover {
          background-color: #ddd;
        }
      }

      .line {
        height: 1px;
        background-color: #ddd;
      }

      .way {
        width: 1080px;
        height: 110px;
        background: #f4f4f4;
        padding: 15px;
        margin: 0 auto;

        h5 {
          line-height: 50px;
        }

        .info {
          margin-top: 20px;

          .s1 {
            float: left;
            border: 1px solid #ddd;
            width: 120px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin-right: 10px;
          }

          p {
            line-height: 30px;
          }
        }
      }

      .detail {
        width: 1080px;
        // background: #eee;
        // border: 1px solid #ddd;
        border-radius: 5px;
        padding: 15px;
        margin: 2px auto 0;
        img {
          // width: 100px;
          height: 100px;
          box-shadow: 0 0 1px #ccc;
        }

        h5 {
          line-height: 50px;
        }

        .list {
          display: flex;
          justify-content: space-between;
          border: 1px solid #ddd;
          margin-bottom: 5px;
          height: 100px;
          .num,.status {
            height: 100px;
            line-height: 100px;
          }

          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            p {
              max-width: 300px;
              line-height: 20px;
            }

            h4 {
              color: #c81623;
              font-weight: 400;
            }

            h3 {
              height: 100px;
              line-height: 100px;
              color: #e12228;
            }
          }
        }
      }

      .bbs {
        margin-bottom: 15px;

        h5 {
          line-height: 50px;
        }

        textarea {
          padding: 10px;
          width: 95%;
          border-color: #e4e2e2;
          line-height: 1.8;
          outline: none;
          resize: none;
        }
      }

      .bill {
        h5 {
          line-height: 50px;
        }

        div {
          padding-left: 15px;
        }
      }
    }

    .money {
      width: 1200px;
      margin: 20px auto;

      ul {
        width: 220px;
        float: right;

        li {
          line-height: 30px;
          display: flex;
          justify-content: space-between;

          i {
            color: red;
          }
        }
      }
    }

    .trade {
      box-sizing: border-box;
      width: 1200px;
      padding: 10px;
      margin: 10px auto;
      text-align: right;
      background-color: #f4f4f4;
      border: 1px solid #ddd;

      div {
        line-height: 30px;
      }

      .price span {
        color: #e12228;
        font-weight: 700;
        font-size: 14px;
      }

      .receiveInfo {
        color: #999;
      }
    }

    .sub {
      width: 1200px;
      margin: 0 auto 10px;

      .subBtn {
        float: right;
        width: 164px;
        height: 56px;
        font: 700 18px "微软雅黑";
        line-height: 56px;
        text-align: center;
        color: #fff;
        background-color: #e1251b;

      }
    }

  }
</style>