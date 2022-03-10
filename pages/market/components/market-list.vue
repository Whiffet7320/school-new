<template>
	<view class="comment_list">
		<view class="comment_item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
			<view class="woobox">
				<image :src="item.avatar_url" mode="aspectFill" class="img"></image>
				<view class="woobox_flex">
					<view class="name" v-if="item.is_anonymous==0">{{item.nickname}}</view>
					<view class="name" v-if="item.is_anonymous==1">*****</view>
					<view class="desc">
						<text v-if="item.type==1">#帮帮收购</text>
						<text v-if="item.type==2">#帮帮转卖</text>
						<text class="text">{{item.device|getDevice}}</text>
					</view>
				</view>
			</view>
			<template v-if="item.type==1">
				<view class="feed_content">
					<view class="feed_item">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_sg.png" mode="aspectFit" style="width: 34rpx;height: 32rpx;"></image>收物】：</view>
							<view class="sub u-line-2">{{item.product_name}}</view>
						</view>
					</view>
					<view class="feed_item">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_sg.png" mode="aspectFit" style="width: 34rpx;height: 32rpx;"></image>收价】：</view>
							<view class="sub u-line-2">{{item.price}}</view>
						</view>
					</view>
					<view class="feed_item" v-if="item.description">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_sg.png" mode="aspectFit" style="width: 34rpx;height: 32rpx;"></image>描述】：</view>
							<view class="sub u-line-3">{{item.description}}</view>
						</view>
					</view>
					<view class="feed_item" v-if="item.remark">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_sg.png" mode="aspectFit" style="width: 34rpx;height: 32rpx;"></image>备注】：</view>
							<view class="sub u-line-3">{{item.remark}}</view>
						</view>
					</view>
					<view class="tip">【请告知在广科帮帮平台上看到的】</view>
					<view class="tip call">
						<text class="text">想出的请同学点我</text>
						<view class="triangle-up"></view>
						<view class="triangle-up"></view>
						<view class="triangle-up"></view>
					</view>
					<u-gap height="2" bg-color="#f7f8fa" style="width: 230rpx;"></u-gap>
					<view class="imglist" v-if="item.img_paths!==''">
						<view class="item" v-for="(pitem,indexz) in item.imgPath" :key="indexz" @click="previewImage([item.imgPath,indexz])">
							<image :src="pitem" mode="aspectFill" class="img"></image>
						</view>
					</view>
				</view>
			</template>
			<template v-if="item.type==2">
				<view class="feed_content">
					<view class="feed_item">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_zm.png" mode="aspectFit" style="width: 34rpx;height: 31rpx;"></image>出售】：</view>
							<view class="sub u-line-2">{{item.product_name}}</view>
						</view>
					</view>
					<view class="feed_item">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_zm.png" mode="aspectFit" style="width: 34rpx;height: 31rpx;"></image>售价】：</view>
							<view class="sub u-line-2">{{item.price}}</view>
						</view>
					</view>
					<view class="feed_item" v-if="item.description">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_zm.png" mode="aspectFit" style="width: 34rpx;height: 31rpx;"></image>描述】：</view>
							<view class="sub u-line-3">{{item.description}}</view>
						</view>
					</view>
					<view class="feed_item" v-if="item.remark">
						<view class="text">
							<view class="bold">【<image src="/static/images/icon_zm.png" mode="aspectFit" style="width: 34rpx;height: 31rpx;"></image>备注】：</view>
							<view class="sub u-line-3">{{item.remark}}</view>
						</view>
					</view>
					<view class="tip">【请告知在广科帮帮平台上看到的】</view>
					<view class="tip call">
						<text class="text">收购的同学请点我</text>
						<view class="triangle-up"></view>
						<view class="triangle-up"></view>
						<view class="triangle-up"></view>
					</view>
					<u-gap height="2" bg-color="#f7f8fa" style="width: 230rpx;"></u-gap>
					<view class="imglist" v-if="item.img_paths!==''">
						<view class="item" v-for="(pitem,indexz) in item.imgPath" :key="indexz" @click.stop="previewImage([item.imgPath,indexz])">
							<image :src="pitem" mode="aspectFill" class="img"></image>
						</view>
					</view>
				</view>
			</template>
			<view class="feed_ft">
				<view class="left">发布于{{item.add_time}}</view>
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
</template>

<script>
	export default{
		props:{
			list:{
				type:Array,
				default:()=>{return []}
			},
			isTime:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{}
		},
		filters:{
			getDevice(val){
				if(val==null){
					return "";
				}else{
					if(val=="ios"){
						return "来自Iphone"
					}else{
						return '来自'+val.charAt(0).toUpperCase() + val.slice(1)
					}
				}
			}
		},
		methods:{
			previewImage(a){
				this.$emit('previewImage',a)
			},
			goDetail(item){
				// this.$store.commit("setDetail",item);
				uni.navigateTo({
					url:"/pages/index/detail/detail?id="+item.id+"&type=jishi"+"&stype="+item.type
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/common/css/spell/comment.scss";
</style>
