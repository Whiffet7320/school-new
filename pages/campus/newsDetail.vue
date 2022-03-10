<template>
	<view class="detail">
		<view class="title">{{info.title}}</view>
		<view class="author">
			<view class="name">广科帮帮平台发布</view>
			<view class="time">{{info.add_time}}</view>
		</view>
		<view class="u-content">
			<u-parse :html="info.content"></u-parse>
		</view>
		<view class="imglist" v-if="info.imgPath">
			<view class="item" v-for="(pitem,indexa) in info.imgPath" :key="indexa" @click="previewImage(info.imgPath,indexa)">
				<image :src="pitem" mode="widthFix" class="img"></image>
			</view>
		</view>
		<u-gap height="100"></u-gap>
		<view class="footbar">
			<view class="left">{{info.read_num}}人阅读</view>
			<view class="right">
				<view class="zan on" v-if="info.is_zan==1">
					<u-icon name="heart-fill" size="26" color="#FE694F"></u-icon>
					<text class="text">{{info.zan_count}}</text>
				</view>
				<view class="zan" v-if="info.is_zan==0" @click.stop="onZan(id)">
					<u-icon name="heart" size="26" color="#848484"></u-icon>
					<text class="text">{{info.zan_count}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default{
		data(){
			return{
				id:0,
				info:{
					title:"",
					add_time:"",
					content:""
				}
			}
		},
		computed: {
			...mapState({
				newsArticle:state => state.newsArticle
			})
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
					}
				})
			},
			onZan(id){
				this.$api.zan({id:id,type:"article"}).then((res)=>{
					if(res.code==200){
						this.info.is_zan = 1;
						this.info.zan_count++;
						uni.showToast({
							title:"点赞成功",
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
		},
		onLoad(option){
			if(option.id){
				this.id = option.id;
				this.getDetail();
			}
		}
	}
</script>
<style>
	page{
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.detail{
		padding:48rpx 22rpx;
		.title{
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #000000;
		}
		.author{
			display: flex;
			align-items: center;
			margin:32rpx 0 48rpx 0;
			font-size: 28rpx;
			.name{
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #FE694F;
			}
			.time{
				margin-left: 16rpx;
				color: #b3b3b3;
			}
		}
		.u-content{
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			color: #060606;
		}
		.imglist{
			padding-top: 12rpx;
			display: flex;
			flex-direction: column;
			.item{
				width: 100%;
				min-height: 200rpx;
				text-align: center;
				padding-bottom: 40rpx;
			}
		}
		.footbar{
			position: fixed;
			bottom: 0;
			left:0;
			z-index: 50;
			width: 100%;
			height: 80rpx;
			padding: 0 22rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: rgba(0,0,0,0.3);
			.left{
				flex:1;
			}
			.zan{
				.text{
					margin-left: 10rpx;
				}
				&.on{
					color: #FE694F;
				}
			}
		}
	}
</style>
