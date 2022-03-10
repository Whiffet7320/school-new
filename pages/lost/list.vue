<template>
	<view class="container">
		<view class="tabbox">
			<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in tablist" :key="index" @click="onTab(item,index)">{{item.title}}</view>
		</view>
		<view @click='onSearch'>
			<page-search></page-search>
		</view>
		<view class="list">
			<lost-list :list="list" @previewImage="previewImage"></lost-list>
			<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
		</view>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import pageSearch from "@/components/page-search/page-search";
	import lostList from "./components/lost-list";
	export default {
		components: {
			pageSearch,
			lostList
		},
		data() {
			return {
				cur: 0,
				tablist: [{
						type: "id",
						title: "最新"
					},
					{
						type: "zan_num",
						title: "热门"
					}
				],
				isOnShow:true,
				field: "id",
				show: false,
				type: 0,
				scrollTop: 0,
				list:[],
				// 加载
				reload: false, //判断是否上拉
				current_page:1,
				last_page:1,
				status: 'loading',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '正在加载...',
					nomore: '没有更多了'
				}
			}
		},
		computed:{
			...mapState({
				isAdd: (state) => state.isAdd
			})
		},
		methods: {
			previewImage(arr) {
				this.isOnShow = false;
				uni.previewImage({
					urls: arr[0],
					current: arr[1],
					indicator: 'default',
					loop: true,
					fail(err) {
						console.log('previewImage出错', urls, err)
					},
				})
			},
			onSearch() {
				console.log(this.type)
				var type;
				if (this.type == 2) {
					type = 0;
				} else if (this.type == 1) {
					type = 1;
				}
				uni.navigateTo({
					url: `/pages/search/index?from=lost&type=${type}`
				})
			},
			setTitle(type) {
				if (type == 1) {
					uni.setNavigationBarTitle({
						title: "帮帮寻物"
					})
				} else if (type == 2) {
					uni.setNavigationBarTitle({
						title: "帮帮寻主"
					})
				}
			},
			onTab(item, index) {
				this.cur = index;
				this.field = item.type;
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			},
			loadData() {
				this.$api.getshougou({type: this.type,field: this.field,page:this.current_page,limit: 10}).then((res) => {
					if (res.code == 200) {
						uni.stopPullDownRefresh();
						this.list = this.reload ? res.data.data : this.list.concat(res.data.data);
						this.list.forEach(ele => {
							if(ele.img_paths){
								ele.imgPath = ele.img_paths.split(",");
								ele.imgPath.forEach((img, i) => {
									this.$set(ele.imgPath, i, this.$tools.imgUrl(img))
								})
							}
						})
						this.current_page = res.data.current_page; //当前页码
						this.last_page = res.data.last_page; //总页码
						this.status = res.data.total == 0 ? 'nomore' : 'more';
					} else {
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				})
			}
		},
		onLoad(options) {
			if (options.type) {
				this.type = options.type;
				this.setTitle(options.type);
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			}
		},
		onShow(){
			if(!this.isOnShow){
				return
			}
			if(this.isAdd){
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
				this.$store.commit("setAdd",false);
			}
		},
		onPullDownRefresh() {
			this.current_page = 1;
			this.reload = true;
			this.loadData();
		},
		onReachBottom() {
			//判断是否最后一页
			if (this.current_page >= this.last_page) {
				this.status = 'nomore';
			} else {
				this.reload = false;
				this.current_page = this.current_page + 1; //页码+1
				this.status = 'loading';
				this.loadData();
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 0 24rpx;
		background-color: #FFFFFF;
	}

	.tabbox {
		padding: 32rpx 0 30rpx 0;
		display: flex;
		align-items: center;

		.tab_item {
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #060606;
			margin-left: 80rpx;
			position: relative;

			&.on {
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;

				&::after {
					content: "";
					position: absolute;
					bottom: -8rpx;
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

	.list {
		padding: 28rpx 0;
	}

	.comment_wrap {
		background-color: #FFFFFF;

		.total {
			background-color: #e5f5fd;
			padding: 0 20rpx;
			border-radius: 0 0 60rpx 60rpx;
			height: 60rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #04a1eb;
		}

		.commlist {
			padding-top: 12rpx;
			padding-left: 22rpx;

			.commitem {
				padding: 28rpx 0;
				display: flex;
				border-bottom: 2rpx solid #f6f6f6;

				&:last-child {
					border-bottom: 0;
				}

				.img {
					width: 54rpx;
					height: 54rpx;
					background-color: #eee;
					border-radius: 50%;
				}

				.info {
					padding-left: 20rpx;

					.hd {
						display: flex;
						align-items: center;

						.name {
							flex: 1;
							font-size: 28rpx;
							font-family: PingFang SC, PingFang SC-Bold;
							font-weight: 700;
							color: #000000;
						}

						.zan {
							display: flex;
							align-items: center;
							font-size: 24rpx;
							font-family: PingFang SC, PingFang SC-Regular;
							font-weight: 400;
							color: #848484;

							&.on {
								color: #165FF9;
								margin-left: 7rpx;
							}
						}
					}

					.desc {
						margin-top: 26rpx;
						font-size: 24rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #000000;
					}
				}
			}
		}
	}
</style>
