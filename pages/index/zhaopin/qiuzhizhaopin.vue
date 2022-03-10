<template>
	<view class="index">
		<view class="nav1">
			<u-icon name="search" color="#848484" size="28"></u-icon>
			<u-input v-model="value" height="60" type="text"/>
		</view>
		<u-tabs-swiper bg-color="#f7f8fa" height='60' font-size="28" gutter="30" inactive-color="#848484"
			bar-height="2" bar-width="84" active-color="#FE694F" ref="uTabs" :list="list" :current="current"
			@change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		<swiper :style="[{height: height + 'px'}]" :current="swiperCurrent">
			<swiper-item @touchmove.stop class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view scroll-y='true' style="height: 90vh;">
					<view class="items">
						<!-- {{item.name}} -->
						<!-- 求职大厅 -->
						<template v-if="swiperCurrent == 0">
							
						</template>
						<!-- 附近工作 -->
						<template v-if="swiperCurrent == 1">
							<view class="s-nav2">
								<view class="s-items" v-for="item in 6">
									<view class="left">
										<image class="pic1" src="/static/images/user_s.png" mode=""></image>
										<view class="navv">
											<view class="txt1">市场宣传部招生</view>
											<view class="txt2">销售/代理/微商 不限</view>
											<view class="txt3">招<text class="red">2</text>人，共<text class="red">120</text>天，月结</view>
										</view>
									</view>
									<view class="right">120元/天</view>
								</view>
							</view>
						</template>
						<!-- 我的 -->
						<template v-if="swiperCurrent == 2">
						
						</template>
					</view>
				</scroll-view>
		
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				value:'',
				// 
				swiperCurrentIndex: 0,
				height: 0,
				list: [{
					name: '求职大厅'
				}, {
					name: '附近工作'
				},{
					name: '我的'
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			}
		},
		onShow() {
			this.tabsChange(this.current);
			// this.getData();
		},
		mounted() {
			this.getCurrentSwiperHeight('.items')
		},
		methods:{
			// tabs通知swiper切换
			tabsChange(index) {
				console.log(index);
				this.swiperCurrent = index;
				this.current = index;
				this.swiperCurrentIndex = index;
				setTimeout(()=>{
					this.getCurrentSwiperHeight('.items')
				},200)
			},
			getCurrentSwiperHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(element).boundingClientRect();
				query.exec((res) => {
					this.height = 50 + res[0][this.swiperCurrentIndex].height;
				})
			},
		}
	}
</script>

<style>
	page {
		background: #f7f8fa;
	}
</style>
<style lang="scss" scoped>
	.index {}
	.nav1{
		margin-bottom: 14rpx;
		padding-left: 24rpx;
		margin-top: 20rpx;
		margin-left: 24rpx;
		display: flex;
		align-items: center;
		width: 702rpx;
		height: 60rpx;
		background: #f1f1f1;
		border-radius: 30rpx;
		/deep/ .u-input{
			margin-left: 16rpx;
			width: 602rpx;
			height: 60rpx;
			border-radius: 30rpx;
			background: #f1f1f1;
			.u-input__input{
				font-size: 24rpx;
				font-weight: 400;
				color: #848484;
			}
 		}
	}
	.items{
		.s-nav2{
			.s-items{
				margin-top: 20rpx;
				padding: 0 24rpx;
				width: 750rpx;
				height: 154rpx;
				background: #ffffff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					display: flex;
					align-items: center;
					.pic1{
						width: 90rpx;
						height: 90rpx;
						margin-right: 16rpx;
					}
					.navv{
						.txt1{
							font-size: 24rpx;
							font-weight: 700;
							color: #000000;
						}
						.txt2{
							margin-top: 12rpx;
							font-size: 20rpx;
							font-weight: 500;
							color: #000000;
						}
						.txt3{
							margin-top: 12rpx;
							font-size: 20rpx;
							font-weight: 500;
							color: #000000;
							.red{
								color: #FE694F;
							}
						}
					}
				}
				.right{
					font-size: 20rpx;
					font-weight: 700;
					color: #165ff9;
				}
			}
		}
	}
</style>
