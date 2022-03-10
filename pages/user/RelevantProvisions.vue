<template>
	<view class="index">
		<Navtop title="相关条款"></Navtop>
		
		<view class="TipsList" v-for="(item,index) in TestList" :key="index">
			<view class="Test">
				{{item}}
			</view>
			<view class="icon">
				<image src="/static/user/youjiantou.png" mode=""></image>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TestList:[
					'商户违规行为管理办法',
					'商品信息发布规则',
					'食品安全管理规范',
					'食品安全自查制度',
					'隐私权政策',
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background: #f7f8fa;
	}
	.index{
		width: 100%;
		.TipsList{
			width: 710rpx;
			height: 88rpx;
			margin: 20rpx auto 0;
			background: #ffffff;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.Test{
				margin-left: 30rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #333333;
			}
			.icon{
				margin-right: 34rpx;
				display: flex;
				align-items: center;
				image{
					width: 12rpx;
					height: 22rpx;
				}
			}
		}
	}

</style>
