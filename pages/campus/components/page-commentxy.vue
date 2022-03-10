<template>
	<view class="comment_list">
		<view class="comment_item" v-for="(item,index) in list" :key="index" @click="goComment(item)">
			<view class="woobox">
				<image :src="item.avatar_url" mode="aspectFill" class="img"></image>
				<view class="woobox_flex">
					<view class="name">{{item.sender_name}}</view>
					<view class="desc">发布于{{item.add_time}}</view>
				</view>
			</view>
			<view class="feed_content">
				<view class="feed_item" v-if="isDetail">{{item.description==null?"":item.description.replace(/\r\n|\n|\r/g,"\n")}}</view>
				<view class="feed_item u-line-4" v-else>{{item.description==null?"":item.description.replace(/\r\n|\n|\r/g,"\n")}}</view>
				<view class="imglist" v-if="item.img_paths!==''">
					<view class="item" v-for="(pitem,indexz) in item.imgPath" :key="indexz" @click.stop="previewImage([item.imgPath,indexz])">
						<image :src="pitem" mode="aspectFill" class="img"></image>
					</view>
				</view>
			</view>
			<view class="feed_ft">
				<view class="left"><view v-if="!isMe">【来自广科帮帮平台发布】</view></view>
				<view class="right">
					<view class="icon_l" v-if="isShow">
						<image src="/static/images/icon_time.png" mode="aspectFit" style="width: 23rpx;height: 23rpx;margin-right: 8rpx;"></image>
						<text>{{item.read_count||0}}</text>
					</view>
					<view class="icon_l" v-if="isShow">
						<image src="/static/images/icon_xin.png" mode="aspectFit" style="width: 32rpx;height: 26rpx;margin-right: 8rpx;"></image>
						<text>{{item.zan_count||0}}</text>
					</view>
					<view class="icon_l" v-if="isShow" @click.stop="goComment(item)">
						<image src="/static/images/icon_pl.png" mode="aspectFit" style="width: 30rpx;height: 23rpx;margin-right: 8rpx;"></image>
						<text>{{item.comment_count||0}}</text>
					</view>
					<view class="icon_l del" @click.stop="onDel(item.id,index)" v-if="isDel">
						<image src="/static/images/icon_delete.png" mode="aspectFit" style="width: 25rpx;height: 25rpx;margin-right: 8rpx;"></image>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:()=>{return []}
			},
			isMe:{
				type:Boolean,
				default:false
			},
			isDel:{
				type:Boolean,
				default:false
			},
			isDetail:{
				type:Boolean,
				default:false
			},
			isShow:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{}
		},
		methods:{
			previewImage(a){
				this.$emit('previewImage',a)
			},
			goComment(item){
				if(this.isDetail){
					return;
				}
				let array = [];
				array.push(item);
				// this.$store.commit("setArticle",array);
				uni.navigateTo({
					url:"/pages/campus/comment?id="+item.id
				})
			},
			onDel(id,index){
				let info = {id:id,index:index};
				this.$emit("ondel",info);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment_list{
		background-color: #FFFFFF;
		.comment_item{
			padding-bottom: 16rpx;
			&:last-child{
				padding-bottom: 0;
			}
			.woobox{
				display: flex;
				align-items: center;
				.img{
					width: 60rpx;
					height: 60rpx;
					background-color: #eee;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.woobox_flex{
					padding-left: 16rpx;
					.name{
						font-size: 28rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #010101;
					}
					.desc{
						margin-top: 8rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #000034;
					}
				}
			}
			.feed_content{
				padding-top: 20rpx;
				.feed_item{
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
					text-align: justify;
					word-wrap: break-word;
					word-break: break-all;
					word-break: break-word;
					white-space: pre-wrap;
					margin-bottom: 16rpx;
				}
				.imglist{
					display: flex;
					flex-wrap: wrap;
					.item{
						width: 214rpx;
						height: 214rpx;
						margin-right: 14rpx;
						margin-bottom: 24rpx;
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
			}
			.feed_ft{
				padding:0 0 24rpx 0;
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
						&.del{
							margin-left: 30rpx;
						}
					}
				}
			}
		}
	}
</style>
