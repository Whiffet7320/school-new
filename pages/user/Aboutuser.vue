<template>
	<view class="index">
		<view class="About">
			<view class="Title">
				关于我们
			</view>
			<view class="Conentn">
				<u-parse :html="content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:`<p>
    “广科帮帮平台”专注于大学及高校生活的方方面面，吃喝玩乐一样不少，以学生为本，关注学生生活，密切关注校园学术动态。
</p>
<p><br/></p>
<p>
    免费提供二手品买卖、失物招领、工作兼职、信息发布、成绩查询、课表查询、点餐等服务，免费发布新闻，报道学生校园生活，反映校园生活的平台。
</p>
<p><br/></p>
<p>
    欢迎大家加入平台！
</p>
<p>
    <br/>
</p>`
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		background: #f7f8fa;
	}
</style>
<style lang="scss" scoped>
	.index{
		width: 100%;
		.About{
			width: 686rpx;
			margin: 20rpx auto;
			background: #ffffff;
			border-radius: 10rpx 10rpx 0rpx 0rpx;
			display: flex;
			flex-direction: column;
			.Title{
				width: 100%;
				height: 109rpx;
				border-bottom: 2rpx dashed #e5e5e5;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				font-weight: 700;
				color: #000000;
			}
			.Conentn{
				margin: 28rpx 32rpx;
				margin-top: 29rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: #000000;
				text-align: justify;
				min-height: 200rpx;
			}
		}
	}

</style>
