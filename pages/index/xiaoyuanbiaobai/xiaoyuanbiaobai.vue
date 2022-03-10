<template>
	<view class="index">
		<image src="https://guangke.bjxinzeyuan.cn/static/img/images/zu2393.png" class="bgImg" mode=""></image>
		<image src="https://guangke.bjxinzeyuan.cn/static/img/images/juxin999.png" class="picc1" mode=""></image>
		<image src="https://guangke.bjxinzeyuan.cn/static/img/images/mcz13.png" class="picc2" mode=""></image>
		<view class="nav1">
			<view class="tit1">
				<text class="red">*</text>表白对象TO:
			</view>
			<view class="tit2">对方昵称</view>
			<view :class='{"inp1":true,"red":form.receiver_name==""}'>
				<u-input v-model="form.receiver_name" type="text" border :clearable='false' />
			</view>
			<view class="tit1 n2">
				<text class="red">*</text>请输入表白内容:
			</view>
			<view class="tit2 n2">用真诚的话打动TA吧！越真诚的告白越容易上榜哦～</view>
			<view class="tit3">注：请尊重他人，不要恶作剧！</view>
			<view :class='{"myTextarea":true,"red":form.content==""}' >
				<u-input v-model="form.content" maxlength='500' type="textarea" :border='false' :clearable='false' />
				<view class="imgs">
					<view v-for="(item,i) in imgArr" :key='i' class="imgItem" @click="chooseImg(i)">
						<image class="pic1" :src="item" mode=""></image>
						<!-- <u-icon v-if='item == "" ' name="plus" color="#E6E6E6" size="36"></u-icon> -->
					</view>
				</view>
			</view>
			<view class="btn1" @click="shangchuanImg(img_pathsNum)">
				<u-icon name="photo" color="#ffffff" size="36"></u-icon>
				<view class="txt1">添加图片({{img_pathsNum}}/3)</view>
			</view>
			<!-- <view class="tit1 n3">
				<text class="red">*</text>你的昵称:
			</view>
			<u-radio-group size='32' active-color="#fe694f" wrap v-model="rad1" @change="radioGroupChange">
				<u-radio label-size='24' :name="1">否</u-radio>
				<u-radio label-size='24' :name="2">是</u-radio>
			</u-radio-group> -->
			<view v-if="!isNiming" class="tit1 n4">你的名称</view>
			<u-input v-if="!isNiming" v-model="form.sender_name" type="text" border />
			<view class="tit1 n5">联系方式</view>
			<view class="tit2 n5">这个联系方式不会再墙上放出，如果那个TA想要找到你，我们会给TA你的联系方式</view>
			<u-input v-model="form.sender_wx" type="text" border />
			<view class="footBtn" @click="onSubmit">提交</view>
		</view>
		<!-- 弹出层 -->
		<u-popup mode='center' border-radius="10" v-model="popShow1" width="448rpx" height="366rpx">
			<view class="pop1">
				<view class="txt1">提示</view>
				<view class="txt2">提交成功</view>
				<view class="txt2">请耐心等待ta的回应哦</view>
				<view @click="queding" class="btn">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popShow1: false,
				rad1: '1',
				img_pathsNum: 0,
				isNiming: false,
				imgArr: [],
				form: {
					receiver_name: '',
					content: '',
					img_paths: [''],
					sender_name: '',
					sender_wx: '',
				}
			}
		},
		methods: {
			async onSubmit() {
				console.log(this.form.img_paths.toString())
				const res = await this.$api.addGaobai({
					...this.form,
					img_paths: this.form.img_paths.toString()
				})
				console.log(res)
				if (res.code == 200) {
					this.popShow1 = true;
				}
			},
			radioGroupChange(e) {
				// console.log(e);
				if (e == 2) {
					this.isNiming = true;
				} else {
					this.isNiming = false;
				}
			},
			queding() {
				this.popShow1 = false;
				uni.redirectTo({
					url: '/pages/index/xiaoyuanbiaobai/biaobaiqiang'
				})
			},
			shangchuanImg(i) {
				if (i == 3) {
					return
				}
				uni.chooseImage({
					count: 3, //默认9
					success: (res) => {
						console.log(res)
						res.tempFiles.forEach(async (ele,index)=> {
							if (res.tempFiles.length == 1) {
								const res1 = await this.$api.upload_pic(ele, 'gaobai');
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
								const res1 = await this.$api.upload_pic(ele, 'gaobai');
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
			chooseImg(i) {
				if (i == 3) {
					return
				}
				uni.chooseImage({
					count: 3, //默认9
					success: (res) => {
						console.log(res)
						res.tempFiles.forEach(async ele => {
							const res1 = await this.$api.upload_pic(ele, 'gaobai');
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
						})

					}
				});
			},
		}
	}
</script>

<style>

</style>
<style lang="scss" scoped>
	.index {
		position: relative;
	}
	.inp1.red{
		/deep/ .u-input--border{
			border-color: #fe694f !important;
		}
	}
	.myTextarea.red{
			border-color: #fe694f !important;
	}
	.bgImg {
		position: fixed;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}

	.picc1 {
		width: 100%;
		height: 170rpx;
	}

	.picc2 {
		margin-left: 24rpx;
		margin-top: -148rpx;
		width: 702rpx;
		height: 284rpx;
	}

	.nav1 {
		margin: 40rpx 24rpx 0 24rpx;

		.tit1 {
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			text-align: left;
			color: #000000;

			.red {
				color: #e01313;
				margin-right: 6rpx;
			}
		}

		.tit2 {
			margin-bottom: 20rpx;
			margin-top: 8rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #848484;
		}

		/deep/ .u-input--border {
			background: #ffffff;
		}

		/deep/ .u-input__input {
			font-size: 24rpx;
		}

		.tit1.n2 {
			margin-top: 40rpx;
		}

		.tit2.n2 {
			margin-bottom: 2rpx;
		}

		.tit3 {
			font-size: 24rpx;
			font-weight: 500;
			color: #fe694f;
			margin-bottom: 20rpx;
		}

		.myTextarea {
			z-index: 2;
			width: 702rpx;
			// height: 254rpx;
			background: #ffffff !important;
			border: 2rpx solid #ebebeb;
			border-radius: 10rpx;
			padding: 4rpx 16rpx;

			/deep/ .u-input {
				background: #ffffff;
			}

			.imgs {
				margin: 10rpx 0;
				display: flex;
				flex-wrap: wrap;

				.imgItem {
					position: relative;
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
					background: #FFFFFF;
					// border: 2rpx dashed #E6E6E6;
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
		}

		.btn1 {
			margin-top: 20rpx;
			width: 240rpx;
			height: 68rpx;
			background: #ffc9d7;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.txt1 {
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 500;
				color: #ffffff;
				margin-left: 12rpx;
			}
		}

		.tit1.n3 {
			margin-top: 40rpx;
			margin-bottom: 16rpx;
		}

		.tit1.n4 {
			margin-top: 40rpx;
			margin-bottom: 20rpx;
		}

		.tit1.n5 {
			margin-top: 40rpx;
			margin-bottom: 8rpx;
		}

		.tit2.n5 {
			margin-bottom: 20rpx;
		}

		.footBtn {
			margin: 60rpx 0 80rpx 0;
			width: 702rpx;
			height: 80rpx;
			background: #fe694f;
			border-radius: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
			line-height: 80rpx;
			color: #ffffff;
		}
	}

	.pop1 {
		display: flex;
		flex-direction: column;
		align-items: center;

		.txt1 {
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #000000;
			margin: 42rpx;
		}

		.txt2 {
			font-size: 28rpx;
			font-weight: 400;
			text-align: center;
			color: #000000;
		}

		.btn {
			margin-top: 40rpx;
			width: 240rpx;
			height: 80rpx;
			background: #fe694f;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: 500;
			text-align: center;
			color: #ffffff;
			line-height: 80rpx;
		}
	}
</style>
