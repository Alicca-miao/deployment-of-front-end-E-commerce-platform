<template>
	<div>
		<!-- 三级分类导航 -->
		<TypeNav/>
		<!-- 列表 -->
		<ListContainer/>
		<!-- 今日推荐 -->
		<Recommend/>
		<!-- 楼层 -->
		<Floor v-for="(f,index) in floorList" :key="f.id" :floor="f" :index="index"/>
		<!-- 商标 -->
		<Brand/>
	</div>
</template>

<script>
	import ListContainer from './ListContainer'
	import Recommend from './Recommend'
	import Floor from './Floor'
	import Brand from './Brand'
	import { mapState } from 'vuex'

	export default {
		name:'Home',
		components:{ListContainer,Recommend,Floor,Brand},
		computed:{
			// 从vuex中读取floorList（楼层数据）
			...mapState('home',['floorList'])
		},
		mounted() {
			// Home组件一挂载，就联系getFloorList获取楼层数据，并存入Vuex
			this.$store.dispatch('home/getFloorList')
		},
	}
</script>