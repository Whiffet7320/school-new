<template>
</template>

<script>
	export default{
		onShow() {
			this.$store.commit('isShudong',false);
			this.$store.commit('firstMusicTime',true);
			this.$innerAudioContext.stop()
			if (uni.getStorageSync('token')) {
				this.getMsg();
			}
		},
		methods:{
			getMsg() {
				let token = uni.getStorageSync("token");
				if (token) {
					this.$api.wait_read_num().then((res) => {
						if (res.code == 200) {
							this.count = res.data.count;
							if(this.count>0){
								uni.setTabBarBadge({
									index:2,
									text:this.count>99?"99+":this.count.toString()
								})
							}else{
								uni.removeTabBarBadge({index:2});
							}
						}
					})
				}
			},
		}
	}
</script>

<style>
</style>
