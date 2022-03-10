<template>
	<view>
		<view class="searchwrp">
			<view class="searchbox">
				<image src="/static/images/icon_search.png" mode="aspectFit" class="icon"></image>
				<input @confirm='onSearch' type="text" v-model="value" placeholder="请输入你正在找的宝贝" placeholder-style="color:#B3B3B3;" @input="onInput" />
			</view>
			<view class="seabtn" @click="onCancel">取消</view>
		</view>
		<u-gap height="116"></u-gap>
		<view class="history" v-if="seaShow">
			<view class="tit">
				<text>历史搜索</text>
				<view class="fresh" @click="onDel">
					<image src="/static/images/icon_delete.png" mode="aspectFit" style="width: 30rpx;height: 30rpx;"></image>
				</view>
			</view>
			<view class="tagwrap">
				<view class="itag" v-for="(item,index) in hislist" :key="index" @click="ontag(item)">{{item}}</view>
			</view>
		</view>
		<view class="history" v-if="seaShow && tjlist.length">
			<view class="tit">
				<text>推荐搜索</text>
				<view class="fresh" @click="onResh"><image src="/static/images/icon_resh.png" mode="aspectFit" style="width: 24rpx;height: 23rpx;margin-right:17rpx;"></image>换一批</view>
			</view>
			<view class="tagwrap">
				<view class="itag" v-for="(item,index) in tjlist" :key="index">{{item}}</view>
			</view>
		</view>
		<view class="sealist" v-if="reShow">
			<view @click="onSearch" class="text">{{value}}</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default{
		// searchList
		computed: {
			...mapState(['searchList'])
		},
		data(){
			return{
				value:"",
				hislist:["化妆镜"],
				tjlist:[],
				list:[],
				seaShow:true,
				reShow:false,
				from:'',
				type:'0',
			}
		},
		methods:{
			onSearch(){
				this.$store.commit("setKey",this.value);
				this.$store.commit("searchList",this.value);
				uni.navigateTo({
					url:`/pages/search/list?from=${this.from}&type=${this.type}`
				})
			},
			onInput(e){
				if(e.detail.value!==""){
					this.seaShow = false;
					this.reShow = true;
				}else{
					this.seaShow = true;
					this.reShow = false;
				}
			},
			onCancel(){
				this.value = "";
			},
			onDel(){
				this.hislist = [];
				this.$store.commit("clearSearchList",'clear');
			},
			onResh(){
				this.$u.randomArray(this.tjlist);
			},
			ontag(item){
				this.$store.commit("setKey",item);
				uni.navigateTo({
					url:`/pages/search/list?from=${this.from}&type=${this.type}`
				})
			}
		},
		onLoad(options){
			console.log(options)
			if(options.type){
				this.type = options.type;
			}
			if(options.from){
				this.from = options.from;
			}
		},
		onShow() {
			this.hislist = [...this.searchList];
			this.tjlist = [...this.searchList];
			console.log(this.hislist)
			this.hislist.reverse();
			this.tjlist.reverse();
			console.log(this.hislist)
		},
	}
</script>
<style>
	page{
		background-color: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.searchwrp{
		padding: 20rpx 24rpx 32rpx;
		display: flex;
		align-items: center;
		width: 100%;
		position: fixed;
		top:0;
		left:0;
		z-index: 50;
		.searchbox{
			display: flex;
			align-items: center;
			width: 600rpx;
			height: 64rpx;
			background: #f1f1f1;
			border-radius: 32rpx;
			padding: 0 32rpx;
			font-size: 22rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
			input{
				flex:1;
			}
			.icon{
				width: 25rpx;
				height: 25rpx;
				margin-right: 13rpx;
			}
		}
		.seabtn{
			padding-left: 30rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
		}
	}
	.history{
		padding:0 24rpx 24rpx 24rpx;
		.tit{
			font-size: 28rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #090909;
			padding-bottom: 16rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.fresh{
				display: flex;
				align-items: center;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000000;
			}
		}
		.tagwrap{
			display: flex;
			align-items: center;
			.itag{
				display: flex;
				align-items: center;
				padding:0 26rpx;
				height: 40rpx;
				background: #f1f1f1;
				border-radius: 20rpx;
				font-size: 20rpx;
				font-family: PingFang SC, PingFang SC-Medium;
				font-weight: 500;
				color: #000000;
				margin-right: 40rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	.sealist{
		padding:0 25rpx;
		.text{
			padding: 40rpx 0 30rpx;
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-Medium;
			font-weight: 500;
			color: #000000;
			border-bottom: 2rpx solid #f2f2f2;
			&:first-child{
				padding:0 0 30rpx;
			}
		}
	}
</style>
