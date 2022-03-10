<template>
	<view class="container spell">
		<view class="tip">温馨提示：点击展示框进行<text class="red">查看详情</text>，向左滑动进行<text class="red">下架</text>（如果您不想让用户看到可以进行下架，下架后其他用户将不会看到您的个人信息）；</view>
		<view class="ulist">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item,index) in list" :key="index">
					<view class="uitem" @click="goDetail(item)">
						<view class="content">
							<view class="advice_title">{{item.title}}</view>
							<view class="advice_desc u-line-4">{{item.content}}</view>
							<view class="imglist" v-if="item.imgPath">
								<view class="item" v-for="(pitem,indexa) in item.imgPath" :key="indexa" @click="previewImage(item.imgPath,indexa)">
									<image :src="pitem" mode="aspectFill" class="img"></image>
								</view>
							</view>
							<view class="ft">
								<view class="left">{{item.add_time}}</view>
								<view class="right">
									<view class="icon_l">
										<image src="/static/images/icon_time.png" mode="aspectFit" style="width: 23rpx;height: 23rpx;margin-right: 8rpx;"></image>
										<text>{{item.read_count||0}}</text>
									</view>
									<view class="icon_l">
										<image src="/static/images/icon_xin.png" mode="aspectFit" style="width: 32rpx;height: 26rpx;margin-right: 8rpx;"></image>
										<text>{{item.zan_count||0}}</text>
									</view>
									<view class="icon_l">
										<image src="/static/images/icon_pl.png" mode="aspectFit" style="width: 30rpx;height: 23rpx;margin-right: 8rpx;"></image>
										<text>{{item.comment_count||0}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<template v-slot:right>
						<view class="slotbtn" @click="bindClick('del',index)">
							<text class="slotbtn-text">下架</text>
						</view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<u-loadmore :status="status" bg-color="#f7f8fa" color="#010101" font-size="20" margin-top="50" />
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				isOnShow:true,
				scrollTop:0,
				type:"advice",
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
			bindClick(e,index){
				let id = this.list[index].id;
				this.$api.delarticle(id).then((res)=>{
					if(res.code==200){
						this.list.splice(index,1);
						this.$store.commit("setAdd",true);
						uni.showToast({
							title:"下架成功",
							icon:"none"
						})
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			loadData(){
				this.$api.getmylist({params:this.type,type:"article",page:this.current_page,limit:10}).then((res)=>{
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
			},
			goDetail(item){
				if(this.type=="news"){
					this.$store.commit("setNewsarticle",item);
					uni.navigateTo({
						url:"/pages/campus/newsDetail?id="+item.id
					})
				}else{
					uni.navigateTo({
						url:"/pages/campus/adviceDetail?id="+item.id
					})
				}
			},
			previewImage(urls,index){
				this.isOnShow = false;
				uni.previewImage({
					urls: urls,
					current: index,
					indicator: 'default',
					loop: true,
					fail(err) {
						console.log('previewImage出错', urls, err)
					},
				})
			},
			setTitle(type){
				if(type=="news"){
					uni.setNavigationBarTitle({
						title:"我的新闻"
					})
				}else{
					uni.setNavigationBarTitle({
						title:"我的咨询"
					})
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(option){
			if(option.type){
				this.type = option.type;
				this.setTitle(option.type);
			}
			this.list = [];
			this.current_page = 1;
			this.last_page = 1;
			this.loadData();
		},
		onShow(){
			if(!this.isOnShow){
				return
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
		background: #f7f8fa;
	}
</style>
<style lang="scss" scoped>
	@import "@/common/css/spell/index.scss";
	.container{
		padding: 0 26rpx;
	}
	.advice_title{
		font-size: 24rpx;
		color: #000000;
		font-weight: bold;
		padding-top: 16rpx;
		padding-bottom: 12rpx;
	}
	.advice_desc{
		font-size: 20rpx;
		color: #666666;
	}
	.imglist{
		padding: 30rpx 0 16rpx 0;
		display: flex;
		flex-wrap: wrap;
		.item{
			width: 206rpx;
			height: 206rpx;
			margin-right: 22rpx;
			margin-bottom: 14rpx;
			background-color: #eee;
			.img{
				width: 100%;
				height: 100%;
			}
			&:nth-child(3n){
				margin-right: 0;
			}
		}
	}
	.ft{
		padding: 14rpx 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		font-size: 20rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #b3b3b3;
		.right{
			display: flex;
			align-items: center;
			.icon_l{
				display: flex;
				align-items: center;
				margin-left: 12rpx;
			}
		}
	}
</style>
