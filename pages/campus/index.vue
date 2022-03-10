<template>
	<view>
		<view class="swiper">
			<image :src="banner" mode="aspectFill" class="img"></image>
			<u-navbar v-if="scrollTop>100" :custom-back="onBack" title="校园一角" :back-icon-name="backIcon" back-icon-color="#ffffff" title-color="#ffffff" :background="background" :border-bottom="false"></u-navbar>
			<u-navbar v-else :custom-back="onBack" title="校园一角" :back-icon-name="backIcon" back-icon-color="#ffffff" title-color="#ffffff" :background="{backgroundColor: 'transparent'}" :border-bottom="false"></u-navbar>
		</view>
		<view class="navmenu">
			<view class="mitem">
				<view class="navpic1" @click="jump('/pages/campus/scenery')">
					<image src="/static/images/school/m1.png" mode="aspectFit" style="width: 218rpx;height: 190rpx;"></image>
				</view>
				<view class="navpic" @click="jump('/pages/campus/meScenery')">
					<image src="/static/images/school/m2.png" mode="aspectFit" style="width: 242rpx;height: 114rpx;"></image>
				</view>
			</view>
			<view class="mitem">
				<view class="navpic" @click="jump('/pages/campus/news')">
					<image src="/static/images/school/m3.png" mode="aspectFit" style="width: 484rpx;height: 114rpx;"></image>
				</view>
				<view class="navpic" @click="jump('/pages/campus/advice')">
					<image src="/static/images/school/m4.png" mode="aspectFit" style="width: 484rpx;height: 114rpx;"></image>
				</view>
				<view class="navpic">
					<view @click="jump('/pages/campus/list')">
						<image src="/static/images/school/m6.png" mode="aspectFit" style="width: 242rpx;height: 114rpx;"></image>
					</view>
					<view @click="jump('/pages/campus/repair')">
						<image src="/static/images/school/m5.png" mode="aspectFit" style="width: 242rpx;height: 114rpx;"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="menulist">
			<view class="menu_item" v-for="(item,index) in menulist" :key="index" @click="goMenu(item)">
				<image :src="item.icon" class="img"></image>
				<text>{{item.title}}</text>
			</view>
		</view> -->
		<view class="comment">
			<view class="tabbox">
				<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in tablist" :key="index" @click="onTab(item,index)">{{item.title}}</view>
			</view>
			<view class="subtab" v-if="cur==0">
				<view class="subtab_item" @click="onSort(1)">综合<image :src="iszh?'/static/images/arrow.png':'/static/images/arrow_up.png'" class="img"></image></view>
				<view class="subtab_item" @click="onSort(2)">时间先后<image :src="issj?'/static/images/arrow_up.png':'/static/images/arrow.png'" class="img"></image></view>
			</view>
			<view class="list">
				<page-commentxy :list="list" @previewImage="previewImage"></page-commentxy>
				<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
			</view>
		</view>
		<page-foot :cur="4"></page-foot>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import pageCommentxy from "./components/page-commentxy";
	import pageFoot from "@/components/page-foot/page-foot";
	export default{
		components:{
			pageCommentxy,
			pageFoot
		},
		data(){
			return{
				scrollTop:0,
				backIcon:"nav-back",
				page:0,
				banner:`${this.$url}/static/img/images/school/xyyj.jpeg`,
				background: {
					background: `url(${this.$url}/static/img/images/school/xyyj.jpeg) no-repeat`,
					backgroundSize: 'cover'
				},
				menulist:[
					{
						icon:"/static/images/school/menu_1.png",
						path:"/pages/campus/scenery",
						title:"校园风景"
					},
					{
						icon:"/static/images/school/menu_2.png",
						path:"/pages/campus/advice",
						title:"社团咨询"
					},
					{
						icon:"/static/images/school/menu_3.png",
						path:"/pages/campus/news",
						title:"校园新闻"
					},
					{
						icon:"/static/images/school/menu_4.png",
						path:"/pages/campus/addRepair",
						title:"发布报修"
					},
					{
						icon:"/static/images/school/menu_5.png",
						path:"/pages/campus/list",
						title:"帮帮报修"
					},
					{
						icon:"/static/images/school/menu_6.png",
						path:"/pages/campus/addScenery",
						title:"发布风景"
					},
					{
						icon:"/static/images/school/menu_7.png",
						path:"/pages/campus/meScenery",
						title:"我的风景"
					},
					{
						icon:"/static/images/school/menu_8.png",
						path:"/pages/campus/repair",
						title:"我的报修"
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
			jump(path){
				uni.navigateTo({
					url:path
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
			onTab(item,index){
				this.cur = index;
				this.field = item.type;
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			},
			async loadData(){
				if(this.cur==2){
					this.$api.new_comment_list({type:"fengjing",page: this.current_page,limit: 10}).then((res)=>{
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
					this.$api.getfengjing({field:this.field,page:this.current_page,limit: 10}).then((res)=>{
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
				}
			},
			onBack(){
				if(this.page==4){
					uni.switchTab({
						url:"/pages/tabBar/index"
					})
				}else{
					uni.navigateBack({
						delta:2
					})
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options){
			if(options.page){
				this.backIcon = "home-fill";
				this.page = options.page;
			}
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
		background-color: #F2F2F2;
	}
</style>
<style lang="scss" scoped>
	@import "@/common/css/spell/index.scss";
	.swiper{
		width: 100%;
		height: 588rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	.navmenu{
		padding: 32rpx 12rpx 8rpx 12rpx;
		background-color: #FFFFFF;
		display: flex;
		.mitem{
			display: flex;
			flex-direction: column;
			align-items: center;
			.navpic1{
				margin:8rpx 12rpx 20rpx 12rpx;
			}
			.navpic{
				display: flex;
			}
		}
	}
	.menulist{
		margin-top: 20rpx;
		margin-bottom: 32rpx;
	}
	.list{
		padding:30rpx 0;
	}
</style>
