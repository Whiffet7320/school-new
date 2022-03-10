<template>
	<view>
		<page-nav :scrollTop="scrollTop" :title="title"></page-nav>
		<view class="list">
			<page-commentxy :list="list" @previewImage="previewImage" :isShow="false" :isDetail="true" :isDel="isDel" @ondel="onDelete"></page-commentxy>
			<view class="commentlist">
				<view class="total">共{{total}}条评论</view>
				<view class="comment_list">
					<view class="litem" v-for="(item,index) in jlist" :key="index" @click="onSubreplay(item)">
						<image :src="item.avatar_url" mode="aspectFill" class="img"></image>
						<view class="info">
							<view class="hd">
								<view class="left">
									<text class="name">{{item.nickname}}</text>
									<text>{{$tools.timeago(Date.parse(new Date(item.add_time.replace(/-/g, '/'))))}}</text>
								</view>
							</view>
							<view class="ft">
								<view class="desc">{{item.content}}</view>
								<view class="toolicon">
									<view class="zan" :class="[item.is_zan==1?'on':'']" @click.stop="onZan(item)">
										<u-icon name="heart" size="26" color="#FE694F" v-if="item.is_zan==1"></u-icon>
										<u-icon name="heart" size="26" color="#848484" v-if="item.is_zan==0"></u-icon>
										<text class="text">{{item.zan_count}}</text>
									</view>
									<view class="zan">
										<u-icon name="chat" size="26" color="#848484"></u-icon>
										<text class="text">{{item.comment_reply_list.length}}</text>
									</view>
								</view>
							</view>
							<view class="feedback" @click.stop="onSubreplay(item)">回复</view>
							<view class="replaylist" v-if="item.comment_reply_list.length">
								<view class="replay_item" v-for="(pitem,indexz) in item.comment_reply_list" :key="indexz">
									<image :src="pitem.avatar_url" mode="aspectFill" class="img"></image>
									<view class="info">
										<view class="hd">
											<text class="name">{{pitem.nickname}}</text>
											<text>{{$tools.timeago(Date.parse(new Date(pitem.add_time.replace(/-/g, '/'))))}}</text>
										</view>
										<view class="desc">{{pitem.content}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" margin-top="100" />
			</view>
		</view>
		<page-ftcomment :list="list[0]" :total="total" @change="onChange" @reply="onReply"></page-ftcomment>
		<u-popup v-model="popShow" mode="bottom" :closeable="false" :safe-area-inset-bottom="true" border-radius="0">
			<view class="commentModal">
				<view class="utext" :class="{'on':comments==''}">
					<textarea v-model="comments" class="replytext" />
				</view>
				<view class="comtbtn">
					<view class="btns" @click.stop="onSubmit">提交</view>
				</view>
			</view>
		</u-popup>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import pageNav from "./components/page-nav";
	import pageCommentxy from "./components/page-commentxy";
	import pageFtcomment from "@/components/page-foot/page-ftcomment";
	export default{
		components:{
			pageNav,
			pageCommentxy,
			pageFtcomment
		},
		computed: {
			...mapState({
				article:state => state.article
			})
		},
		data(){
			return{
				isOnShow:true,
				uid:0,
				isDel:false,
				id:0,
				sid:0,
				title:"",
				scrollTop:0,
				list:[],
				total:0,
				mshow:false,
				modshow:false,
				popShow:false,
				comments:"",
				isZan:false,
				jlist:[],
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
			getUserInfo(){
				this.$api.userInfo().then((res)=>{
					if(res.code==200){
						this.uid = res.data.uid;
					}
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
				// if(this.article.length){
				// 	this.list = this.article;
				// 	this.title = this.article[0].sender_name+"发布的风景";
				// }
				this.$api.getfengjingDetail(this.id).then((res)=>{
					if(res.code==200){
						let data = res.data;
						if(this.uid == data.user_id){
							this.isDel = true;
						}
						if(data.img_paths){
							data.imgPath = data.img_paths.split(",");
							data.imgPath.forEach((img, i) => {
								this.$set(data.imgPath, i, this.$tools.imgUrl(img))
							})
						}
						let array = [];
						array.push(data)
						this.list = array;
						this.title = res.data.sender_name+"发布的风景";
						this.getcomtlist();
					}
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
			getcomtlist(){
				this.$api.comment_list({id:this.id,type:"fengjing",page:this.current_page,limit:10}).then((res)=>{
					if(res.code==200){
						uni.stopPullDownRefresh();
						this.jlist = this.reload ? res.data.data : this.jlist.concat(res.data.data);
						this.current_page = res.data.current_page; //当前页码
						this.last_page = res.data.last_page; //总页码
						this.status = res.data.total == 0 ? 'nomore' : 'more';
						this.total = res.data.total;
					}
				})
			},
			async onZan(item){
				if (item.is_zan == 0) {
					item.is_zan = true;
					item.zan_count++;
					this.isZan = item.is_zan;
				}else{
					item.is_zan = false;
					item.zan_count--;
					this.isZan = item.is_zan;
				}
				this.$api.comment_zan({id:item.id,type:"fengjing"}).then((res)=>{
					if(res.code==200){
						if(this.isZan){
							uni.showToast({
								title:"点赞成功",
								icon:"none"
							})
						}else{
							uni.showToast({
								title:"取消点赞",
								icon:"none"
							})
						}
						this.$store.commit("setAdd",true);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			onChange(id){
				if (this.list[0].is_zan == 0) {
					this.list[0].is_zan = true;
					this.list[0].zan_count++;
				}else{
					this.list[0].is_zan = false;
					this.list[0].zan_count--;
				}
				this.$api.zan({id:id,type:"fengjing"}).then((res)=>{
					if(res.code==200){
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
				this.$store.commit("setAdd",true);
			},
			onSubreplay(val){
				this.sid = val.id;
				this.popShow = true;
			},
			onReply(val){
				this.sid = 0;
				this.popShow = true;
			},
			onSubmit(){
				if(this.comments==""){
					uni.showToast({
						title:"请写下您的想法",
						icon:"none"
					})
				}else{
					if(this.sid>0){
						this.$api.comment_reply({id:this.sid,type:"fengjing",content:this.comments}).then((res)=>{
							if(res.code==200){
								uni.showToast({
									title:"评论成功",
									icon:"none"
								})
								this.comments = "";
								this.popShow = false;
								this.reload = true;
								this.current_page = 1;
								this.getcomtlist();
								this.$store.commit("setAdd",true);
							}else{
								uni.showToast({
									title:res.message,
									icon:"none"
								})
							}
						})
					}else{
						this.$api.comment({id:this.id,type:"fengjing",content:this.comments}).then((res)=>{
							if(res.code==200){
								uni.showToast({
									title:"评论成功",
									icon:"none"
								})
								this.comments = "";
								this.popShow = false;
								this.reload = true;
								this.current_page = 1;
								this.getcomtlist();
								this.$store.commit("setAdd",true);
							}else{
								uni.showToast({
									title:res.message,
									icon:"none"
								})
							}
						})
					}
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(options){
			if(options.id){
				this.id = options.id;
				this.getUserInfo();
				this.loadData();
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
	.commentlist{
		.total{
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
		}
		.comment_list{
			.litem{
				padding: 22rpx 0;
				border-bottom: 2rpx solid #f2f2f2;
				display: flex;
				&:last-child{
					border-bottom: 0;
				}
				.img{
					width: 62rpx;
					height: 62rpx;
					background-color: #eee;
					border-radius: 50%;
				}
				.info{
					flex:1;
					padding-left: 10rpx;
					.hd{
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #b3b3b3;
						.name{
							margin-right: 48rpx;
						}
						.left{
							flex:1;
						}
					}
					.ft{
						display: flex;
						justify-content: space-between;
					}
					.desc{
						margin-top: 10rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #000000;
					}
					.feedback{
						margin-top: 10rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #999;
					}
					.toolicon{
						margin-top: 10rpx;
						display: flex;
						align-items: flex-start;
						.zan{
							display: flex;
							align-items: center;
							color: #848484;
							margin-left:10rpx;
							.text{
								font-size: 20rpx;
								font-family: PingFang SC, PingFang SC-Regular;
								font-weight: 400;
								margin-left: 7rpx;
							}
							&.on{
								color:#FE694F;
							}
						}
					}
					.replaylist{
						margin-top: 20rpx;
						.replay_item{
							display: flex;
							margin-bottom: 20rpx;
							.info{
								.hd{
									justify-content: flex-start;
								}
							}
						}
					}
				}
			}
		}
	}
	.commentModal{
		width: 100%;
		padding: 20rpx;
		.utext{
			width: 100%;
			padding: 20rpx;
			height: 200rpx;
			background: #f1f1f1;
			border-radius: 10rpx;
			.replytext{
				width: 100%;
				height: 100%;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Regular;
				font-weight: 400;
				color: #000000;
				text-align: justify;
			}
			&.on{
				.replytext::after{
					content:"禁止发布内容和分类不符、营销推广类等内容，平台已引入AI智能机器人对您发布的信息进行自动检测，同时平台将加强巡查力度，整治不合规信息。";
					font-size: 24rpx;
					color:#8f8f8f;
				}
			}
		}
		.comtbtn{
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
			.btns{
				font-size: 24rpx;
				color:#FFFFFF;
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				background-color: #FE694F;
				border-radius: 12rpx;
				text-align: center;
			}
		}
	}
</style>