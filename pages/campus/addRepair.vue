<template>
	<view class="campus">
		<view class="spellcon">
			<view class="usercon">
				<image :src="user.avatarUrl" class="img"></image>
				<view class="info">
					<view class="fnwrap">
						<text class="name" v-if="iseye">{{user.nickName}}</text>
						<text class="name" v-else>*****</text>
						<view @click="onEye">
							<image src="/static/images/icon_eyes.png" v-if="iseye" mode="aspectFit" style="width: 19rpx;height: 12rpx;"></image>
							<image src="/static/images/icon_eye.png" v-else mode="aspectFit" style="width: 18rpx;height: 15rpx;"></image>
						</view>
					</view>
					<view class="time">{{user.expressTime||""}}（发布时间）</view>
				</view>
			</view>
			<view class="spell_list">
				<view class="spell_item">
					<view class="label">
						<image src="/static/images/icon_gifts.png" style="width:32rpx;height: 32rpx;"></image>
						<text class="text">报修物品</text>
					</view>
					<view class="content">
						<input type="text" v-model="from.name" class="input" placeholder="请输入报修物品" placeholder-style="color: #848484;" />
						<view class="icon" @click="onMod(1)">
							<image src="/static/images/icon_yw.png" style="width:19rpx;height:19rpx;"></image>
						</view>
					</view>
				</view>
				<view class="spell_item">
					<view class="label">
						<image src="/static/images/icon_users.png" style="width:32rpx;height: 30rpx;"></image>
						<text class="text">{{selval}}</text>
					</view>
					<view class="content">
						<input type="number" v-model="from.phone" maxlength="11" class="inputs" placeholder="请输入联系方式" placeholder-style="color: #848484;" v-if="cur==0" />
						<input type="number" v-model="from.qq" class="inputs" placeholder="请输入联系方式" placeholder-style="color: #848484;" v-if="cur==1" />
						<input type="text" v-model="from.wx" class="inputs" placeholder="请输入联系方式" placeholder-style="color: #848484;" v-if="cur==2" />
						<view class="icon" @click="onMod(2)">
							<image src="/static/images/icon_yw.png" style="width:19rpx;height:19rpx;"></image>
						</view>
						<view class="change_wrap">
							<view class="item" :class="[show?'':'on']" @click.stop="changeLx">点我切换联系方式</view>
							<view class="change_list" v-if="show">
								<view class="item" :class="{'on':cur===index}" v-for="(item,index) in lxlist" :key="index" @click.stop="onChange(item,index)">{{item}}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="spell_item">
					<view class="label">
						<image src="/static/images/icon_bz.png" style="width:32rpx;height: 32rpx;"></image>
						<text class="text">备注</text>
					</view>
					<view class="content">
						<input v-model="from.remark" type="text" class="inputs" placeholder="请输入备注" placeholder-style="color: #848484;" />
						<view class="icon" @click="onMod(4)">
							<image src="/static/images/icon_yw.png" style="width:19rpx;height:19rpx;"></image>
						</view>
					</view>
				</view>
				<view class="spell_item textarea">
					<view class="label">
						<image src="/static/images/icon_ends.png" style="width:32rpx;height: 32rpx;"></image>
						<text class="text">描述</text>
					</view>
					<view class="content dcont">
						<textarea v-model="from.desc" class="utextarea" :auto-height="true" placeholder="请输入物品描述(100字以内)" placeholder-style="color: #848484;"></textarea>
						<view class="icon" @click="onMod(3)">
							<image src="/static/images/icon_yw.png" style="width:19rpx;height:19rpx;"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="tip">【请告知在广科帮帮平台上看到的】</view>
			<view class="rtip">注意：下面添加图片（最多可以上传6张，每张大小为2M,建议不要选原图防止图片过大无法上传，拍照时尽量让宝贝在图片中央，图片宽度不要差别太大，如果直接点击拍照不能上传，请先用自带相机拍照，然后点击从手机相册选择照片上传.)</view>
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
			<view class="btn_group">
				<view class="commbtn" @click="onSubmit">发布报修</view>
				<view class="commbtn reset" @click="onReset">取消发布</view>
			</view>
		</view>
		<page-modal width="60%" :content="modcon" :show="modshow" @click="onConfirm"></page-modal>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import config from "../../api/url.js";
	import pageModal from "@/components/page-modal/page-modal";
	export default{
		components:{
			pageModal
		},
		computed: {
			...mapState({
				user:state => state.userInfo
			})
		},
		data(){
			return{
				iseye:true,
				from:{
					name:"",
					phone:"",
					qq:"",
					wx:"",
					desc:"",
					remark:"",
					imgs:[]
				},
				lxlist:["手机号","QQ","其他"],
				selval:"手机号",
				cur:0,
				show:false,
				imglist:[],
				modshow:false,
				modcon:""
			}
		},
		methods:{
			onEye(){
				this.iseye = !this.iseye;
			},
			onMod(index){
				if(index===1){
					this.modcon = "温馨提示：请在输入栏输入您想报修的物品";
				}else if(index===2){
					this.modcon = "温馨提示：请在输入栏输入您正确的联系方式，如需切换请点击输入正确的联系方式";
				}else if(index===3){
					this.modcon = "温馨提示：请在输入栏输入您的保修物品地点描述，方便与你联系";
				}else if(index===4){
					this.modcon = "温馨提示：请在输入栏输入您的保修物品的重要信息，方便与你联系";
				}
				this.modshow = !this.modshow;
			},
			onConfirm(val){
				this.modshow = !this.modshow;
			},
			changeLx(){
				this.show = !this.show;
			},
			onChange(item,index){
				this.cur = index;
				this.selval = item;
				this.show = !this.show;
			},
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
											'type':"baoxiu"
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
				if(this.from.name=="" || (this.from.phone==""&&this.from.qq==""&&this.from.wx=="")){
					uni.showToast({
						title:"请输入完整的信息",
						icon:"none"
					})
					return false;
				}
				if(this.from.phone!="" && !this.$u.test.mobile(this.from.phone)){
					uni.showToast({
						title:"请输入正确的手机号",
						icon:"none"
					})
					return false;
				}
				let data = {
					is_anonymous:this.iseye?0:1,
					product_name:this.from.name,
					description:this.from.desc,
					remark:this.from.remark,
					img_paths:this.from.imgs.length?this.from.imgs.join(","):"",
					device:uni.getSystemInfoSync().platform
				}
				if(this.cur==0){
					data.mobile = this.from.phone;
				}else if(this.cur==1){
					data.qq = this.from.qq;
				}else if(this.cur==2){
					data.wx = this.from.wx;
				}
				this.$api.baoxiu(data).then((res)=>{
					if(res.code==200){
						uni.showToast({
							title:"发布成功",
							icon:"none"
						})
						setTimeout(()=>{
							uni.navigateBack();
							this.from.imgs = [];
							this.imglist = [];
						},1500)
					}else{
						uni.showToast({
							title:res.message,
							icon:"none"
						})
					}
				})
			},
			onReset(){
				this.from = {};
				uni.navigateBack();
			}
		},
		onShow(){
			let expressTime = this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd');
			this.$store.commit("setUserinfo",{time:expressTime});
		}
	}
</script>
<style>
	page{
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	@import "@/common/css/spell/list.scss";
	.campus{
		.dcont{
			padding:25rpx 0;
		}
	}
</style>
