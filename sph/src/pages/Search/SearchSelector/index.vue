<template>
	<!--搜索选择器-->
	<div class="clearfix selt">
		<div class="type-wrap logo">
			<div class="fl key brand">品牌</div>
			<div class="value logos">
				<!-- 品牌列表 -->
				<ul class="logo-list">
					<!-- 一个li就是一个品牌 -->
					<li 
						v-for="trademark in trademarkList" 
						:key="trademark.tmId"
						@click="sendTrademark(trademark)"
					>
						<a>{{trademark.tmName}}</a>
					</li>
				</ul>
			</div>
		</div>
		<!-- 每个type-wrap就是一条属性 -->
		<div class="type-wrap" v-for="attr in attrsList" :key="attr.attrId">
			<div class="fl key">{{attr.attrName}}</div>
			<div class="fl value">
				<ul class="type-list">
					<!-- 每一个li就是一条属性中的可选值 -->
					<li v-for="(attrValue,index) in attr.attrValueList" :key="index">
						<a @click="getAttribute(attr,attrValue)">{{attrValue}}</a>
					</li>
				</ul>
			</div>
			<div class="fl ext"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'SearchSelector',
		props:['attrsList','trademarkList','sendTrademark'],
		methods: {
			getAttribute(attr,attrValue){
				// 获取点击的属性信息
				const {attrId,attrName} = attr
				// 将属性信息拼接成一个符合接口规范的字符串
				const str = `${attrId}:${attrValue}:${attrName}`
				// 通过自定义事件完成给父传递str
				this.$emit('send-attribute',str)
			}
		},
	}
</script>

<style lang="less" scoped>
	.selt {
		border: 1px solid #ddd;
		border-top: 0;
		margin-bottom: 5px;
		overflow: hidden;

		.logo {
			border-top: 0;
			margin: 0;
			position: relative;
			overflow: hidden;

			.key {
				padding-bottom: 87px !important;
			}
		}

		.type-wrap {
			margin: 0;
			position: relative;
			border-top: 1px solid #ddd;
			overflow: hidden;

			.key {
				width: 100px;
				background: #f1f1f1;
				line-height: 26px;
				text-align: right;
				padding: 10px 10px 0 15px;
				float: left;
			}

			.value {
				overflow: hidden;
				padding: 10px 0 0 15px;
				color: #333;
				margin-left: 120px;
				padding-right: 90px;

				.logo-list {
					li {
						float: left;
						border: 1px solid #e4e4e4;
						margin: -1px -1px 0 0;
						width: 105px;
						height: 30px;
						text-align: center;
						line-height: 30px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						font-weight: 700;
						// font-style: italic;
						cursor: pointer;
						background-color: #e1251b;
						font-size: 14px;
						border-radius: 5px;
						&:hover {
							box-shadow: 0 0 5px rgba(0, 0, 0, 0.371);
						}
						a {
							color: white;
						}

						img {
							max-width: 100%;
							vertical-align: middle;
						}
					}
				}

				.type-list {
					li {
						float: left;
						display: block;
						margin-right: 30px;
						line-height: 26px;
						&:hover {
							a {
								color: #e1251b;;
							}
						}

						a {
							text-decoration: none;
							color: #666;
						}
					}
				}
			}

			.ext {
				position: absolute;
				top: 10px;
				right: 10px;

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
					padding: 0 10px;
					background: #fff;
					border: 1px solid #d5d5d5;
				}

				a {
					color: #666;
				}
			}
		}
	}
</style>