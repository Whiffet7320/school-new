import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		seakey: "",
		userInfo: uni.getStorageSync("user") == undefined ? {} : uni.getStorageSync("user"),
		article: [],
		detail: {},
		newsArticle:{},
		// 
		biaobaiqiangPage: 1, //表白墙列表
		biaobaiqiangPageSize: 10,
		biaobaiqiangPinglunPage: 1, //表白墙评论列表
		biaobaiqiangPinglunPageSize: 10,
		searchList: [],
		shudongPage: 1, //树洞列表
		shudongPageSize: 10,
		shudongPinlunPage: 1, //树洞详情评论列表
		shudongPinlunPageSize: 10,
		xiaoxiPage: 1, //未读消息列表
		xiaoxiPageSize: 10,
		firstMusicTime:false,
		musicPaused:false,
		isShudong:false,
		isAdd:false,
		badge:0
	},
	mutations: {
		setNewsarticle(state, data) {
			state.newsArticle = data;
		},
		setAdd(state, data) {
			state.isAdd = data;
		},
		setBadge(state, data) {
			state.badge = data;
		},
		setArticle(state, data) {
			state.article = data;
		},
		setDetail(state, data) {
			state.detail = data;
		},
		setKey(state, data) {
			state.seakey = data;
		},
		setUserinfo(state, data) {
			if (data.info) {
				state.userInfo = data.info;
			}
			if (data.time) {
				state.userInfo.expressTime = data.time;
			}
			if (data.uid) {
				state.userInfo.uid = data.uid;
			}
			uni.setStorageSync("user", state.userInfo);
		},
		// 
		biaobaiqiangPage(state, str) {
			state.biaobaiqiangPage = str;
		},
		biaobaiqiangPinglunPage(state, str) {
			state.biaobaiqiangPinglunPage = str;
		},
		searchList(state, str) {
			if (str != '') {
				state.searchList.push(str);
			}
			if (state.searchList.length > 10) {
				state.searchList.pop()
			}
		},
		clearSearchList(state, str) {
			if (str) {
				state.searchList = [];
			}
		},
		shudongPage(state, str) {
			state.shudongPage = str;
		},
		shudongPinlunPage(state, str) {
			state.shudongPinlunPage = str;
		},
		xiaoxiPage(state, str) {
			state.xiaoxiPage = str;
		},
		firstMusicTime(state, str) {
			state.firstMusicTime = str;
		},
		musicPaused(state, str) {
			state.musicPaused = str;
		},
		isShudong(state, str) {
			state.isShudong = str;
		}
	}
})

export default store
