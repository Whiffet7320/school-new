<template>
	<view>
		<view class="ibg">
			<image :src='imggg' mode="aspectFill" class="img"></image>
		</view>
		<page-nav :scrollTop="scrollTop" title="校园风景" :imgbg="banner"></page-nav>
		<view class="scenery_from">
			<view class="sitem">
				<view class="tit"><text class="red">*</text>投稿须知</view>
				<view class="desc first">
					<view>1.投稿需为原创作品</view>
					<view>2.拍摄对象为校园的某一角</view>
				</view>
			</view>
			<view class="sitem">
				<view class="tit"><text class="red">*</text>投稿者</view>
				<view class="desc">（你的名称）</view>
				<view class="input"><input type="text" v-model="from.nickname" /></view>
			</view>
			<view class="sitem">
				<view class="tit"><text class="red">*</text>想说的话</view>
				<view class="desc">（什么时候拍的，有什么感想，2000字以内）</view>
				<view class="textarea"><textarea v-model="from.content" maxlength="2000" class="utextarea" :auto-height="true"></textarea></view>
			</view>
			<view class="sitem">
				<view class="tit"><text class="red">*</text>投稿图片</view>
				<view class="desc">（什么时候拍的，有什么感想）</view>
				<view class="file" @tap="chooseImage">
					<view class="icon">+</view>
					<view>选择上传文件（最多6个）、限制每个20MB以内、仅支持:jpg.jpeg.png.gif.bmp</view>
				</view>
				<view class="grid">
					<view class="bg_img" v-for="(vo, key) in imglist" :key="key" @tap="viewImage(key)">
						<image :src="vo" mode="aspectFill"></image>
						<view class="cu_tag" @tap.stop="delImg(key)">x</view>
					</view>
				</view>
			</view>
			<button class="u-reset-button subbtn" :class="{'on':disabled}" :disabled="disabled" @click="onSubmit">提交</button>
		</view>
	</view>
</template>

<script>
	import config from "../../api/url.js";
	import pageNav from "./components/page-nav";
	export default{
		components:{
			pageNav
		},
		data(){
			return{
				imggg:`${this.$url}/static/img/images/school/xyfj.png`,
				scrollTop:0,
				banner:`${this.$url}/static/img/images/school/xyfj2.jpeg`,
				from:{
					nickname:"",
					content:"",
					imgs:[]
				},
				imglist:[],
			}
		},
		watch:{
			disabled(){
				if(this.from.nickname==="" && this.from.content==="" && this.from.imgs.length==0){
					return true;
				}else{
					return false;
				}
			}
		},
		methods:{
			viewImage(index) {
				uni.previewImage({
					urls: this.imglist,
					current:index
				});
			},
			delImg(index) {
				this.imglist.splice(index, 1);
				this.from.imgs.splice(index, 1);
			},
			chooseImage(){
				uni.chooseImage({
					count: 6 - this.imglist.length, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: res => {
						for (let i = 0; i < res.tempFilePaths.length; i++) {
							// 读取图片宽高
							uni.getImageInfo({
								src: res.tempFilePaths[i],
								success: image => {
									if(this.imglist.length>=6){
										this.$u.toast("图片最多可以上传6张");
										return false;
									}
									uni.showLoading({
										mask:true,
										title:"上传中..."
									})
									uni.hideLoading();
									uni.uploadFile({
										url:config.baseUrl+config.upload_pic,
										method:"POST",
										header:{
											'token':uni.getStorageSync('token')
										},
										filePath: image.path,
										name: 'image',
										formData:{
											'token':uni.getStorageSync('token'),
											'type':"fengjing"
										},
										success: (res) =>{
											let data = JSON.parse(res.data);
											if(data.code == 200){
												uni.hideLoading();
												this.imglist = this.imglist.concat(image.path);
												this.from.imgs = this.from.imgs.concat(data.data);
											}else{
												uni.hideLoading();
												uni.showToast({
													title:"上传失败",
													icon:"none"
												})
											}
										},
										fail:(error)=>{
											uni.hideLoading();
										}
									})
								}
							});
						}
					}
				});
			},
			onSubmit(){
				if(this.from.nickname==""||this.from.content==""||this.from.imgs.length<1){
					uni.showToast({
						title:"请填写完整的信息",
						icon:"none"
					})
					return false;
				}
				let data = {
					sender_name:this.from.nickname,
					description:this.from.content,
					img_paths:this.from.imgs.length?this.from.imgs.join(","):""
				}
				this.$api.fengjing(data).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:"发布成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
							this.from.imgs = [];
							this.imglist = [];
							this.$store.commit("setAdd",true);
						},1500)
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			}
		},
		onShow(){
			let expressTime = this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd');
			this.$store.commit("setUserinfo",{time:expressTime});
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style>
	page{
		background-color: #F2F2F2;
	}
</style>
<style lang="scss" scoped>
	.ibg{
		position: fixed;
		top:286rpx;
		left:0;
		z-index: -2;
		width: 100%;
		.img{
			width: 100%;
			height: 1338rpx;
		}
	}
	.scenery_from{
		margin-top: 20rpx;
		padding:40rpx 24rpx;
		background: rgba(255,255,255,0.4);
		.red{
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #ff0000;
			letter-spacing: -1rpx;
			margin-right: 8rpx;
		}
		.sitem{
			padding-bottom: 40rpx;
			.tit{
				font-size: 28rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #000000;
				letter-spacing: -1rpx;
				display: flex;
				align-items: center;
				margin-bottom: 8rpx;
			}
			.desc{
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000000;
				&.first{
					margin-left: 24rpx;
				}
			}
			.input{
				margin-top: 12rpx;
				width: 100%;
				height: 60rpx;
				border: 2rpx solid #e6e6e6;
				padding:0 24rpx;
				display: flex;
				align-items: center;
				input{
					width: 100%;
					height: 100%;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
				}
				
			}
			.textarea{
				margin-top: 12rpx;
				width: 100%;
				border: 2rpx solid #e6e6e6;
				padding:12rpx 24rpx;
				display: flex;
				.utextarea{
					width: 100%;
					height: 100%;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
				}
			}
			.file{
				margin-top: 16rpx;
				width: 584rpx;
				height: 92rpx;
				border: 2rpx solid #e6e6e6;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000034;
				display: flex;
				align-items: center;
				.icon{
					width: 20rpx;
					height: 44rpx;
					font-size: 32rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					text-align: center;
					color: #000000;
					letter-spacing: -1rpx;
					margin:0 24rpx;
				}
			}
			.grid{
				padding:24rpx 0 0 0;
				display: flex;
				flex-wrap: wrap;
				.bg_img{
					margin-right: 60rpx;
					margin-bottom: 30rpx;
					position: relative;
					width: 160rpx;
					height: 160rpx;
					image{
						width: 160rpx;
						height: 160rpx;
					}
					.cu_tag{
						width: 40rpx;
						height: 40rpx;
						background: #FE694F;
						border-radius: 20rpx;
						text-align: center;
						line-height: 40rpx;
						color: #ffffff;
						font-size: 28rpx;
						position: absolute;
						top:-20rpx;
						right: -12rpx;
						z-index: 50;
					}
				}
			}
		}
		.subbtn{
			width: 400rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: #b3b3b3;
			border-radius: 8rpx;
			margin:48rpx auto;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #000000;
			&.on{
				color: #FFFFFF;
				background: #165ff9;
			}
		}
	}
</style>
