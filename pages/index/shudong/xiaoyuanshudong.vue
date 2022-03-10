<template>
	<view class="index">
		<u-toast ref="uToast" />
		<view class="nearby" v-if="imgShow">
			<u-modal v-model="show" @confirm="longPressConfirm" :content="content" show-cancel-button></u-modal>
			<MyPreviewImage @closeIImg1='closeImg' ref="myPreviewImage" @longPress="() => {show = true}"
				@uploadIndex="uploadIndex" :list="myImgList" :vertical="false"></MyPreviewImage>
		</view>
		<!-- <image class="bgImg" src="/static/images/zbj2405.jpg" mode=""></image> -->
		<image class="bgImg" src="/static/images/zu12345.jpg" mode=""></image>
		<!-- <image class="bgImg2" src="https://guangke.bjxinzeyuan.cn/static/img/images/mcz245.png" mode=""></image> -->
		<image src="/static/images/zu2770.png" v-if="musicPaused" class="musicImgzt" @click="changeMusic" mode="">
		</image>
		<image src="/static/images/zu2405.png" v-else class="musicImg" @click="changeMusic" mode=""></image>
		<!-- <image src="/static/images/zu2405.png" v-else class="musicImg" :style='{"transform": "rotate("+$rotateDeg+"deg);"}'	@click="changeMusic" mode=""></image> -->
		<image src="/static/images/zu2771.png" class="shuaxin" @click="shuaxin" mode=""></image>
		<view class="bgtxt">校园帮帮提供技术支持~</view>
		<view class="nav1">
			<view class="nav1-1">
				<image class="pic1-1" src="https://guangke.bjxinzeyuan.cn/static/img/images/lujin1889.png" mode="">
				</image>
				<u-input class="inp1-1" maxlength='600' :clearable='false' v-model="form.content" placeholder="说点什么呢..."
					type="textarea" :border="false" />
			</view>
			<view class="tit3">
				<view v-for="(item,i) in imgArr" :key='i' class="imgItem" @click="chooseImg(i)">
					<image class="pic1" :src="item" mode=""></image>
					<u-icon v-if='item == "" ' name="plus" color="#E6E6E6" size="36"></u-icon>
					<image v-if="item != ''" @click.stop="delImg(i)"
						style="position: absolute;top: 8rpx;right: 8rpx;height: 40rpx;width: 40rpx;"
						src="https://guangke.bjxinzeyuan.cn/static/img/images/zu2414.png" mode=""></image>
				</view>
			</view>
			<view class="btns">
				<view @click="fabu" class="btn2">发布</view>
				<view class="btn1">
					<u-input v-model="nicheng" :clearable='false' type="text" height='30' placeholder="你的名称" :border="false" />
					<image src="https://guangke.bjxinzeyuan.cn/static/img/images/lujin1892.png" class="pic" mode=""></image>
				</view>
				<!-- <view class="isnm">
					<u-checkbox-group active-color="#fe694f">
						<u-checkbox v-model="isNm" label-size='24' @change="nmChange">昵称是否填写</u-checkbox>
					</u-checkbox-group>
				</view> -->
			</view>
		</view>
		<view class="nav2">
			<text class="red">备注：</text>可以发表600字以内的文字；可以添加1-3张图片
		</view>
		<view class="nav3">
			<view class="nav3-1"></view>
			<view class="items">
				<view @click="itemClick(5)" :class="{'item':true,'active':itemIndex==5}">新发</view>
				<view @click="itemClick(1)" :class="{'item':true,'active':itemIndex==1}">我发</view>
				<view @click="itemClick(2)" :class="{'item':true,'active':itemIndex==2}">我回</view>
				<view @click="itemClick(3)" :class="{'item':true,'active':itemIndex==3}">我赞</view>
				<view @click="itemClick(4)" :class="{'item':true,'active':itemIndex==4}">新回</view>
				<view @click="itemClick(6)" :class="{'item':true,'active':itemIndex==6}">最热</view>
				<view @click="itemClick(7)" :class="{'item':true,'active':itemIndex==7}">精选</view>
			</view>
		</view>
		<view class="nav4-items">
			<view class="item" @click="toXiangqin(item)" style="border-left: 2rpx solid #FFFFFF;"
				v-for="(item,index) in list" :key='item.id'>
				<view class="left">
					<view class="dian"></view>
					<view class="shu"></view>
				</view>
				<view class="right">
					<view class="zsRight">
						<view class="txt1">
							<view class="txt1-1">
								<text class="floor">#{{listTotal-index}}·</text>{{item.sender_name?item.sender_name:'A'}}
							</view>
							<view class="aaa" style="display: flex; align-items: center;transform: translateX(24rpx);">
								<view class="txt1-2">{{item.showTime}}</view>
								<view style="transform: rotate(90deg);margin-left: 4rpx;"
									@click.stop="changeSheet(item)">
									<u-icon name="more-dot-fill" color="#000000" size="28"></u-icon>
								</view>
							</view>

						</view>
						<view class="txt2">{{item.content}}</view>
						<view class="nav4-imgs">
							<image @click.stop="mySeeImg(i,item.myImg_paths)" class="nav4-img"
								v-for="(ele,i) in item.myImg_paths" :key="i" :src="ele" mode=""></image>
						</view>
						<view class="txt3">
							<view class="icon1" @click.stop="dianzan(item)">
								<template v-if="item.is_zan == 0">
									<u-icon name="thumb-up" color="#ffffff" size="28"></u-icon>
									<view class="i-txt">{{item.zan_count}}</view>
								</template>
								<template v-else>
									<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
									<view class="i-txt isDianzan">{{item.zan_count}}</view>
								</template>
							</view>
							<view class="icon1">
								<u-icon name="more-circle" color="#ffffff" size="26"></u-icon>
								<view class="i-txt">{{item.comment_count}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" />
			<u-action-sheet :list="sheetList" @click="sheetClick" v-model="sheetShow" class="actionlist"></u-action-sheet>
		</view>
	</view>
</template>

<script>
	import {mapState} from "vuex";
	import MyPreviewImage from '@/components/page-previewImage/page-previewImage.vue'
	export default {
		components: {
			MyPreviewImage
		},
		data() {
			return {
				isNm:true,
				imgShow: false,
				myImgList: [],
				show: false,
				sheetItem: null,
				sheetShow: false,
				sheetId: null,
				sheetList: [{
					text: '删除'
				}],
				isOnShow: true,
				index: 1,
				innerAudioContext: null,
				rotateDeg: 0,
				timer: null,
				itemIndex: 5,
				isDianzan: false,
				imgArr: [''],
				form: {
					img_paths: [],
					content: '',
				},
				nicheng: '',
				imgArrNum: 0,
				list: [],
				listTotal: 0,
				// 加载
				status: 'loadmore',
				iconType: 'flower',
				loadText: {
					loadmore: '上拉加载更多',
					loading: '正在加载...',
					nomore: '没有了更多了'
				},
			}
		},
		computed: {
			...mapState(["shudongPage", "shudongPageSize", 'firstMusicTime', 'musicPaused']),
		},
		watch: {
			shudongPage: function(page) {
				console.log('ddpage')
				this.$store.commit("shudongPage", page);
				if (this.shudongPage != 1) {
					this.getData();
				}
			},
		},
		onHide() {
			console.log('myOnhide')
		},
		async onLoad() {
			console.log(uni.getStorageSync('token'))
			if (!uni.getStorageSync('token')) {
				uni.navigateTo({
					url: '/pages/login/index?from=shudong'
				})
				return;
			}
			if (this.isOnShow) {
				this.list = [];
				this.$store.commit("shudongPage", 1);
				this.getData();
			}
		},
		onBackPress(e) {
			console.log(e, 'back')
		},
		otherFun(shudongBack) {
			console.log(object)
		},
		async onShow(option) {
			console.log(option)
			if (option) {
				if (option.isShudongBack) {
					this.list = [];
					this.$store.commit("shudongPage", 1);
					this.getData();
				}
				if (option.shudongPinlunNum) {
					this.shudongPinlunNum = option.shudongPinlunNum;
					this.shudongPinlunId = option.shudongPinlunId;
					this.list.forEach(ele=>{
						if(ele.id == this.shudongPinlunId){
							ele.comment_count = this.shudongPinlunNum
						}
					})
				}
			}
			console.log(uni.getStorageSync('token'))
			if (!uni.getStorageSync('token')) {
				return
			}
			this.$store.commit("isShudong", true);
			if (this.isOnShow) {
				if (this.firstMusicTime) {
					const res = await this.$api.video_list()
					console.log(res);
					this.$innerAudioContext.src = res.data.path;
					this.$innerAudioContext.play()
					this.$store.commit('musicPaused', false)
					this.$store.commit('firstMusicTime', false)
				}
				// else {
				// 	console.log(this.$innerAudioContext.paused, 1111)
				// 	if (this.$innerAudioContext.paused) {
				// 		this.musicPaused = true;
				// 	} else {
				// 		this.musicPaused = false;
				// 	}
				// }
			}
		},
		onHide() {
			if (!this.isOnShow) {
				return;
			}
		},
		onUnload() {
			// this.innerAudioContext.pause()
		},
		onReachBottom() {
			this.$store.commit("shudongPage", this.shudongPage + 1);
		},
		methods: {
			nmChange(e){
				console.log(e)
				this.isNm = e.value;
			},
			closeImg(val) {
				this.imgShow = val;
			},
			mySeeImg(i, arr) {
				this.myImgList = arr;
				this.imgShow = true;
				setTimeout(() => {
					this.$refs.myPreviewImage.open(i)
				}, 200)

			},
			uploadIndex(index) {
				console.log('当前图片', this.list[index]);
			},
			longPressConfirm() {
				console.log('长按事件点击确定');
			},
			async getData() {
				this.status = 'loading';
				setTimeout(async () => {
					const res = await this.$api.shudong({
						page: this.shudongPage,
						limit: this.shudongPageSize,
						type: this.itemIndex == 1 ? 'my_send' : this.itemIndex == 2 ? 'my_reply' :
							this.itemIndex == 3 ? 'my_zan' : this.itemIndex == 4 ? 'new_comment' :
							this.itemIndex == 5 ? 'new_send' : this.itemIndex == 6 ?
							'hot_shudong' : 'best_shudong'
					})
					this.listTotal = res.data.total;
					if (res.data.data.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.list = this.list.concat(res.data.data)
						this.list.forEach(ele => {
							ele.showTime = this.timeago(Date.parse(new Date(ele.add_time.replace(
								/-/g, '/'))))
							if (ele.img_paths) {
								ele.myImg_paths = ele.img_paths.split(',')
								ele.myImg_paths.forEach((img, i) => {
									this.$set(ele.myImg_paths, i,
										`${img}`)
								})
							}
						})
					}
				}, 200)
			},
			async sheetClick(i) {
				console.log(i)
				if (i == 0) {
					const res = await this.$api.delShudong(this.sheetItem.id)
					console.log(res)
					if (res.code == 200) {
						this.$refs.uToast.show({
							title: res.message,
							type: 'success',
							duration: 1000,
							callback: () => {
								this.form.content = '';
								this.imgArr = [''];
								this.list = [];
								this.$store.commit("shudongPage", 1);
								this.getData();
							}
						})
					} else {
						this.$refs.uToast.show({
							title: res.message,
							type: 'warning',
							duration: 1000,
						})
					}
				}
			},
			changeSheet(item) {
				console.log(item)
				this.sheetItem = item;
				this.sheetList[0].subText = item.content;
				this.sheetId = item.id;
				this.sheetShow = true;
			},
			changeMusic() {
				console.log(this.$innerAudioContext.paused)
				if (this.musicPaused) {
					this.$innerAudioContext.play()
					this.$store.commit('musicPaused', false)
				} else {
					this.$innerAudioContext.pause()
					this.$store.commit('musicPaused', true)
				}
			},
			async shuaxin() {
				this.list = [];
				this.$store.commit("shudongPage", 1);
				this.getData();
			},
			toXiangqin(item) {
				uni.navigateTo({
					url: `/pages/index/shudong/xiangqin?id=${item.id}`
				})
			},
			async dianzan(item) {
				console.log(item);
				if (item.is_zan == 0) {
					item.is_zan = true;
					item.zan_count++
				} else {
					item.is_zan = false;
					item.zan_count--
				}
				await this.$api.zan({
					id: item.id,
					type: 'shudong'
				})
			},
			async fabu() {
				this.form.img_paths.forEach((ele, i) => {
					if (ele == '') {
						this.form.img_paths.splice(i, 1)
					}
				})
				const res = await this.$api.addShudong({
					...this.form,
					img_paths: this.form.img_paths.toString(),
					type: 'shudong',
					sender_name: this.nicheng
				})
				console.log(res)
				if (res.code == 200) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'success',
						duration: 1000,
						callback: () => {
							this.form.content = '';
							this.imgArr = [''];
							this.form.img_paths = [''];
							this.list = [];
							this.$store.commit("shudongPage", 1);
							this.getData();
						}
					})
				} else {
					this.$refs.uToast.show({
						title: res.message,
						type: 'warning',
						duration: 1000,
					})
				}
			},
			timeago(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
				dateTimeStamp = Number(dateTimeStamp)
				var result;
				var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
				var hour = minute * 60;
				var day = hour * 24;
				var week = day * 7;
				var halfamonth = day * 15;
				var month = day * 30;
				var now = new Date().getTime(); //获取当前时间毫秒
				var diffValue = now - dateTimeStamp; //时间差
				if (diffValue < 0) {
					return;
				}
				var minC = diffValue / minute; //计算时间差的分，时，天，周，月
				var hourC = diffValue / hour;
				var dayC = diffValue / day;
				var weekC = diffValue / week;
				var monthC = diffValue / month;
				//此处考虑小数情况，感谢 情非得已https://blog.csdn.net/weixin_48495574 指正
				if (monthC >= 1 && monthC < 4) {
					result = " " + parseInt(monthC) + "月前"
				} else if (weekC >= 1 && weekC < 4) {
					result = " " + parseInt(weekC) + "周前"
				} else if (dayC >= 1 && dayC < 7) {
					result = " " + parseInt(dayC) + "天前"
				} else if (hourC >= 1 && hourC < 24) {
					result = " " + parseInt(hourC) + "小时前"
				} else if (minC >= 1 && minC < 60) {
					result = " " + parseInt(minC) + "分钟前"
				} else if (diffValue >= 0 && diffValue <= minute) {
					result = "刚刚"
				} else {
					var datetime = new Date();
					datetime.setTime(dateTimeStamp);
					console.log(datetime)
					var Nyear = datetime.getFullYear();
					var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
					var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
					var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
					var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
					var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
					result = Nyear + "-" + Nmonth + "-" + Ndate
				}
				return result;
			},
			chooseImg(i) {
				if (i == 3) {
					return
				}
				uni.chooseImage({
					count: 3, //默认9
					success: (res) => {
						console.log(res)
						res.tempFiles.forEach(async (ele, index) => {
							if (res.tempFiles.length == 1) {
								const res1 = await this.$api.upload_pic(ele, 'shudong');
								console.log(res1.data)
								var newImg = `${res1.data}`
								this.$set(this.imgArr, i, newImg)
								this.$set(this.form.img_paths, i, res1.data)
								if (!this.imgArr[i + 1] && this.imgArr.length != 3) {
									this.$set(this.imgArr, i + 1, '');
									this.$set(this.form.img_paths, i + 1, '');
									this.img_pathsNum = this.imgArr.length - 1;
								} else {
									this.img_pathsNum = 3;
								}
							} else {
								const res1 = await this.$api.upload_pic(ele, 'shudong');
								console.log(res1.data)
								var newImg = `${res1.data}`
								this.$set(this.imgArr, index, newImg)
								this.$set(this.form.img_paths, index, res1.data)
								if (!this.imgArr[index + 1] && this.imgArr.length != 3) {
									this.$set(this.imgArr, index + 1, '');
									this.$set(this.form.img_paths, index + 1, '');
									this.img_pathsNum = this.imgArr.length - 1;
								} else {
									this.img_pathsNum = 3;
								}
							}
						})
					}
				});
			},
			delImg(i) {
				this.imgArr.splice(i, 1)
				console.log(this.imgArr.length, this.imgArr[1])
				if (this.imgArr.length == 2 && this.imgArr[1] != '') {
					this.$set(this.imgArr, this.imgArr.length, '');
				}
				this.form.img_paths.splice(i, 1)
				console.log(this.form.img_paths.length, this.form.img_paths[1])
				if (this.form.img_paths.length == 2 && this.form.img_paths[1] != '') {
					this.$set(this.form.img_paths, this.form.img_paths.length, '');
				}
				console.log(this.form.img_paths)
				// if(this.imgArr.length == 0){
				// 	this.$set(this.imgArr, 0 , '');
				// 	this.imgArr.splice(1,2)
				// }
				// if(this.imgArr.length == 1){
				// 	this.$set(this.imgArr, 1 , '');
				// 	this.imgArr.splice(2,1)
				// }
				// if(this.imgArr.length == 2){
				// 	this.$set(this.imgArr, 2 , '');
				// }
			},
			itemClick(i) {
				this.itemIndex = i
				this.$store.commit("shudongPage", 1);
				this.list = [];
				this.getData();
			},
			toSeeImg(i, imgArr) {
				this.isOnShow = false;
				uni.previewImage({
					current: i,
					urls: imgArr,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) +
								'张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
		}
	}
</script>

<style>

</style>
<style lang="scss" scoped>
	.nearby {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100vh;
		background-color: #000000;
		z-index: 99999;
	}

	.index {
		position: relative;
		width: 100%;
		height: 100%;
	}

	@-webkit-keyframes rotating {
		0% {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(1turn)
		}
	}

	@keyframes rotating {
		0% {
			transform: rotate(0deg)
		}

		to {
			transform: rotate(1turn)
		}
	}

	.musicImg {
		animation: rotating 5.2s linear infinite;
		position: fixed;
		right: 40rpx;
		bottom: 200rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 99;
	}

	.musicImgzt {
		position: fixed;
		right: 40rpx;
		bottom: 200rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 99;
		animation-play-state: running;
	}

	.jymusicImg {
		position: fixed;
		right: 40rpx;
		bottom: 200rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 99;
	}

	.shuaxin {
		position: fixed;
		right: 40rpx;
		bottom: 120rpx;
		width: 60rpx;
		height: 60rpx;
		z-index: 99;
	}

	/deep/ .u-load-more-wrap {
		height: 100rpx !important;
	}

	/deep/ .u-more-text {
		color: #FFFFFF !important;
	}

	.bgImg {
		position: fixed;
		top: 0;
		left: 0;
		z-index: -2;
		height: 100vh;
		width: 100vw;
	}

	.bgImg2 {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
	}

	.bgtxt {
		position: absolute;
		font-size: 20rpx;
		font-weight: 500;
		color: #ffffff;
		top: -50rpx;
		right: 112rpx;
	}

	.nav1 {
		width: 702rpx;
		// height: 272rpx;
		padding: 62rpx 0 40rpx 0;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 8rpx;
		position: relative;
		margin-top: 288rpx;
		left: 24rpx;

		.nav1-1 {
			// position: re;
			// margin-top: 62rpx;
			width: 702rpx;
			background: #ffffff;
			padding: 0 20rpx;
			display: flex;

			.pic1-1 {
				margin-top: 22rpx;
				width: 32rpx;
				height: 46rpx;
			}

			.inp1-1 {
				width: 100%;
				margin-top: 16rpx;
				margin-left: 20rpx;

				/deep/ .u-input__textarea {
					height: 100rpx;
				}
			}
		}

		.tit3 {
			margin-top: 44rpx;
			padding: 0 20rpx;
			display: flex;
			flex-wrap: wrap;

			.imgItem {
				&:nth-child(3) {
					margin: 0rpx 0rpx 14rpx 0rpx;
				}

				position: relative;
				margin: 0rpx 15rpx 14rpx 0rpx;
				width: 210rpx;
				height: 210rpx;
				background: #FFFFFF;
				border: 2rpx dashed #E6E6E6;
				display: flex;
				justify-content: center;
				align-items: center;

				.pic1 {
					width: 100%;
					height: 100%;
					position: absolute;
				}
			}
		}

		.btns {
			margin-top: 30rpx;
			padding: 0 20rpx;
			display: flex;
			flex-direction: row-reverse;

			.btn1 {
				width: 150rpx;
				height: 44rpx;
				background: #ffffff;
				border-radius: 8rpx;
				font-size: 20rpx;
				font-weight: 500;
				color: #b3b3b3;
				display: flex;
				align-items: center;
				justify-content: center;

				/deep/ .u-input {
					width: 90rpx;

					.u-input__input {
						font-size: 20rpx;
					}
				}

				.pic {
					margin-left: 8rpx;
					width: 24rpx;
					height: 24rpx;
				}
			}
			.isnm{
				/deep/.u-checkbox__label{
					color: #FFFFFF;
				}
			}

			.btn2 {
				margin-left: 24rpx;
				width: 98rpx;
				height: 44rpx;
				background: #fe694f;
				border-radius: 8rpx;
				font-size: 20rpx;
				font-weight: 500;
				text-align: center;
				color: #ffffff;
				line-height: 44rpx;
			}
		}
	}

	.nav2 {
		position: relative;
		margin-top: 16rpx;
		margin-left: 24rpx;
		font-size: 20rpx;
		font-weight: 500;
		color: #ffffff;

		.red {
			color: #fe694f;
		}
	}

	.nav3 {
		height: 80rpx;
		position: relative;
		margin-left: 24rpx;
		margin-top: 40rpx;

		.nav3-1 {
			position: absolute;
			width: 702rpx;
			height: 80rpx;
			// background: #d2d1cf;
			opacity: 0.76;
			background: #ffffff;
			border-radius: 8rpx;
		}

		.items {
			width: 702rpx;
			height: 80rpx;
			position: absolute;
			z-index: 9;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.item {
				width: 92rpx;
				height: 72rpx;
				text-align: center;
				line-height: 72rpx;
			}

			.active {
				background: #ffffff;
			}
		}
	}

	.nav4-items {
		position: relative;
		margin: 30rpx 20rpx;

		// border-left: 2rpx soild #ffffff;
		.item {
			// height: 300rpx;
			display: flex;
			padding-bottom: 30rpx;

			// align-items: center;
			.left {
				// height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				transform: translateX(-6rpx);

				.dian {
					width: 8rpx;
					height: 8rpx;
					background: #ffffff;
					border-radius: 50%;
				}

				// .shu {
				// 	height: 100%;
				// 	width: 2rpx;
				// 	background: #FFFFFF;
				// }
			}

			.right {
				position: relative;

				.zsRight::after {
					content: "";
					position: absolute;
					transform: rotateZ(-270deg);
					left: -22rpx;
					top: 0rpx;
					width: 0;
					height: 0;
					border-top: 12rpx solid #fff;
					border-left: 12rpx solid #fff;
					border-right: 12rpx solid transparent;
					border-bottom: 12rpx solid transparent;
					opacity: 0.5;
				}

				.zsRight {
					background: rgba(255, 255, 255, 0.5);
					position: relative;
					top: 8rpx;
					left: 22rpx;
					width: 676rpx;
					padding: 24rpx 34rpx 24rpx 14rpx;

					.txt1 {
						display: flex;
						align-items: center;
						justify-content: space-between;

						.txt1-1 {
							font-size: 28rpx;
							font-weight: 500;
							color: #000000;
						}

						.floor {
							font-size: 24rpx;
							color: #000000;
						}

						.txt1-2 {
							font-size: 20rpx;
							font-weight: 500;
							color: #000034;
						}
					}

					.txt2 {
						margin-top: 28rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #ffffff;
					}

					.nav4-imgs {
						margin-top: 10rpx;

						.nav4-img {
							width: 140rpx;
							height: 140rpx;
							margin-right: 12rpx;
							border-radius: 8rpx;
						}
					}

					.txt3 {
						display: flex;
						align-items: center;
						justify-content: space-between;
						margin-top: 24rpx;

						.icon1 {
							display: flex;
							align-items: center;

							.i-txt {
								margin-left: 8rpx;
								font-size: 24rpx;
								font-weight: 400;
								color: #ffffff;
							}

							.i-txt.isDianzan {
								color: #165ff9;
							}
						}
					}
				}
			}
		}
	}
</style>
