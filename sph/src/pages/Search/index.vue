<template>
	<div class="outer">
		<!-- 三级分类导航 -->
		<TypeNav />

		<!-- 搜索区容器 -->
		<div class="main">
			<div class="py-container">
				<!--面包屑导航-->
				<div class="bread">
					<span class="sui-breadcrumb">全部结果:</span>
					<ul class="fl sui-tag">

						<!-- 面包屑_分类名 -->
						<li class="with-x" v-if="searchParams.categoryName">
							分类：{{searchParams.categoryName}} 
							<i @click="removeCategoryName">×</i>
						</li>

						<!-- 面包屑_关键词 -->
						<li class="with-x" v-if="searchParams.keyword">
							关键词：{{searchParams.keyword}} 
							<i @click="removeKeyword">×</i>
						</li>

						<!-- 面包屑_品牌 -->
						<li class="with-x" v-if="searchParams.trademark">
							品牌：{{searchParams.trademark.split(':')[1]}} 
							<i @click="removeTrademark">×</i>
						</li>

						<!-- 面包屑_属性 -->
						<li class="with-x" v-for="(p,index) in searchParams.props" :key="index">
							{{formatProps(p)}}
							<i @click="removeProps(index)">×</i>
						</li>

					</ul>
				</div>

				<!-- 搜索器 -->
				<SearchSelector 
					:trademarkList="searchInfo.trademarkList"
					:attrsList="searchInfo.attrsList"
					:sendTrademark="saveTrademark"
					@send-attribute="saveAttribute"
					v-if="searchInfo.total"
				/>

				<!--内容区-->
				<div class="details clearfix" v-if="searchInfo.total">
					<!-- 商品排序 -->
					<div class="sui-navbar">
						<div class="navbar-inner filter">
							<ul class="sui-nav">
								<!-- 综合排序 -->
								<li :class="{active:orderType === '1'}" @click="changeOrder(1)">
									<a>
										<!-- icon-up代表上箭头，icon-down代表下箭头 -->
										综合<i v-show="orderType === '1'" class="iconfont" :class="orderFlag"></i>
									</a>
								</li>
								<!-- 价格排序 -->
								<li :class="{active:orderType === '2'}" @click="changeOrder(2)">
									<a>
										<!-- icon-up代表上箭头，icon-down代表下箭头 -->
										价格<i v-show="orderType === '2'" class="iconfont" :class="orderFlag"></i>
									</a>
								</li>
							</ul>
						</div>
					</div>

					<!-- 商品展列表 -->
					<div class="goods-list">
						<ul class="yui3-g" @click="toDetail">
							<!-- 每一个li就是一个商品 -->
							<li class="yui3-u-1-5" v-for="g in searchInfo.goodsList" :key="g.id">
								<div class="list-wrap">
									<div class="p-img">
										<a>
											<!-- 商品图片 -->
											<img :data-id="g.id" v-lazy="g.defaultImg" />
										</a>
									</div>
									<div class="price">
										<strong>
											<em>¥</em>
											<!-- 商品价格 -->
											<i>{{g.price}}</i>
										</strong>
									</div>
									<div class="attr">
										<a :data-id="g.id" :title="g.title" v-html="g.title"></a>
									</div>
								</div>
							</li>
						</ul>
					</div>

					<!-- 分页器 --> 
					<Pagination 
						:total="searchInfo.total" 
						:pageSize="searchParams.pageSize" 
						:pageNo="searchParams.pageNo" 
						:continues="5"
						:sendPageNo="savePageNo"
					/>

				</div>

				<!-- 数据为空的展示 -->
				<div class="empty" v-if="!searchInfo.total">
					<img src="https://static.360buyimg.com/devfe/error-new/1.0.0/css/i/error_06.png" alt="">
					<h2>搜索结果为空</h2>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
	import SearchSelector from './SearchSelector'
	import './icon/iconfont.css'
	import {reqSearchInfo} from '@/api'

	export default {
		name: 'Search',
		components: { SearchSelector },
		data() {
			return {
				// 搜索参数
				searchParams:{
					category1Id:'', //一级分类ID
					category2Id:'', //二级分类ID
					category3Id:'', //三级分类ID
					categoryName:'', //分类名称
					keyword:'', // 搜索关键字
					props:[], // 属性
					trademark:'', // 品牌
					order:'1:desc', //排序方式
					pageNo:1,
					pageSize:5,
				},
				// 搜索回来的结果
				searchInfo:{}
			}
		},
		computed:{
			// 计算排序类型（综合是1，价格是2）
			orderType(){
				return this.searchParams.order.split(':')[0]
			},
			// 计算排序标识（asc是升序，图标为icon-up。desc是降序图标为icon-up），
			orderFlag(){
				return this.searchParams.order.split(':')[1] === 'asc' ? 'icon-up' : 'icon-down'
			}
		},
		// computed:{
		// 	formatProps(){
		// 		return function(p){
		// 			return p.split(':')[2] + '：' + p.split(':')[1]
		// 		}
		// 	}
		// },
		methods: {
			// 专门用于携带searchParams去执行搜索的方法
			async executeSearch(){
				// 发起搜索请求
				let {code,message,data} = await reqSearchInfo(this.searchParams)
				if(code === 200){
					// 维护data到本地
					this.searchInfo = data
				}else{
					alert(`搜索失败：${message}`)
				}
			},
			// 用于移除分类名面包屑
			removeCategoryName(){
				// 1.路径中和分类相关的东西（category?Id,categoryName）要删除
				// 2.分类名面包屑要消失
				// 3.重新搜索一下
				// 一次路由跳转，把上面三件事都做完了，当然需要感谢一下watch里的逻辑
				this.$router.push({
					path:'/search',
					query:{
						// 这里携带参数的时候，不去携带任何分类相关的参数，因为我们要干掉分类，但为了关键词不丢，所以依然要携带关键词
						keyword:this.searchParams.keyword
					}
				})
			},
			// 用于移除关键词面包屑
			removeKeyword(){
				// 1.路径中只把keyword移除，其他的所有东西，均保留
				// 2.关键词面包屑消失
				// 3.重新搜索一下

				// 此处的query是一个对象，其中包含着当前路由的所有参数
				const {query} = this.$route
				// 复制一份query对象
				const obj = {...query}
				// 从obj中干掉keyword
				delete obj.keyword
				// // 跳转路由
				this.$router.push({
					path:'/search',
					query:obj
				})
			},
			// 用于保存子传递过来的品牌数据
			async saveTrademark({tmId,tmName}){
				// 将子传过来的品牌数据，存入searchParams的trademark中，供页面使用，供搜索使用
				/* this.searchParams.trademark = `${tmId}:${tmName}`
				this.searchParams.pageNo = 1 */

				Object.assign(this.searchParams,{
					trademark:`${tmId}:${tmName}`,
					pageNo:1
				})
			},
			// 用于移除品牌面包屑
			removeTrademark(){
				// 清空本地数据
				this.searchParams.trademark = ''
				this.searchParams.pageNo = 1
			},
			// 用于保存子传递过来的属性数据
			saveAttribute(value){
				// 判断属是否重复
				let result = this.searchParams.props.includes(value)
				// 若不重复再添加
				if(!result){
					// 添加
					this.searchParams.props.push(value)
					this.searchParams.pageNo = 1
				}
			},
			// 用于格式化属性名
			formatProps(p){
				return p.split(':')[2] + '：' + p.split(':')[1]
			},
			// 用于从searchParams.props数组中移除你点击的那个属性
			removeProps(index){
				// 移除指定的属性
				this.searchParams.props.splice(index,1)
				this.searchParams.pageNo = 1
			},
			// 用于保存分页器传递过来的页码（页码是点击得来的）
			savePageNo(n){
				this.searchParams.pageNo = n
			},
			// 点击【综合】、【价格】这些排序的回调
			changeOrder(newType){
				// 获取原来的排序方式
				const [type,flag] = this.searchParams.order.split(':')
				// 准备一个空字符串，用于承装后拼接好的排序字符串
				let str = ''
				// 判断用户点击的排序方式和之前的是不是一种
				if(newType === type*1){
					// 一个新的排序字符串
					str = type + ':' + (flag === 'asc' ? 'desc' : 'asc')
				}else{
					// 一个新的排序字符串
					str = newType + ':' + 'desc'
				}
				// 修改searchParams中的order
				// this.searchParams.order = str
				// this.searchParams.pageNo = 1

				Object.assign(this.searchParams,{
					order:str,
					pageNo:1
				})
			},
			toDetail(event){
				// 获取点击商品的id
				const {id} = event.target.dataset
				if(id){
					this.$router.push({
						name:'detail',
						params:{id}
					})
				}
			}
		},
		// 监视
		watch:{
			// 监视$route，目的：每次路由的跳转都能立刻拿到携带的参数
			$route:{
				// 立即监视，目的：让Search初次挂载时也能拿到参数
				immediate:true,
				// $route变化时的回调
				async handler(value){ //value是$route的最新值
					// 维护参数 —— searchParams两个地方用：①呈现到页面；②发请求要带着
					this.searchParams = {
						...this.searchParams, // 拿到之前的所有参数放进来
						category1Id:'', // 重置一级分类id
						category2Id:'', // 重置二级分类id
						category3Id:'', // 重置三级分类id
						categoryName:'',// 重置分类名称
						keyword:'', // 重置关键词
						pageNo:1,
						...value.query //将最新的参数整合进去
					}
					// 执行搜索
					this.executeSearch()
				}
			},
			searchParams:{
				deep:true,
				handler(){
					this.executeSearch()
				}
			}
		},
		beforeDestroy(){
      // Search路由即将销毁时，立刻通过$bus通知Header组件去清空关键词
      this.$bus.$emit('clear-keyword')
    }
	}
</script>

<style lang="less" scoped>
	.main {
		margin: 10px 0;

		.py-container {
			width: 1200px;
			margin: 0 auto;

			.bread {
				margin-bottom: 5px;
				overflow: hidden;

				.sui-breadcrumb {
					padding: 3px 15px;
					margin: 0;
					font-weight: 400;
					border-radius: 3px;
					float: left;
					margin-bottom: 5px;

					li {
						display: inline-block;
						line-height: 18px;

						a {
							color: #666;
							text-decoration: none;

							&:hover {
								color: #4cb9fc;
							}
						}
					}
				}

				.sui-tag {
					margin-top: -5px;
					list-style: none;
					font-size: 0;
					line-height: 0;
					padding: 5px 0 0;
					float: left;

					.with-x {
						font-size: 12px;
						margin: 0 5px 5px 0;
						display: inline-block;
						overflow: hidden;
						color: #000;
						background: #f7f7f7;
						padding: 0 7px;
						height: 20px;
						line-height: 20px;
						border: 1px solid #dedede;
						white-space: nowrap;
						transition: color 400ms;
						cursor: pointer;

						i {
							margin-left: 5px;
							cursor: pointer;
							font: 400 14px tahoma;
							display: inline-block;
							height: 100%;
							vertical-align: middle;
						}

						&:hover {
							color: #e1251b;
						}
					}
				}
			}

			.details {
				margin-bottom: 5px;

				.sui-navbar {
					overflow: visible;
					margin-bottom: 0;

					.filter {
						min-height: 40px;
						padding-right: 20px;
						background: #fbfbfb;
						border: 1px solid #e2e2e2;
						padding-left: 0;
						border-radius: 0;
						box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

						.sui-nav {
							position: relative;
							left: 0;
							display: block;
							float: left;
							margin: 0 10px 0 0;

							li {
								float: left;
								line-height: 18px;

								a {
									display: block;
									cursor: pointer;
									padding: 11px 15px;
									color: #777;
									text-decoration: none;
								}

								&.active {
									a {
										background: #e1251b;
										color: #fff;
									}
								}
							}
						}
					}
				}

				.goods-list {
					margin: 20px 0;

					ul {
						display: flex;
						flex-wrap: wrap;

						li {
							height: 100%;
							width: 20%;
							margin-top: 10px;
							line-height: 28px;
							transition: 0.15s linear;
							&:hover {
								box-shadow: 0 0 10px rgba(0, 0, 0, 0.119);
								border-radius: 5px;
							}

							.list-wrap {
								.p-img {
									padding-left: 15px;
									width: 215px;
									height: 255px;
									overflow: hidden;

									a {
										color: #666;

										img {
											max-width: 100%;
											height: auto;
											vertical-align: middle;
										}
									}
								}

								.price {
									padding-left: 15px;
									font-size: 18px;
									color: #c81623;

									strong {
										font-weight: 700;
									}
								}

								.attr {
									padding-left: 15px;
									width: 85%;
									overflow: hidden;
									margin-bottom: 8px;
									min-height: 38px;
									cursor: pointer;
									line-height: 1.8;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 2;

									a {
										color: #333;
										text-decoration: none;
									}
								}

								.commit {
									padding-left: 15px;
									height: 22px;
									font-size: 13px;
									color: #a7a7a7;

									span {
										font-weight: 700;
										color: #646fb0;
									}
								}

								.operate {
									padding: 12px 15px;

									.sui-btn {
										display: inline-block;
										padding: 2px 14px;
										box-sizing: border-box;
										margin-bottom: 0;
										font-size: 12px;
										line-height: 18px;
										text-align: center;
										vertical-align: middle;
										cursor: pointer;
										border-radius: 0;
										background-color: transparent;
										margin-right: 15px;
									}

									.btn-bordered {
										min-width: 85px;
										background-color: transparent;
										border: 1px solid #8c8c8c;
										color: #8c8c8c;

										&:hover {
											border: 1px solid #666;
											color: #fff !important;
											background-color: #666;
											text-decoration: none;
										}
									}

									.btn-danger {
										border: 1px solid #e1251b;
										color: #e1251b;

										&:hover {
											border: 1px solid #e1251b;
											background-color: #e1251b;
											color: white !important;
											text-decoration: none;
										}
									}
								}
							}
						}
					}
				}

				.page {
					width: 733px;
					height: 66px;
					overflow: hidden;
					float: right;

					.sui-pagination {
						margin: 18px 0;

						ul {
							margin-left: 0;
							margin-bottom: 0;
							vertical-align: middle;
							width: 490px;
							float: left;

							li {
								line-height: 18px;
								display: inline-block;

								a {
									position: relative;
									float: left;
									line-height: 18px;
									text-decoration: none;
									background-color: #fff;
									border: 1px solid #e0e9ee;
									margin-left: -1px;
									font-size: 14px;
									padding: 9px 18px;
									color: #333;
								}

								&.active {
									a {
										background-color: #fff;
										color: #e1251b;
										border-color: #fff;
										cursor: default;
									}
								}

								&.prev {
									a {
										background-color: #fafafa;
									}
								}

								&.disabled {
									a {
										color: #999;
										cursor: default;
									}
								}

								&.dotted {
									span {
										margin-left: -1px;
										position: relative;
										float: left;
										line-height: 18px;
										text-decoration: none;
										background-color: #fff;
										font-size: 14px;
										border: 0;
										padding: 9px 18px;
										color: #333;
									}
								}

								&.next {
									a {
										background-color: #fafafa;
									}
								}
							}
						}

						div {
							color: #333;
							font-size: 14px;
							float: right;
							width: 241px;
						}
					}
				}
			}
		}
		.empty {
			margin: 50px 0px;
			text-align: center;
			h2 {
				color: #aaa;
			}
		}
	}
</style>