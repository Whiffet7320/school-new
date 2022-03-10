<template>
	<view class="index">
		<Navtop title="红包"></Navtop>
		<view class="Head">
			<view class="Tips">
				筛选条件
			</view>
			<view class="Title">
				<view :class="TitDex === index?'ListCor':'List'" v-for="(item,index) in HeadList" :key="index" @click="Select(index)">
					<view class="Name">
						{{item.name}}
					</view>
					<view class="redio" v-if="index !== 0">
						{{item.amount}}
					</view>
				</view>
				
			</view>
		</view>
	
		<view class="RedPack" v-for="(item,index) in RedPackList" :key="index">
			<view class="Tips" :style="{background:item.state ==='将到期'?'#D81E1E':''}">
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
				HeadList:[
					{
						name:'默认'
					},
					{
						name:'最新获取',
						amount:0,//优惠卷数量
					},
					{
						name:'即将到期',
						amount:0,//优惠卷数量
					}
				],
				TitDex:-1,//标题选择
				//红包
				RedPackList:[
					// {
					// 	pic:'/static/user/touxiang.png',
					// 	name:'年糕小姐豆腐汤',
					// 	TouTime:'2021.10.15 11:38',
					// 	WeiTime:'2021.10.18 23:59',
					// 	price:8,//价格
					// 	num:10,//满减
					// 	state:'将到期',//状态
					// 	Tips:'限00:00:00-23:59:59使用',
					// },
					// {
					// 	pic:'/static/user/touxiang.png',
					// 	name:'年糕小姐豆腐汤',
					// 	TouTime:'2021.10.15 11:38',
					// 	WeiTime:'2021.10.18 23:59',
					// 	price:8,//价格
					// 	num:10,//满减
					// 	state:'新获取',//状态
					// 	Tips:'限00:00:00-23:59:59使用',
					// }
				],
			}
		},
		methods: {
			//选择排序
			Select(index){
				this.TitDex = index
			},
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		background: #f7f8fa;
	}
	.index{
		width: 100%;
		.Head{
			width: 100%;
			height: 82rpx;
			background: #ffffff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.Tips{
				margin-left: 40rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
			}
			.Title{
				width: 400rpx;
				display: flex;
				align-items: center;
				justify-content: space-around;
				.List{
					position: relative;
					font-size: 28rpx;
					font-weight: 400;
					color: #000000;
				}
				.ListCor{
					position: relative;
					font-size: 28rpx;
					font-weight: 700;
					color: #fe694f;
				}
				.redio{
					position: absolute;
					top: 0;
					right: 0;
					margin-top: -5rpx;
					margin-right: -10rpx;
					width: 24rpx;
					height: 24rpx;
					background: #d81e1e;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					font-weight: 500;
					color: #ffffff;
				}
			}
		}
		
		.RedPack{
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
