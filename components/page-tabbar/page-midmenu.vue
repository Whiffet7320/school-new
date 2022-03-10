<template>
	<view class="midwrap" v-if="midshow">
		<view class="mask"></view>
		<!-- <view class="midwrap_con">
			<view class="hd">选择内容</view>
			<view class="miditem" v-for="(item,index) in mlist" :key="index" @click="goMenu(item.path)">{{item.title}}</view>
			<view class="ft" @click="midshow=false">取消发布</view>
			<view class="before"></view>
		</view> -->
		<view class="myNav">
			<!-- <video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" controls></video> -->
			<view class="items">
				<view class="item" v-for="(item,i) in mlist" :key='i' @click="goMenu(item.path)">
					<image :src="item.img" class="i-pic" mode=""></image>
					<view class="i-txt">{{item.title}}</view>
				</view>
			</view>
			<view @click="midshow=false" class="quxiao">取消发布</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				midshow: false,
				mlist: [{
						title: "发布转卖",
						path: "/pages/market/addMarket",
						img:'/static/images/zu3637.png'
					},
					{
						title: "发布收购",
						path: "/pages/market/addMarketpro",
						img:'/static/images/zu3636.png'
					},
					{
						title: "发布寻物",
						path: "/pages/lost/addlost",
						img:'/static/images/zu3638.png'
					},
					{
						title: "发布寻主",
						path: "/pages/lost/addlostpro",
						img:'/static/images/zu3639.png'
					},
					{
						title: "发布拼车",
						path: "/pages/spell/addSpell",
						img:'/static/images/zu3640.png'
					},
					{
						title: "发布拼单",
						path: "/pages/spell/addSpellpro",
						img:'/static/images/zu3641.png'
					},
					{
						title: "发布风景",
						path: "/pages/campus/addScenery",
						img:'/static/images/zu3642.png'
					},
					{
						title: "发布报修",
						path: "/pages/campus/addRepair",
						img:'/static/images/zu3643.png'
					}
				]
			}

		},
		watch: {
			show: {
				handler(newval) {
					this.midshow = !this.midshow;
				},
				immediate: false,
				deep: true
			}
		},
		methods: {
			goMenu(path) {
				uni.navigateTo({
					url: path
				})
				this.midshow = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.midwrap {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		z-index: 500;

		.mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 500;
			background-color: rgba(0, 0, 0, 0.5);
		}

		.midwrap_con {
			width: 236rpx;
			background: #ffffff;
			border-radius: 10rpx;
			padding: 0 11rpx;
			position: absolute;
			left: 50%;
			bottom: calc((180rpx + env(safe-area-inset-bottom));
					transform: translateX(-50%);
					z-index: 600;

					.before {
					position: absolute;
					bottom:-20rpx;
					left: 50%;
					width: 0;
					height: 0;
					border-left: 26rpx solid transparent;
					border-right: 26rpx solid transparent;
					border-top: 26rpx solid #ffffff;
					transform: translateX(-50%);
				}

				.hd {
					line-height: 66rpx;
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #000000;
					border-bottom: 2rpx dashed #cccccc;
				}

				.ft {
					margin-top: 20rpx;
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #b3b3b3;
					padding: 20rpx 0;
					border-top: 2rpx dashed #cccccc;
				}

				.miditem {
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #030303;
					padding-top: 20rpx;

					&.on {
						color:#FFA900;
					}
				}
			}

			.myNav {
				position: absolute;
				padding: 30rpx 60rpx;
				box-sizing: border-box;
				width: 700rpx;
				height: 396rpx;
				background: #FFFFFF;
				left:50%;
				bottom: calc((170rpx + env(safe-area-inset-bottom));
					transform: translateX(-50%);
					z-index: 600;
					border-radius: 20rpx;

					.items {
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						.item {
							margin-right: 64rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							&:nth-child(1){
								margin-bottom: 24rpx;
							}
							&:nth-child(2){
								margin-bottom: 24rpx;
							}
							&:nth-child(3){
								margin-bottom: 24rpx;
							}
							&:nth-child(4){
								margin-right: 0rpx;
								margin-bottom: 24rpx;
							}
							&:nth-child(8){
								margin-right: 0rpx;
							}
							.i-pic {
								width: 80rpx;
								height: 80rpx;
							}

							.i-txt {
								margin-top: 6rpx;
								font-size: 24rpx;
								font-family: PingFang SC, PingFang SC-Medium;
								font-weight: 500;
								color: #000000;
							}
						}
					}
					.quxiao{
						margin-left: 160rpx;
						margin-top: 28rpx;
						width: 252rpx;
						height: 48rpx;
						background: #fe694f;
						border-radius: 24rpx;
						text-align: center;
						line-height: 48rpx;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #ffffff;
					}
				}
			}
</style>
