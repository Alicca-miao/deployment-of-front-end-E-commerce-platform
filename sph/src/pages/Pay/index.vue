<template>
  <div class="pay-main">
    <div class="pay-container">
      <div class="checkout-tit">
        <h4 class="tit-txt">
          <span class="success-icon"></span>
          <span class="success-info">订单提交成功，请您及时付款，以便尽快为您发货~~</span>
        </h4>
        <div class="paymark">
          <span class="fl">请您在提交订单<em class="orange time">4小时
            </em>之内完成支付，超时订单会自动取消。订单号：<em>{{$route.query.id}}</em>
          </span>
          <span class="fr"><em class="lead">应付金额：</em><em class="orange money">￥{{payInfo.totalFee}}</em></span>
        </div>
      </div>
      <div class="checkout-info">
        <h4>重要说明：</h4>
        <ol>
          <li>尚品汇商城支付平台目前支持<span class="zfb">微信</span>支付方式。</li>
          <li>其它支付渠道正在调试中，敬请期待。</li>
        </ol>
      </div>
      <div class="checkout-steps">
        <div class="step-tit">
          <h5>支付平台</h5>
        </div>
        <div class="step-cont">
          <ul class="payType">
            <li class="active"><img src="./images/pay3.jpg"></li>
          </ul>
        </div>
        <div class="hr"></div>
        <div class="submit">
          <a class="btn" @click="pay">立即支付</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {reqPayInfo,reqPayStatus} from '@/api'
  import QRCode from 'qrcode'

  export default {
    name: 'Pay',
    data() {
      return {
        payInfo:{}
      }
    },
    methods:{
      // 用户获取订单的支付信息
      async getPayInfo(){
        // 获取当前订单的编号
        const {id} = this.$route.query
        // 发请求
        const {code,message,data} = await reqPayInfo(id)
        // 判断业务逻辑
        if(code === 200){
          this.payInfo = data
        }else{
          this.$message.error(`获取支付信息失败：${message}`)
        }
      },
      // 用于展示支付弹窗
      async pay(){
        try {
          // 生成支付二维码
          const url = await QRCode.toDataURL(this.payInfo.codeUrl)
          // 弹窗中嵌入的html结构
          const str = `<img style="width:200px" src="${url}">`
          // 弹窗配置
          const options = {
            dangerouslyUseHTMLString: true, //用于解析html字符串
            title:'微信扫码支付', //弹窗标题
            center:true,//居中布局
            showClose:false,//是否显示右上角的x
            confirmButtonText:'已完成支付',
            cancelButtonText:'支付遇到问题',
            showCancelButton:true,//是否显示取消按钮
          }
          // 弹窗弹起来！
          this.$alert(str, {
            ...options,
            // 用户点击确认按钮，或点击取消按钮，都会调用callback
            callback:(type)=>{
              if(type === 'confirm'){
                // 点击【已完成支付】按钮的逻辑
                // 第1件事：停止心跳
                clearInterval(timer)
                // 第2件事：最后向服务器发一次请求，确认支付状态
                const {code} = reqPayStatus(this.$route.query.id)
                if(code === 200){
                  this.$message.success('支付成功！')
                  this.$router.push('/paysuccess')
                }else{
                  this.$message.error('您的订单并未支付，请重新扫码支付')
                }
              }else{
                // 点击【支付遇到问题】按钮的逻辑
                // 第1件事：心跳停止
                clearInterval(timer)
                // 第2件事：给个提示
                this.$message.warning('请致电客服解决')
              }
            }
          });
          // 开启一个心跳请求
          let timer = setInterval(async() => {
            // 获取订单编号
            const {id} = this.$route.query
            // 联系服务器询问当前的支付状态
            const {code} = await reqPayStatus(id)
            // 判断业务逻辑
            if(code === 200){
              // 若支付成功了，做以下几件事：
              // 第1件事：给个提示
              this.$message.success('支付成功！')
              // 第2件事：停止心跳
              clearInterval(timer)
              // 第3件事：关闭弹窗
              this.$msgbox.close()
              // 第4件事：跳转到【支付成功】路由
              this.$router.push('/paysuccess')
            }
          },1000);
        } catch (error) {
          this.$message.error('显示付款二维码失败，请联系管理员')
        }
      }
    },
    mounted() {
      // 调用getPayInfo获取当前订单的支付信息
      this.getPayInfo()
    },
  }
</script>

<style lang="less" scoped>
  .pay-main {
    margin-bottom: 20px;

    .pay-container {
      margin: 0 auto;
      width: 1200px;

      a:hover {
        color: #4cb9fc;
      }

      .orange {
        color: #e1251b;
      }

      .money {
        font-size: 18px;
      }

      .zfb {
        color: #e1251b;
        font-weight: 700;
      }

      .checkout-tit {
        padding: 10px;

        .tit-txt {
          font-size: 14px;
          line-height: 21px;

          .success-icon {
            width: 30px;
            height: 30px;
            display: inline-block;
            background: url(./images/icon.png) no-repeat 0 0;
          }

          .success-info {
            padding: 0 8px;
            line-height: 30px;
            vertical-align: top;
          }
        }

        .paymark {
          overflow: hidden;
          line-height: 26px;
          text-indent: 38px;

          .fl {
            float: left;
          }

          .fr {
            float: right;

            .lead {
              margin-bottom: 18px;
              font-size: 15px;
              font-weight: 400;
              line-height: 22.5px;
            }
          }
        }
      }

      .checkout-info {
        padding-left: 25px;
        padding-bottom: 15px;
        margin-bottom: 10px;
        border: 2px solid #e1251b;

        h4 {
          margin: 9px 0;
          font-size: 14px;
          line-height: 21px;
          color: #e1251b;
        }

        ol {
          padding-left: 25px;
          list-style-type: decimal;
          line-height: 24px;
          font-size: 14px;
        }

        ul {
          padding-left: 25px;
          list-style-type: disc;
          line-height: 24px;
          font-size: 14px;
        }
      }

      .checkout-steps {
        border: 1px solid #ddd;
        padding: 25px;

        .hr {
          height: 1px;
          background-color: #ddd;
        }

        .step-tit {
          line-height: 36px;
          margin: 15px 0;
        }

        .step-cont {
          margin: 0 10px 12px 20px;

          ul {
            font-size: 0;

            li {
              margin: 2px;
              display: inline-block;
              padding: 5px 20px;
              border: 1px solid #ddd;
              cursor: pointer;
              line-height: 18px;
            }
          }
        }
      }

      .submit {
        text-align: center;

        .btn {
          display: inline-block;
          padding: 15px 45px;
          margin: 15px 0 10px;
          font: 18px "微软雅黑";
          font-weight: 700;
          border-radius: 0;
          background-color: #e1251b;
          border: 1px solid #e1251b;
          color: #fff;
          text-align: center;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          text-decoration: none;
        }
      }

    }
  }
</style>