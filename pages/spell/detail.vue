<template>
	<view>
		<view class="detail">
			<view class="u-content">
				<image v-for="(item,index) in obj.myImg_paths" :key='index' :src="item" class="piccc" mode=""></image>
			</view>
			<view class="info">
				<view class="tit">特别说明</view>
				<view class="content" v-if="obj.start_location">首末地：{{obj.start_location}}-{{obj.end_location}}</view>
				<view class="content">描述：{{obj.description}}</view>
				<view class="content">联系电话：{{obj.mobile}}</view>
				<view class="stip">【联系我时请告知是在校园帮帮上看到的】</view>
			</view>
		</view>
		<u-gap height="100"></u-gap>
		<view class="navigation safe-area-inset-bottom">
			<view class="left" @click="modShow = true">
				<image src="" mode="aspectFit" style="width: 33rpx;height: 33rpx;"></image>
				<text class="text">客服</text>
			</view>
			<!-- <view class="right">
				<view class="toolbtn buy" @click="pinBuy">拼单购买¥{{obj.price}}</view>
				<view class="toolbtn blue" @click="buy">单独购买¥{{obj.price}}</view>
			</view> -->
		</view>
		<page-service :show="modShow" @change="onChange" :user="obj" ></page-service>
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
				obj:{},
			}
		},
		onLoad(options) {
			if(options.item){
				this.obj = JSON.parse(options.item);
				console.log(this.obj)
				if(this.obj.img_paths!=''){
					this.obj.myImg_paths = this.obj.img_paths.split(',');
					this.obj.myImg_paths.forEach((img, i) => {
						this.$set(this.obj.myImg_paths, i, `${img}`)
					})
				}
			}
		},
		methods:{
			onChange(val){
				this.modShow = val;
			},
			pinBuy(){
				uni.navigateTo({
					url:`/pages/order/porder?item=${JSON.stringify(this.obj)}`
				})
			},
			buy(){
				uni.navigateTo({
					url:`/pages/order/addorder?item=${JSON.stringify(this.obj)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail{
		padding-top: 20rpx;
		background-color: #FFFFFF;
		.piccc{
			background-size:cover;
			width: 100%;
		}
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
				color:#FE694F;
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
		height: 100rpx;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 28rpx 0rpx rgba(166,179,194,0.30);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		.left{
			flex:1;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #b3b3b3;
			.text{
				margin-top: 5rpx;
			}
		}
		.right{
			padding-right: 64rpx;
			display: flex;
			.toolbtn{
				padding: 0 34rpx;
				height: 64rpx;
				line-height: 64rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				text-align: center;
				color: #ffffff;
				&.buy{
					background: #ffa900;
				}
				&.blue{
					background: #FE694F;
				}
			}
		}
	}
</style>
