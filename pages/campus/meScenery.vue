<template>
	<view>
		<page-nav :scrollTop="scrollTop" title="我的风景"></page-nav>
		<view class="list" v-if="list.length">
			<page-commentxy :list="list" @previewImage="previewImage" :isMe="true" :isDel="true" @ondel="onDelete"></page-commentxy>
			<u-loadmore :status="status" bg-color="#fff" color="#010101" font-size="20" margin-top="80" />
		</view>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import pageNav from "./components/page-nav";
	import pageCommentxy from "./components/page-commentxy";
	export default{
		components:{
			pageNav,
			pageCommentxy
		},
		data(){
			return{
				isOnShow:true,
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
			onDelete(val){
				let id = val.id;
				let index = val.index;
				uni.showModal({
					content:"确定是否删除？",
					confirmColor:"#fe694f",
					success: (res) => {
						if(res.confirm){
							this.$api.delfengjing(id).then((res)=>{
								if(res.code==200){
									this.list.splice(index,1);
									this.$store.commit("setAdd",true);
									uni.showToast({
										title:res.message,
										icon:"none"
									})
								}else{
									uni.showToast({
										title:res.message,
										icon:"none"
									})
								}
							})
						}
					}
				})
			},
			loadData(){
				this.$api.getmylist({type:"fengjing",page:this.current_page,limit:10}).then((res)=>{
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
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
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
	.list{
		padding: 40rpx 24rpx;
		background-color: #FFFFFF;
	}
</style>