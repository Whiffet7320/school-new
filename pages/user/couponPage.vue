<template>
	<view class="index">
		<Navtop title="优惠券"></Navtop>
		
		<view class="Coupon" v-for="(item,index) in CouponList" :key="index">
			<view class="Tips">
				{{item.state}}
			</view>
			<view class="OneInfo">
				<view class="whole">
					<view class="StorePic">
						<image :src="item.pic" mode=""></image>
					</view>
					<view class="StoreName">
						<view class="Name">
							{{item.name}}
						</view>
						<view class="Time">
							{{item.TouTime+'-'+item.WeiTime}}
						</view>
					</view>
				</view>
				<view class="PriTips">
					<view class="Price">
						<view class="Staus">
							¥{{item.price}}
						</view>
						<view class="Test">
							优惠券
						</view>
					</view>
					<view class="Reduce">
						满{{item.num}}可用
					</view>
				</view>
			</view>
			<view class="TestTips">
				<view class="Limit">
					{{item.Tips}}
				</view>
				<view class="Gouse">
					去使用
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//优惠卷
				CouponList:[
					// {
					// 	pic:'/static/user/touxiang.png',
					// 	name:'年糕小姐豆腐汤',
					// 	TouTime:'2021.10.15 11:38',
					// 	WeiTime:'2021.10.18 23:59',
					// 	price:8,
					// 	num:99,
					// 	state:'新获取',
					// 	Tips:'限线上购买商品使用',
					// }
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background: #f7f8fa;
	}
	.index{
		width: 100%;
		.Coupon{
			width: 702rpx;
			height: 200rpx;
			margin: 20rpx auto 0;
			background-color: #fff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			position: relative;
			.Tips{
				position: absolute;
				margin-left: 10rpx;
				top: 0;
				width: 86rpx;
				height: 28rpx;
				background-color: #FE694F;
				border-radius: 0 0 10rpx 10rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20rpx;
				font-weight: 500;
				color: #ffffff;
			}
			.OneInfo{
				margin: 0 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.whole{
					display: flex;
					align-items: center;
					.StorePic{
						display: flex;
						align-items: center;
						image{
							width: 76rpx;
							height: 76rpx;
							border-radius: 50%;
						}
					}
					.StoreName{
						display: flex;
						flex-direction: column;
						margin-left: 20rpx;
						.Name{
							font-size: 28rpx;
							font-weight: 500;
							color: #000000;
						}
						.Time{
							margin-top: 8rpx;
							font-size: 20rpx;
							font-weight: 400;
							color: #848484;
						}
					}
				}
				.PriTips{
					display: flex;
					flex-direction: column;
					.Price{
						display: flex;
						align-items: center;
						.Staus{
							font-size: 36rpx;
							font-weight: 700;
							color: #d81e1e;
						}
						.Test{
							font-size: 20rpx;
							font-weight: 500;
							color: #d81e1e;
						}
					}
					.Reduce{
						font-size: 20rpx;
						font-weight: 400;
						color: #848484;
					}
				}
			}
			.TestTips{
				margin: 0 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.Limit{
					font-size: 20rpx;
					font-weight: 400;
					color: #848484;
				}
				.Gouse{
					width: 124rpx;
					height: 40rpx;
					background: #fe694f;
					border-radius: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					font-weight: 400;
					color: #ffffff;
				}
			}
		}
	
	}
	

</style>
