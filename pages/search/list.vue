<template>
	<view>
		<search-navbar :value="seakey"></search-navbar>
		<view class="seatabbox">
			<view class="tab_item" :class="{'on':cur==index}" v-for="(item,index) in tablist" :key="index"
				@click="onTab(item,index)">{{item}}</view>
		</view>
		<view class="prolist">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
				<image :src="item.myImg_paths[0]" mode="aspectFill" class="img"></image>
				<view class="title u-line-2" v-if="from == 'spell' && cur == 1">
					{{item.start_location}}-{{item.end_location}}
				</view>
				<view class="title u-line-2" v-else>{{item.product_name}}</view>
				<!-- <view class="taglist" v-if="flag">
					<view class="itag">五成新</view>
					<view class="itag red">可拼单</view>
				</view> -->
				<view class="ft" v-if="from != 'lost'">
					<view class="price" v-if="from == 'spell' && cur == 1">{{item.pinche_time}}</view>
					<view class="price" v-else><text class="text">¥</text>{{item.price}}</view>
					<view class="service">
						<image src="/static/images/icon_serv.png" mode="aspectFit" style="width: 33rpx;height:33rpx;">
						</image>
					</view>
				</view>
				<!-- <view class="ftbtn">
					<view class="cbtn">单独购买</view>
					<view class="cbtns">拼单购买</view>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import searchNavbar from "@/components/search-navbar/search-navbar";
	export default {
		components: {
			searchNavbar
		},
		data() {
			return {
				cur: 0,
				tablist: ["帮帮转卖", "帮帮收购"],
				list: [],
				from: '',
				flag: false,
				type: '0',
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.from) {
				this.from = options.from
			}
			if (options.type) {
				this.type = options.type
				this.cur = this.type;
			}
		},
		onShow() {
			this.getData()
		},
		computed: {
			...mapState({
				seakey: state => state.seakey
			})
		},
		methods: {
			async getData() {
				if (this.from == 'spell') {
					if (this.cur == 0) {
						const res = await this.$api.getpindan({
							keyword: this.seakey
						})
						console.log(res.data)
						this.list = res.data.data;
						this.list.forEach(ele => {
							if (ele.img_paths) {
								ele.myImg_paths = ele.img_paths.split(',')
								ele.myImg_paths.forEach((img, i) => {
									this.$set(ele.myImg_paths, i, `${img}`)
								})
							}
						})
					} else if (this.cur == 1) {
						const res = await this.$api.getpinche({
							keyword: this.seakey
						})
						console.log(res.data)
						this.list = res.data.data;
						this.list.forEach(ele => {
							if (ele.img_paths) {
								ele.myImg_paths = ele.img_paths.split(',')
								ele.myImg_paths.forEach((img, i) => {
									this.$set(ele.myImg_paths, i, `${img}`)
								})
							}
						})
					}

					this.tablist = ["帮帮拼单", "帮帮拼车"];
					this.flag = false;
				} else if (this.from == 'market') {
					const res = await this.$api.getjishi({
						keyword: this.seakey,
						type: this.cur == 0 ? '2' : '1'
					})
					console.log(res.data)
					this.list = res.data.data;
					this.list.forEach(ele => {
						if (ele.img_paths) {
							ele.myImg_paths = ele.img_paths.split(',')
							ele.myImg_paths.forEach((img, i) => {
								this.$set(ele.myImg_paths, i, `${img}`)
							})
						}
					})
					this.tablist = ["帮帮转卖", "帮帮收购"];
					this.flag = false;
				} else if (this.from == 'lost') {
					const res = await this.$api.getshougou({
						keyword: this.seakey,
						type: this.cur == 0 ? '2' : '1'
					})
					console.log(res.data)
					this.list = res.data.data;
					this.list.forEach(ele => {
						if (ele.img_paths) {
							ele.myImg_paths = ele.img_paths.split(',')
							ele.myImg_paths.forEach((img, i) => {
								this.$set(ele.myImg_paths, i, `${img}`)
							})
						}
					})
					this.tablist = ["帮帮拾物", "帮帮失物"];
					this.flag = false;
				}
			},
			onTab(item, index) {
				this.cur = index;
				this.getData()
			},
			goDetail(item) {
				// uni.navigateTo({
				// 	url: `/pages/spell/detail?item=${JSON.stringify(item)}`
				// })
				if (this.from == 'market') {
					uni.navigateTo({
						url: "/pages/index/detail/detail?id=" + item.id + "&type=jishi" + "&stype=" + item.type
					})
				} else if (this.from == 'lost') {
					uni.navigateTo({
						url: "/pages/index/detail/detail?id=" + item.id + "&type=shougou" + "&stype=" + item.type
					})
				} else if (this.from == 'spell') {
					var type = this.cur == 0 ? 'pindan' : 'pinche';
					uni.navigateTo({
						url:"/pages/index/detail/detail?id="+item.id+"&type="+type
					})
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	.seatabbox {
		width: 100%;
		height: 102rpx;
		background: #f7f8fa;
		display: flex;
		align-items: center;

		.tab_item {
			flex: 1;
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #000000;
			position: relative;

			&.on {
				&::after {
					content: "";
					position: absolute;
					bottom: -12rpx;
					left: 50%;
					z-index: 50;
					width: 40rpx;
					height: 2rpx;
					background-color: #FE694F;
					transform: translateX(-50%);
				}
			}
		}
	}

	.prolist {
		width: 100%;
		background-color: #FFFFFF;
		padding: 32rpx 0;
		display: flex;
		flex-wrap: wrap;

		.item {
			flex: 0 0 50%;
			padding: 0 24rpx;
			box-sizing: border-box;

			.img {
				width: 100%;
				height: 256rpx;
			}

			.title {
				width: 100%;
				margin: 16rpx 0 12rpx 0;
				height: 68rpx;
				overflow: hidden;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #131313;
			}

			.taglist {
				margin-bottom: 24rpx;
				display: flex;
				align-items: center;

				.itag {
					padding: 4rpx 10rpx;
					border: 2rpx solid #b3b3b3;
					border-radius: 4rpx;
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #4d4d4d;
					margin-right: 16rpx;

					&.red {
						border-color: #FF0000;
						color: #FF0000;
					}
				}
			}

			.ft {
				display: flex;
				align-items: center;

				.price {
					flex: 1;
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #ff0000;

					.text {
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
					}
				}
			}

			.ftbtn {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 16rpx;

				.cbtn {
					width: 116rpx;
					height: 44rpx;
					border: 2rpx solid #707070;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #000000;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.cbtns {
					width: 116rpx;
					height: 44rpx;
					background: #fe694f;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					text-align: center;
					color: #ffffff;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
	}
</style>
