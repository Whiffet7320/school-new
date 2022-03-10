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
				<view class="imenu" @click="jump('/pages/spell/list?type=1')"><image src="/static/images/pin/m1.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/spell/list?type=2')"><image src="/static/images/pin/m2.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/spell/mespell?type=1')"><image src="/static/images/pin/m3.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
				<view class="imenu" @click="jump('/pages/spell/mespell?type=2')"><image src="/static/images/pin/m4.png" mode="aspectFit" style="width: 364rpx;height: 142rpx;"></image></view>
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
				<view class="subtab_item" @click="onSort(1)">综合<image :src="iszh?'/static/images/arrow.png':'/static/images/arrow_up.png'" class="img"></image></view>
				<view class="subtab_item" @click="onSort(2)">时间先后<image :src="issj?'/static/images/arrow_up.png':'/static/images/arrow.png'" class="img"></image></view>
			</view>
			<view class="list">
				<page-comment :list="list" @previewImage="previewImage" type="pinche"></page-comment>
				<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
			</view>
		</view>
		<page-foot></page-foot>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import pageComment from "@/components/page-comment/page-comment";
	import pageFoot from "@/components/page-foot/page-foot";
	import pageSearch from "@/components/page-search/page-search";
	export default{
		components:{
			pageSearch,
			pageComment,
			pageFoot
		},
		data(){
			return{
				scrollTop:0,
				banlist:["/static/images/pin/banner.png"],
				menulist:[
					// {
					// 	icon:"/static/images/pin/menu_1.png",
					// 	path:"/pages/spell/addSpell",
					// 	title:"发布拼车"
					// },
					// {
					// 	icon:"/static/images/pin/menu_2.png",
					// 	path:"/pages/spell/addSpellpro",
					// 	title:"发布拼单"
					// },
					{
						icon:"/static/images/pin/menu_3.png",
						path:"/pages/spell/list?type=1",
						title:"帮帮拼车"
					},
					{
						icon:"/static/images/pin/menu_4.png",
						path:"/pages/spell/list?type=2",
						title:"帮帮拼单"
					},
					{
						icon:"/static/images/pin/menu_5.png",
						path:"/pages/spell/mespell?type=1",
						title:"我的拼车"
					},
					{
						icon:"/static/images/pin/menu_6.png",
						path:"/pages/spell/mespell?type=2",
						title:"我的拼单"
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
				list:[],
				isOnShow:true,
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
					url:"/pages/search/index?from=spell"
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
			loadData(){
				if(this.cur==2){
					this.$api.new_comment_list({type:"pinche",page: this.current_page,limit: 10}).then((res)=>{
						if(res.code==200){
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
						}
					})
				}else{
					this.$api.getpinche({field:this.field,page:this.current_page,limit: 10}).then((res)=>{
						if(res.code==200){
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
						}else{
							uni.showToast({
								title:res.message,
								icon:"none"
							})
						}
					})
				}
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
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(){
			this.list = [];
			this.current_page = 1;
			this.last_page = 1;
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
