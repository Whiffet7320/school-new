<template>
	<view class="container spell">
		<view class="tip">温馨提示：点击展示框进行<text class="red">查看详情</text>，向左滑动进行<text class="red">下架</text>（如果您不想拼单可以进行下架，下架后其他用户将不会看到您的个人信息）；</view>
		<view class="ulist">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item,index) in list" :key="index">
					<view class="uitem" @click="goDetail(item)">
						<view class="hd">
							<image :src="item.avatar_url" mode="aspectFit" class="img"></image>
							<view class="info">
								<view class="name">{{item.nickname}}</view>
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
						<view class="content">
							<view class="conitem">
								<image src="/static/images/icon_gifts.png" mode="aspectFit" style="width: 32rpx;height: 32rpx;margin-right: 13rpx;"></image>
								<view class="text">
									<text class="bold">【物品】：</text>
									<view class="sub u-line-2">{{item.product_name}}</view>
								</view>
							</view>
							<view class="conitem" v-if="item.description">
								<image src="/static/images/icon_ends.png" mode="aspectFit" style="width: 32rpx;height: 32rpx;margin-right: 13rpx;"></image>
								<view class="text">
									<text class="bold">【描述】：</text>
									<view class="sub u-line-2">{{item.description}}</view>
								</view>
							</view>
							<view class="conitem" v-if="item.remark">
								<image src="/static/images/icon_bz.png" mode="aspectFit" style="width: 32rpx;height: 32rpx;margin-right: 13rpx;"></image>
								<view class="text">
									<text class="bold">【备注】：</text>
									<view class="sub u-line-2">{{item.remark}}</view>
								</view>
							</view>
							<view class="imglist" v-if="item.img_paths!==''">
								<view class="item" v-for="(pitem,indexz) in item.imgPath" :key="indexz" @click="previewImage(item.imgPath,indexz)">
									<image :src="pitem" mode="aspectFill" class="img"></image>
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
				scrollTop:0,
				list:[],
				// 加载
				reload: false, //判断是否上拉
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
		methods:{
			previewImage(urls,index) {
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
			bindClick(e,index){
				let id = this.list[index].id;
				this.$api.delbaoxiu(id).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:"下架成功",
							icon:"none"
						})
						this.list.splice(index,1);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			loadData(){
				this.$api.getmylist({type:"baoxiu",page:this.current_page,limit:10}).then((res)=>{
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
				// this.$store.commit("setDetail",item);
				uni.navigateTo({
					url:"/pages/index/detail/detail?id="+item.id+"&type=baoxiu"
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
</style>
