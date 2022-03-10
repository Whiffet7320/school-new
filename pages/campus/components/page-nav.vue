<template>
	<view class="swiper">
		<image :src="imgbg" mode="aspectFill" class="img"></image>
		<u-navbar v-if="scrollTop>100" :title="title" back-icon-color="#ffffff" title-color="#ffffff" :background="background" :border-bottom="false"></u-navbar>
		<u-navbar v-else :title="title" back-icon-color="#ffffff" title-color="#ffffff" :background="{backgroundColor: 'transparent'}" :border-bottom="false"></u-navbar>
	</view>
</template>

<script>
	export default{
		props:{
			scrollTop:{
				type:Number,
				default:0
			},
			title:{
				type:String,
				default:""
			},
			imgbg:{
				type:String,
				default:`https://guangke.bjxinzeyuan.cn/static/img/images/school/xyfj.jpeg`
			}
		},
		data(){
			return{
				background: {
					background: 'url('+this.imgbg+') no-repeat',
					backgroundSize: 'cover'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper{
		width: 100%;
		height: 584rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
</style>
