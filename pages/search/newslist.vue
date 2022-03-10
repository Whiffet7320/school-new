<template>
	<view>
		<view class="searchwrp">
			<view class="searchbox">
				<image src="/static/images/icon_search.png" mode="aspectFit" class="icon"></image>
				<input type="text" v-model="value" placeholder="请输入新闻关键词" placeholder-style="color:#B3B3B3;" />
			</view>
			<view class="seabtn" @click="onSearch">搜索</view>
		</view>
		<u-gap height="116"></u-gap>
		<view class="sealist" v-if="list.length">
			<view class="text" v-for="(item,index) in list" :key="index" @click="onDetail(item)">{{item.title}}</view>
		</view>
		<view class="empty" v-if="total==0">暂无搜索结果</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				value:"",
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
				},
				total:-1
			}
		},
		methods:{
			onSearch(){
				if(this.value!==""){
					this.loadData();
				}
			},
			onDetail(val){
				if(val.tag=="news"){
					this.$store.commit("setNewsarticle",val);
					uni.navigateTo({
						url:"/pages/campus/newsDetail?id="+val.id
					})
				}else if(val.tag=="advice"){
					uni.navigateTo({
						url:"/pages/campus/adviceDetail?id="+val.id
					})
				}
				this.value = "";
				this.list = [];
				this.current_page = 1;
				this.reload = true;
			},
			async loadData(){
				this.$api.getarticle({keyword:this.value}).then((res)=>{
					if(res.code==200){
						uni.stopPullDownRefresh();
						this.total = res.data.total;
						this.list = this.reload ? res.data.data : this.list.concat(res.data.data);
						this.current_page = res.data.current_page; //当前页码
						this.last_page = res.data.last_page; //总页码
						this.status = res.data.total == 0 ? 'nomore' : 'more';
					}
				})
			}
		},
		onShow(){
			if(this.value!==""){
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
				this.loadData();
			}
		},
		onPullDownRefresh() {
			if(this.value!==""){
				this.current_page = 1;
				this.reload = true;
				this.loadData();
			}
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

<style lang="scss" scoped>
	.searchwrp{
		padding: 20rpx 24rpx 32rpx;
		display: flex;
		align-items: center;
		width: 100%;
		position: fixed;
		top:0;
		left:0;
		z-index: 50;
		.searchbox{
			display: flex;
			align-items: center;
			width: 600rpx;
			height: 64rpx;
			background: #f1f1f1;
			border-radius: 32rpx;
			padding: 0 32rpx;
			font-size: 22rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
			input{
				flex:1;
			}
			.icon{
				width: 25rpx;
				height: 25rpx;
				margin-right: 13rpx;
			}
		}
		.seabtn{
			padding-left: 30rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
		}
	}
	.sealist{
		padding:0 25rpx;
		.text{
			padding: 40rpx 0 30rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
			border-bottom: 2rpx solid #f2f2f2;
			&:first-child{
				padding:0 0 30rpx;
			}
		}
	}
	.empty{
		width: 100%;
		height: 300rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #707070;
	}
</style>
