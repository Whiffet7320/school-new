<template>
	<view>
		<search-navbar :value="seakey"></search-navbar>
		<view class="seatabbox">
			<view class="tab_item" :class="{'on':cur===index}" v-for="(item,index) in tablist" :key="index" @click="onTab(item,index)">{{item}}</view>
		</view>
		<view class="prolist">
			<view class="item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
				<image src="" mode="aspectFill" class="img"></image>
				<view class="title u-line-2">{{item.title}}</view>
				<view class="ft">
					<view class="avatar">
						<image src="" mode="aspectFit" class="img"></image>
						<text>小小丢</text>
					</view>
					<view class="service"><image src="" mode="aspectFit" style="width: 33rpx;height:33rpx;"></image></view>
				</view>
			</view>
		</view>
		<page-service :show="modShow" @change="onChange"></page-service>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import searchNavbar from "@/components/search-navbar/search-navbar";
	import pageService from "@/components/page-service/page-service";
	export default{
		components:{
			searchNavbar,
			pageService
		},
		data(){
			return{
				modShow:false,
				cur:0,
				tablist:["帮帮拾物","帮帮失物"],
				list:[
					{
						title:"校园长廊上拾到便携充电宝一个带数据线",
						avatar:""
					},
					{
						title:"校园长廊上拾到便携充电宝一个带数据线",
						avatar:""
					}
				]
			}
		},
		computed: {
			...mapState({
				seakey:state=>state.seakey
			})
		},
		methods:{
			onChange(val){
				this.modShow = val;
			},
			onTab(item,index){
				this.cur = index;
			},
			goDetail(item){
				uni.navigateTo({
					url:"/pages/lost/detail?id="+item.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.seatabbox{
		width: 100%;
		height: 102rpx;
		background: #f7f8fa;
		display: flex;
		align-items: center;
		.tab_item{
			flex: 1;
			font-size: 32rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: center;
			color: #000000;
			position: relative;
			&.on{
				&::after{
					content:"";
					position: absolute;
					bottom:-12rpx;
					left:50%;
					z-index: 50;
					width: 40rpx;
					height: 2rpx;
					background-color:#165FF9;
					transform: translateX(-50%);
				}
			}
		}
	}
	.prolist{
		width: 100%;
		background-color: #FFFFFF;
		padding:32rpx 0;
		display: flex;
		flex-wrap: wrap;
		.item{
			flex:1;
			padding:0 24rpx;
			box-sizing: border-box;
			.img{
				width: 100%;
				height: 256rpx;
			}
			.title{
				width: 100%;
				margin:16rpx 0 12rpx 0;
				height: 68rpx;
				overflow: hidden;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #131313;
			}
			.ft{
				display: flex;
				align-items: center;
				.avatar{
					flex:1;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
					.img{
						width: 60rpx;
						height: 60rpx;
						background-color: #eee;
						border-radius: 50%;
						margin-right: 12rpx;
					}
				}
			}
		}
	}
</style>
