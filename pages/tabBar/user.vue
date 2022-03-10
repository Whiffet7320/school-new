<template>
	<view class="user">
		<u-toast ref="uToast" />
		<view class="Header">
			<view class="TopImg">
				<image src="/static/user/user-back.png" mode=""></image>
			</view>
			<view class="userInfo">
				<view class="avaUrl">
					<image :src="user.avatar?user.avatar:''" mode=""></image>
				</view>
				<view class="subject">
					<view class="Content">
						<view class="Name">
							{{user.nickname?user.nickname:''}}
						</view>
						<view class="userPhone">
							{{user.phone?user.phone:''}}
						</view>
					</view>
					<view class="InfoTips">
						<view class="Set_up" @click="GoInfo">
							<image src="/static/user/shezhi.png" mode=""></image>
						</view>
						<view class="Notice" @click="GoNotice">
							<image src="/static/user/tongzhi.png" mode=""></image>
							<u-badge type="error" :count="count"></u-badge>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="MyFunc">
			<view class="Title">
				个人资料
			</view>
			<view class="subject">
				<view class="FuncList" @click="UpPic">
					<view class="Pic">
						<image src="/static/images/lujin3096.png" mode=""></image>
					</view>
					<view class="Name">更换头像</view>
				</view>
				<view class="FuncList" @click="xgNameShow = true">
					<view class="Pic">
						<image src="/static/images/lujin3094.png" mode=""></image>
					</view>
					<view class="Name">更换昵称</view>
				</view>
				<view class="FuncList" @click="GoInfo">
					<view class="Pic">
						<image src="/static/images/lujin3095.png" mode=""></image>
					</view>
					<view class="Name">更换手机号</view>
				</view>
			</view>
		</view>

		<view class="OtherFunc">
			<view class="Title">
				其他功能
			</view>
			<view class="subject">
				<!-- <view class="FuncList" @click="OtherSelect(0)">
					<view class="Pic">
						<image src="/static/user/shangjiaruzhu.png" mode="aspectFit"></image>
					</view>
					<view class="Name">商家入驻</view>
				</view> -->
				<view class="FuncList" @click="jump('/pages/user/Aboutuser')">
					<view class="Pic">
						<image src="/static/user/guanyuwomen.png" mode="aspectFit"></image>
					</view>
					<view class="Name">关于我们</view>
				</view>
				<view class="FuncList">
					<button class="u-reset-button" open-type="contact">
						<view class="Pic">
							<image src="/static/user/lianxikefu.png" mode="aspectFit"></image>
						</view>
						<view class="Name">联系客服</view>
					</button>
				</view>
				<view class="FuncList" @click="jump('/pages/user/UserAgreement')">
					<view class="Pic">
						<image src="/static/user/yonghuxieyi.png" mode="aspectFit"></image>
					</view>
					<view class="Name">用户协议</view>
				</view>
				<view class="FuncList" @click="jump('/pages/user/PrivacyAgreement')">
					<view class="Pic">
						<image src="/static/user/yinsizhengce.png" mode="aspectFit"></image>
					</view>
					<view class="Name">隐私政策</view>
				</view>
				<view class="FuncList" @click="OtherSelect(0)">
					<view class="Pic">
						<image src="/static/user/xiangguantiaokuan.png" mode="aspectFit"></image>
					</view>
					<view class="Name">相关条款</view>
				</view>
				<!-- <view class="FuncList" v-for="(item,index) in OtherFuncList" :key="index" @click="OtherSelect(index)">
					<view class="Pic">
						<image :src="item.pic" mode=""></image>
					</view>
					<view class="Name">
						{{item.name}}
					</view>
				</view> -->
			</view>
		</view>

		<view @click="outLogin" class="ExitLogin">
			退出登陆
		</view>

		<view class="Mask" v-if="Service"></view>
		<view class="Tips" v-if="Service">
			<view class="Tes">
				{{ServicePhone}}
			</view>
			<view class="Cont" @click="CallPhone(ServicePhone)">
				呼叫
			</view>
			<view class="NoChak" @click="NoChak">
				取消
			</view>
		</view>
		<!-- 修改昵称 -->
		<u-popup mode='center' border-radius="10" v-model="xgNameShow" width="448rpx" height="336rpx">
			<view class="pop1">
				<view class="txt1">修改昵称</view>
				<!-- <image class="pic1" src="/static/images/zu11111.png" mode=""></image> -->
				<u-input v-model="nicheng" :clearable='false' type="text" :border="false" border />
				<view class="btns">
					<view @click="changeNickname" class="btn1">修改</view>
					<view @click="xgNameShow = false" class="btn2">取消</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xgNameShow:false,
				nicheng:'',
				user: {},
				userAvaurl: '/static/user/touxiang.png', //用户头像
				userName: '', //用户名称
				userPhone: '', //用户手机号码
				ZiChanList: [{
						name: '余额',
						amount: 0,
						pic: '/static/user/yue.png'
					},
					{
						name: '红包',
						amount: 0,
						pic: '/static/user/hongbao.png'
					},
					{
						name: '优惠券',
						amount: 0,
						pic: '/static/user/youhuijuan.png'
					}
				],
				MyFuncList: [{
					name: '收货地址',
					pic: '/static/user/shouhuodizhi.png'
				}, ],
				OtherFuncList: [{
						name: '商家入驻',
						pic: '/static/user/shangjiaruzhu.png'
					},
					{
						name: '联系客服',
						pic: '/static/user/lianxikefu.png'
					},
					{
						name: '关于我们',
						pic: '/static/user/guanyuwomen.png'
					},
					{
						name: '用户协议',
						pic: '/static/user/yonghuxieyi.png'
					},
					{
						name: '隐私政策',
						pic: '/static/user/yinsizhengce.png'
					},
					{
						name: '相关条款',
						pic: '/static/user/xiangguantiaokuan.png'
					},
				],
				Service: false, //联系客服
				ServicePhone: '0577-89898989',
				count: 0
			}
		},
		onShow() {
			this.getData();
		},
		methods: {
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
			// 修改昵称
			async changeNickname() {
				const res = await this.$api.update_user_info({
					nickname: this.nicheng
				})
				console.log(res)
				if (res.code == 200) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'success',
						duration: 1000,
						callback: () => {
							this.getData();
							this.xgNameShow = false
						}
					})
				}
			},
			jump(path) {
				uni.navigateTo({
					url: path
				})
			},
			async getData() {
				const res = await this.$api.userInfo()
				console.log(res)
				this.user = res.data;
				this.nicheng = this.user.nickname;
				this.$store.commit("setUserinfo", {
					uid: res.data.uid
				});
				this.$api.wait_read_num().then((res) => {
					if (res.code == 200) {
						this.count = res.data.count;
						if (this.count > 0) {
							uni.setTabBarBadge({
								index: 2,
								text: this.count > 99 ? "99+" : this.count.toString()
							})
							this.$store.commit("setBadge", this.count);
						} else {
							uni.removeTabBarBadge({
								index: 2
							});
						}
					}
				})
			},
			outLogin() {
				uni.setStorageSync("token", null);
				this.getData()
			},
			//我的资产
			ZiChanNav(index) {
				this.$u.toast("即将开放，敬请期待");
				// switch (index) {
				// 	case 0:
				// 		// 开发中
				// 		uni.navigateTo({
				// 			url: '/pages/index/kfing/kfing'
				// 		})
				// 		// uni.navigateTo({
				// 		// 	url: '/pages/user/BalancePage'
				// 		// })
				// 		break;
				// 	case 1:
				// 		// 开发中
				// 		uni.navigateTo({
				// 			url: '/pages/index/kfing/kfing'
				// 		})
				// 		// uni.navigateTo({
				// 		// 	url: '/pages/user/RedPacketPage'
				// 		// })
				// 		break;
				// 	case 2:
				// 		// 开发中
				// 		uni.navigateTo({
				// 			url: '/pages/index/kfing/kfing'
				// 		})
				// 		// uni.navigateTo({
				// 		// 	url: '/pages/user/couponPage'
				// 		// })
				// 		break;
				// }
			},
			//我的功能
			MyFuncSelect(index) {
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '/pages/user/ReceivingAddress'
						})
						break;

				}
			},
			//其他功能
			OtherSelect(index) {
				switch (index) {
					case 0:
						this.$u.toast("即将开放，敬请期待");
						// 开发中
						// uni.navigateTo({
						// 	url: '/pages/index/kfing/kfing'
						// })
						// uni.navigateTo({
						// 	url:'/pages/user/MerchantSettlement'
						// })
						break;
						// case 1:
						// 	// uni.hideTabBar({})
						// 	// this.Service = !this.Service
						// 	this.CallPhone(this.ServicePhone)
						// 	break;
					case 1:
						uni.navigateTo({
							url: '/pages/user/Aboutuser'
						})
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/user/UserAgreement'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/user/PrivacyAgreement'
						})
						break;
					case 4:
						this.$u.toast("即将开放，敬请期待");
						// 开发中
						// uni.navigateTo({
						// 	url: '/pages/index/kfing/kfing'
						// })
						// uni.navigateTo({
						// 	url:'/pages/user/RelevantProvisions'
						// })
						break;
				}
			},
			//取消联系客服遮罩层
			NoChak() {
				this.Service = !this.Service
			},
			//呼叫
			CallPhone(value) {
				uni.makePhoneCall({
					phoneNumber: value,
					success: (res) => {
						console.log(res)
					}
				})
			},
			//个人信息
			GoInfo() {
				uni.navigateTo({
					url: '/pages/user/PersonalInfo'
				})
			},
			//通知
			GoNotice() {
				uni.navigateTo({
					url: '/pages/user/NotifyMessage'
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background: #f7f8fa;
	}

	.user {
		width: 100%;
		height: 100%;

		.Header {
			width: 100%;
			display: flex;
			flex-direction: column;

			.TopImg {
				position: absolute;
				z-index: -1;

				image {
					width: 750rpx;
					height: 350rpx;
				}
			}

			.Navtop {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 176rpx;

				.Title {
					margin-top: 88rpx;
					font-size: 34rpx;
					font-weight: 700;
					color: #ffffff;
				}
			}

			.userInfo {
				height: 184rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 40rpx 50rpx 32rpx 32rpx;

				.avaUrl {
					display: flex;
					align-items: center;

					image {
						width: 184rpx;
						height: 184rpx;
						border-radius: 50%;
						background-color: #eee;
					}
				}

				.subject {
					width: 464rpx;
					height: 184rpx;
					display: flex;
					justify-content: space-between;

					.Content {
						display: flex;
						flex-direction: column;
						justify-content: center;

						.Name {
							font-size: 44rpx;
							font-weight: 700;
							color: #ffffff;
						}

						.userPhone {
							font-size: 28rpx;
							font-weight: 400;
							color: #ffffff;
						}
					}

					.InfoTips {
						display: flex;

						.Set_up {
							display: flex;

							image {
								width: 42rpx;
								height: 40rpx;
							}
						}

						.Notice {
							display: flex;
							margin-left: 46rpx;

							image {
								width: 40rpx;
								height: 40rpx;
							}
						}
					}
				}

			}
		}

		.ZiChan {
			width: 702rpx;
			height: 220rpx;
			margin: 0 auto;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;

			.Title {
				margin: 28rpx 0 0 34rpx;
				font-size: 28rpx;
				font-weight: 700;
				color: #000000;
			}

			.BanList {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				margin: 25rpx auto 0;

				.StausList {
					display: flex;
					flex-direction: column;
					align-items: center;

					.OneSele {
						display: flex;
						align-items: center;

						.Pic {
							display: flex;
							align-items: center;

							image {
								width: 52rpx;
								height: 54rpx;
							}
						}

						.Name {
							margin-left: 16rpx;
							font-size: 24rpx;
							font-weight: 700;
							color: #000000;
						}
					}

					.TwoSele {
						margin-top: 16rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #000000;
					}
				}
			}
		}

		.MyFunc {
			width: 702rpx;
			height: 220rpx;
			margin: 20rpx auto;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;

			.Title {
				margin: 28rpx 0 0 34rpx;
				font-size: 28rpx;
				font-weight: 700;
				color: #000000;
			}

			.subject {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-around;
				margin: 25rpx auto 0;

				.FuncList {
					display: flex;
					align-items: center;
					flex-direction: column;

					.Pic {
						display: flex;
						align-items: center;

						image {
							width: 44rpx;
							height: 54rpx;
						}
					}

					.Name {
						margin-top: 12rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #000000;
					}
				}
			}
		}

		.OtherFunc {
			width: 702rpx;
			height: 332rpx;
			margin: 0 auto 88rpx;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;

			.Title {
				margin: 28rpx 0 0 34rpx;
				font-size: 28rpx;
				font-weight: 700;
				color: #000000;
			}

			.subject {
				width: 660rpx;
				// margin: 38rpx 59rpx 0 54rpx;
				margin: 36rpx 54rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.FuncList {
					margin-right: 68rpx;
					margin-bottom: 32rpx;
					display: flex;
					align-items: center;
					flex-direction: column;

					.Pic {
						display: flex;
						align-items: center;
						justify-content: center;

						image {
							width: 38rpx;
							height: 42rpx;
						}
					}

					.Name {
						margin-top: 12rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #000000;
					}
				}
			}
		}

		.ExitLogin {
			width: 522rpx;
			height: 80rpx;
			margin: 0 auto 91rpx;
			background: #fe694f;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: 500;
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

		.Tips {
			position: fixed;
			z-index: 2;
			bottom: 0;
			display: flex;
			align-items: center;
			flex-direction: column;
			justify-content: space-evenly;
			width: 100%;
			height: 434rpx;
			background: #ffffff;
			border-radius: 40rpx 40rpx 0rpx 0rpx;

			.Tes {
				font-size: 28rpx;
				font-weight: 700;
				color: #ffa900;
			}

			.Cont {
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
			}

			.NoChak {
				width: 100%;
				border-top: 8rpx solid #f7f8fa;
				height: 162rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #c4c4c4;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}


	}
	.pop1{
		display: flex;
		flex-direction: column;
		align-items: center;
		.txt1{
			margin-top: 32rpx;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #000000;
			margin-bottom: 52rpx;
		}
		.pic1{
			margin-top: 32rpx;
			width: 160rpx;
			height: 128rpx;
		}
		.btns{
			display: flex;
			align-items: center;
			width: 448rpx;
			height: 92rpx;
			margin-top: 38rpx;
			.btn1{
				width: 50%;
				text-align: center;
				color: #ff451a;
			}
			.btn2{
				width: 50%;
				text-align: center;
				color: #848484;
			}
		}
	}
	
</style>
