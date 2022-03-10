<template>
	<view class="container">
		<view class="bgwhite">
			<view class="search">
				<page-search @onSearch="onSearch"></page-search>
			</view>
			<view class="swiperbox">
				<u-swiper :list="banlist" height="296" mode="none"></u-swiper>
			</view>
			<view class="navmenu">
				<view class="imenu" @click="jump('/pages/market/list?type=2')"><image src="/static/images/market/m1.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/market/list?type=1')"><image src="/static/images/market/m3.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/market/memarket?type=2')"><image src="/static/images/market/m2.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/market/memarket?type=1')"><image src="/static/images/market/m4.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
			</view>
			<!-- <view class="menulist">
				<view class="menu_item" v-for="(item,index) in menulist" :key="index" @click="goMenu(item)">
					<image :src="item.icon" class="img"></image>
					<text>{{item.title}}</text>
				</view>
			</view> -->
		</view>
		<view class="comment">
			<view class="tabbox">
				<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in tablist" :key="index" @click="onTab(item,index)">{{item.title}}</view>
			</view>
			<view class="subtab" v-if="cur==0">
				<view class="subtab_item" @click="onSort(1)">综合<image :src="iszh?'https://guangke.bjxinzeyuan.cn/static/img/images/arrow.png':'https://guangke.bjxinzeyuan.cn/static/img/images/arrow_up.png'" class="img"></image></view>
				<view class="subtab_item" @click="onSort(2)">时间先后<image :src="issj?'https://guangke.bjxinzeyuan.cn/static/img/images/arrow_up.png':'https://guangke.bjxinzeyuan.cn/static/img/images/arrow.png'" class="img"></image></view>
			</view>
			<view class="list">
				<market-list :list="list" @previewImage="previewImage"></market-list>
				<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
			</view>
		</view>
		<page-foot :cur="3"></page-foot>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import marketList from "./components/market-list";
	import pageFoot from "@/components/page-foot/page-foot";
	import pageSearch from "@/components/page-search/page-search";
	export default{
		components:{
			pageSearch,
			marketList,
			pageFoot
		},
		data(){
			return{
				banlist:["https://guangke.bjxinzeyuan.cn/static/img/images/market/banner.png"],
				menulist:[
					// {
					// 	icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu1.png",
					// 	path:"/pages/market/addMarket",
					// 	title:"发布转卖"
					// },
					// {
					// 	icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu2.png",
					// 	path:"/pages/market/addMarketpro",
					// 	title:"发布收购"
					// },
					{
						icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu3.png",
						path:"/pages/market/list?type=2",
						title:"帮帮转卖"
					},
					{
						icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu4.png",
						path:"/pages/market/list?type=1",
						title:"帮帮收购"
					},
					{
						icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu5.png",
						path:"/pages/market/memarket?type=2",
						title:"我的转卖"
					},
					{
						icon:"https://guangke.bjxinzeyuan.cn/static/img/images/market/menu6.png",
						path:"/pages/market/memarket?type=1",
						title:"我的收购"
					}
				],
				tablist:[
					{
						type:"id",
						title:"最新"
					},
					{
						type:"zan_num",
						title:"热门"
					},
					{
						type:"comment_time",
						title:"新评"
					}
				],
				field:"id",
				cur:0,
				iszh:true,
				issj:true,
				scrollTop:0,
				list:[],
				isOnShow:true,
				// 加载
				current_page:1,
				last_page:1,
				status: 'loadmore',
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
		methods:{
			jump(path){
				uni.navigateTo({
					url:path
				})
			},
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
			onSearch(){
				uni.navigateTo({
					url:"/pages/search/index?from=market"
				})
			},
			goMenu(item){
				if(item.path!==''){
					uni.navigateTo({
						url:item.path
					})
				}
			},
			onSort(index){
				if(index===1){
					this.iszh = !this.iszh;
					this.field = this.iszh?"id,desc":"id,asc";
				}else{
					this.issj = !this.issj;
					this.field = this.issj?"add_time,asc":"add_time,desc";
				}
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			},
			async loadData(){
				this.status = 'loading';
				setTimeout(async () => {
					let res = null;
					if(this.cur==2){
						res = await this.$api.new_comment_list({
							type:"jishi",
							page: this.current_page,
							limit: 10
						})
					}else{
						res = await this.$api.getjishi({
							field:this.field,
							page: this.current_page,
							limit: 10
						})
					}
					if (res.data.data.length == 0) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
						this.last_page = res.data.last_page;
						this.list = this.list.concat(res.data.data);
						this.list.forEach(ele => {
							if(ele.img_paths){
								ele.imgPath = ele.img_paths.split(",");
								ele.imgPath.forEach((img, i) => {
									this.$set(ele.imgPath, i, this.$tools.imgUrl(img))
								})
							}
						})
					}
				}, 200)
			},
			onTab(item,index){
				this.cur = index;
				this.field = item.type;
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			}
		},
		onLoad(){
			this.list = [];
			this.loadData();
		},
		onShow(option){
			if (option) {
				if (option.isShudongBack) {
					this.list = [];
					this.current_page = 1;
					this.last_page = 1;
					this.loadData();
				}
			}
			if(this.isAdd){
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
				this.$store.commit("setAdd",false);
			}
		},
		onReachBottom(){
			//判断是否最后一页
			if (this.current_page >= this.last_page) {
				this.status = 'nomore';
			} else {
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
<style>
	page{
		background-color: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	@import "@/common/css/spell/index.scss";
	.bgwhite{
		background-color: #FFFFFF;
		padding-top: 22rpx;
	}
	.swiperbox{
		background-color: #eee;
		height: 296rpx;
		margin:28rpx 24rpx 0 24rpx;
	}
	.navmenu{
		display: flex;
		flex-wrap: wrap;
		padding:26rpx 10rpx 10rpx 10rpx;
		background-color: #FFFFFF;
		.imenu{
			width: 50%;
		}
	}
	.search{
		margin:0 24rpx 0;
	}
	.list{
		padding: 40rpx 0;
	}
</style>
