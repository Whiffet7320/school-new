<template>
	<view class="index">
		<Navtop title="商家入驻"></Navtop>
		<view class="BackPic">
			<image src="https://guangke.bjxinzeyuan.cn/static/img/user/backPic.png" mode=""></image>
		</view>
		<view class="RuzhuPlate">
			<view class="Title">
				<view :class="RuzhuDex === index?'SeleState':'SeleList'" v-for="(item,index) in SelectList" :key="index" @click="Select(index)">
					{{item}}
				</view>
			</view>
			
			<view class="userInfo">
				<view class="userName">
					<input type="text" value="" v-model="userName" placeholder="您的名字" />
				</view>
				<view class="userPhone">
					<input type="text" value="" v-model="userPhone" placeholder="手机号码" />
				</view>
				<view class="PhoneCode">
					<view class="Codes">
						<input type="text" value="" v-memo="userPhone" placeholder="手机验证码" />
					</view>
					<view class="SendOut" @click="SenCode" v-if="!CodeBos">
						手机验证码
					</view>
					<view class="Sender" v-if="CodeBos">
						重新发送({{Seco}}S)
					</view>
				</view>
				<view class="applyRuzhu">
					申请入驻
				</view>
			</view>
			
		</view>
		
		<view class="TestTips">
			<view class="Title">
				加入合伙人须知
			</view>
			<view class="Content">
				<view class="One">
					1、请填写有效身份的身份信息（姓名、手机号、验证码)，以确保信息的真实性。   
				</view>
				<view class="Two">
					2、提交信息后，管理员会及时审核，请耐心等候。
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				SelectList:[
					'入驻商家',
					'加盟骑手',
				],
				RuzhuDex:0,
				userName:'',//名字
				userPhone:'',//手机号码
				Seco:60,//重新发送秒数
				CodeBos:false,
				Duite:'',//验证码对比
			}
		},
		methods: {
			//选择入驻方式
			Select(index){
				this.RuzhuDex = index
			},
			//发送验证码
			SenCode(){
				if(this.userName === '' || this.userPhone === ''){
					uni.showToast({
						title:'请输入账号和姓名',
						icon:'none',
						duration:1500
					})
				}else{
					this.CodeBos = !this.CodeBos
					var set = setInterval(()=>{
						this.Seco--
						if(this.Seco === 0){
							this.Seco = 60
							clearInterval(set)
							this.CodeBos = !this.CodeBos
						}
					},1000)
					
				}
				
			},
		}
	}
</script>

<style lang="scss">
	.index{
		width: 100%;
		.BackPic{
			width: 100%;
			height: 450rpx;
			image{
				width: 100%;
				height: 450rpx;
			}
		}
		.RuzhuPlate{
			position: relative;
			z-index: 1;
			width: 686rpx;
			height: 656rpx;
			margin: -146rpx auto 0;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			.Title{
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				height: 146rpx;
				.SeleList{
					height: 54rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: #848484;
					border-bottom: 2rpx solid transparent;
				}
				.SeleState{
					height: 54rpx;
					font-size: 32rpx;
					font-weight: 700;
					color: #FE694F;
					border-bottom: 2rpx solid #FE694F;
				}
			}
			.userInfo{
				display: flex;
				flex-direction: column;
				.userName,
				.userPhone{
					margin-left: 70rpx;
					width: 616rpx;
					height: 118rpx;
					border-bottom: 2rpx solid #f7f8fa;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					font-weight: 400;
					color: #848484;
				}
				.PhoneCode{
					margin-left: 70rpx;
					width: 616rpx;
					height: 118rpx;
					border-bottom: 2rpx solid #f7f8fa;
					display: flex;
					align-items: center;
					.Codes{
						font-size: 28rpx;
						font-weight: 400;
						color: #848484;
					}
					.SendOut{
						font-size: 28rpx;
						font-weight: 400;
						color: #fe694f;
					}
					.Sender{
						font-size: 28rpx;
						font-weight: 400;
						color: #fe694f;
					}
				}
				.applyRuzhu{
					width: 552rpx;
					height: 80rpx;
					margin: 41rpx auto 0;
					background: #fe694f;
					border-radius: 10rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 28rpx;
					font-weight: 500;
					color: #ffffff;
				}
			}
			
			
		}
		.TestTips{
			width: 686rpx;
			height: 230rpx;
			margin: 20rpx auto;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			.Title{
				margin-left: 28rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
			}
			.Content{
				width: 630rpx;
				height: 110rpx;
				margin: 0 auto;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				font-weight: 400;
				color: #848484;
			}
		}
		
	}
	

</style>
