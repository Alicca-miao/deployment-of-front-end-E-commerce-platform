<template>
  <div class="detail">
    <!-- 商品分类导航 -->
    <TypeNav />
    <!-- 容器 -->
    <section class="con" v-if="info?.skuInfo?.id">
      <!-- 导航路径 -->
      <div class="conPoin">
        <span>{{info.categoryView?.category1Name}}</span>
        <span>{{info.categoryView?.category2Name}}</span>
        <span>{{info.categoryView?.category3Name}}</span>
      </div>
      <!-- 主要内容 -->
      <div class="mainCon">
        <!-- 左侧 -->
        <div class="previewWrap">

          <!--放大镜效果-->
          <Zoom :url="info.skuInfo?.skuDefaultImg"/>

          <!-- 小图列表 -->
          <ImageList :imgList="info.skuInfo?.skuImageList"/>
          
        </div>
        <!-- 右侧 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <!-- 商品名称 -->
            <h3 class="InfoName">{{info.skuInfo?.skuName}}</h3>
            <!-- 商品简介 -->
            <p class="news">{{info.skuInfo?.skuDesc}}</p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
                <div class="price">
                  <i>¥</i>
                  <!-- 商品价格 -->
                  <em>{{info.price}}</em>
                </div>
              </div>
            </div>
          </div>
          <div class="choose">

            <!-- 属性选择区 -->
            <div class="chooseArea">
              <div class="choosed"></div>
              <!-- 一个dl就是一个可选属性 -->
              <dl v-for="s1 in info.spuSaleAttrList" :key="s1.id">
                <!-- dt是属性名 -->
                <dt class="title">选择{{s1.saleAttrName}}</dt>
                <!-- dd是每个具体的可选值 -->
                <dd 
                  :class="{active:s2.isChecked === '1'}" 
                  v-for="s2 in s1.spuSaleAttrValueList" 
                  :key="s2.id"
                  @click="changeAttr(s2.id,s1.spuSaleAttrValueList)"
                >
                  {{s2.saleAttrValueName}}
                </dd>
              </dl>
            </div>

            <div class="cartWrap">
              <!-- 数量修改区 -->
              <div class="controls">
                <input class="itxt" :value="goodsNum" @change="changeGoodsNum('input',$event)">
                <a class="plus" @click="changeGoodsNum('increment')">+</a>
                <a class="mins" @click="changeGoodsNum('decrement')">-</a>
              </div>
              <!-- 加入购物车 -->
              <div class="add">
                <a @click="addGoodsToCart">加入购物车</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
  import ImageList from './ImageList'
  import Zoom from './Zoom'
  import {reqGoodsDetailInfo,reqAddGoodsToCart} from '@/api'

  export default {
    name: 'Detail',
    components: { ImageList,Zoom },
    data() {
      return {
        info:{}, //当前商品的详细信息
        goodsNum:1
      }
    },
    methods: {
      // 获取商品详情
      async getGoodsDetailInfo(){
         // 获取路由传递过来的商品编号（id）
        const {id}  = this.$route.params
        // 发请求获取详情
        const {code,message,data} = await reqGoodsDetailInfo(id)
        // 判断业务逻辑
        if(code === 200){
          this.info = data
        }else{
          alert(`商品详情加载失败：${message}`)
        }
      },
      // 切换商品属性
      changeAttr(id,list){
        list.forEach(item => {
          item.id === id ? item.isChecked = '1' : item.isChecked = '0'
        });
      },
      // 修改购买数量的回调
      changeGoodsNum(type,event){
        switch (type) {
          // 直接输入值，去修改
          case 'input':
            // 获取用户的输入
            const {value} = event.target
            // 校验数据
            if(value>=1 && value<=200){
              // 若输入的是1~200之间，正常收集数据，若是小数则取其整数部分
              this.goodsNum = parseInt(value)
            }else if(value < 1){
              // 若输入的是小于1的，则直接置为1
              this.goodsNum = 1
            }else if(value > 200){
              // 若输入的是大于200的，则直接置为200
              this.goodsNum = event.target.value = 200
            }else {
              this.goodsNum = event.target.value = 1
            }
            break;
          // 点击加号，去修改
          case 'increment':
            this.goodsNum < 200 ? this.goodsNum += 1 : alert('最大购买数量为200')
            break;
           // 点击减号，去修改
          case 'decrement':
            this.goodsNum > 1 ? this.goodsNum -= 1 : alert('最小购买数量为1')
            break;
        }
      },
      // 添加商品到购物车
      async addGoodsToCart(){
        // 获取商品的编号
        const {id} = this.$route.params
        // 发请求添加
        const {code,message} = await reqAddGoodsToCart(id,this.goodsNum)
        // 判断业务逻辑
        if(code === 200){
          // 获取商品的：默认图片、名称、数量、单价、用户选择的属性
          // 图片、名称
          const {skuDefaultImg,skuName} = this.info.skuInfo
          // 数量
          const {goodsNum} = this
          // 单价
          const {price} = this.info
          // 定义一个用于保存用户所选属性的数组
          const arr = []
          // 用户选择的属性
          this.info.spuSaleAttrList.forEach((item1)=>{
            //遍历每一个可选属性数组，寻找到选中的那个
            let result = item1.spuSaleAttrValueList.find( item2 =>{
              return item2.isChecked === '1'
            })
            arr.push(`${result.saleAttrName}：${result.saleAttrValueName}`)
          })
          // 定义一个对象，用户承装所有即将展示到【/addcart_success】的信息
          const buyInfo = {
            name:skuName,
            num:goodsNum,
            url:skuDefaultImg,
            price,
            arr
          }
          // 将【/addcart_success】要展示的信息存入sessionStorage中
          sessionStorage.setItem('buyInfo',JSON.stringify(buyInfo))
          // 跳转到【/addcart_success】同时携带参数
          this.$router.push('/addcart_success')
        }else{
          alert(`加入购物车失败：${message}`)
        }
      }
    },
    async mounted() {
      // 组件一挂载就发请求获取商品详情
      this.getGoodsDetailInfo()
    },
  }
</script>

<style lang="less" scoped>
  .detail {
    .con {
      width: 1200px;
      margin: 15px auto 0;

      .conPoin {
        padding: 9px 15px 9px 0;

        &>span+span:before {
          content: "/\00a0";
          padding: 0 5px;
          color: #ccc;
        }
      }

      .mainCon {
        overflow: hidden;
        margin: 5px 0 15px;

        .previewWrap {
          float: left;
          width: 400px;
          position: relative;
        }

        .InfoWrap {
          width: 700px;
          float: right;

          .InfoName {
            font-size: 14px;
            line-height: 21px;
            margin-top: 15px;
          }

          .news {
            color: #e12228;
            margin-top: 15px;
          }

          .priceArea {
            background: #fee9eb;
            padding: 7px;
            margin: 13px 0;

            .priceArea1 {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                float: left;
                margin-right: 15px;
              }

              .price {
                float: left;
                color: #c81623;

                i {
                  font-size: 16px;
                }

                em {
                  font-size: 24px;
                  font-weight: 700;
                }

                span {
                  font-size: 12px;
                }
              }

              .remark {
                float: right;
              }
            }

            .priceArea2 {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                margin-right: 15px;
                float: left;
              }

              .fixWidth {
                width: 520px;
                float: left;

                .red-bg {
                  background: #c81623;
                  color: #fff;
                  padding: 3px;
                }

                .t-gray {
                  color: #999;
                }
              }
            }


          }

          .support {
            border-bottom: 1px solid #ededed;
            padding-bottom: 5px;

            .supportArea {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              .title {
                margin-right: 15px;
                float: left;
              }

              .fixWidth {
                width: 520px;
                float: left;
                color: #999;
              }
            }
          }

          .choose {
            .chooseArea {
              overflow: hidden;
              line-height: 28px;
              margin-top: 10px;

              dl {
                overflow: hidden;
                margin: 13px 0;

                dt {
                  margin-right: 15px;
                  float: left;
                }

                dd {
                  float: left;
                  margin-right: 5px;
                  color: #666;
                  line-height: 24px;
                  padding: 2px 14px;
                  border-top: 1px solid #eee;
                  border-right: 1px solid #bbb;
                  border-bottom: 1px solid #bbb;
                  border-left: 1px solid #eee;
                  cursor: pointer;

                  &.active {
                    color: #e1251b;
                    border: 2px solid #e1251b;
                  }
                }
              }
            }

            .cartWrap {
              .controls {
                width: 48px;
                position: relative;
                float: left;
                margin-right: 15px;

                .itxt {
                  width: 38px;
                  height: 35px;
                  border: 1px solid #ccc;
                  color: #555;
                  float: left;
                  border-right: 0;
                  text-align: center;
                  &:focus {
                    outline: 0px;
                  }
                }

                .plus,
                .mins {
                  width: 15px;
                  text-align: center;
                  height: 17px;
                  line-height: 17px;
                  background: #f1f1f1;
                  color: #666;
                  position: absolute;
                  border: 1px solid #ccc;
                }

                .mins {
                  top: 19px;
                  border-top: 0;
                }
              }

              .add {
                float: left;

                a {
                  background-color: #e1251b;
                  padding: 0 25px;
                  font-size: 16px;
                  color: #fff;
                  height: 36px;
                  line-height: 36px;
                  display: block;
                }
              }
            }
          }
        }
      }
    }

    .product-detail {
      width: 1200px;
      margin: 30px auto 0;
      overflow: hidden;

      .aside {
        width: 210px;
        float: left;
        border: 1px solid #ccc;

        .tabWraped {
          height: 40px;

          h4 {
            border-top: 3px solid #fff;
            float: left;
            line-height: 37px;
            width: 105px;
            text-align: center;
            border-bottom: 1px solid #ccc;

            &.active {
              border-right: 1px solid #ccc;
              box-sizing: border-box;
              font-weight: normal;
            }
          }
        }

        .tabContent {
          padding: 10px;

          .tab-pane {
            display: none;

            &.active {
              display: block;
            }

            &:nth-child(1) {
              .partList {
                overflow: hidden;

                li {
                  width: 50%;
                  float: left;
                  border-bottom: 1px dashed #ededed;
                  line-height: 28px;
                }
              }

              .goodsList {
                &>li {
                  margin: 5px 0 15px;
                  border-bottom: 1px solid #ededed;
                  padding-bottom: 5px;

                  .list-wrap {
                    .p-img {
                      text-align: center;

                      img {
                        width: 152px;
                      }
                    }

                    .price {
                      font-size: 16px;
                      color: #c81623;
                    }

                    .operate {
                      text-align: center;
                      margin: 5px 0;

                      a {
                        background-color: transparent;
                        border: 1px solid #8c8c8c;
                        color: #8c8c8c;
                        display: inline-block;
                        padding: 2px 14px;
                        line-height: 18px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .detail {
        width: 980px;
        float: right;

        .fitting {
          border: 1px solid #ddd;
          margin-bottom: 15px;

          .kt {
            border-bottom: 1px solid #ddd;
            background: #f1f1f1;
            color: #333;
            padding: 5px 0 5px 15px;
          }

          .good-suits {
            height: 170px;
            padding-top: 10px;

            .master {
              width: 127px;
              height: 165px;
              text-align: center;
              position: relative;
              float: left;

              img {
                width: 87px;
              }

              p {
                color: #c81623;
                font-size: 16px;
                font-weight: 700;
              }

              i {
                position: absolute;
                top: 48px;
                right: -25px;
                font-size: 16px;
              }
            }

            .suits {
              width: 668px;
              height: 165px;
              float: left;

              .suitsItem {
                float: left;
                width: 127px;
                padding: 0 20px;
                text-align: center;

                img {
                  width: 120px;
                  height: 130px;
                }

                p {
                  font-size: 12px;
                }

                label {
                  display: block;
                  position: relative;

                  input {
                    vertical-align: middle;
                  }

                  span {
                    vertical-align: middle;
                  }
                }
              }
            }

            .result {
              border-left: 1px solid #ddd;
              width: 153px;
              height: 165px;
              padding-left: 20px;
              float: left;

              .num {
                font-size: 14px;
                margin-bottom: 10px;
                margin-top: 10px;
              }

              .price-tit {
                font-weight: bold;
                margin-bottom: 10px;
              }

              .price {
                color: #B1191A;
                font-size: 16px;
                margin-bottom: 10px;
              }

              .addshopcar {
                background-color: #e1251b;
                border: 1px solid #e1251b;
                padding: 10px 25px;
                font-size: 16px;
                color: #fff;
                display: inline-block;
                box-sizing: border-box;
              }
            }
          }
        }

        .intro {
          .tab-wraped {
            background: #ededed;
            // border: 1px solid #ddd;
            overflow: hidden;

            li {
              float: left;

              &+li>a {
                border-left: 1px solid #ddd;
              }

              &.active {
                a {
                  // border: 0;
                  background: #e1251b;
                  color: #fff;
                }
              }

              a {
                display: block;
                height: 40px;
                line-height: 40px;
                padding: 0 11px;
                text-align: center;
                color: #666;
                background: #fcfcfc;
                border-top: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
              }
            }
          }

          .tab-content {
            .tab-pane {
              display: none;

              &.active {
                display: block;
              }

              &:nth-child(1) {
                .goods-intro {
                  padding-left: 10px;

                  li {
                    margin: 10px 0;
                  }
                }

                .intro-detail {
                  img {
                    width: 100%;
                  }
                }
              }
            }

          }
        }
      }
    }
  }
</style>