import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import api from 'api/index.js';
import apiUrls from 'api/url.js';
import store from './store';

Vue.use(uView);
// 挂载工具函数
import tools from '@/utils/tools';
Vue.prototype.$tools = tools;
// 小程序分享的mixin封装
import mpShare from './common/mixin/mpShare';
Vue.mixin(mpShare);

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$url = apiUrls.baseUrl;
App.mpType = 'app';

(async ()=>{
	console.log(store.state.isShudong,!store.state.musicPaused)
	Vue.prototype.$innerAudioContext = uni.createInnerAudioContext();
	Vue.prototype.$innerAudioContext.loop = true;
	Vue.prototype.$innerAudioContext.onPlay(async() => {
		console.log('开始播放');
		return ('开始播放')
	});
	Vue.prototype.$innerAudioContext.onPause(async() => {
		console.log('暂停播放');
		return ('暂停播放')
	});
	store.commit('firstMusicTime',true)
	if(!uni.getStorageSync('token')){
		return;
	}
	// Vue.prototype.$innerAudioContext.play()
})()

// function playMusic(){
// 	return new Promise(async(resolve, reject)=>{
// 		if(!uni.getStorageSync('token')){
// 			return reject('未登录');
// 		}
// 		return resolve('music')
// 	})
// }
// Vue.prototype.$playMusic = playMusic;

const app = new Vue({
	...App,
	store,
})
app.$mount()
	