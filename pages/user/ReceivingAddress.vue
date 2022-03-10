<template>
	<view class="index">
		<view class="DizhiIcon" v-if="Addresslist.length == 0">
			<view class="icon">
				<image src="/static/user/dizhi.png" mode=""></image>
			</view>
			<view class="Test">
				你还没有收货地址哦
			</view>
		</view>
		
		<view class="AddRess">
			<uni-swipe-action>
				<uni-swipe-action-item class="uitem" v-for="(item,index) in Addresslist" :key="index">
					<view class="Bito" @click="toEditAddress(item)">
						<view class="Hiurs">
							<view class="NaPh">
								<view class="Name">
									{{item.real_name}}
								</view>
								<view class="Phone">
									{{item.phone}}
								</view>
							</view>
							
							<view class="Defas" >
								<view class="DeTes" v-if="item.is_default == 1">
									默认
								</view>
							</view>
						</view>
						<view class="DDress">
							{{item.detail}}
						</view>
						<view class="Defes" @click.stop="Default(item)">
							<view class="Pic">
								<image :src="item.is_default?'/static/user/morendizhi-h.png':'/static/user/morendizhi.png'"></image>
							</view>
							<view class="Tes">
								设置为默认地址
							</view>
						</view>
					</view>
					<template v-slot:right>
						<view class="Delete" @click.stop="Delete(item)">
							<image src="/static/images/icon_deletes.png" mode="aspectFit" style="width: 30rpx;height:30rpx;margin-bottom: 12rpx;"></image>
							<text>删除</text>
						</view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		
		<view class="GoAdds" @click="Addes">
			新建地址
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				state:'',//判断是否拥有地址
				Addresslist:[],
				pag:1,//页码
				size:6,//数量
				leftStyle:0,//滑动效果
				startX:0,//滑动效果
				hiddenFlag:true,//滑动效果
				delBtnWidth:162,//滑动效果
				dier:'',//防止滑动效果重复
			}
		},
		onShow() {
			this.ddrelist()
			this.state = this.Addresslist.length
		},
		methods: {
			toEditAddress(item){
				uni.navigateTo({
					url:`/pages/user/NewAddress?editAddress=${JSON.stringify(item)}`
				})
			},
			//获取地址信息
			async ddrelist(){
				const res = await this.$api.address();
				console.log(res)
				this.Addresslist = res.data;
			},
			//新建地址
			Addes(){
				uni.navigateTo({
					url:'NewAddress'
				})
			},
			//设置默认地址
			async Default(item){
				const res = await this.$api.upDateAddress({
					is_default: item.is_default == '0' ? '1' : '0',
				},item.id)
				console.log(res)
				if(res.code == 200){
					this.ddrelist()
				}
			},
			//左滑删除
			touchS(e,index) {
				this.leftStyle = 0
				// startX记录开始移动的位置
				if (e.touches.length === 1) {
					this.startX = e.touches[0].clientX
				}
				// hiddenFlag为true则是从右向左，为false则是从左向右
				if (this.leftStyle === 0) {
					this.hiddenFlag = true;
				} else {
					this.hiddenFlag = false;
				}
				this.dier = index
				if(this.leftStyle === 0){
					this.leftStyle = 28
				}
			},
			touchM(e) {
				if (e.touches.length === 1) {
					//手指移动时水平方向位置
					const moveX = e.touches[0].clientX
					this.moveFunc(moveX);
				}
			},
			touchE(e) {
				const {
					leftStyle,
					delBtnWidth
				} = this;
				// 如果停止滑动的距离大于二分之一则直接弹出删除按钮，不然则left为0
				if (-leftStyle > delBtnWidth / 2) {
					this.leftStyle = -delBtnWidth;
				} else {
					if(this.leftStyle === 0 || this.leftStyle === 28){
						this.leftStyle = 28
					}else{
						this.leftStyle = -delBtnWidth;
					}
					
				}
			},
			moveFunc(moveX) {
				// 原始位置向左，leftStyle为小于0；原始位置向右，leftStyle为大于0
				// disX为相对最初位置的左右距离
				// 大于0为向右，小于0为向左
				const disX = moveX - this.startX;
				const delBtnWidth = this.delBtnWidth;
				let offsetNum = 0;
				if (-disX >= delBtnWidth && this.leftStyle === -delBtnWidth) {
					return;
				}
				// this.hiddenFlag为true则是从左到右，则应该将container向左移动
				// this.hiddenFlag为false则是从右向左，则应该将container向右移动
				if (this.hiddenFlag) {
					// 此时container为最右边，则应该将container向左移动
					// disX大于0为相对原始位置的向右移动，则直接将offsetNum置为0
					// 否则为向左移动，offsetNum为disX相反的值，判断是否超过设置的最大位置
					if (disX == 0 || disX > 0) {
						offsetNum = 0;
					} else {
						offsetNum = disX;
						if (disX <= -delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							offsetNum = -delBtnWidth;
						}
					}
				} else {
					// 此时container为最左边，应该向右移动
					// disX小于0为相对原始位置的向左移动，则直接将offsetNum置为-this.delBtnWidth
					// 否则为相对原始位置的向右移动，此时应该将最大位置与向右位置的差值为此刻位置，判断是否为大于0
					if (disX < 0) {
						offsetNum = -this.delBtnWidth;
					} else {
						offsetNum = -this.delBtnWidth + disX;
						if (offsetNum > 0) {
							offsetNum = 0;
						}
					}
				}
				this.leftStyle = offsetNum;
			},
			//删除地址
			async Delete(item){
				const res = await this.$api.deleteAddress(item.id);
				console.log(res);
				if(res.code == 200){
					this.ddrelist()
				}
			},
		
		
		
		}
	}
</script>
<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		background-color: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	.index{
		width: 100%;
		.DizhiIcon{
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 400rpx auto 60rpx;
			.icon{
				display: flex;
				align-items: center;
				image{
					width: 234rpx;
					height: 204rpx;
				}
			}
			.Test{
				margin-top: 26rpx;
				font-size: 20rpx;
				font-weight: 500;
				color: #000000;
			}
		}
		.AddRess{
			width: 100%;
			position: relative;
			overflow: hidden;
			padding: 20rpx 24rpx 20rpx 44rpx;
			.Bito{
				width: 99%;
				height: 252rpx;
				margin-bottom: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 33rpx 28rpx 31rpx;
				border-radius: 20rpx;
				background: #ffffff;
				border: 2rpx solid #f4f4f4;
				position: relative;
				.Hiurs{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.NaPh{
						display: flex;
						align-items: center;
						.Name{
							font-size: 28rpx;
							font-weight: 400;
							color: #000000;
						}
						.Phone{
							margin-left: 28rpx;
							font-size: 28rpx;
							font-weight: 400;
							color: #000000;
						}
					}
					.Defas{
						width: 58rpx;
						height: 28rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						.DeTes{
							width: 58rpx;
							height: 28rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: #FE694F;
							font-size: 20rpx;
							font-weight: 400;
							color: #ffffff;
						}
					}
					
				}
				.DDress{
					margin: 33rpx 0 59rpx 0;
					width: 520rpx;
					height: 34rpx;
					// overflow: hidden;
					// text-overflow:ellipsis;
					// white-space: nowrap;
					font-size: 24rpx;
					font-weight: 400;
					color: #000000;
				}
				.Defes{
					display: flex;
					align-items: center;
					.Pic{
						display: flex;
						align-items: center;
						image{
							width: 34rpx;
							height: 34rpx;
						}
					}
					.Tes{
						margin-left: 19rpx;
						font-size: 26rpx;
						font-weight: 400;
						color: #000000;
					}
				}
			}
		}
		.GoAdds{
			width: 612rpx;
			height: 80rpx;
			margin: 136rpx auto 0;
			background: #fe694f;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.Delete {
			width: 142rpx;
			height: 252rpx;
			border-radius:20rpx;
			background-color: #FE694F;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-size: 22rpx;
			font-weight: 400;
			color: #ffffff;
		}
	}
</style>
