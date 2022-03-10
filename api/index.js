import axios from 'axios';
import Vue from 'vue';
import urls from './url.js';
const vue = new Vue()
let myPost = axios.create({
	baseURL: urls.baseUrl,
	method: 'post',
	// timeout: 1000,
})
let myUploadImg = axios.create({
	baseURL: urls.baseUrl,
	method: 'post',
	// timeout: 1000,
})
let myGet = axios.create({
	baseURL: urls.baseUrl,
	method: 'get',
	// timeout: 1000,
})
let myDelete = axios.create({
	baseURL: urls.baseUrl,
	method: 'delete',
	// timeout: 1000,
})
let myPut = axios.create({
	baseURL: urls.baseUrl,
	method: 'put',
	// timeout: 1000,
})
let dzpMyPost = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'post',
	// timeout: 1000,
})
let dzpMyGet = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'get',
	// timeout: 1000,
})
let dzpMyDelete = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'delete',
	// timeout: 1000,
})
let dzpMyPut = axios.create({
	baseURL: urls.dzpBaseUrl,
	method: 'put',
	// timeout: 1000,
})
axios.defaults.adapter = function(config) { //自己定义个适配器，用来适配uniapp的语法
	return new Promise((resolve, reject) => {
		var settle = require('axios/lib/core/settle');
		var buildURL = require('axios/lib/helpers/buildURL');
		uni.request({
			method: config.method.toUpperCase(),
			url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
			header: config.headers,
			data: config.data,
			dataType: config.dataType,
			responseType: config.responseType,
			sslVerify: config.sslVerify,
			complete: function complete(response) {
				response = {
					data: response.data,
					status: response.statusCode,
					errMsg: response.errMsg,
					header: response.header,
					config: config
				};

				settle(resolve, reject, response);
			}
		})
	})
}
myPut.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myDelete.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myPost.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myUploadImg.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			"Content-Type": "multipart/form-data;charse=UTF-8",
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myDelete.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myUploadImg.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myGet.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			// 'token': sessionStorage.token,
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
			'Access-Control-Allow-Origin': '*',
			"access-control-allow-credentials": "true"
		}
		config.headers.token = uni.getStorageSync('token');
	}
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
myPut.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myPost.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
myGet.interceptors.response.use(response => {
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error);
	if (error.response.status === 500) {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})



dzpMyPut.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyPost.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			'Authorization': `Bearer ${uni.getStorageSync('token')}`
			// 'token':  uni.getStorageSync('token'),
			// 'Access-Control-Allow-Origin': '*',
			// "access-control-allow-credentials": "true"
		}
		// config.headers.token = uni.getStorageSync('token');
	}
	console.log(config)
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyGet.interceptors.request.use(config => {
	if (uni.getStorageSync('token')) {
		config.headers = {
			'Accept': 'application/json',
			// 'token': sessionStorage.token,
			'Authorization': `Bearer ${uni.getStorageSync('token')}`,
			'Access-Control-Allow-Origin': '*',
			"access-control-allow-credentials": "true"
		}
		config.headers.token = uni.getStorageSync('token');
	}
	return config;
}, error => {
	console.log(error);
	return Promise.reject();
})
dzpMyPut.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
dzpMyPost.interceptors.response.use(response => {
	// console.log(response)
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error)
	if (error.response.status === 500) {
		console.log(vue)
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})
dzpMyGet.interceptors.response.use(response => {
	if (response.status === 200) {
		if (response.data.code == 401) {
			uni.navigateTo({
				url: '/pages/login/index'
			})
		} else {
			return response.data
		}
	}
	// if (response.status === 200 && response.data.code == '200') {
	//     vue.$message({
	//         message: response.data.msg,
	//         type: "success",
	//     });
	//     return response.data;
	// }
	else {
		vue.$message.error(response.data.info);
		Promise.reject();
	}
}, error => {
	//错误跳转
	console.log(error);
	if (error.response.status === 500) {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	} else if (error.response.status === 401) {
		sessionStorage.setItem("isLogin", false);
		console.log(sessionStorage.getItem("isLogin"));
		// router.push({ path: "/" })
		// router.go(0)
		return Promise.reject();
	} else if (error.response.status === 404) {
		vue.$alert('页面不存在', '404错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else if (error.response.status === 402) {
		vue.$alert('请求次数限制', '402错误', {
			confirmButtonText: '确定',
		});
		return Promise.reject();
	} else {
		if (error.response.data.info != '参数错误') {
			vue.$message.error(error.response.data.info);
		}
	}
})

export default {
	loginWechat(obj) {
		return myPost({
			url: urls.loginWechat,
			data: {
				...obj
			},
		})
	},
	banner() {
		return myGet({
			url: urls.banner,
		})
	},
	address() {
		return myGet({
			url: urls.address,
		})
	},
	addressAdd(obj) {
		return myPost({
			url: urls.addressAdd,
			data: {
				...obj
			},
		})
	},
	addressEdit(obj) {
		return myPut({
			url: `${urls.addressEdit}/${obj.id}`,
			data: {
				...obj
			},
		})
	},
	addressXq(id) {
		return myGet({
			url: `${urls.addressXq}/${id}`,
		})
	},
	deleteItems(id) {
		return myDelete({
			url: `${urls.items}/${id}`,
		})
	},
	// 
	gaobai(obj) {
		return myGet({
			url: `${urls.gaobai}`,
			params: {
				...obj
			}
		})
	},
	addGaobai(obj) {
		return myPost({
			url: `${urls.gaobai}`,
			data: {
				...obj
			}
		})
	},
	gaobaiXiangqin(id) {
		return myGet({
			url: `${urls.gaobai}/${id}`,
		})
	},
	upload_pic(file, type) {
		return new Promise(async (resolve, reject) => {
			uni.uploadFile({
				url: `${urls.baseUrl}${urls.upload_pic}`,
				filePath: file.path,
				header: {
					"Content-Type": "multipart/form-data;charse=UTF-8",
					'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				},
				name: 'image',
				formData: {
					token: uni.getStorageSync('token'),
					type,
				},
				success: (res) => {
					if(JSON.parse(res.data).code == 401){
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
					return resolve(JSON.parse(res.data))
				}
			})
		})
	},
	upload_avatar(file) {
		return new Promise(async (resolve, reject) => {
			uni.uploadFile({
				url: `${urls.baseUrl}${urls.upload_avatar}`,
				filePath: file.path,
				header: {
					"Content-Type": "multipart/form-data;charse=UTF-8",
					'Authorization': `Bearer ${uni.getStorageSync('token')}`,
				},
				name: 'image',
				formData: {
					token: uni.getStorageSync('token'),
				},
				success: (res) => {
					console.log(res)
					if(JSON.parse(res.data).code == 401){
						uni.navigateTo({
							url: '/pages/login/index'
						})
					}
					return resolve(JSON.parse(res.data))
				}
			})
		})
	},
	zan(obj) {
		return myPost({
			url: `${urls.zan}`,
			data: {
				...obj
			}
		})
	},
	comment(obj) {
		return myPost({
			url: `${urls.comment}`,
			data: {
				...obj
			}
		})
	},
	shudong(obj) {
		return myGet({
			url: `${urls.shudong}`,
			params: {
				...obj
			}
		})
	},
	shudongXiangqin(id) {
		return myGet({
			url: `${urls.shudong}/${id}`,
		})
	},
	addShudong(obj) {
		return myPost({
			url: `${urls.shudong}`,
			data: {
				...obj
			}
		})
	},
	delShudong(id) {
		return myDelete({
			url: `${urls.shudong}/${id}`,
		})
	},
	my_type_list(obj) {
		return myPost({
			url: `${urls.my_type_list}`,
			data: {
				...obj
			}
		})
	},
	comment_list(obj) {
		return myGet({
			url: `${urls.comment_list}`,
			params: {
				...obj
			}
		})
	},
	address(obj) {
		return myGet({
			url: `${urls.address}`,
			params: {
				...obj
			}
		})
	},
	addAddress(obj) {
		return myPost({
			url: `${urls.address}`,
			data: {
				...obj
			}
		})
	},
	upDateAddress(obj, id) {
		return myPut({
			url: `${urls.address}/${id}`,
			data: {
				...obj
			},
		})
	},
	deleteAddress(id) {
		return myDelete({
			url: `${urls.address}/${id}`,
		})
	},
	comment_zan(obj) {
		return myPost({
			url: `${urls.comment_zan}`,
			data: {
				...obj
			}
		})
	},
	userInfo() {
		return myGet({
			url: `${urls.userInfo}`,
		})
	},
	// 
	baoxiu(obj) {
		return myPost({
			url: urls.baoxiu,
			data: {
				...obj
			}
		})
	},
	delbaoxiu(id) {
		return myDelete({
			url: `${urls.baoxiu}/${id}`
		})
	},
	getbaoxiu(obj) {
		return myGet({
			url: urls.baoxiu,
			params: {
				...obj
			}
		})
	},
	getbxDetail(id) {
		return myGet({
			url: `${urls.baoxiu}/${id}`
		})
	},
	getmylist(obj) {
		return myGet({
			url: urls.my_type_list,
			params: {
				...obj
			}
		})
	},
	video_list(obj) {
		return myGet({
			url: urls.video_list,
			params: {
				...obj
			}
		})
	},
	fengjing(obj) {
		return myPost({
			url: urls.fengjing,
			data: {
				...obj
			}
		})
	},
	getfengjing(obj) {
		return myGet({
			url: urls.fengjing,
			params: {
				...obj
			}
		})
	},
	getfengjingDetail(id) {
		return myGet({
			url: `${urls.fengjing}/${id}`
		})
	},
	delfengjing(id) {
		return myDelete({
			url: `${urls.fengjing}/${id}`
		})
	},
	shougou(obj) {
		return myPost({
			url: urls.shougou,
			data: {
				...obj
			}
		})
	},
	delshougou(id) {
		return myDelete({
			url: `${urls.shougou}/${id}`
		})
	},
	getshougou(obj) {
		return myGet({
			url: urls.shougou,
			params: {
				...obj
			}
		})
	},
	getsgDetail(id) {
		return myGet({
			url: `${urls.shougou}/${id}`
		})
	},
	jishi(obj) {
		return myPost({
			url: urls.jishi,
			data: {
				...obj
			}
		})
	},
	deljishi(id) {
		return myDelete({
			url: `${urls.jishi}/${id}`
		})
	},
	getjishi(obj) {
		return myGet({
			url: urls.jishi,
			params: {
				...obj
			}
		})
	},
	getjshiDetail(id) {
		return myGet({
			url: `${urls.jishi}/${id}`
		})
	},
	article(obj) {
		return myPost({
			url: urls.article,
			data: {
				...obj
			}
		})
	},
	getarticle(obj) {
		return myGet({
			url: urls.article,
			params: {
				...obj
			}
		})
	},
	articleDetail(id) {
		return myGet({
			url: `${urls.article}/${id}`
		})
	},
	delarticle(id) {
		return myDelete({
			url: `${urls.article}/${id}`
		})
	},
	pindan(obj) {
		return myPost({
			url: urls.pindan,
			data: {
				...obj
			}
		})
	},
	delpindan(id) {
		return myDelete({
			url: `${urls.pindan}/${id}`
		})
	},
	getpindan(obj) {
		return myGet({
			url: urls.pindan,
			params: {
				...obj
			}
		})
	},
	getpdanDetail(id) {
		return myGet({
			url: `${urls.pindan}/${id}`
		})
	},
	pinche(obj) {
		return myPost({
			url: urls.pinche,
			data: {
				...obj
			}
		})
	},
	delpinche(id) {
		return myDelete({
			url: `${urls.pinche}/${id}`
		})
	},
	getpinche(obj) {
		return myGet({
			url: urls.pinche,
			params: {
				...obj
			}
		})
	},
	getpcheDetail(id) {
		return myGet({
			url: `${urls.pinche}/${id}`
		})
	},
	buy_pindan(obj) {
		return myPost({
			url: urls.buy_pindan,
			data: {
				...obj
			}
		})
	},
	web_config() {
		return myGet({
			url: urls.web_config,
		})
	},
	pindan_toghter_list(obj) {
		return myGet({
			url: urls.pindan_toghter_list,
			params: {
				...obj
			}
		})
	},
	get_phone(obj) {
		return myPost({
			url: urls.get_phone,
			data: {
				...obj
			}
		})
	},
	comment_reply(obj) {
		return myPost({
			url: urls.comment_reply,
			data: {
				...obj
			}
		})
	},
	phone(obj) {
		return myPost({
			url: urls.phone,
			data: {
				...obj
			}
		})
	},
	unread_comment_list(obj) {
		return myGet({
			url: urls.unread_comment_list,
			params: {
				...obj
			}
		})
	},
	update_user_info(obj) {
		return myPost({
			url: urls.update_user_info,
			data: {
				...obj
			}
		})
	},
	send_sms(obj) {
		return myPost({
			url: urls.send_sms,
			data: {
				...obj
			}
		})
	},
	update_mobile(obj) {
		return myPost({
			url: urls.update_mobile,
			data: {
				...obj
			}
		})
	},
	add_shudong_comment(obj) {
		return myPost({
			url: urls.add_shudong_comment,
			data: {
				...obj
			}
		})
	},
	shudong_comment_list(obj) {
		return myGet({
			url: urls.shudong_comment_list,
			params: {
				...obj
			}
		})
	},
	del_shudong_comment(id) {
		return myPost({
			url: urls.del_shudong_comment,
			data: {
				id:id
			}
		})
	},
	my_send(obj) {
		return myGet({
			url: urls.my_send,
			params: {
				...obj
			}
		})
	},
	my_reply(obj) {
		return myGet({
			url: urls.my_reply,
			params: {
				...obj
			}
		})
	},
	my_zan(obj) {
		return myGet({
			url: urls.my_zan,
			params: {
				...obj
			}
		})
	},
	new_comment(obj) {
		return myGet({
			url: urls.new_comment,
			params: {
				...obj
			}
		})
	},
	new_send(obj) {
		return myGet({
			url: urls.new_send,
			params: {
				...obj
			}
		})
	},
	hot_shudong(obj) {
		return myGet({
			url: urls.hot_shudong,
			params: {
				...obj
			}
		})
	},
	best_shudong(obj) {
		return myGet({
			url: urls.best_shudong,
			params: {
				...obj
			}
		})
	},
	zero_unread_comment(obj) {
	  return myPost({
		   url: urls.zero_unread_comment,
		   data: {
			...obj
		   }
	  })
	},
	wait_read_num() {
		return myGet({
			url: `${urls.wait_read_num}`
		})
	},
	new_comment_list(obj){
		return myGet({
			url: `${urls.new_comment_list}`,
			params: {
				...obj
			}
		})
	}
}
