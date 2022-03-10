<template>
	<view>
		<view class="oinfo">
			<image :src="item.myImg_paths[0]" mode="aspectFit" class="img"></image>
			<view class="info">
				<view class="hd">
					<view class="left">
						<view class="name u-line-2">{{obj.product_name}}</view>
						<!-- <view class="taglist">
							<view class="tag">九成新</view>
						</view> -->
					</view>
					<view class="right">
						<text>￥{{obj.price}}</text>
						<text class="num">x1</text>
					</view>
				</view>
				<view class="ft">
					<view class="close">关闭拼单</view>
				</view>
			</view>
		</view>
		<view class="polist">
			<view class="tabbox">
				<view v-if="list.length" class="tab_items">邀请好友拼单</view>
				<view v-else @click="toPindan" class="tab_items">立即拼单</view>
				<view class="tab_item" @click="buy">单独购买</view>
			</view>
			<view class="puser" v-if="list.length">
				<view class="tit">
					正在拼单人员
				</view>
				<view class="list">
					<view class="uitem">
						<image src="" mode="aspectFill" class="img"></image>
						<view class="name">小小丢</view>
						<view class="time">
							<view class="text">还差<text class="num">1</text>人拼成</view>
							<view class="small">剩余12:20:05.4</view>
						</view>
						<view class="btn" @click="goPin">去拼单</view>
					</view>
				</view>
			</view>
			<view class="empty" v-if="list.length===0">
				<image src="" mode="aspectFill" class="img"></image>
				<text>暂没有好友加入拼单</text>
			</view>
		</view>
		<view class="modwrap" v-if="showPopup" @touchmove.stop.prevent="clear">
			<view class="mask"></view>
			<view class="modcont">
				<view class="close" @click="showPopup = false"><image src="" mode="aspectFit" style="width: 58rpx;height: 58rpx;"></image></view>
				<view class="tit">参与Lisa的拼单</view>
				<view class="time">仅剩1个名额，剩余12:20:05.4后结束</view>
				<view class="ulist">
					<view class="uitem">
						<image src="" mode="aspectFill" class="img"></image>
						<view class="pin">拼主</view>
					</view>
					<view class="uitem border">?</view>
				</view>
				<view class="btn">参与拼单</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				showPopup:false,
				list:[],
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
		onShow() {
			this.getData();
		},
		methods:{
			async getData(){
				const res = await this.$api.pindan_toghter_list({
					limit:100,
					page:1
				})
				console.log(res.data)
			},
			clear(e){
				e.stopPropagation();
			},
			toPindan(){
				uni.navigateTo({
					url:`/pages/order/addorder?item=${JSON.stringify(this.obj)}&payType=1`
				})
			},
			buy(){
				uni.navigateTo({
					url:`/pages/order/addorder?item=${JSON.stringify(this.obj)}&payType=0`
				})
			},
			goPin(){
				this.showPopup = true;
			}
		}
	}
</script>
<style>
	page{
		background: #f2f2f2;
	}
</style>
<style lang="scss" scoped>
	.oinfo{
		margin:26rpx 24rpx 0;
		padding:40rpx 18rpx;
		background: #ffffff;
		display: flex;
		.img{
			width: 160rpx;
			height: 160rpx;
			background-color: #eee;
			border-radius: 10rpx;
			flex-shrink: 0;
		}
		.info{
			flex:1;
			padding-left: 20rpx;
			.hd{
				display: flex;
				justify-content: space-between;
				.left{
					padding-right: 52rpx;
				}
				.name{
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #000000;
				}
				.taglist{
					padding-top: 12rpx;
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
				.right{
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #000000;
					display: flex;
					flex-direction: column;
					.num{
						color: #b3b3b3;
						text-align: right;
					}
				}
			}
			.ft{
				display: flex;
				justify-content: flex-end;
			}
			.close{
				width: 144rpx;
				height: 50rpx;
				line-height: 50rpx;
				background: #FE694F;
				border-radius: 26rpx;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: center;
				color: #ffffff;
			}
		}
	}
	.polist{
		margin: 20rpx 24rpx 0 24rpx;
		background: #ffffff;
		border-radius: 10rpx;
		.tabbox{
			padding: 48rpx 0;
			display: flex;
			justify-content: center;
			.tab_items{
				width: 304rpx;
				height: 72rpx;
				line-height: 72rpx;
				background: #FE694F;
				border-radius: 36rpx;
				text-align: center;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #ffffff;
				margin-right: 62rpx;
			}
			.tab_item{
				width: 176rpx;
				height: 72rpx;
				line-height: 72rpx;
				background: #d9d9d9;
				border-radius: 36rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: center;
				color: #000000;
			}
		}
		.puser{
			.tit{
				padding:0 12rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000000;
				.icon{
					margin-right: 17rpx;
				}
			}
			.list{
				padding:0 18rpx 54rpx 12rpx;
				.uitem{
					display: flex;
					align-items: center;
					margin-top: 32rpx;
					.img{
						width: 70rpx;
						height: 70rpx;
						background-color: #eee;
						border-radius: 50%;
					}
					.name{
						flex:1;
						padding-left: 13rpx;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Bold;
						font-weight: 700;
						color: #000000;
					}
					.time{
						display: flex;
						flex-direction: column;
						.text{
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #000000;
						}
						.num{
							color:#FE694F;
						}
						.small{
							margin-top: 4rpx;
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Medium;
							font-weight: 500;
							color: #000000;
						}
					}
					.btn{
						margin-left: 32rpx;
						width: 124rpx;
						height: 52rpx;
						line-height: 52rpx;
						background: #FE694F;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						text-align: center;
						color: #ffffff;
						border-radius: 26rpx
					}
				}
			}
		}
	}
	.modwrap{
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		top:0;
		left:0;
		z-index: 50;
		.mask{
			width: 100%;
			height: 100vh;
			background: rgba(0,0,0,0.4);
			position: fixed;
			top:0;
			left:0;
			z-index: 40;
		}
		.modcont{
			width: 520rpx;
			height: 400rpx;
			padding: 0 48rpx;
			background: #ffffff;
			border-radius: 8rpx;
			position: relative;
			z-index: 50;
			.close{
				position: absolute;
				top:-30rpx;
				right:-20rpx;
				z-index: 60;
			}
			.tit{
				text-align: center;
				padding-top: 48rpx;
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #000000;
			}
			.time{
				margin-top: 16rpx;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: center;
				color: #000000;
			}
			.ulist{
				display: flex;
				align-items: center;
				justify-content: center;
				padding:44rpx 0 24rpx 0;
				.uitem{
					position: relative;
					margin:0 40rpx;
					.img{
						width: 88rpx;
						height: 88rpx;
						background-color: #eee;
						border-radius: 50%;
					}
					.pin{
						position: absolute;
						top:-12rpx;
						right:-24rpx;
						z-index: 40;
						width: 62rpx;
						height: 34rpx;
						background: #FE694F;
						border-radius: 18rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						text-align: center;
						color: #ffffff;
					}
					&.border{
						width: 82rpx;
						height: 82rpx;
						border: 2rpx dashed #707070;
						border-radius: 50%;
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 40rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #707070;
					}
				}
			}
			.btn{
				width: 424rpx;
				height: 68rpx;
				line-height: 68rpx;
				background: #FE694F;
				font-size: 32rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				text-align: center;
				color: #ffffff;
			}
		}
	}
	.empty{
		width: 100%;
		height: 500rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 20rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #000000;
		.img{
			width: 222rpx;
			height: 192rpx;
			margin-bottom: 36rpx;
		}
	}
</style>
