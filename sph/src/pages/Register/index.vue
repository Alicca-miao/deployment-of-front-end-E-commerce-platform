<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户</h3>
      <ValidationObserver ref="register">
        <div class="content">
          <label>手机号:</label>
          <ValidationProvider name="手机" rules="shouji|bixu" v-slot="{errors}">
            <input v-model="phone" type="text" placeholder="请输入你的手机号">
            <span class="error-msg">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="content">
          <label>验证码:</label>
          <ValidationProvider name="验证码" rules="ma|bixu" v-slot="{errors}">
            <input v-model="code" type="text" placeholder="请输入验证码">
            <button class="getcode" @click="getCode">获取验证码</button>
            <span class="error-msg">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="content">
          <label>登录密码:</label>
          <ValidationProvider name="密码" rules="mima|bixu" v-slot="{errors}">
            <input v-model="password" type="text" placeholder="请输入你的登录密码">
            <span class="error-msg">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="content">
          <label>确认密码:</label>
          <ValidationProvider name="确认密码" :rules="`bixu|remima:${password}`" v-slot="{errors}">
            <input v-model="rePassword" type="text" placeholder="请输入确认密码">
            <span class="error-msg">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="controls">
          <ValidationProvider name="协议" rules="agree|bixu" v-slot="{errors}">
            <input name="m1" type="checkbox" v-model="agree">
            <span>同意协议并注册《尚品汇用户协议》</span>
            <span class="error-msg">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="btn">
          <button @click="register">完成注册</button>
        </div>
      </ValidationObserver>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>
  import {reqGetCode,reqRegister} from '@/api'

  export default {
    name: 'Register',
    data() {
      return {
        phone:'',
        password:'',
        code:'',
        rePassword:'',
        agree:false
      }
    },
    methods: {
      // 获取验证码
      async getCode(){
        // 请求服务器获取验证码
        const {code,message,data} = await reqGetCode(this.phone)
        // 判断业务逻辑是否成功
        if(code === 200){
          // 自动填写上验证码
          this.code = data
          // 若成功，提示一下
          this.$message.success('验证码下发成功！')
        }else{
          // 若下发失败，给个原因
          this.$message.error(`验证码下发失败:${message}`)
        }
      },
      // 用于登录
      async register(){
        const result = await this.$refs.register.validate()
        if(result){
          // 获取注册必要的参数：手机号、密码、验证码
          const {phone,password,code} = this
          // 请求注册（注意参数的顺序）
          const {code:c1,message} = await reqRegister(phone,password,code)
          // 判断业务逻辑
          if(c1 === 200){
            // 注册成功给个提示
            this.$message.success('注册成功！'),
            // 跳转到登录
            this.$router.push('/login')
          }else{
            // 注册失败提示原因
            this.$message.error(`注册失败：${message}`)
          }
        }else{
          this.$message.warning('请检查您的输入项')
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .register-container {
    .register {
      width: 1200px;
      height: 445px;
      border: 1px solid rgb(223, 223, 223);
      margin: 0 auto;

      h3 {
        background: #ececec;
        margin: 0;
        padding: 6px 15px;
        color: #333;
        border-bottom: 1px solid #dfdfdf;
        font-size: 16px;
        line-height: 30.06px;

        span {
          font-size: 14px;
          float: right;

          a {
            color: #e1251b;
          }
        }
      }

      div:nth-of-type(1) {
        margin-top: 40px;
      }

      .content {
        padding-left: 390px;
        margin-bottom: 18px;
        position: relative;

        label {
          font-size: 14px;
          width: 96px;
          text-align: right;
          display: inline-block;
        }

        input {
          width: 270px;
          height: 38px;
          padding-left: 8px;
          box-sizing: border-box;
          margin-left: 5px;
          outline: none;
          border: 1px solid #999;
        }

        img {
          vertical-align: sub;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .controls {
        text-align: center;
        position: relative;

        input {
          vertical-align: middle;
        }

        .error-msg {
          position: absolute;
          top: 100%;
          left: 495px;
          color: red;
        }
      }

      .btn {
        text-align: center;
        line-height: 36px;
        margin: 17px 0 0 55px;

        button {
          outline: none;
          width: 270px;
          height: 36px;
          background: #e1251b;
          color: #fff !important;
          display: inline-block;
          font-size: 16px;
          border: 0;
          cursor: pointer;
        }
      }

			.getcode{
				height: 38px;
				margin-left: 10px;
				padding: 5px;
			}
    }

    .copyright {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
      line-height: 24px;

      ul {
        li {
          display: inline-block;
          border-right: 1px solid #e4e4e4;
          padding: 0 20px;
          margin: 15px 0;
        }
      }
    }
  }
</style>