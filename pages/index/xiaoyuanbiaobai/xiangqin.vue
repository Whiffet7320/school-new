<template>
	<view class="index">
		<view class="items">
			<view class="item">
				<view class="tit1">
					<view class="left">
						<image :src="obj.avatar" class="pic1" mode=""></image>
						<view class="txt1">{{obj.sender_name==""?'':obj.sender_name}}</view>
					</view>
					<view class="bq">TO：{{obj.receiver_name}}</view>
				</view>
				<view class="tit2">{{obj.content}}</view>
				<view class="tit3" v-if="obj.myImg_paths.length">
					<image @click.stop="toSeeImg(i,obj.myImg_paths)" v-for="(item,i) in obj.myImg_paths" :key='i'
						:src="item" class="pic2" mode="">
					</image>
				</view>
				<view class="tit4">
					<view class="left">
						<view class="icon1">
							<u-icon name="eye" color="#848484" size="30"></u-icon>
							<view class="i-txt">{{obj.read_num}}</view>
						</view>
						<view class="icon1" @click="dianzan('obj')">
							<template v-if="obj.is_zan != 1">
								<u-icon name="thumb-up" color="#848484" size="28"></u-icon>
								<view class="i-txt">{{obj.zan_count}}</view>
							</template>
							<template v-else>
								<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
								<view class="i-txt isDianzan">{{obj.zan_count}}</view>
							</template>
						</view>
						<view class="icon1">
							<u-icon name="more-circle" color="#848484" size="26"></u-icon>
							<view class="i-txt">{{pinlunCount}}</view>
						</view> 
					</view>
					<view class="right">{{obj.add_time}}发布</view>
				</view>
			</view>
		</view>
		<view class="nav2">
			<view class="tit2-1">评论</view>
			<view class="tit2-2">共{{pinlunCount}}条评论</view>
			<view class="nav2-items">
				<view class="nav2-item" v-for="item in pinlunList">
					<view class="tit1-n2">
						<view class="left">
							<image :src='item.avatar_url' class="pic1" mode=""></image>
							<view class="txt1-n2">{{item.nickname}}</view>
						</view>
						<view class="icon1" @click.stop="dianzan(item)">
							<template v-if="item.is_zan == 0">
								<u-icon name="thumb-up" color="#848484" size="28"></u-icon>
								<view class="i-txt">{{item.zan_count}}</view>
							</template>
							<template v-else>
								<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
								<view class="i-txt isDianzan">{{item.zan_count}}</view>
							</template>
						</view>
					</view>
					<view class="tit2-n2">{{item.content}}</view>
				</view>
				<u-loadmore :status="status" />
			</view>
		</view>
		<view class="footer">
			<u-input v-model="value" type="text" border />
			<view @click="pinlun" class="btn-f">评论</view>
		</view>
		<!-- 弹出层 -->
		<u-popup v-model="popShow1" border-radius='40' height="1000" mode="bottom">
			<view class="nav2">
				<view class="tit2-1">评论</view>
				<view class="tit2-2">共{{pinlunCount}}条评论</view>
				<view class="nav2-items">
					<view class="nav2-item" v-for="item in pinlunList" :key='item.id'>
						<view class="tit1-n2">
							<view class="left">
								<image :src='item.avatar_url' class="pic1" mode=""></image>
								<view class="txt1-n2">{{item.nickname}}</view>
							</view>
							<view class="icon1" @click.stop="dianzan(item)">
								<template v-if="item.is_zan == 0">
									<u-icon name="thumb-up" color="#848484" size="28"></u-icon>
									<view class="i-txt">{{item.zan_count}}</view>
								</template>
								<template v-else>
									<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
									<view class="i-txt isDianzan">{{item.zan_count}}</view>
								</template>
							</view>
						</view>
						<view class="tit2-n2">{{item.content}}</view>
					</view>
				</view>
			</view>
			<view class="footer">
				<u-input v-model="value" type="text" border />
				<view @click="pinlun" class="btn-f">评论</view>
			</view>
		</u-popup>
		<!-- 提交成功 -->
		<u-popup mode='center' border-radius="10" v-model="popShow2" width="360rpx" height="360rpx">
			<view class="pop2">
				<view class="txt1">提示</view>
				<view class="txt2">评论成功</view>
				<view @click="queding" class="btn">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				popShow2: false,
				popShow1: false,
				value: '',
				isDianzan: false,
				imgArr: [],
				id: '',
				obj: {},
				pinlunList: [],
				pinlunCount: 0,
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
			...mapState(["biaobaiqiangPinglunPage", "biaobaiqiangPinglunPageSize"]),
		},
		watch: {
			biaobaiqiangPinglunPage: function(page) {
				console.log('ddpage')
				this.$store.commit("biaobaiqiangPinglunPage", page);
				if (this.biaobaiqiangPinglunPage != 1) {
					this.getData();
				}
			},
		},
		onLoad(options) {
			this.id = options.id;
		},
		onReachBottom() {
			this.$store.commit("biaobaiqiangPinglunPage", this.biaobaiqiangPinglunPage + 1);
		},
		onShow() {
			this.pinlunList = [];
			this.$store.commit("biaobaiqiangPinglunPage", 1);
			this.getData1();
			this.getData();
		},
		methods: {
			async getData1() {
				const res = await this.$api.gaobaiXiangqin(this.id);
				console.log(res);
				this.obj = res.data;
				if (this.obj.img_paths != '') {
					this.obj.myImg_paths = this.obj.img_paths.split(',')
					this.obj.myImg_paths.forEach((ele, i) => {
						this.$set(this.obj.myImg_paths, i, `${this.$url}/${ele}`)
					})
				}
			},
			async getData() {
				this.status = 'loading';
				setTimeout(async () => {
					const res2 = await this.$api.comment_list({
						type: 'gaobai',
						id: this.id,
						page: this.biaobaiqiangPinglunPage,
						limit: this.biaobaiqiangPinglunPageSize,
					})
					this.pinlunCount = res2.data.total;
					if (res2.data.data.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.pinlunList = this.pinlunList.concat(res2.data.data)
					}
				}, 200)
				console.log(this.pinlunList)
			},
			queding() {
				this.popShow2 = false;
				this.value = '';
				this.pinlunList = [];
				this.$store.commit("biaobaiqiangPinglunPage", 1);
				this.getData();
			},
			async dianzan(item) {
				if (item == 'obj') {
					item = this.obj
					await this.$api.zan({
						id: this.id,
						type: 'gaobai'
					})
				} else {
					await this.$api.comment_zan({
						id: item.id,
						type: 'gaobai'
					})
				}
				if (item.is_zan == 0) {
					item.is_zan = true;
					item.zan_count++
				} else {
					item.is_zan = false;
					item.zan_count--
				}
			},
			toSeeImg(i, imgArr) {
				uni.previewImage({
					current: i,
					urls: imgArr,
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
			async pinlun() {
				await this.$api.comment({
					id: this.id,
					type: 'gaobai',
					content: this.value,
				})
				this.popShow2 = true;
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
	.index {
		position: relative;
	}

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
						border-radius: 50%;
					}

					.txt1 {
						margin-left: 20rpx;
						font-size: 28rpx;
						font-weight: 700;
						color: #000000;
					}
				}

				.bq {
					height: 50rpx;
					padding: 0 20rpx;
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

	.nav2 {
		padding-bottom: 140rpx;
		margin-left: 12rpx;
		width: 726rpx;
		// height: 838rpx;
		background: #ffffff;
		border-radius: 10rpx;

		.tit2-1 {
			padding-top: 40rpx;
			font-size: 34rpx;
			font-weight: 700;
			text-align: center;
			color: #000000;
		}

		.tit2-2 {
			width: 180rpx;
			height: 58rpx;
			background: #fed1c9;
			border-radius: 0rpx 30rpx 30rpx 0rpx;
			font-size: 24rpx;
			font-weight: 500;
			text-align: center;
			line-height: 58rpx;
			color: #000000;
		}

		.nav2-items {
			margin: 0 32rpx;

			.nav2-item {
				padding: 28rpx 0 24rpx 0;
				border-bottom: 2rpx solid #f6f6f6;

				.tit1-n2 {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left {
						display: flex;
						align-items: center;

						.pic1 {
							margin-right: 20rpx;
							width: 54rpx;
							height: 54rpx;
							border-radius: 50%;
						}

						.txt1-n2 {
							font-size: 28rpx;
							font-weight: 700;
							color: #000000;
						}
					}

					.icon1 {
						display: flex;
						align-items: center;

						.i-txt {
							margin-left: 8rpx;
							font-size: 24rpx;
						}

						.isDianzan {
							color: #fe694f;
						}
					}
				}

				.tit2-n2 {
					margin-top: 26rpx;
					margin-left: 74rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #000000;
				}
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		z-index: 9;
		width: 750rpx;
		height: 140rpx;
		background: #ffffff;
		display: flex;
		box-shadow: 0rpx 8rpx 28rpx 0rpx rgba(166, 179, 194, 0.30);

		/deep/ .u-input {
			margin-left: 42rpx;
			margin-top: 12rpx;
			width: 518rpx;
			height: 72rpx;
			border-radius: 38rpx;
		}

		.btn-f {
			margin-left: 20rpx;
			margin-top: 12rpx;
			width: 128rpx;
			height: 72rpx;
			background: #fe694f;
			border-radius: 36rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #ffffff;
			line-height: 72rpx;
		}
	}

	.pop2 {
		display: flex;
		flex-direction: column;
		align-items: center;

		.txt1 {
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #000000;
			margin: 42rpx;
		}

		.txt2 {
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #000000;
		}

		.btn {
			margin-top: 60rpx;
			width: 240rpx;
			height: 80rpx;
			background: #fe694f;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 80rpx;
		}
	}
</style>
