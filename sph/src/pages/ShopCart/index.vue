<template>
  <div>
    <!-- 购物车 -->
    <div class="cart" v-if="cartInfoList.length">
      <h4>全部商品</h4>
      <div class="cart-main">
        <div class="cart-th">
          <div class="cart-th1">全部</div>
          <div class="cart-th2">商品</div>
          <div class="cart-th3">单价（元）</div>
          <div class="cart-th4">数量</div>
          <div class="cart-th5">小计（元）</div>
          <div class="cart-th6">操作</div>
        </div>
        <!-- 购物车列表 -->
        <div class="cart-body">
          <!-- 一个ul就是购物车中的一条记录 -->
          <ul
            class="cart-list"
            v-for="cartInfo in cartInfoList"
            :key="cartInfo.id"
          >
            <!-- 选中状态 -->
            <li class="cart-list-con1">
              <input
                type="checkbox"
                :checked="cartInfo.isChecked"
                @click.prevent="checkOne(cartInfo)"
              />
            </li>
            <!-- 商品名称 -->
            <li class="cart-list-con2">
              <img :src="cartInfo.imgUrl" />
              <div class="item-msg">{{ cartInfo.skuName }}</div>
            </li>
            <!-- 商品价格 -->
            <li class="cart-list-con4">
              <span class="price">{{ cartInfo.cartPrice }}</span>
            </li>

            <!-- 数量操作 -->
            <li class="cart-list-con5">
              <a @click="changeSkuNum('decrement',cartInfo)" class="mins">-</a>
              <input
                type="text"
                class="itxt"
                :value="cartInfo.skuNum"
                @change="changeSkuNum('input', cartInfo, $event)"
              />
              <a @click="changeSkuNum('increment',cartInfo)" class="plus">+</a>
            </li>

            <!-- 小计 -->
            <li class="cart-list-con6">
              <span class="sum">{{
                cartInfo.cartPrice * cartInfo.skuNum
              }}</span>
            </li>
            <!-- 删除 -->
            <li class="cart-list-con7">
              <a class="sindelet" @click="deleteOne(cartInfo.skuId)">删除</a>
              <br />
            </li>
          </ul>
        </div>
      </div>
      <!-- 底部功能区 -->
      <div class="cart-tool">
        <div class="select-all">
          <!-- 全选 -->
          <input
            class="chooseAll"
            type="checkbox"
            :checked="isAll"
            @click.prevent="checkAll"
          />
          <span>全选</span>
        </div>
        <div class="option">
          <!-- 删除 -->
          <a @click="batchDlete">删除选中的商品</a>
        </div>
        <div class="money-box">
          <!-- 统计 -->
          <div class="chosed">
            已选择 <span>{{ total }}</span
            >件商品
          </div>
          <div class="sumprice">
            <em>总价（不含运费） ：</em>
            <i class="summoney">{{ totalPrice }}</i>
          </div>
          <!-- 结算 -->
          <div class="sumbtn">
            <router-link class="sum-btn" to="/trade">结算</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 数据为空展示 -->
    <div class="empty" v-if="!cartInfoList.length">
      <hr />
      <img src="http://49.232.112.44/images/empty.gif" alt="" />
      <h2>购物车空空如也</h2>
    </div>
  </div>
</template>

<script>
import {
  reqCartList,
  reqCheckOne,
  reqCheckAll,
  reqDeleteOne,
  reqBatchDelete,
  reqAddGoodsToCart,
} from "@/api";
// import {throttle} from 'lodash'

export default {
  name: "ShopCart",
  data() {
    return {
      cartInfoList: [],
    };
  },
  computed: {
    // 标识是否全选
    isAll() {
      return this.cartInfoList.every((item) => {
        return item.isChecked === 1;
      });
    },
    // 商品总数
    total() {
      let n = 0;
      this.cartInfoList.forEach((item) => {
        item.isChecked ? (n += item.skuNum) : null;
      });
      return n;
    },
    // 商品总金额
    totalPrice() {
      let n = 0;
      this.cartInfoList.forEach((item) => {
        item.isChecked ? (n += item.skuNum * item.skuPrice) : null;
      });
      return n;
    },
  },
  methods: {
    // 获取购物车列表
    async getCartList() {
      const { code, message, data } = await reqCartList();
      code === 200
        ? (this.cartInfoList = data[0]?.cartInfoList || [])
        : alert(`获取购物车数据失败:${message}`);
    },
    // 勾选购物车中的单个商品
    async checkOne(cartInfo) {
      // 获取当前商品的：编号、勾选状态
      const { skuId, isChecked } = cartInfo;
      // 维护一个新的勾选状态
      const newIsChecked = isChecked === 1 ? 0 : 1;
      // 立刻联系服务器，让服务器那边勾上
      const { code, message } = await reqCheckOne(skuId, newIsChecked);
      // 若服务器那边反馈勾选成功，则维护好本地数据
      if (code === 200) {
        cartInfo.isChecked = newIsChecked;
      } else {
        alert(`勾选失败：${message}`);
      }
    },
    // 勾选购物车中的所有商品
    async checkAll() {
      // 获取购物车总所有商品的id，arr用于保存所有商品id组成的数组
      const arr = [];
      this.cartInfoList.forEach( item => arr.push(item.skuId) );
      // 根据isAll，维护一个newChecked
      const newChecked = this.isAll ? 0 : 1;
      // 发请求
      const { code, message } = await reqCheckAll(arr, newChecked);
      // 判断业务逻辑
      if (code === 200) {
        this.cartInfoList.forEach((item) => {
          item.isChecked = newChecked;
        });
      } else {
        alert(`全选失败：${message}`);
      }
    },
    // 删除一个商品
    async deleteOne(id) {
      if (confirm("确定删除吗？")) {
        const { code, message } = await reqDeleteOne(id);
        if (code === 200) {
          // 维护本地数据，第一种写法
          this.cartInfoList = this.cartInfoList.filter((item) => {
            return item.skuId !== id;
          });

          // 维护本地数据，第二种写法
          /* let x = 0
            this.cartInfoList.forEach((item,index)=>{
              if(item.skuId === id){
                x = index
              }
            })
            this.cartInfoList.splice(x,1) */

          // 维护本地数据，第三种写法
          /* const result = this.cartInfoList.find((item,index)=>{
              if(item.skuId === id){
                item.index = index
              }
              return item.skuId === id
            })
            this.cartInfoList.splice(result.index,1) */
        } else {
          alert(`删除失败：${message}`);
        }
      }
    },
    // 删除已选商品
    async batchDlete() {
      if (confirm("确定删除已勾选的吗？")) {
        // 把购物车中，所有勾选了的商品的skuId是收集起来
        const arr = [];
        this.cartInfoList.forEach((item) => {
          item.isChecked ? arr.push(item.skuId) : null;
        });
        // 发请求
        let { code, message } = await reqBatchDelete(arr);
        if (code === 200) {
          // 维护本地数据
          this.cartInfoList = this.cartInfoList.filter((item) => {
            return item.isChecked === 0;
          });
        } else {
          alert(`删除失败：${message}`);
        }
      }
    },
    // 修改购买数量（cartInfo是当前商品信息,event是事件对象）
    async changeSkuNum(type, cartInfo, event) {
      if(this.isLock) {
        return
      }
      this.isLock = true
      // 获取要修改商品的skuId(编号)、skuNum(数量)
      const { skuId, skuNum } = cartInfo;
      switch (type) {
        case "input":
          // 获取用户的输入
          const { value } = event.target;
          // 校验数据，若输入的是1~200的合法数据，则进入判断
          if (value >= 1 && value <= 200) {
            // 由于用户输入的可能是小数，所以每次使用value都parseInt一下（举例：12.67 ==> 12）
            // 根据用户的输入和当前的数量，计算出一个差值，因为服务器要的是差值。
            const disNum = parseInt(value) - skuNum;
            // 发请求联系服务器去修改数量，注意：携带的是差值
            const { code, message } = await reqAddGoodsToCart(skuId, disNum);
            // 判断业务逻辑
            if (code === 200) {
              // 维护本地数据
              cartInfo.skuNum = event.target.value =  parseInt(value);
              cartInfo.isChecked = 1
            } else {
              alert(`修改商品数量失败：${message}`);
              // 若修改失败后，要将页面上的呈现置为原来的值
              event.target.value = skuNum;
            }
          } else if (value > 200) {
            // 进入到这里，证明输入的是不合法，其实就是输入的太多了，可原谅；用户的输入直接不要了，直接用200-当前值，得到最大的差值
            const disNum = 200 - skuNum;
            // 发请求
            const { code, message } = await reqAddGoodsToCart(skuId, disNum);
            if (code === 200) {
              // 本地数据调整为最大值—— 200
              cartInfo.skuNum = event.target.value =  200;
              cartInfo.isChecked = 1
            } else {
              alert(`修改商品数量失败：${message}`);
              event.target.value = skuNum;
            }
          } else {
            // 进入到这里，证明输入的是不合法，且不可原谅的那种不合法
            event.target.value = skuNum;
          }
          break;
        case "increment":
          if(skuNum === 200){
             alert('最大购买数量为200')
          }else{
            // 发请求修改数量
            const {code,message} = await reqAddGoodsToCart(skuId,1)
            // 请求成功维护本地数据，否则提示
            code === 200 ? (cartInfo.skuNum += 1,cartInfo.isChecked = 1) : alert(`修改数量失败：${message}`)
          }
          break;
        case "decrement":
          if(skuNum === 1){
            alert('最小购买数量为1')
          }else{
            // 发请求修改数量
            const {code,message} = await reqAddGoodsToCart(skuId,-1)
            // 请求成功维护本地数据，否则提示
            code === 200 
              ? (cartInfo.skuNum -= 1,cartInfo.isChecked = 1) 
              : alert(`修改数量失败：${message}`)
          }
          break;
      }
      this.isLock = false
    },
  },
  mounted() {
    this.getCartList();
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;
  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }
  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;
      & > div {
        float: left;
      }
      .cart-th1 {
        width: 25%;
        input {
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
      }
      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
      .cart-th2 {
        width: 25%;
      }
      .cart-th4 {
        width: 14.5%;
      }
      .cart-th5 {
        width: 10%;
      }
    }
    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;
      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;
        display: flex;
        align-items: center;
        &:last-child {
          border-bottom: 0;
        }
        & > li {
          float: left;
        }
        .cart-list-con1 {
          width: 15%;
        }
        .cart-list-con2 {
          width: 35%;
          img {
            width: 82px;
            height: 82px;
            float: left;
          }
          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 20px;
          }
        }
        .cart-list-con4 {
          width: 10%;
        }
        .cart-list-con5 {
          width: 17%;
          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 18px;
            text-align: center;
            height: 31px;
            line-height: 31px;
            text-decoration: none;
            cursor: pointer;
          }
          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 31px;
            float: left;
            text-align: center;
            font-size: 14px;
            &:focus {
              outline: 0;
            }
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 18px;
            text-align: center;
            height: 31px;
            line-height: 31px;
            text-decoration: none;
            cursor: pointer;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
            cursor: pointer;
          }
        }
      }
    }
  }
  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;
    height: 50px;
    line-height: 50px;

    .select-all {
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      padding-left: 12px;
      float: left;
      .chooseAll {
        margin-right: 5px;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      overflow: hidden;
      height: 50px;
      line-height: 50px;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
        cursor: pointer;
      }
    }

    .money-box {
      float: right;
      height: 50px;

      .chosed {
        line-height: 50px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 50px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-weight: 600;
          font-size: 18px;
          vertical-align: middle;
        }
      }

      .sumbtn {
        float: right;
        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
          text-decoration: none;
          &hover {
            color: white !important;
          }
        }
      }
    }
  }
}
.empty {
  text-align: center;
  hr {
    border-top: 1px solid #ddd;
    background-color: #ddd;
  }
  img {
    margin-top: 50px;
    width: 200px;
  }
  h2 {
    color: gray;
    margin-bottom: 50px;
  }
}
</style>