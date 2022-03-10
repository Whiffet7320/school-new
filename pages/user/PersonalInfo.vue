<template>
	<view class="index">
		<u-toast ref="uToast" />
		<Navtop title="个人信息"></Navtop>
<!-- 
		<view class="infoUrl">
			<view class="Tes">
				头像
			</view>
			<view class="avaUrl" @click="UpPic">
				<image :src="user.avatar?user.avatar:''"></image>
			</view>
		</view>
		<view class="infoName">
			<view class="Tes">
				姓名
			</view>
			<view class="userName">
				<input type="text" placeholder="请输入昵称" @confirm='changeNickname' v-model="nick_name" />
			</view>
		</view> -->
		<view class="infoPhone">
			<view class="Tes">
				手机号
			</view>
			<view class="userPhone">
				<input type="text" placeholder="请输入您的手机号" v-model="shop_phone" maxlength="11" />
			</view>
		</view>
		<view v-if="!SuBBoos" :class=" nick_name !==''&& shop_phone !==''?'KeepState':'Keep'" @click="KeepUser">
			修改手机号
		</view>
		<view class="BaoCun" v-if="SuBBoos">
			保存
		</view>

		<view class="Mask" v-if="CodeBoos"></view>
		<view class="CodeTips" v-if="CodeBoos">
			<view class="Title">
				<view class="icon" @click="CodeBoos = !CodeBoos">
					<image src="/static/user/fanhuijiantou-h.png" mode=""></image>
				</view>
				<view class="Test">
					请输入短信验证码
				</view>
			</view>
			<view class="Content">
				<view class="Test">
					<view class="One">
						已发送至手机号{{Phone}}，
					</view>
					<view class="Two">
						收不到验证码？
					</view>
				</view>
				<view class="InputCode">
					<view class="Input">
						<input type="text" value="" v-model="PhoneCode" placeholder="请输入短信验证码" placeholder-style="color:#d9d9d9" />
					</view>
					<view class="Num" :style="{background:!CodeSendOut?'#FE694F':'',color:!CodeSendOut?'#FFFFFF':''}">
						{{CodeSendOut?Seco+'秒后重发':'发送验证码'}}
					</view>

				</view>
				<view class="confirm" @click="SubmitCode"
					:style="{background:PhoneCode !==''?'#FE694F':'',color:PhoneCode !==''?'#FFFFFF':''}">
					确认提交
				</view>

			</view>

		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				ExitBos: true, //开启编辑
				userInfo: '', //用户信息
				avatar: '/static/user/gernetouxiang.png', //修改后的头像
				nick_name: '', //修改的名称
				shop_phone: '', //修改的手机号码
				PhoneCode: '', //短信验证码
				CodeBoos: false, //遮罩层
				Seco: 60, //验证码时间
				CodeSendOut: false, //重新发送
				Phone: '', //遮掩手机号
				Dit: 4683,
				SuBBoos: false, //提交成功
				// 
				user: {}
			}
		},
		onLoad() {

		},
		onShow() {
			this.getData();
		},
		methods: {
			async getData() {
				const res = await this.$api.userInfo()
				console.log(res)
				this.user = res.data;
				this.nick_name = this.user.nickname;
				this.shop_phone = this.user.phone;
			},
			async changeNickname(e) {
				const res = await this.$api.update_user_info({
					nickname: e.detail.value
				})
				console.log(res)
				if (res.code == 200) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'success',
						duration: 1000,
						callback: () => {
							this.getData();
						}
					})
				}
			},
			async getPhoneNumber(e) {
				console.log(e)
				console.log(e.detail.iv)
				console.log(e.detail.encryptedData);
				this.iv = e.detail.iv;
				this.phoneData = e.detail.encryptedData
				this.btnShow = false;
				// const res = await this.$api.get_phone({

				// })
			},
			//确认提交
			async SubmitCode() {
				const res = await this.$api.update_mobile({
					new_mobile: this.shop_phone,
					captch: this.PhoneCode
				})
				console.log(res)
				if (res.code == 200) {
					this.$refs.uToast.show({
						title: '修改成功',
						type: 'success',
						duration: 1000,
						callback: () => {
							this.getData();
							this.CodeBoos = false;
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
			//更换头像
			UpPic() {
				uni.chooseImage({
					count: 1,
					success: async (res) => {
						const res1 = await this.$api.upload_avatar(res.tempFiles[0]);
						if (res1.code == 200) {
							console.log(res1.data.path)
							var newImg = `${res1.data.path}`
							const res2 = await this.$api.update_user_info({
								avatar: newImg
							})
							console.log(res2)
							if (res2.code == 200) {
								this.$refs.uToast.show({
									title: res2.message,
									type: 'success',
									duration: 1000,
									callback: () => {
										this.getData();
									}
								})
							}
						}
					}
				});
			},
			//保存修改
			async KeepUser() {

				if (this.nick_name === '' || this.shop_phone === '') {
					return
				} else {
					this.CodeBoos = !this.CodeBoos
					var Tou = this.shop_phone.slice(0, 3)
					var Wei = this.shop_phone.slice(-3)
					this.Phone = Tou + '*****' + Wei
					if (!this.CodeSendOut) {
						this.CodeSendOut = !this.CodeSendOut
						const res = await this.$api.send_sms({
							mobile: this.shop_phone,
							event: 'updatemobile'
						});
						console.log(res)
						var set = setInterval(() => {
							this.Seco--
							if (this.Seco === 0) {
								this.Seco = 60
								clearInterval(set)
								this.CodeSendOut = !this.CodeSendOut
							}
						}, 1000)
					}
				}
			},
			//封装请求
			Request(avatar, nick_name, shop_phone) {
				this.$request('/api/user-info', {
					avatar,
					nick_name,
					shop_phone,
				}, "PUT").then((res) => {
					uni.navigateBack({
						delta: 1
					})
					uni.showToast({
						title: '保存成功',
						duration: 2000
					})
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #F9F9F9;
	}

	.index {
		width: 100%;

		.infoUrl {
			width: 710rpx;
			height: 140rpx;
			margin: 24rpx auto 16rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.Tes {
				margin-left: 30rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.avaUrl {
				margin-right: 50rpx;
				display: flex;
				align-items: center;
				width: 100rpx;
				height: 100rpx;

				image {
					width: 100rpx;
					height: 100rpx;
				}
			}
		}

		.infoName {
			width: 710rpx;
			height: 88rpx;
			margin: 0 auto;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.Tes {
				margin-left: 30rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.userName {
				text-align: right;
				margin-right: 50rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
			}
		}

		.infoPhone {
			width: 710rpx;
			height: 88rpx;
			margin: 20rpx auto 22rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.Tes {
				margin-left: 30rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}

			.userPhone {
				text-align: right;
				margin-right: 50rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #999999;
			}
		}

		.Keep {

			margin: 220rpx auto 0;
			width: 522rpx;
			height: 80rpx;
			background: #d9d9d9;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.KeepState {
			margin: 220rpx auto 0;
			width: 522rpx;
			height: 80rpx;
			background: #FE694F;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.BaoCun {
			margin: 220rpx auto 0;
			width: 522rpx;
			height: 80rpx;
			background: #FE694F;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #ffffff;
		}

		.Mask {
			position: fixed;
			z-index: 1;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			height: 100%;
			width: 100%;
			background-color: #000;
			opacity: .3;
		}

		.CodeTips {
			position: fixed;
			z-index: 2;
			bottom: 0;
			width: 100%;
			height: 344rpx;
			background: #f7f8fa;
			display: flex;
			flex-direction: column;

			.Title {
				width: 100%;
				height: 73rpx;
				border-bottom: 2rpx solid #f2f2f2;
				display: flex;
				align-items: center;

				.icon {
					margin-left: 52rpx;
					display: flex;
					align-items: center;

					image {
						width: 18rpx;
						height: 34rpx;
					}
				}

				.Test {
					margin-left: 210rpx;
					font-size: 24rpx;
					font-weight: 500;
					color: #000000;
				}
			}

			.Content {
				width: 100%;
				height: 269rpx;
				display: flex;
				flex-direction: column;

				.Test {
					margin-top: 25rpx;
					margin-left: 24rpx;
					display: flex;
					align-items: center;

					.One {
						font-size: 20rpx;
						font-weight: 500;
						color: #000000;
					}

					.Two {
						font-size: 20rpx;
						font-weight: 500;
						color: #FE694F;
					}
				}

				.InputCode {
					display: flex;
					align-items: center;
					margin: 8rpx 24rpx 0;

					.Input {
						width: 540rpx;
						height: 64rpx;
						background: #ffffff;
						display: flex;
						align-items: center;

						input {
							width: 80%;
							margin-left: 20rpx;
							font-size: 20rpx;
							font-weight: 500;
							color: #000000;
						}
					}

					.Num {
						width: 162rpx;
						height: 64rpx;
						background: #d9d9d9;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}

				.confirm {
					width: 260rpx;
					height: 68rpx;
					margin: 36rpx auto 0;
					background: #d9d9d9;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					font-weight: 500;
					color: #000000;
				}
			}
		}


	}
</style>
