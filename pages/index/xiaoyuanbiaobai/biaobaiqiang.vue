<template>
	<view class="index">
		<view class="items">
			<view class="item" @click="toXiangqin(item.id)" v-for="item in list" :key='item.id'>
				<view class="tit1">
					<view class="left">
						<image src="/static/images/zu2918.png" class="pic1" mode=""></image>
						<!-- <image :src="item.avatar_url" class="pic1" mode=""></image> -->
						<view class="txt1">{{item.sender_name==''?'':item.sender_name}}</view>
					</view>
					<view class="bq">TO：{{item.receiver_name}}</view>
				</view>
				<view class="tit2">{{item.content}}</view>
				<view class="tit3">
					<image @click.stop="toSeeImg(i,item.myImg_paths)" v-for="(img,i) in item.myImg_paths" :key='i'
						:src="img" class="pic2" mode="">
					</image>
				</view>
				<view class="tit4">
					<view class="left">
						<view class="icon1">
							<u-icon name="eye" color="#848484" size="30"></u-icon>
							<view class="i-txt">{{item.read_num}}</view>
						</view>
						<view class="icon1" @click.stop="dianzan(item)">
							<template v-if="!item.is_zan">
								<u-icon name="thumb-up" color="#848484" size="28"></u-icon>
								<view class="i-txt">{{item.zan_count}}</view>
							</template>
							<template v-else>
								<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
								<view class="i-txt isDianzan">{{item.zan_count}}</view>
							</template>
						</view>
						<view class="icon1">
							<u-icon name="more-circle" color="#848484" size="26"></u-icon>
							<view class="i-txt">{{item.comment_count}}</view>
						</view>
					</view>
					<view class="right">{{item.add_time}}发布</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				isOnShow: true,
				list: [],
				isDianzan: false,
				imgArr: [],
				// 加载
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '正在加载...',
					nomore: '没有了更多了'
				},
			}
		},
		computed: {
			...mapState(["biaobaiqiangPage", "biaobaiqiangPageSize"]),
		},
		watch: {
			biaobaiqiangPage: function(page) {
				console.log('ddpage')
				this.$store.commit("biaobaiqiangPage", page);
				if (this.biaobaiqiangPage != 1) {
					this.getData();
				}
			},
		},
		onShow(option) {
			console.log(option)
			if (option) {
				if (option.isShudongBack) {
					this.list = [];
					this.$store.commit("shudongPage", 1);
					this.getData();
				}
			}
		},
		onLoad() {
			if (!this.isOnShow) {
				return;
			}
			this.list = [];
			this.$store.commit("biaobaiqiangPage", 1);
			this.getData();
		},
		onPullDownRefresh() {
			this.list = [];
			this.$store.commit("biaobaiqiangPage", 1);
			this.getData();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			this.$store.commit("biaobaiqiangPage", this.biaobaiqiangPage + 1);
		},
		methods: {
			async getData() {
				this.status = 'loading';
				setTimeout(async () => {
					const res = await this.$api.gaobai({
						page: this.biaobaiqiangPage,
						limit: this.biaobaiqiangPageSize,
					})
					if (res.data.data.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.list = this.list.concat(res.data.data)
						this.list.forEach(ele => {
							if (ele.img_paths) {
								ele.myImg_paths = ele.img_paths.split(',')
								ele.myImg_paths.forEach((img, i) => {
									this.$set(ele.myImg_paths, i, `${img}`)
								})
							}
						})
					}
				}, 200)
				console.log(this.list)
			},
			async dianzan(item) {
				console.log(item);
				if (item.is_zan == 0) {
					item.is_zan = true;
					item.zan_count++
				} else {
					item.is_zan = false;
					item.zan_count--
				}
				await this.$api.zan({
					id: item.id,
					type: 'gaobai'
				})
			},
			toSeeImg(i, imgList) {
				this.isOnShow = false;
				uni.previewImage({
					current: i,
					urls: imgList,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			toXiangqin(id) {
				uni.navigateTo({
					url: `/pages/index/xiaoyuanbiaobai/xiangqin?id=${id}`
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

	/deep/ .u-load-more-wrap {
		height: 100rpx !important;
	}

	.items {
		margin: 20rpx 12rpx;

		.item {
			width: 726rpx;
			background: #ffffff;
			border-radius: 10rpx;
			margin-bottom: 22rpx;
			padding: 32rpx 28rpx 24rpx 32rpx;

			.tit1 {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;

					.pic1 {
						width: 54rpx;
						height: 54rpx;
					}

					.txt1 {
						margin-left: 20rpx;
						font-size: 28rpx;
						font-weight: 700;
						color: #000000;
					}
				}

				.bq {
					// width: 164rpx;
					padding: 0 20rpx;
					height: 50rpx;
					border: 2rpx solid #ffc9d8;
					border-radius: 28rpx;
					font-size: 24rpx;
					font-weight: 500;
					text-align: center;
					line-height: 50rpx;
					color: #ffc9d7;
				}
			}

			.tit2 {
				margin-top: 26rpx;
				margin-left: 74rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #000000;
			}

			.tit3 {
				margin-top: 16rpx;
				margin-left: 74rpx;

				.pic2 {
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
				}
			}

			.tit4 {
				margin-top: 56rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.left {
					display: flex;
					align-items: center;

					.icon1 {
						margin-right: 50rpx;
						display: flex;
						align-items: center;

						.i-txt {
							margin-left: 8rpx;
							font-size: 24rpx;
							font-weight: 400;
							color: #848484;
						}

						.i-txt.isDianzan {
							color: #fe694f;
						}
					}
				}

				.right {
					font-size: 24rpx;
					font-weight: 400;
					color: #c4c4c4;
				}
			}
		}
	}
</style>
