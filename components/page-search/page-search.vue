<template>
	<view class="searchbox" @click="onSearch">
		<image src="/static/images/icon_search.png" class="icon"></image>
		<view class="text">请输入你想要搜索的内容</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{}
		},
		methods:{
			onSearch(){
				this.$emit("onSearch");
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchbox{
		width: 100%;
		height: 60rpx;
		background: #f1f1f1;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		.icon{
			width: 25rpx;
			height: 25rpx;
			margin-left: 25rpx;
			margin-right: 16rpx;
		}
		.text{
			flex:1;
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #B3B3B3;
		}
	}
</style>
