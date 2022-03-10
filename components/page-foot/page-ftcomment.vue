<template>
	<view>
		<u-gap height="100"></u-gap>
		<view class="ftwrap safe-area-inset-bottom">
			<view class="ipt" @click="onRepay">说一说你的想法...</view>
			<view class="btnwrap">
				<view class="icon_l" v-if="isShow">
					<image src="/static/images/icon_time.png" mode="aspectFit" style="width: 23rpx;height: 23rpx;margin-right: 8rpx;"></image>
					<text>{{list.read_num||0}}</text>
				</view>
				<view class="icon_l" @click.stop="goZan(list.id)">
					<image src="/static/images/icon_xin.png" mode="aspectFit" style="width: 32rpx;height: 26rpx;margin-right: 8rpx;"></image>
					<text>{{list.zan_count||0}}</text>
				</view>
				<view class="icon_l">
					<image src="/static/images/icon_pl.png" mode="aspectFit" style="width: 30rpx;height: 23rpx;margin-right: 8rpx;"></image>
					<text>{{total}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:{
				type:Object,
				default:()=>{return {}}
			},
			isShow:{
				type:Boolean,
				default:true
			},
			total:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				content:""
			}
		},
		methods:{
			onRepay(){
				this.$emit("reply",true);
			},
			goZan(id){
				this.$emit("change",id);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ftwrap{
		width: 100%;
		padding:0 24rpx;
		height: 140rpx;
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left:0;
		z-index: 50;
		background-color: #FFFFFF;
		.ipt{
			transform: translateY(-20rpx);
			flex:1;
			height: 60rpx;
			line-height: 60rpx;
			background: #f1f1f1;
			border-radius: 30rpx;
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #848484;
			padding-left: 32rpx;
		}
		.btnwrap{
			transform: translateY(-20rpx);
			display: flex;
			.icon_l{
				display: flex;
				align-items: center;
				margin-left: 12rpx;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #b3b3b3;
			}
		}
	}
	.mask{
		position: fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 50;
		background-color: rgba(0,0,0,0.5);
	}
	.ftwraps{
		width: 100%;
		padding:24rpx;
		position: fixed;
		bottom: 0;
		left:0;
		z-index:70;
		background-color: #FFFFFF;
		.comtlist{
			display: flex;
			flex-direction: column;
			width: 100%;
			.textwrap{
				width: 100%;
				padding: 20rpx;
				height: 200rpx;
				background: #f1f1f1;
				border-radius: 10rpx;
			}
			.textarea{
				width: 100%;
				height: 100%;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #000000;
			}
			.comtbtn{
				display: flex;
				justify-content: flex-end;
				margin-top: 20rpx;
				.btns{
					font-size: 24rpx;
					color:#FFFFFF;
					width: 160rpx;
					height: 60rpx;
					line-height: 60rpx;
					background-color: #FE694F;
					border-radius: 12rpx;
					text-align: center;
				}
			}
		}
	}
</style>
