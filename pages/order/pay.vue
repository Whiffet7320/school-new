<template>
	<view>
		<u-toast ref="uToast" />
		<view class="oinfo">
			<image :src="obj.myImg_paths" mode="aspectFit" class="img"></image>
			<view class="info">
				<view class="name">{{obj.product_name}}</view>
				<view class="ft">
					<view class="price">¥{{obj.price}}</view>
					<view class="time">剩余<text class="red">{{nowDJSTime}}</text></view>
				</view>
			</view>
		</view>
		<view class="payinfo">
			<view class="tit">支付方式</view>
			<view class="wpay">
				<image src="/static/images/icon_wechat.png" mode="aspectFit" class="icon"></image>
				<view class="mid">
					<view class="hd">微信支付<text class="text">推荐</text></view>
					<view class="desc">亿万用户的选择，更快更安全</view>
				</view>
				<view class="check">
					<image src="/static/images/icon_check.png" mode="aspectFit" style="width: 26rpx;height: 26rpx;"></image>
				</view>
			</view>
		</view>
		<view @click="toPay" class="ftbtn safe-area-inset-bottom">
			<view class="btn">支付¥{{obj.price}}</view>
		</view>
		<u-gap height="100"></u-gap>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				obj:{},
				nowDJSTime:'',
				payTime:0,
				addressId:'',
				payType:'',
				team_id:'',
			}
		},
		onShow() {
			this.getData();
		},
		onLoad(options) {
			console.log(options)
			if(options.item){
				this.obj = JSON.parse(options.item);
				if(this.obj.img_paths!=''){
					this.obj.myImg_paths = this.obj.img_paths.split(',');
					this.obj.myImg_paths.forEach((img, i) => {
						this.$set(this.obj.myImg_paths, i, `${img}`)
					})
				}
				console.log(this.obj)
			}
			if(options.addressId){
				this.addressId = options.addressId;
			}
			if(options.payType){
				this.payType = options.payType;
			}
		},
		mounted() {
			var endTime = new Date().getTime();
			var s = setInterval(() => {
				var dates = this.countTime(endTime+this.payTime*3600000, "go");
				if (dates <= 0) {
					clearInterval(s)
				}
			}, 1000)
		},
		methods:{
			async getData(){
				const res = await this.$api.web_config();
				console.log(res)
				res.data.forEach(ele=>{
					if(ele.tag == 'pay_time'){
						this.payTime = Number(ele.value);
					}
				})
			},
			async toPay(){
				const res = await this.$api.buy_pindan({
					pindan_id:this.obj.id,
					address_id:this.addressId,
					is_pin:this.payType,
					team_id:this.team_id != ''?this.team_id:'0'
				});
				console.log(res)
				if (res.code == 200) {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.data.timeStamp.toString(),
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success: ()=> {
							this.$refs.uToast.show({
								title: '支付成功',
								type: 'success',
								url: '/pages/tabBar/user',
								isTab: true,
							})
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
					});
				} else {
					this.$refs.uToast.show({
						title: res.msg,
						type: 'warning',
					})
				}
			},
			countTime(time, id) {
				var date = new Date();
				var now = date.getTime();
				// var endDate = new Date(time); //设置截止时间
				// var end = endDate.getTime();
				var end = time;
				var leftTime = end - now; //时间差                              
				var d, h, m, s, ms;
				if (leftTime >= 0) {
					d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
					h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
					m = Math.floor(leftTime / 1000 / 60 % 60);
					s = Math.floor(leftTime / 1000 % 60);
					ms = Math.floor(leftTime % 1000);
					if (ms < 100) {
						ms = "0" + ms;
					}
					if (s < 10) {
						s = "0" + s;
					}
					if (m < 10) {
						m = "0" + m;
					}
					if (h < 10) {
						h = "0" + h;
					}
					//将倒计时赋值到div中
					console.log(d + "天" + h + "时" + m + "分" + s + "秒" + ms + "毫秒")
					this.nowDJSTime = h + ":" + m + ":" + s + "秒"
				} else {
					console.log('已截止')
				}
				//递归每秒调用countTime方法，显示动态时间效果
				return leftTime
			}
		}
	}
</script>
<style>
	page{
		background: #f2f2f2;
	}
</style>
<style lang="scss" scoped>
	.oinfo{
		padding:32rpx 24rpx;
		background: #ffffff;
		display: flex;
		.img{
			width: 160rpx;
			height: 160rpx;
			background-color: #eee;
			border-radius: 10rpx;
			flex-shrink: 0;
		}
		.info{
			flex:1;
			padding-left: 20rpx;
			.name{
				width: 100%;
				height: 68rpx;
				font-size: 24rpx;
				font-family: PingFang SC, PingFang SC-Bold;
				font-weight: 700;
				color: #000000;
				margin-bottom: 52rpx;
			}
			.ft{
				display: flex;
				align-items: center;
				.price{
					flex:1;
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #ff0000;
				}
				.time{
					font-size: 20rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
				}
				.red{
					color:#FF0000;
				}
			}
		}
	}
	.payinfo{
		padding:32rpx 24rpx;
		.tit{
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #b3b3b3;
			margin-bottom: 12rpx;
		}
		.wpay{
			width: 100%;
			padding:0 48rpx 0 44rpx;
			height: 206rpx;
			background: #ffffff;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			.icon{
				width: 42rpx;
				height: 38rpx;
				margin-right: 33rpx;
			}
			.mid{
				width: 510rpx;
				.hd{
					display: flex;
					align-items: center;
					font-size: 28rpx;
					font-family: PingFang SC, PingFang SC-Bold;
					font-weight: 700;
					color: #000000;
					.text{
						display: flex;
						align-items: center;
						justify-content: center;
						width: 56rpx;
						height: 32rpx;
						border: 2rpx solid #ff0000;
						border-radius: 4rpx;
						text-align: center;
						margin-left: 60rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #ff0000;
					}
				}
				.desc{
					margin-top: 16rpx;
					font-size: 24rpx;
					font-family: PingFang SC, PingFang SC-Medium;
					font-weight: 500;
					color: #000000;
				}
			}
			.check{
				width: 26rpx;
				height: 26rpx;
			}
		}
	}
	.ftbtn{
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 100rpx;
		padding:0 24rpx;
		background: #ffffff;
		box-shadow: 0rpx 8rpx 28rpx 0rpx rgba(166,179,194,0.30);
		.btn{
			width: 100%;
			height: 64rpx;
			line-height: 64rpx;
			background: #FE694F;
			border-radius: 32rpx;
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}
	}
</style>
