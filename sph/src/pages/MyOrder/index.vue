<template>
  <div class="order-main">
    <TypeNav/>
    <div class="container">
      <div class="order-body">
        <!--左侧列表（不用关心）-->
        <div class="order-left">
          <dl>
            <dt><i>·</i> 订单中心</dt>
            <dd>
              我的订单
            </dd>
            <dd>
              团购订单
            </dd>
            <dd>本地生活订单 </dd>
            <dd>我的预售</dd>
            <dd>评价晒单</dd>
            <dd>取消订单记录</dd>
          </dl>
          <dl>
            <dt><i>·</i> 关注中心</dt>
            <dd>关注的商品 </dd>
            <dd>关注的店铺</dd>
            <dd>关注的专辑 </dd>
            <dd>关注的品牌</dd>
            <dd>关注的活动 </dd>
            <dd>浏览历史</dd>
          </dl>
          <dl>
            <dt><i>·</i> 特色业务</dt>
            <dd>我的营业厅 </dd>
            <dd>京东通信 </dd>
            <dd>定期送 </dd>
            <dd>京东代下单</dd>
          </dl>
        </div>
        <!-- 右侧内容 -->
        <div class="order-right">
          <div class="order-content">
            <div class="chosetype">
              <!-- 整个订单列表的头部 -->
              <table>
                <thead>
                  <tr>
                    <th width="29%">商品</th>
                    <th width="31%">订单详情</th>
                    <th width="13%">收货人</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
              </table>
            </div>
            <!-- 订单列表 -->
            <div class="orders">
              <!-- 一个table就是一个订单 -->
              <table class="order-item" v-for="r1 in orderInfo.records" :key="r1.id">
                <!-- 头部 -->
                <thead>
                  <tr>
                    <th colspan="5">
                      <span class="ordertitle">{{r1.createTime}}　订单编号：{{r1.outTradeNo}} <span
                          class="pull-right delete"><img src="./images/delete.png"></span></span>
                    </th>
                  </tr>
                </thead>
                <!-- 具体内容 -->
                <tbody>
                  <!-- 一个tr就是订单中的一个商品 -->
                  <tr v-for="(r2,index) in r1.orderDetailList" :key="r2.id">
                    <td width="60%">
                      <div class="typographic">
                        <img :src="r2.imgUrl">
                        <a href="#" class="block-text">{{r2.skuName}}</a>
                        <span>x{{r2.skuNum}}</span>
                        <a href="#" class="service">售后申请</a>
                      </div>
                    </td>
                    <td v-if="!index" :rowspan="r1.orderDetailList.length" width="8%" class="center">{{r1.consignee}}</td>
                    <td v-if="!index" :rowspan="r1.orderDetailList.length" width="13%" class="center">
                      <ul class="unstyled">
                        <li>总金额¥{{r1.totalAmount}}</li>
                        <li>在线支付</li>
                      </ul>
                    </td>
                    <td v-if="!index" :rowspan="r1.orderDetailList.length" width="8%" class="center">
                      <a href="#" class="btn">{{r1.orderStatusName}} </a>
                    </td>
                    <td v-if="!index" :rowspan="r1.orderDetailList.length" width="13%" class="center">
                      <ul class="unstyled">
                        <li>
                          <a href="mycomment.html" >评价|晒单</a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分页器 -->
            <Pagination
              :total="orderInfo.total"
              :pageNo="pageNo"
              :pageSize="pageSize"
              :continues="7"
              :sendPageNo="updateOrderInfo"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {reqMyOrderInfo} from '@/api'
  export default {
    name: 'MyOrder',
    data() {
      return {
        orderInfo:{}, //用于存储所有订单信息的
        pageNo:1,
        pageSize:5
      }
    },
    methods: {
      // 获取我的订单数据
      async getMyOrderInfo(){
        // 发请求获取我的订单信息
        const {code,message,data} = await reqMyOrderInfo(this.pageNo,this.pageSize)
        // 判断业务逻辑
        if(code === 200){
          this.orderInfo = data
        }else{
          this.$message.warning(`获取订单列表失败：${message}`)
        }
      },
      updateOrderInfo(n){
        // 将分页器传递过来的，用户所点击的页码，存起来
        this.pageNo = n
        // 发请求重新得到最新的数据
        this.getMyOrderInfo()
        // 滚动条置到最顶端
        document.documentElement.scrollTop = 0
      }
    },
    mounted() {
      // 调用getMyOrderInfo获取我的订单数据
      this.getMyOrderInfo()
    },
  }
</script>

<style lang="less" scoped>
  .order-main {
    .container {
      margin: 0 auto;
      width: 1200px;

      .order-body {
        padding: 10px;
        color: #333;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        //左边
        .order-left {
          float: left;
          width: 16.67%;

          dl {
            line-height: 28px;

            dt {
              font-weight: 700;
              padding: 5px;

              i {
                color: #77b72c;
              }
            }

            dd {
              margin: 0 0 6px;
              border-bottom: 1px solid #ededed;
              text-align: center;
            }
          }
        }

        //右边
        .order-right {
          float: right;
          width: 83.33%;

          //订单部分
          .order-content {
            margin: 0 20px;
            color: #666;

            //标题
            .title {
              margin-bottom: 22px;
              border: 1px solid #ddd;

              h3 {
                padding: 12px 10px;
                font-size: 15px;
                background-color: #f1f1f1;

              }
            }

            //表头
            .chosetype {
              margin-bottom: 15px;
              color: #666;

              table {
                border: 1px solid #e6e6e6;
                border-collapse: separate;
                border-radius: 2px;
                width: 100%;
                max-width: 100%;
                border-spacing: 0;

                th {
                  padding: 6px 8px;
                  color: #666;
                  font-weight: 700;
                  vertical-align: bottom;
                  background-color: #f4f4f4;
                  line-height: 18px;
                  border-bottom: 1px solid #e6e6e6;
                  font-size: 12px;
                  text-align: left;
                }
              }
            }

            // 表单内容
            .orders {
              font-size: 12px;

              a {
                &:hover {
                  color: #4cb9fc;
                }
              }

              table {
                border: 1px solid #e6e6e6;
                border-collapse: collapse;
                border-radius: 2px;
                width: 100%;
                margin-bottom: 18px;
                max-width: 100%;

                th {
                  padding: 6px 8px;
                  line-height: 18px;
                  text-align: left;
                  vertical-align: bottom;
                  background-color: #f4f4f4;
                  font-size: 12px;
                  color: #666;

                  .pull-right {
                    float: right;
                    cursor: pointer;

                    img {
                      margin-right: 10px;
                      vertical-align: middle;
                    }
                  }
                }

                td {
                  font-size: 12px;
                  color: #666;
                  padding: 6px 8px;
                  line-height: 18px;
                  text-align: left;
                  vertical-align: middle;
                  border: 1px solid #e6e6e6;

                  &.center {
                    text-align: center;
                  }

                  .typographic {
                    img {
                      float: left;
                      margin-right: 10px;
                      width: 100px;
                    }

                    a {
                      float: left;
                      min-width: 80px;
                      max-width: 250px;

                      &.service {
                        color: #666;
                      }
                    }

                    span {
                      float: left;
                      min-width: 80px;
                      max-width: 250px;
                      text-align: center;
                    }

                  }
                }

              }
            }

            // 分页
            .choose-order {
              .pagination {
                margin: 38px 0;

                ul {
                  font-size: 0;
                  display: inline-block;

                  li {
                    display: inline-block;
                    padding: 4px 9px;
                    font-size: 14px;
                    border: 1px solid #e0e9ee;

                    &.prev,
                    &.next {
                      background-color: #fafafa;
                    }

                    &.prev {
                      border-right-color: #28a3ef;
                    }

                    &.page {
                      border-color: #28a3ef;
                      border-left: 0;

                      &.actived {
                        background-color: #28a3ef;

                        a {
                          color: #fff;
                        }

                      }
                    }
                  }
                }

                div {
                  display: inline-block;
                  font-size: 14px;
                  color: #333;
                }
              }
            }
          }

          // 猜你喜欢
          .like {
            border: 1px solid #ddd;
            margin: 15px 20px;

            .kt {
              border-bottom: 1px solid #ddd;
              background: #f1f1f1;
              color: #666;
              margin: 0;
              padding: 12px;
              font-size: 15px;
            }

            .like-list {
              padding: 15px 11px;
              overflow: hidden;

              .likeItem {
                width: 25%;
                float: left;

                .p-img {
                  text-align: left;

                  img {
                    width: 167px;
                    height: 123px;
                  }
                }

                .attr {
                  padding: 0 15px;
                }

                .price {
                  padding: 0 15px;
                  font-size: 16px;
                  color: #c81623;
                  margin-bottom: 20px;
                }

                .commit {
                  padding: 0 15px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>