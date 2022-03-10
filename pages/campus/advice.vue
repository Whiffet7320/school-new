<template>
	<view class="container">
		<view class="ibg"><image src="/static/images/newsbg.png" class="icon"></image></view>
		<view class="searchbox" @click="onSearch">
			<image src="/static/images/icon_search.png" class="icon"></image>
			<view class="text">请输入你想要搜索的内容</view>
		</view>
		<view class="swiperbox">
			<u-swiper :list="banlist" height="320" :title="true" mode="none" :title-style="{'font-size':'28rpx','background':'none'}"></u-swiper>
		</view>
		<view class="midnew">
			<view class="input">
				<image src="/static/images/icon_edit.png" mode="aspectFit" class="icon"></image>
				<input type="text" v-model="from.question" placeholder="请输入内容标题(限20字以内)" class="ipt" maxlength="20" placeholder-style="color:#D9D9D9;" />
			</view>
			<view class="input textarea">
				<image src="/static/images/icon_edit.png" mode="aspectFit" class="icon"></image>
				<textarea v-model="from.content" class="iptext" maxlength="1000" :auto-height="true" placeholder="请输入内容，请自觉遵守网络安全法，依法依规进行发布。" placeholder-style="color:#D9D9D9;" @confirm="onConfirm"></textarea>
			</view>
			<view class="upload">
				<view class="grid">
					<view class="bg_img" v-for="(vo, key) in imglist" :key="key" @tap="viewImage(key)">
						<image :src="vo" mode="aspectFill"></image>
						<view class="cu_tag" @tap.stop="delImg(key)">x</view>
					</view>
					<view class="solids" v-if="imglist.length < 6" @tap="chooseImage">
						<image src="/static/images/icon_photo.png" mode="aspectFit" class="img"></image>
					</view>
				</view>
			</view>
			<view class="light">注意：请简单描述你想要咨询的问题以及内容，字数受限在1000字以内，上传图片最多为6张，需经过平台审核才可发布成功。</view>
			<view class="btn" @click="onSubmit">发布咨询</view>
		</view>
		<view class="newrap">
			<view class="tit">问答列表</view>
			<view class="list" v-if="list.length>0">
				<view class="litem" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
					<view class="title">{{item.title}}</view>
					<!-- <view class="desc u-line-3" v-if="item.content!=null && item.content!=''">{{item.content.replace(/\r\n|\n|\r/g,"\n")}}</view> -->
					<view class="imglist" v-if="item.img_paths!==''">
						<view class="item" v-for="(pitem,indexz) in item.imgPath" :key="indexz" @click.stop="previewImages(item.imgPath,indexz)">
							<image :src="pitem" mode="aspectFill" class="img"></image>
						</view>
					</view>
					<view class="ft">
						<view class="time">
							<image src="/static/images/icon_time.png" mode="aspectFit" class="icon"></image>
							<text>{{item.add_time}}</text>
						</view>
						<view class="right">
							<!-- <view class="icon_l">
								<image src="/static/images/icon_time.png" mode="aspectFit" style="width: 23rpx;height: 23rpx;margin-right: 8rpx;"></image>
								<text>{{item.read_count||0}}</text>
							</view> -->
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
		</view>
		<u-loadmore :status="status" bg-color="#ffffff" color="#010101" font-size="20" />
		<view class="mefix" @click="goService">
			<image src="/static/images/icon_kf.png" mode="aspectFit" class="icon"></image>
			<text>我的咨询</text>
		</view>
		<u-back-top :scroll-top="scrollTop" icon="/static/images/icon_top.png" :icon-style="{width:'64rpx',height:'64rpx;'}" :custom-style="{background:'none'}"></u-back-top>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import config from "../../api/url.js";
	export default{
		data(){
			return{
				scrollTop:0,
				id:0,
				isOnShow:true,
				banlist:[
					{
						image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170725%2F88c819bb071345cda4074b081411fc55.jpeg',
						title: '2021学校开展秋季招生活动中...'
					},
				],
				from:{
					question:"",
					content:"",
					imgs:[]
				},
				imglist:[],
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
				}
			}
		},
		computed:{
			...mapState({
				isAdd: (state) => state.isAdd
			})
		},
		methods:{
			onSearch(){
				uni.navigateTo({
					url:"/pages/search/newslist"
				})
			},
			onSubmit(){
				if(this.from.question=='' || this.from.content==""){
					uni.showToast({
						title:"请填写需要发布的内容",
						icon:"none"
					})
					return false;
				}
				let data = {
					tag:"advice",
					title:this.from.question,
					content:this.from.content,
					img_paths:this.from.imgs.length?this.from.imgs.join(","):"",
					device:uni.getSystemInfoSync().platform
				}
				this.$api.article(data).then((res)=>{
					if(res.code==200){
						this.from.question = "";
						this.from.content = "";
						this.from.imgs = [];
						this.imglist = [];
						uni.showToast({
							title:"发布成功，请等待客服审核",
							icon:"none"
						})
						this.list = [];
						this.current_page = 1;
						this.reload = true;
						this.loadData();
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			viewImage(index,key) {
				this.isOnShow = false;
				uni.previewImage({
					urls: this.imglist,
					current: this.imglist[key]
				});
			},
			previewImages(urls,index){
				this.isOnShow = false;
				uni.previewImage({
					urls: urls,
					current: index
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
											'type':"article"
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
			async loadData(){
				this.$api.getarticle({tag:"advice",page:this.current_page,limit:10}).then((res)=>{
					if(res.code==200){
						uni.stopPullDownRefresh();
						this.list = this.reload ? res.data.data : this.list.concat(res.data.data);
						this.list.forEach(ele => {
							if(ele.img_paths){
								ele.imgPath = ele.img_paths.split(",");
								ele.imgPath.forEach((img, i) => {
									this.$set(ele.imgPath, i, this.$tools.imgUrl(img))
								})
							}
						})
						this.current_page = res.data.current_page; //当前页码
						this.last_page = res.data.last_page; //总页码
						this.status = res.data.total == 0 ? 'nomore' : 'more';
					}
				})
			},
			goDetail(item){
				uni.navigateTo({
					url:"/pages/campus/adviceDetail?id="+item.id
				})
			},
			goService(){
				uni.navigateTo({
					url:"/pages/campus/meAdvice?type=advice"
				})
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad(option){
			this.list = [];
			this.current_page = 1;
			this.last_page = 1;
			this.loadData();
		},
		onShow(){
			if(!this.isOnShow){
				return
			}
			if(this.isAdd){
				this.list = [];
				this.current_page = 1;
				this.last_page = 1;
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

<style lang="scss" scoped>
	@import "@/common/css/spell/news.scss";
</style>
