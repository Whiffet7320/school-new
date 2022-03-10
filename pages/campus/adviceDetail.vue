<template>
	<view class="detail">
		<view class="title">{{info.title}}</view>
		<view class="desc" v-if="info.content!=null && info.content!=''">
			<u-parse :html="info.content"></u-parse>
		</view>
		<view class="imglist" v-if="info.imgPath">
			<view class="item" v-for="(pitem,indexa) in info.imgPath" :key="indexa" @click="previewImage(info.imgPath,indexa)">
				<image :src="pitem" mode="aspectFill" class="img"></image>
			</view>
		</view>
		<view class="time">
			<image src="/static/images/icon_time.png" mode="aspectFit" class="icon"></image>
			<text>{{info.add_time}}</text>
		</view>
		<view class="comment_wrap">
			<view class="total">共{{total}}条评论</view>
			<view class="commlist" v-if="jlist.length>0">
				<view class="commitem" v-for="(item,index) in jlist" :key="index" @click="onSubreplay(item)">
					<image :src="item.avatar_url" mode="aspectFill" class="img"></image>
					<view class="info">
						<view class="hd">
							<view class="name">{{item.nickname}}</view>
							<view class="time">{{$tools.timeago(Date.parse(new Date(item.add_time.replace(/-/g, '/'))))}}</view>
							<!-- <view class="toolicon">
								<view class="zan" :class="[item.is_zan==1?'on':'']" @click.stop="onZan(item)">
									<u-icon name="heart" size="26" color="#FE694F" v-if="item.is_zan==1"></u-icon>
									<u-icon name="heart" size="26" color="#848484" v-if="item.is_zan==0"></u-icon>
									<text class="text">{{item.zan_count}}</text>
								</view>
							</view> -->
						</view>
						<view class="desc">{{item.content}}</view>
						<view class="replaylist" v-if="item.comment_reply_list.length">
							<view class="replay_item" v-for="(pitem,indexz) in item.comment_reply_list" :key="indexz">
								<image :src="pitem.avatar_url" mode="aspectFill" class="img"></image>
								<view class="info">
									<view class="hd">
										<view class="name">{{pitem.nickname}}</view>
									</view>
									<view class="desc">{{pitem.content}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="empty" v-if="jlist.length==0">暂时没有评论</view>
		</view>
		<page-ftcomment :list="info" :isShow="false" :total="total" @change="onChange" @reply="onReply"></page-ftcomment>
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
	import pageFtcomment from "@/components/page-foot/page-ftcomment";
	export default{
		components:{
			pageFtcomment
		},
		data(){
			return{
				sid:0,
				id:0,
				info:{},
				scrollTop:0,
				popShow:false,
				comments:"",
				total:0,
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
			getDetail(){
				this.$api.articleDetail(this.id).then((res)=>{
					if(res.code==200){
						let data = res.data;
						if(data.img_paths){
							data.imgPath = data.img_paths.split(",");
							data.imgPath.forEach((img, i) => {
								this.$set(data.imgPath, i, this.$tools.imgUrl(img))
							})
						}
						this.info = data;
						this.getcomtlist();
					}
				})
			},
			previewImage(arr,index) {
				uni.previewImage({
					urls: arr,
					current: index,
					indicator: 'default',
					loop: true,
					fail(err) {
						console.log('previewImage出错', urls, err)
					},
				})
			},
			getcomtlist(){
				this.$api.comment_list({id:this.id,type:"article",page:this.current_page,limit:10}).then((res)=>{
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
				this.$api.comment_zan({id:item.id,type:"article"}).then((res)=>{
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
				if (this.info.is_zan == 0) {
					this.info.is_zan = true;
					this.info.zan_count++;
				}else{
					this.info.is_zan = false;
					this.info.zan_count--;
				}
				this.$api.zan({id:id,type:"article"}).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:res.message,
							icon:"none"
						})
						this.$store.commit("setAdd",true);
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
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
						this.$api.comment_reply({id:this.sid,type:"article",content:this.comments}).then((res)=>{
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
						this.$api.comment({id:this.id,type:"article",content:this.comments}).then((res)=>{
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
		onLoad(option){
			if(option.id){
				this.id = option.id;
				this.getDetail();
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

<style lang="scss" scoped>
	@import "@/common/css/spell/commentWrap.scss";
	.detail{
		padding: 24rpx;
	}
	.title{
		font-family: PingFang SC, PingFang SC-Bold;
		font-weight: 700;
		font-size: 30rpx;
		color: #000000;
		padding-bottom: 24rpx;
	}
	.desc{
		font-size: 28rpx;
		color: #666;
	}
	.imglist{
		padding-top: 12rpx;
		display: flex;
		flex-wrap: wrap;
		.item{
			width: 224rpx;
			height: 224rpx;
			margin-right: 14rpx;
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
	.time{
		padding:12rpx 0 20rpx 0;
		display: flex;
		align-items: center;
		font-size: 20rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		color: #848484;
		.icon{
			width: 20rpx;
			height: 20rpx;
			margin-right: 17rpx;
		}
	}
	.comment_wrap{
		padding: 20rpx 0;
	}
</style>
