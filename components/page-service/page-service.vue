<template>
	<view class="modwrap" v-if="showPopup" @touchmove.stop.prevent="clear">
		<view class="mask"></view>
		<view class="service" v-if="type==1">
			<view class="close" @click.stop="close">
				<image src="/static/images/icon_close.png" mode="aspectFit" style="width: 58rpx;height: 58rpx;"></image>
			</view>
			<view class="hd">
				<image :src="user.avatar_url" mode="aspectFit" class="img"></image>
				<view>{{user.nickname}}</view>
			</view>
			<view class="sitem">
				<!-- <image src="/static/images/icon_tels.png" mode="aspectFit" style="width: 30rpx;height: 30rpx;"></image> -->
				<u-icon name="phone-fill" size="30" :color="color"></u-icon>
				<view class="text">{{user.mobile}}</view>
				<view class="btn" @click.stop="onTel(user.mobile)" :style="{background:color}">立即呼叫</view>
			</view>
			<view class="sitem">
				<!-- <image src="/static/images/icon_wechats.png" mode="aspectFit" style="width: 43rpx;height: 35rpx;"></image> -->
				<u-icon name="weixin-fill" size="43" :color="color"></u-icon>
				<view class="text">{{user.wx?user.wx:''}}</view>
				<view class="btn last" @click.stop="onCopy(user.wx)" :style="{background:color}">复制</view>
			</view>
			<view class="sitem last">
				<!-- <image src="/static/images/icon_qq.png" mode="aspectFit" style="width: 35rpx;height: 36rpx;"></image> -->
				<u-icon name="qq-fill" size="30" :color="color"></u-icon>
				<view class="text">{{user.qq?user.qq:''}}</view>
				<view class="btn last" @click.stop="onCopy(user.qq)" :style="{background:color}">复制</view>
			</view>
		</view>
		<view class="service other" v-if="type==2">
			<view class="closes" @click.stop="close">
				<image src="/static/images/icon_close.png" mode="aspectFit" style="width: 58rpx;height: 58rpx;"></image>
			</view>
			<view class="sitem">
				<u-icon name="phone-fill" size="30" :color="color"></u-icon>
				<view class="text">{{user.mobile}}</view>
				<view class="btn" @click.stop="onTel(user.mobile)" :style="{background:color}">呼叫</view>
			</view>
			<view class="sitem">
				<u-icon name="weixin-fill" size="43" :color="color"></u-icon>
				<view class="text">{{user.wx?user.wx:''}}</view>
				<view class="btn last" @click.stop="onCopy(user.wx)" :style="{background:color}">复制</view>
			</view>
			<view class="sitem last">
				<u-icon name="qq-fill" size="30" :color="color"></u-icon>
				<view class="text">{{user.qq?user.qq:''}}</view>
				<view class="btn last" @click.stop="onCopy(user.qq)" :style="{background:color}">复制</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name: "pageService",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			color:{
				type:String,
				default:"#FE694F"
			},
			type:{
				type:Number,
				default:1
			},
			user:{
				type:Object,
				default:()=>{
					return{}
				}
			}
		},
		data(){
			return{
				showPopup:false,
			}
		},
		watch: {
			show: {
				handler: function(newVal) {
					this.showPopup = newVal;
				},
				immediate: true
			}
		},
		methods:{
			clear(e) {
				e.stopPropagation()
			},
			close(){
				this.showPopup = false;
				this.$emit("change",false);
			},
			onTel(number){
				uni.makePhoneCall({
				    phoneNumber: number
				});
			},
			onCopy(text){
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({
							title:"复制成功",
							icon:"none"
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modwrap{
		width: 100%;
		height: 100vh;
		position: fixed;
		top:0;
		left:0;
		z-index: 50;
		.mask{
			width: 100%;
			height: 100vh;
			background: rgba(0,0,0,0.5);
			position: fixed;
			top:0;
			left:0;
			z-index: 50;
		}
		.service{
			position: absolute;
			bottom:180rpx;
			left:50%;
			z-index: 60;
			transform: translateX(-50%);
			width: 600rpx;
			height: 480rpx;
			background: #ffffff;
			border-radius: 8rpx;
			padding: 0 65rpx;
			&.other{
				width: 380rpx;
				height: 200rpx;
				padding: 20rpx 20rpx 0;
				bottom:0;
				top:277rpx;
				.closes{
					position: absolute;
					top:-30rpx;
					left:-20rpx;
					z-index: 60;
				}
				.sitem{
					padding-bottom: 17rpx;
					.btn{
						&.last{
							margin-right:0;
						}
					}
				}
			}
			.close{
				position: absolute;
				top:-30rpx;
				right:-20rpx;
				z-index: 60;
			}
			.hd{
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				padding:40rpx 0 30rpx 0;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000000;
				.img{
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					margin-bottom: 16rpx;
				}
			}
			.sitem{
				display: flex;
				align-items: center;
				padding-bottom: 56rpx;
				&.last{
					padding-bottom: 0;
				}
				.text{
					flex:1;
					padding-left: 35rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
				}
				.btn{
					padding: 0 22rpx;
					height: 40rpx;
					line-height: 40rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #ffffff;
					// background: #FE694F;
					border-radius: 20rpx;
					&.last{
						margin-right: 22rpx;
					}
				}
			}
		}
	}
</style>
