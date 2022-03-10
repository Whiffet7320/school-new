<template>
	<view class="index">
		<Navtop title="余额"></Navtop>
		<view class="YueExh">
			<view class="Pic">
				<image src="/static/user/yuebeijin.png" mode=""></image>
			</view>
			<view class="OneTest">
				<view class="Test">
					可用余额
				</view>
				<view class="icon">
					<image src="/static/user/yanjing.png" mode=""></image>
				</view>
			</view>
			<view class="Price">
				0.00
			</view>
			
		</view>
		<view class="Head">
			<view class="Tips">
				明细
			</view>
			<view class="Title">
				<view :class="TitDex === index?'ListCor':'List'" v-for="(item,index) in HeadList" 
				:key="index" @click="Select(index)">
					{{item}}
				</view>
			</view>
		</view>
		
		<view class="allList" v-for="(item,index) in AllPriceList" :key="index">
			<view class="Title">
				{{item.title}}月
			</view>
			<view class="reward" v-for="(cont,conx) in item.content" :key="conx">
				<view class="Tous">
					<view class="test">
						奖励
					</view>
					<view class="Time">
						{{cont.time}}
					</view>
				</view>
				<view class="Price">
					+{{cont.price}}
				</view>
			</view>
		</view>
		
		
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				HeadList:[
					'全部',
					'上月',
					'本月',
				],
				TitDex:-1,//标题选择
				// AllPriceList:[
				// 	{
				// 		title:10,
				// 		content:[
				// 			{
				// 				time:'10-23 10:22',
				// 				price:20.00
				// 			}
				// 		]
				// 	},
				// 	{
				// 		title:9,
				// 		content:[
				// 			{
				// 				time:'10-23 10:22',
				// 				price:20.00
				// 			},
				// 			{
				// 				time:'10-24 10:22',
				// 				price:20.00
				// 			}
				// 		]
				// 	}
				// ],
			}
		},
		methods: {
			//选择月份
			Select(index){
				this.TitDex = index
			},
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		background-color: #F7F8FA;
	}
	.index{
		width: 100%;
		height: 100%;
		.YueExh{
			width: 710rpx;
			height: 228rpx;
			margin: 20rpx auto 24rpx;
			border-radius: 10rpx;
			position: relative;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			.Pic{
				position: absolute;
				left: 0;
				right: 0;
				z-index: -1;
				margin: 0 auto;
				image{
					width: 710rpx;
					height: 228rpx;
				}
			}
			.OneTest{
				margin-left: 40rpx;
				display: flex;
				align-items: center;
				.Test{
					font-size: 24rpx;
					font-weight: 500;
					color: #ffffff;
				}
				.icon{
					margin-left: 20rpx;
					display: flex;
					align-items: center;
					image{
						width: 32rpx;
						height: 22rpx;
					}
				}
			}
			.Price{
				margin-left: 40rpx;
				font-size: 52rpx;
				font-weight: 700;
				color: #ffffff;
			}
			
		}
		.Head{
			height: 56rpx;
			display: flex;
			align-items: center;
			margin: 0 20rpx;
			justify-content: space-between;
			.Tips{
				margin-left: 20rpx;
				font-size: 30rpx;
				font-weight: 700;
				color: #141313;
			}
			.Title{
				width: 400rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.List{
					font-size: 30rpx;
					font-weight: 400;
					color: #848484;
					border-bottom: 2rpx solid transparent;
				}
				.ListCor{
					height: 52rpx;
					font-size: 30rpx;
					font-weight: 700;
					color: #fe694f;
					border-bottom: 2rpx solid #fe694f;
				}
			}
		}
		
		.allList{
			width: 702rpx;
			margin: 20rpx auto;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.Title{
				width: 672rpx;
				height: 80rpx;
				border-bottom: 2rpx solid #f8f8f8;
				display: flex;
				align-items: center;
				margin-left: 31rpx;
				
			}
			.reward{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-left: 31rpx;
				width: 672rpx;
				height: 116rpx;
				border-bottom: 2rpx solid #f8f8f8;
				.Tous{
					display: flex;
					flex-direction: column;
					.test{
						font-size: 28rpx;
						font-weight: 500;
						color: #000000;
					}
					.Time{
						font-size: 20rpx;
						font-weight: 400;
						color: #848484;
					}
				}
				.Price{
					margin-right: 38rpx;
					font-size: 28rpx;
					font-weight: 700;
					color: #fe694f;
				}
			}
		}
	
	}

</style>
