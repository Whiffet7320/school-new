<template>
	<view>
		<page-tabbar v-model="current" :list="tabbarlist" :mid-button="true" @change="onChange"></page-tabbar>
		<page-midmenu :show="midshow"></page-midmenu>
	</view>
</template>

<script>
	import pageTabbar from "@/components/page-tabbar/page-tabbar";
	import pageMidmenu from "@/components/page-tabbar/page-midmenu";
	export default{
		components:{
			pageTabbar,
			pageMidmenu
		},
		props:{
			cur:{
				type:Number,
				default:0
			}
		},
		data(){
			return{
				tabbarlist:[
					{
						iconPath: "/static/images/tabbar/icon_bp.png",
						selectedIconPath: "/static/images/tabbar/icon_bps.png",
						text: '帮帮拼单',
						customIcon: false,
						pagePath:'/pages/spell/index'
					},
					{
						iconPath: "/static/images/tabbar/icon_swzl.png",
						selectedIconPath: "/static/images/tabbar/icon_swzls.png",
						text: '失物招领',
						customIcon: false,
						pagePath:'/pages/lost/index'
					},
					{
						iconPath: "/static/images/tabbar/icon_fb.png",
						selectedIconPath: "/static/images/tabbar/icon_fb.png",
						text: '发布',
						midButton: true,
						customIcon: false
					},
					{
						iconPath: "/static/images/tabbar/icon_xyj.png",
						selectedIconPath: "/static/images/tabbar/icon_xyjs.png",
						text: '校园集市',
						customIcon: false,
						pagePath:'/pages/market/index'
					},
					{
						iconPath: "/static/images/tabbar/icon_xyyj.png",
						selectedIconPath: "/static/images/tabbar/icon_xyyjs.png",
						text: '校园一角',
						customIcon: false,
						pagePath:'/pages/campus/index'
					}
				],
				midshow:false,
				current:0
			}
		},
		watch:{
			cur:{
				handler(newval){
					this.current = newval;
				},
				immediate:true,
				deep:true
			}
		},
		methods:{
			onChange(val){
				if(val==2){
					this.midshow = !this.midshow;
				}else{
					uni.reLaunch({
						url:this.tabbarlist[val].pagePath+"?page="+val
					})
				}
			}
		}
	}
</script>

<style>
</style>
