<template>
    <view class="navbar">
        <view class="navbar-fixed" :style="{background:color}">
            <!-- 状态栏小程序撑起高度 -->
            <view :style="{height:statusBarHeight+'px'}"></view>
            <view class="navbar-content" :style="{height:navBarHeight+'px',width:windowWidth+'px'}">
                <view class="back" @click="toBack">
					<image src="/static/images/icon_back.png" style="width: 18rpx;height: 34rpx;"></image>
				</view>
				<view class="navbar-search">
                    <view class="navbar-search_icon">
                       <image src="/static/images/icon_search.png" mode="" class="imgs"></image>
                    </view>
                    <view class="navbar-serach">
                        <view class="navbar-search_text">{{value}}</view>
                    </view>
                </view>
			</view>
        </view>
        <!-- 需要添加占位符高度  状态栏高度+导航栏高度（否则下面tab会塌陷）-->
        <view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
    </view>
</template>

<script>
    export default {
        name: 'searchNavbar',
		props:{
			value:{
				type:String,
				default:""
			},
			color:{
				type:String,
				default:"#FE694F"
			}
		},
        data() {
            return {
                statusBarHeight: 20,/* 状态栏高度 */
                navBarHeight: 45,/* 导航栏高度 */
                windowWidth: 375,/* 窗口宽度 */
                /* 设定状态栏默认高度 */
            };
        },
		methods:{
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
		},
        created() {
            // 获取手机系统信息
            const info = uni.getSystemInfoSync()
            // 设置状态栏高度（H5顶部无状态栏小程序有状态栏需要撑起高度）
            this.statusBarHeight = info.statusBarHeight
            this.windowWidth = info.windowWidth
            // 除了h5 app mp-alipay的情况下执行
            // #ifndef H5 || APP-PLUS || MP-ALIPAY
            // 获取胶囊的位置
            const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            console.log(menuButtonInfo);
            // (胶囊底部高度 - 状态栏的高度) + (胶囊顶部高度 - 状态栏内的高度) = 导航栏的高度
            this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
            this.windowWidth = menuButtonInfo.left
            // #endif
        }
    }
</script>

<style lang="scss">
    .navbar {
        .navbar-fixed {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 99;
            width: 100%;
            .navbar-content {
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
				padding:0 60rpx 0 38rpx;
				.back{
					margin-right: 30rpx;
				}
                .navbar-search {
                    display: flex;
                    align-items: center;
                    padding: 0 32rpx 0 0;
                    width: 100%;
                    height: 64rpx;
                    background: #ffffff;
                    border-radius: 32rpx;

                    .navbar-search_icon {
                        margin-right: 15rpx;
						.imgs{
							margin-left: 38rpx;
							width: 25rpx;
							height: 25rpx;
						}
                    }
                    .navbar-search_text {
						display: flex;
						align-items: center;
						padding:0 16rpx;
                        height: 40rpx;
                        background: #f1f1f1;
                        border-radius: 20rpx;
						font-size: 20rpx;
						font-family: PingFang SC, PingFang SC-Medium;
						font-weight: 500;
						color: #000000;
                    }
                }
            }
        }
    }
</style>