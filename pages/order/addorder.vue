<template>
	<view>
		<view class="orderlist">
			<view class="address">
				<view class="cu_avatar"><image src="/static/images/icon_address.png" mode="aspectFit" style="width: 61rpx;height: 80rpx;"></image></view>
				<view class="content" v-if="addressData.real_name" @tap="addAddress()">
					<view class="hd">
						<text class="pip">{{ addressData.real_name }}</text>
						<text class="gray-light">{{ addressData.phone }}</text>
					</view>
					<view class="ft">
						<text>{{ addressData.detail }}</text>
						<view class="action"><image src="/static/images/arrow_right.png" mode="aspectFit" class="icon"></image></view>
					</view>
				</view>
				<view class="tip" @tap="addAddress" v-else>点击此处填写收货地址</view>
			</view>
			<view class="lists">
				<view class="hd">
					<image :src="obj.avatar_url" mode="aspectFit" class="icon"></image>
					<text>{{obj.nickname}}</text>
				</view>
				<view class="culist">
					<view class="cuitem">
						<image :src="obj.myImg_paths[0]" mode="aspectFit" class="icon"></image>
						<view class="mid">
							<view class="name u-line-2">{{obj.product_name}}</view>
							<view class="taglist">
								<!-- <view class="tag">九成新</view> -->
								<view class="tag">{{obj.people}}人团</view>
							</view>
							<view class="tip">可拼单购买</view>
						</view>
						<view class="right">
							<view class="price">{{obj.price}}</view>
							<view class="num">x1</view>
						</view>
					</view>
					<view class="stip">【本商品由用户保卖|校园帮帮帮帮仅提供平台服务】</view>
				</view>
				<view class="cuform_group">
					<view class="title first">优惠劵</view>
					<view class="picker">
						<view class="text"></view>
						<view class="text gray">暂无可用优惠劵</view>
						<image src="/static/images/arrow_right.png" mode="aspectFit" class="icon"></image>
					</view>
				</view>
				<view class="cuform_group last">
					<view class="title">平台配送（平台发货至商家）</view>
					<view class="title">快递¥0.00</view>
				</view>
			</view>
			<view class="cuform_groups">
				<view class="gitem">
					<text class="name">商品总额</text>
					<text class="price">¥{{obj.price}}</text>
				</view>
				<view class="gitem">
					<text class="name">运费</text>
					<text class="yprice">¥0.00</text>
				</view>
			</view>
		</view>
		<view class="ftbtn safe-area-inset-bottom">
			<view class="left">合计：<text class="text_price">¥{{obj.price}}</text></view>
			<view class="btn" @click="onSubmit">确认下单</view>
		</view>
		<u-gap height="100"></u-gap>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				addressData:{},
				obj:{},
				payType:'',
			}
		},
		onLoad(options) {
			if(options.item){
				this.obj = JSON.parse(options.item);
				if(this.obj.img_paths!=''){
					this.obj.myImg_paths = this.obj.img_paths.split(',');
					ele.myImg_paths.forEach((img, i) => {
						this.$set(ele.myImg_paths, i, `${img}`)
					})
				}
			}
			if(options.payType){
				this.payType = options.payType
			}
		},
		onShow() {
			this.getData()
		},
		methods:{
			async getData(){
				const res = await this.$api.address();
				console.log(res)
				res.data.forEach(ele=>{
					if(ele.is_default == 1){
						this.addressData = ele;
					}
				})
			},
			addAddress() {
				uni.navigateTo({
					url:'/pages/user/ReceivingAddress'
				})
			},
			userAddress() {
				uni.navigateTo({
					url:"/pages/user/address/address?source=1"
				})
			},
			onSubmit(){
				uni.navigateTo({
					url:`/pages/order/pay?item=${JSON.stringify(this.obj)}&addressId=${this.addressData.id}&payType=${this.payType}`
				})
			}
		}
	}
</script>
<style>
	page{
		background-color: #f7f8fa;
	}
</style>
<style lang="scss" scoped>
	.orderlist{
		padding:20rpx 24rpx;
		.address{
			background-color: #FFFFFF;
			padding:40rpx 0;
			display: flex;
			position: relative;
			.cu_avatar{
				margin-left: 46rpx;
				margin-right: 17rpx;
			}
			.content{
				width: 538rpx;
				.tip{
					text-align: center;
					font-size: 28rpx;
					color: #000000;
				}
				.hd{
					display: flex;
					align-items: center;
					.pip{
						font-size: 28rpx;
						font-family: PingFang SC, PingFang SC-Bold;
						font-weight: 700;
						color: #000000;
					}
					.gray-light{
						margin-left: 12rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Bold;
						font-weight: 700;
						color: #b3b3b3;
					}
				}
				.ft{
					margin-top: 16rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.action{
						margin-left: 10rpx;
						.icon{
							width: 12rpx;
							height: 23rpx;
						}
					}
				}
			}
		}
		.lists{
			width: 100%;
			background: #ffffff;
			border-radius: 8rpx;
			margin-top: 32rpx;
			.hd{
				padding:20rpx 16rpx 0 16rpx;
				display: flex;
				align-items: center;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #000000;
				.icon{
					width: 88rpx;
					height: 88rpx;
					background-color: #eee;
					border-radius: 50%;
					margin-right: 16rpx;
				}
			}
			.culist{
				padding:32rpx 0 0 0;
				.cuitem{
					padding:0 16rpx;
					display: flex;
					.icon{
						width: 160rpx;
						height: 160rpx;
						border-radius: 10rpx;
					}
					.mid{
						padding:0 36rpx 0 24rpx;
						width: 428rpx;
						.name{
							height: 68rpx;
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #000000;
						}
						.taglist{
							padding: 14rpx 0;
							display: flex;
							align-items: center;
							.tag{
								padding: 0 10rpx;
								height: 32rpx;
								border: 2rpx solid #b3b3b3;
								border-radius: 4rpx;
								font-size: 20rpx;
								font-family: PingFang SC, PingFang SC-Medium;
								font-weight: 500;
								color: #4d4d4d;
								margin-right: 20rpx;
							}
						}
						.tip{
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Medium;
							font-weight: 500;
							color: #ff0000;
						}
					}
					.right{
						.price{
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #000000;
							&::before{
								content: "¥";
								font-size: 20rpx;
							}
						}
						.num{
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #b3b3b3;
						}
					}
				}
				.stip{
					padding-top: 32rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Regular;
					font-weight: 400;
					color: #000000;
				}
			}
			.cuform_group{
				padding:32rpx 24rpx 32rpx 16rpx;
				border-bottom: 2rpx solid #f2f2f2;
				display: flex;
				align-items: center;
				justify-content: space-between;
				&.last{
					border-bottom: 0;
				}
				.title{
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #000000;
				}
				.first{
					flex:1;
				}
				.picker{
					display: flex;
					align-items: center;
					.text{
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
					}
					.gray{
						color: #b3b3b3;
					}
					.icon{
						width: 12rpx;
						height: 23rpx;
						margin-left: 26rpx;
					}
				}
			}
		}
		.cuform_groups{
			margin-top: 22rpx;
			background: #ffffff;
			border-radius: 8rpx;
			padding:32rpx 24rpx 0 16rpx;
			.gitem{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-bottom: 32rpx;
				.name{
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #000000;
				}
				.price{
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					text-align: left;
					color: #ff0000;
				}
				.yprice{
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					text-align: left;
					color: #b3b3b3;
				}
			}
		}
	}
	.ftbtn{
		width: 100%;
		padding: 0 24rpx;
		height: 100rpx;
		display: flex;
		align-items: center;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 28rpx 0rpx rgba(166,179,194,0.30); 
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		.left{
			flex:1;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #000000;
			.text_price{
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #ff0000;
			}
		}
		.btn{
			width: 184rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #FE694F;
			border-radius: 32rpx;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}
	}
</style>
