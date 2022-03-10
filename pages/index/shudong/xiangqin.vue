<template>
	<view class="index">
		<u-toast ref="uToast" />
		<view class="nearby"  v-if="imgShow">
			<u-modal v-model="show" @confirm="longPressConfirm" :content="content" show-cancel-button></u-modal>
			<MyPreviewImage @closeIImg1='closeImg' ref="myPreviewImage" @longPress="() => {show = true}" @uploadIndex="uploadIndex"
				:list="myImgList" :vertical="false"></MyPreviewImage>
		</view>
		<!-- <image class="bgImg" src="https://guangke.bjxinzeyuan.cn/static/img/images/zu2410.png" mode=""></image> -->
		<image class="bgImg" src="/static/images/zu12345.jpg" mode=""></image>
		<image class="bgImg2" src="https://guangke.bjxinzeyuan.cn/static/img/images/mcz245.png" mode=""></image>
		<image src="/static/images/zu2770.png" v-if="musicPaused" class="musicImgzt" @click="changeMusic" mode="">
		</image>
		<image src="/static/images/zu2405.png" v-else class="musicImg" @click="changeMusic" mode=""></image>
		<image src="/static/images/zu2771.png" class="shuaxin" @click="shuaxin" mode=""></image>
		<view class="nav1">
			<view class="tit1">{{obj.sender_name?obj.sender_name:''}}</view>
			<view class="tit2">{{obj.content}}</view>
			<view class="nav4-imgs">
				<!-- @click.stop="toSeeImg(i,obj.myImg_paths)" -->
				<image class="nav4-img" @click="mySeeImg(i,obj.myImg_paths)" v-for="(ele,i) in obj.myImg_paths" :key="i" :src="ele" mode=""></image>
				<!-- 查看图片 -->
				<!-- <MyPreviewImage :list="obj.myImg_paths" /> -->
			</view>
			<view class="txt3">
				<view class="icon1" @click="dianzan(obj)">
					<template v-if="obj.is_zan == 0">
						<u-icon name="thumb-up" color="#ffffff" size="28"></u-icon>
						<view class="i-txt">{{obj.zan_count}}</view>
					</template>
					<template v-else>
						<u-icon name="thumb-up-fill" color="#fe694f" size="28"></u-icon>
						<view class="i-txt isDianzan">{{obj.zan_count}}</view>
					</template>
				</view>
				<view class="icon1">
					<u-icon name="more-circle" color="#ffffff" size="26"></u-icon>
					<view class="i-txt">{{obj.comment_count}}</view>
				</view>
			</view>
		</view>
		<view class="nav2">
			<view class="nav1-1">
				<image class="pic1-1" src="https://guangke.bjxinzeyuan.cn/static/img/images/lujin1889.png" mode="">
				</image>
				<u-input class="inp1-1" maxlength='600' :clearable='false' v-model="content" placeholder="回点什么呢..."
					type="textarea" :border="false" />
			</view>
			<view class="btns">
				<view @click="fabu" class="btn2">发布</view>
				<view class="btn1">
					<u-input v-model="nicheng" :clearable='false' type="text" height='30' placeholder="昵称"
						:border="false" />
					<image src="https://guangke.bjxinzeyuan.cn/static/img/images/lujin1892.png" class="pic" mode="">
					</image>
				</view>
			</view>
			<view class="nav2-txt">点击下面回复的内容可@评论者</view>
		</view>
		<view class="nav3">
			<block v-for="(item,i) in list" :key="i">
				<view :class="{'item':true,'yary':i%2==0,'del':item.status == 1}" @click="atPeople(item,i)">
					<view class="tit1">
						<view class="txt1">#{{listTotal-i}} {{item.sender_nickname?item.sender_nickname:'A'}}<text
								class="floor"
								v-if="item.is_builder==0">({{Number(item.writer_id) + Number(id)}}号)</text><text
								class="floor" v-if="item.is_builder==1">(楼主)</text><text class="floor"
								v-if="item.writer_id==uid">(我)</text></view>
						<view class="txt2">
							<view class="txt2-1">{{item.showTime}}</view>
							<view style="transform: rotate(90deg);" v-if="item.writer_id==uid"
								@click.stop="changeSheets(item,i)">
								<u-icon name="more-dot-fill" color="#000000" size="28"></u-icon>
							</view>
							<view style="transform: rotate(90deg);" v-else @click.stop="changeSheet(item,i)">
								<u-icon name="more-dot-fill" color="#000000" size="28"></u-icon>
							</view>
						</view>
					</view>
					<view class="tit2" v-if="item.status == 0">{{item.content}}</view>
					<view class="tit2" style="color: #EF694F;" v-else>【该评论已被删除】</view>
				</view>
			</block>
			<u-loadmore :status="status" />
			<u-action-sheet :list="sheetList" @click="sheetClick" v-model="sheetShow" class="actionlist">
			</u-action-sheet>
			<u-action-sheet :list="sheetList2" @click="sheetClicks" v-model="sheetsShow" class="actionlist">
			</u-action-sheet>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import MyPreviewImage from '@/components/page-previewImage/page-previewImage.vue'
	export default {
		components: {
			MyPreviewImage
		},
		data() {
			return {
				fabuFlag:false,
				imgShow:false,
				myImgList:[],
				show: false,
				randomNum: null,
				listTotal: 0,
				isOnShow: true,
				uid: 0,
				id: '',
				sheetIdArr: [],
				sheetId: '',
				isAt: false,
				sheetIndex: null,
				sheetItem: null,
				sheetList: [{
					fontSize: 24,
					subText: '感谢您的点赞'
				}, {
					text: '@Ta'
				}],
				sheetList2: [{
					fontSize: 24,
					subText: '感谢您的点赞'
				}, {
					text: '删除'
				}, {
					text: '@Ta'
				}],
				sheetShow: false,
				sheetsShow: false,
				innerAudioContext: null,
				rotateDeg: 0,
				timer: null,
				obj: {},
				nicheng: '',
				content: '',
				list: [],
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
			...mapState(["shudongPinlunPage", "shudongPinlunPageSize", 'musicPaused', 'firstMusicTime']),
		},
		watch: {
			shudongPinlunPage: function(page) {
				console.log('ddpage',page)
				this.$store.commit("shudongPinlunPage", page);
				if (this.shudongPinlunPage != 1) {
					this.getData();
				}
			},
		},
		onLoad(options) {
			this.id = options.id;
			this.randomNum = this.random(0, 100);
		},
		onUnload() {
			// this.innerAudioContext.pause()
		},
		async onShow() {
			// this.$refs.myPreviewImage.open(0)
			this.$store.commit("isShudong", true);
			if (!this.isOnShow) {
				return;
			}
			if (this.firstMusicTime) {
				const res = await this.$api.video_list()
				console.log(res);
				this.$innerAudioContext.src = res.data.path;
				this.$innerAudioContext.play()
				this.$store.commit('musicPaused', false)
				this.$store.commit('firstMusicTime', false)
			}
			this.list = [];
			this.$store.commit("shudongPinlunPage", 1);
			this.getUserInfo();
			this.getXqData();
			this.getData();
		},
		onReachBottom() {
			console.log('onReachBottom')
			if(!this.fabuFlag){
				this.$store.commit("shudongPinlunPage", this.shudongPinlunPage + 1);
			}else{
				this.fabuFlag = false;
			}
			
		},
		methods: {
			closeImg(val){
				this.imgShow = val;
			},
			mySeeImg(i,arr){
				this.myImgList = arr;
				this.imgShow = true;
				setTimeout(()=>{
					this.$refs.myPreviewImage.open(i)
				},200)
				
			},
			uploadIndex(index) {
				console.log('当前图片', this.list[index]);
			},
			longPressConfirm() {
				console.log('长按事件点击确定');
			},
			async getXqData() {
				const res = await this.$api.shudongXiangqin(this.id)
				console.log(res)
				this.obj = res.data;
				if (this.obj.img_paths) {
					this.obj.myImg_paths = this.obj.img_paths.split(',')
					this.obj.myImg_paths.forEach((img, i) => {
						this.$set(this.obj.myImg_paths, i,
							`${img}`)
					})
				}
			},
			getUserInfo() {
				this.$api.userInfo().then((res) => {
					if (res.code == 200) {
						this.uid = res.data.uid;
					}
				})
			},
			async getData() {
				// console.log(this.$innerAudioContext.paused)
				// if (this.$innerAudioContext.paused) {
				// 	this.musicPaused = true;
				// } else {
				// 	this.musicPaused = false;
				// }
				this.status = 'loading';
				console.log(this.shudongPinlunPage,'getdata')
				setTimeout(async () => {
					const res = await this.$api.shudong_comment_list({
						page: this.shudongPinlunPage,
						limit: this.shudongPinlunPageSize,
						id: this.id,
					})
					this.listTotal = res.data.total;
					var pages = getCurrentPages(); // 获取页面栈
					var currPage = pages[pages.length - 1]; // 当前页面
					var prevPage = pages[pages.length - 2]; // 上一个页面
					prevPage.onShow({shudongPinlunNum:this.listTotal,shudongPinlunId:this.id});
					if (res.data.data.length == 0) {
						this.status = 'nomore'
					} else {
						this.status = 'loadmore';
						this.list = this.list.concat(res.data.data)
						this.list.forEach(ele => {
							ele.showTime = this.timeago(Date.parse(new Date(ele.add_time.replace(
								/-/g, '/'))))
						})
					}
				}, 200)
				console.log(this.list)
			},
			async shuaxin() {
				this.list = [];
				this.$store.commit("shudongPinlunPage", 1);
				this.fabuFlag = true;
				this.getUserInfo();
				this.getXqData();
				this.getData();
			},
			sheetClicks(i) {
				if (i == 1) {
					uni.showModal({
						content: "确定是否删除？",
						confirmColor: "#fe694f",
						success: (res) => {
							if (res.confirm) {
								this.$api.del_shudong_comment(this.sheetId).then((res) => {
									if (res.code == 200) {
										uni.showToast({
											title: res.message,
											icon: "none"
										})
										this.list = [];
										this.$store.commit("shudongPinlunPage", 1);
										this.getUserInfo();
										this.getXqData();
										this.getData();
									} else {
										uni.showToast({
											title: res.message,
											icon: "none"
										})
									}
								})
							}
						}
					})
				} else {
					this.content += this.sheetItem.sender_nickname ? `@${this.sheetItem.sender_nickname} ` :
						`@${this.sheetIndex+1}楼 `;
					this.isAt = true;
				}
			},
			random(min, max) {
				return Math.floor(Math.random() * (max - min)) + min;
			},
			sheetClick(i) {
				if (i == 1) {
					this.content += this.sheetItem.sender_nickname ? `@${this.sheetItem.sender_nickname} ` :
						`@${this.sheetIndex+1}楼 `;
					this.isAt = true;
				}
			},
			atPeople(item, i) {
				if (item.status == 1) {
					return;
				}
				this.content += item.sender_nickname ? `@${item.sender_nickname} ` : `@${this.listTotal-i}楼 `;
				this.isAt = true;
				this.sheetId = item.id;
				this.sheetIdArr.push(item.id);
			},
			changeSheets(item, i) {
				if (item.status == 1) {
					return;
				}
				this.sheetList2[0].subText = item.content;
				this.sheetId = item.id;
				this.sheetsShow = true;
				this.sheetItem = item;
				this.sheetIndex = i;
				this.sheetId = item.id;
				this.sheetIdArr.push(item.id);
			},
			changeSheet(item, i) {
				console.log(item)
				if (item.status == 1) {
					return;
				}
				this.sheetList[0].subText = item.content;
				this.sheetId = item.id;
				this.sheetShow = true;
				this.sheetItem = item;
				this.sheetIndex = i;
				this.sheetId = item.id;
				this.sheetIdArr.push(item.id);
			},
			changeMusic() {
				if (this.musicPaused) {
					this.$innerAudioContext.play()
					this.$store.commit('musicPaused', false)
				} else {
					this.$innerAudioContext.pause()
					this.$store.commit('musicPaused', true)
				}
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
			async fabu() {
				const res = await this.$api.add_shudong_comment({
					sender_nickname: this.nicheng,
					id: this.obj.id,
					content: this.content,
					reply_id: this.isAt ? this.sheetIdArr.toString() : '',
				})
				console.log(res)
				if (res.code == 200) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'success',
						duration: 1000,
						callback: () => {
							this.isAt = false;
							this.sheetIdArr = [];
							this.content = '';
							this.nicheng = '';
							this.list = [];
							this.$store.commit("shudongPinlunPage", 1);
							this.fabuFlag = true;
							this.getData();
						}
					})
				}
				// if (this.isAt) {
				// 	const res = await this.$api.comment_reply({
				// 		sender_nickname: this.nicheng,
				// 		id: this.sheetId,
				// 		type: 'shudong',
				// 		content: this.content,
				// 	})
				// 	console.log(res)
				// 	if (res.code == 200) {
				// 		this.$refs.uToast.show({
				// 			title: res.message,
				// 			type: 'success',
				// 			duration: 1000,
				// 			callback: () => {
				// 				this.isAt = false;
				// 				this.content = '';
				// 				this.nicheng = '';
				// 				this.list = [];
				// 				this.$store.commit("shudongPinlunPage", 1);
				// 				this.getData();
				// 			}
				// 		})
				// 	}
				// } else {
				// 	const res = await this.$api.comment({
				// 		sender_nickname: this.nicheng,
				// 		id: this.obj.id,
				// 		type: 'shudong',
				// 		content: this.content,
				// 	})
				// 	console.log(res)
				// 	if (res.code == 200) {
				// 		this.$refs.uToast.show({
				// 			title: res.message,
				// 			type: 'success',
				// 			duration: 1000,
				// 			callback: () => {
				// 				this.isAt = false;
				// 				this.content = '';
				// 				this.nicheng = '';
				// 				this.list = [];
				// 				this.$store.commit("shudongPinlunPage", 1);
				// 				this.getData();
				// 			}
				// 		})
				// 	}
				// }

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

	.actionlist {
		/deep/.u-action-sheet-item__subtext {
			width: 100%;
			padding: 0 24rpx;
			text-align: center;
		}
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

	.nav1 {
		position: relative;
		margin-top: 16rpx;
		margin-left: 24rpx;
		width: 702rpx;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 8rpx;
		padding: 24rpx 16rpx;

		.tit1 {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
		}

		.tit2 {
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 700;
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
					color: #fe694f;
				}
			}
		}
	}

	.nav2 {
		width: 702rpx;
		// height: 272rpx;
		padding: 22rpx 0 16rpx 0;
		background: rgba(255, 255, 255, 0.5);
		position: relative;
		margin-top: 22rpx;
		left: 24rpx;

		.nav1-1 {
			// position: re;
			// margin-top: 62rpx;
			width: 662rpx;
			background: #ffffff;
			padding: 0 20rpx;
			margin-left: 20rpx;
			display: flex;
			border-radius: 8rpx;

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
					height: 88rpx !important;
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
				width: 120rpx;
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
					width: 60rpx;

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

		.nav2-txt {
			text-align: right;
			margin: 16rpx 20rpx 0 0;
			font-size: 20rpx;
			font-weight: 500;
			color: #000034;
		}
	}

	.nav3 {
		position: relative;
		z-index: 10;
		margin-left: 24rpx;
		width: 702rpx;
		// height: 902rpx;
		background: #ffffff;
		padding: 52rpx 0;

		.item {
			margin-left: 92rpx;
			position: relative;
			width: 574rpx;
			// height: 132rpx;
			background: rgba(106, 195, 105, 0.8);
			margin-bottom: 28rpx;
			border-radius: 16rpx;
			border-top-right-radius: 0;
			padding: 16rpx 20rpx;

			.tit1 {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.txt1 {
					font-size: 28rpx;
					font-weight: 500;
					color: #014001;
				}

				.floor {
					font-size: 24rpx;
					font-weight: 500;
					color: #014001;
				}

				.txt2 {
					transform: translateX(10rpx);
					display: flex;
					align-items: center;

					.txt2-1 {
						font-size: 20rpx;
						font-weight: 500;
						color: #000034;
					}
				}
			}

			.tit2 {
				margin-top: 16rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #ffffff;
			}
		}

		.item::after {
			position: absolute;
			top: 0;
			right: -21rpx;
			content: '';
			width: 0;
			height: 0;
			opacity: 0.8;
			border-top: 12rpx solid #6AC369;
			border-left: 12rpx solid #6AC369;
			border-right: 12rpx solid transparent;
			border-bottom: 12rpx solid transparent;
		}

		.item.yary {
			background: rgba(217, 217, 217, 0.8);
		}

		.item.del {
			opacity: 0.6;
		}

		.item.yary::after {
			position: absolute;
			top: 0;
			right: -21rpx;
			content: '';
			width: 0;
			height: 0;
			opacity: 0.8;
			border-top: 12rpx solid #D9D9D9;
			border-left: 12rpx solid #D9D9D9;
			border-right: 12rpx solid transparent;
			border-bottom: 12rpx solid transparent;
		}
	}
</style>
