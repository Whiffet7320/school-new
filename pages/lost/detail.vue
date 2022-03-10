<template>
	<view>
		<view class="detail">
			<view class="u-content">
				<u-parse :html="content"></u-parse>
			</view>
			<view class="info">
				<view class="tit">特别说明</view>
				<view class="content">晚自习下课和同学在样园散步无意间发现走廊座椅上有白色充电宝带有数据线一个，遗失的同学速与我联系。</view>
				<view class="stip">【联系我时请告知是在校园帮帮上看到的】</view>
			</view>
		</view>
		<u-gap height="100"></u-gap>
		<view class="navigation safe-area-inset-bottom">
			<view class="btn" @click="modShow=true">立即联系</view>
		</view>
		<page-service :show="modShow" color="#165FF9" @change="onChange"></page-service>
	</view>
</template>

<script>
	import pageService from "@/components/page-service/page-service";
	export default{
		components:{
			pageService
		},
		data(){
			return{
				modShow:false,
				content:`<p><img src="https://p2.img.cctvpic.com/photoworkspace/contentimg/2020/07/16/2020071613380766481.jpg"></p>`
			}
		},
		methods:{
			onChange(val){
				this.modShow = val;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail{
		padding-top: 20rpx;
		background-color: #FFFFFF;
		.info{
			padding:32rpx 24rpx 60rpx 24rpx;
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
			.tit{
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color:#165FF9;
			}
			.content{
				padding:16rpx 0;
			}
		}
	}
	.navigation{
		display: flex;
		align-items: center;
		width: 100%;
		padding:0 24rpx;
		height: 100rpx;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 28rpx 0rpx rgba(166,179,194,0.30);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		.btn{
			width: 100%;
			height: 64rpx;
			line-height: 64rpx;
			background: #165ff9;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}
	}
</style>
