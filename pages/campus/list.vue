<template>
	<view class="container">
		<view class="tabbox">
			<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in tablist" :key="index" @click="onTab(item,index)">{{item.title}}</view>
		</view>
		<page-search @onSearch="onSearch"></page-search>
		<view class="list">
			<page-comment :list="list" @previewImage="previewImage" type="baoxiu"></page-comment>
			<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
		</view>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import pageSearch from "@/components/page-search/page-search";
	import pageComment from "@/components/page-comment/page-comment";
	export default{
		components:{
			pageSearch,
			pageComment
		},
		data(){
			return{
				isOnShow:true,
				cur:0,
				tablist:[
					{
						type:"id",
						title:"最新"
					},
					{
						type:"zan_num",
						title:"热门"
					}
				],
				field:"id",
				scrollTop:0,
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
			goDetail(type,item){
				this.$store.commit("setDetail",item);
				uni.navigateTo({
					url:"/pages/index/detail/detail?type="+type
				})
			},
			onTab(item,index){
				this.cur = index;
				this.field = item.type;
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			},
			loadData(){
				this.$api.getbaoxiu({field:this.field,page:this.current_page,limit: 10}).then((res)=>{
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
		onLoad(){
			this.list = [];
			this.current_page = 1;
			this.last_page = 1;
			this.loadData();
		},
		onShow(){
			if(!this.isOnShow){
				return;
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
	.container{
		padding: 0 24rpx;
		background-color: #FFFFFF;
	}
	.tabbox{
		padding:32rpx 0 23rpx 0;
		display: flex;
		align-items: center;
		.tab_item{
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			color: #060606;
			margin-left: 80rpx;
			position: relative;
			&.on{
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				&::after{
					content:"";
					position: absolute;
					bottom:-8rpx;
					left:50%;
					z-index: 50;
					width: 40rpx;
					height: 2rpx;
					background-color:#FE694F;
					transform: translate(-50%);
				}
			}
		}
	}
	.list{
		padding: 28rpx 0;
	}
</style>
