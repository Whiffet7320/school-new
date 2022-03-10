<template>
	<view class="index">
		<Navtop title="通知信息" ></Navtop>
		
		<view class="Notify" @click="toXiangqin(item)" v-for="(item,index) in list" :key="item.id">
			<view class="Time">
				{{item.relation_info.add_time}}
			</view>
			<view class="About">
				<view class="NotPic">
					<image src="/static/user/tongzhixinx.png"></image>
				</view>
				<view class="Infos">
					<view class="Title">
						{{item.title}}
					</view>
					<view class="Cont">
						{{item.relation_info.content}}
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" />
		
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				list:[],
				// 加载
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '正在加载...',
					nomore: '没有了更多了'
				},
			}
		},
		computed: {
			...mapState(["xiaoxiPage", "xiaoxiPageSize"]),
		},
		watch: {
			xiaoxiPage: function(page) {
				console.log('ddpage')
				this.$store.commit("xiaoxiPage", page);
				if (this.xiaoxiPage != 1) {
					this.getData();
				}
			},
		},
		onLoad() {
			
		},
		onShow() {
			this.$store.commit("isShudong", false);
			this.$store.commit('firstMusicTime',true);
			this.$innerAudioContext.stop()
			
			this.list = [];
			this.$store.commit("xiaoxiPage", 1);
			this.getData();
		},
		onReachBottom() {
			this.$store.commit("xiaoxiPage", this.xiaoxiPage + 1);
		},
		methods: {
			async getData(){
				this.status = 'loading';
				setTimeout(async () => {
					const res = await this.$api.unread_comment_list({
						page: this.xiaoxiPage,
						limit: this.xiaoxiPageSize,
					})
					if (res.data.data.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.list = this.list.concat(res.data.data)
						this.list.forEach(ele => {
							ele.title = ele.type.indexOf('shudong') > -1 ? '你有一条来自树洞的消息' : ele.type == 'gaobaiComment' ? '你有一条来自表白墙的消息' : ele.type.indexOf('jishi') > -1 ? '你有一条来自集市的消息' : ele.type.indexOf('baoxiu') > -1 ? '你有一条来自报修的消息' : ele.type.indexOf('fengjing') > -1 ? '你有一条来自风景的消息' : ele.type.indexOf('pinche') > -1 ? '你有一条来自拼车的消息' :  ele.type.indexOf('pindan') > -1 ? '你有一条来自拼单的消息' : ele.type.indexOf('shougou') > -1 ? '你有一条来自失物招领的消息' : ''
						})
					}
				}, 200)
				console.log(this.list)
			},
			async toXiangqin(item){
				console.log(item)
				this.$api.zero_unread_comment({id:item.id}).then((res)=>{
					console.log(res)
					if(item.type.indexOf('shudong') > -1 ){
						uni.navigateTo({
							url: `/pages/index/shudong/xiangqin?id=${item.pid}`
						})
						this.list = [];
					}else if(item.type == 'gaobaiComment' ){
						uni.navigateTo({
							url: `/pages/index/xiaoyuanbiaobai/xiangqin?id=${item.pid}`
						})
						this.list = [];
					}else if(item.type == 'jishiComment' || item.type == 'jishiCommentReply'){
						this.$api.getjshiDetail(item.pid).then((res)=>{
							uni.navigateTo({
								url: `/pages/index/detail/detail?id=${item.pid}&type=jishi&stype=${res.data.type}`
							})
							this.list = [];
						})
					}else if(item.type == 'fengjingComment' || item.type == 'fengjingCommentReply'){
						uni.navigateTo({
							url: `/pages/campus/comment?id=${item.pid}`
						})
						this.list = [];
					}else if(item.type == 'baoxiuComment' || item.type == 'baoxiuCommentReply'){
						uni.navigateTo({
							url: `/pages/index/detail/detail?id=${item.pid}&type=baoxiu`
						})
						this.list = [];
					}else if(item.type == 'pindanComment' || item.type == 'pindanCommentReply'){
						uni.navigateTo({
							url: `/pages/index/detail/detail?id=${item.pid}&type=pindan`
						})
						this.list = [];
					}else if(item.type == 'pincheComment' || item.type == 'pincheCommentReply'){
						uni.navigateTo({
							url: `/pages/index/detail/detail?id=${item.pid}&type=pinche`
						})
						this.list = [];
					}else if(item.type == 'shougouComment' || item.type == 'shougouCommentReply'){
						this.$api.getsgDetail(item.pid).then((res)=>{
							uni.navigateTo({
								url: `/pages/index/detail/detail?id=${item.pid}&type=shougou&stype=${res.data.type}`
							})
							this.list = [];
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		background-color: #F9F9F9;
	}
	/deep/ .u-load-more-wrap {
		height: 100rpx !important;
	}
	.index{
		width: 100%;
		height: 100%;
		.Notify{
			display: flex;
			flex-direction: column;
			.Time{
				margin: 24rpx auto;
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
			.About{
				display: flex;
				.NotPic{
					display: flex;
					margin: 0 22rpx 0 52rpx;
					image{
						width: 56rpx;
						height: 56rpx;
					}
				}
				.Infos{
					width: 594rpx;
					height: 232rpx;
					background: #ffffff;
					display: flex;
					flex-direction: column;
					.Title{
						margin-left: 30rpx;
						display: flex;
						align-items: center;
						width: 560rpx;
						height: 77rpx;
						border-bottom: 2rpx solid #FAFBFF;
						font-size: 28rpx;
						font-weight: 500;
						color: #000000;
						&::before{
							content: "";
							display: flex;
							align-items: center;
							width: 0;
							height: 0;
							border-top: 10rpx solid transparent;
							border-bottom: 10rpx solid transparent;
							border-right: 15rpx solid #ffffff;
							position: absolute;
							left: 0;
							margin-left: 115rpx;
						}
					}
					.Cont{
						width: 538rpx;
						height: 95rpx;
						margin: 24rpx auto 27rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
						font-size: 24rpx;
						font-weight: 400;
						color: #999999;
					}
				}
			}
			
		}
	}

</style>
