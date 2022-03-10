<template>
	<view class="tabbox">
		<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in list" :key="index" @click="onTab(item,index)">{{item.title}}</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:()=>{return []}
			}
		},
		data(){
			return{
				cur:0
			}
		},
		methods:{
			onTab(item,index){
				this.cur = index;
				this.$emit("change",item);
			}
		}
	}
</script>

<style lang="scss">
	.tabbox{
		padding:32rpx 0 30rpx 0;
		display: flex;
		align-items: center;
		.tab_item{
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #060606;
			margin-left: 80rpx;
			position: relative;
			&.on{
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				&::after{
					content:"";
					position: absolute;
					bottom:-8rpx;
					left:50%;
					z-index: 50;
					width: 40rpx;
					height: 2rpx;
					background-color:#FE694F;
					transform: translateX(-50%);
				}
			}
		}
	}
</style>
