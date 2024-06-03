/* 
  1.该文件是对整个项目的接口进行统一管理，后端给我们的接口文档中，有几个接口，那么在这里就会匹配几个请求函数
  2.该文件中，所有函数的命名规范均为：reqXxxx
*/

import request from '@/utils/request'
import mockRequest from '@/utils/mockRequest'

// 专门用于请求首页的【三级分类列表】
export const reqCategoryList = () => request.get('/api/product/getBaseCategoryList')

// 专门用于请求首页的【楼层数据】（模拟）
export const reqFloorList = () => mockRequest.get('/floor')

// 专门用于请求首页的【轮播图数据】（模拟）
export const reqSlideList = () => mockRequest.get('/slide')

// 专门用于请求【搜索】
export const reqSearchInfo = (searchParams) => request.post('/api/list',searchParams)

// 专门用于请求【商品详情信息】
export const reqGoodsDetailInfo = (id) => request.get(`/api/item/${id}`)

// 专门用于请求【添加商品到购物车、对购物车中商品数量进行改动（正数是加，负数是减）】
export const reqAddGoodsToCart = (id,num) => request.post(`/api/cart/addToCart/${id}/${num}`)

// 专门用于请求【购物车列表】
export const reqCartList = () => request.get('/api/cart/cartList')

// 专门用于请求【勾选购物车中的商品】
export const reqCheckOne = (id,flag) => request.get(`/api/cart/checkCart/${id}/${flag}`)

// 专门用于请求【勾选购物车中的所有商品】
export const reqCheckAll = (skuIdList,isChecked) => request.post(`/api/cart/batchCheckCart/${isChecked}`,skuIdList)

// 专门用于请求【删除购物车中的某个商品】
export const reqDeleteOne = (id) => request.delete(`/api/cart/deleteCart/${id}`)

// 专门用于请求【删除购物车中的多个商品】
export const reqBatchDelete = (skuIdList) => request.post(`/api/cart/batchDeleteCart`,skuIdList)

// 专门用于请求【验证码】
export const reqGetCode = (phone) => request.get(`/api/user/passport/sendCode/${phone}`)

// 专门用于请求【注册】
export const reqRegister = (phone,password,code) => request.post('/api/user/passport/register',{phone,password,code})

// 专门用于请求【登录】
export const reqLogin = (loginParamsObj) => request.post('/api/user/passport/login',loginParamsObj)

// 专门用于请求【用户信息，需要携带token】
export const reqUserInfo = () =>  request.get('/api/user/passport/auth/getUserInfo')

// 专门用于请求【退出登录】
export const reqLogout = () =>  request.get('/api/user/passport/logout')

// 专门用于请求【交易信息，需要携带token】
export const reqTradeInfo = () =>  request.get('/api/order/auth/trade')

// 专门用于请求【提交订单】
export const reqSubmitOrder = (tradeNo,paramsObj) =>  request.post(`/api/order/auth/submitOrder?tradeNo=${tradeNo}`,paramsObj)

// 专门用于请求【获取某笔订单的支付信息】
export const reqPayInfo = (id) =>  request.get(`/api/payment/weixin/createNative/${id}`)

// 专门用于请求【获取某笔订单的支付状态】
export const reqPayStatus = (id) =>  request.get(`/api/payment/weixin/queryPayStatus/${id}`)

// 专门用于请求【我的订单】
export const reqMyOrderInfo = (pageNo,pageSize) =>  request.get(`/api/order/auth/${pageNo}/${pageSize}`)





