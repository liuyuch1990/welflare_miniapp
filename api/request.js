// var baseUrl = "https://gamebeta.m.jd.com";
// var baseUrl = "http://test1.esign.jd.com";
var baseUrl = "https://unicorncto.top"; // 正式环境
// var baseUrl = "http://localhost:9209"; //测试环境
// var token = uni.getStorageSync('token');

const request = {
	postRequest(param = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl+ "/wsp-boot" + param.url,
				header: {
					"token": uni.getStorageSync('token'),
				},
				'content-type': param.contentType,
				method: "POST",
				data: param.payload,
				success: res => {
					if (res.data.resultCode == 20000) {
						const data = res.data.data;
						if (!res.header.token) {
							// uni.showToast({
							// 	title: "服务器异常，请稍后再试！",
							// 	icon:'none'
							// })
						} else {
							uni.setStorageSync('token', res.header.token);
						}
							resolve(data)
					} else if (res.data.resultCode == 30000) {
						uni.showToast({
							title: "登录状态过期",
							icon: "error"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login',
							})
						}, 1500)
						reject(res.data)
					} else {
						reject(res.data)
					}
				},
				fail: (err) => {
					// console.log('失败')
					// console.log(err)
					reject(err)
				},
				complete: () => {}
			});
		})

	},
	getRequest(param) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl + "/wsp-boot" + param.url + param.payload == true ?
					`?${param.payload}` :  baseUrl + "/wsp-boot" +
					param.url,
				method: 'GET',
				header: {
					'token': uni.getStorageSync('token'),
					'content-type': param.contentType || 'application/json'
				},
				data: {},
				success: res => {
					if (res.data.resultCode == 20000) {
						const data = res.data.data;

						if (!res.header.token) {
							// uni.showToast({
							// 	title: "服务器异常，请稍后再试！",
							// 	icon:'none'
							// 	})
								
						} else {
							uni.setStorageSync('token', res.header.token);
						}
						resolve(data)
					} else if (res.data.resultCode == 30000) {
						uni.showToast({
							title: "登录状态过期",
							icon: "error"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/login',
							})
						}, 1500)
						reject(res)
					} else {
						uni.showToast({
							title: res.data.message || "登录状态过期",
							icon: "error"
						})
						reject(res)
					}
				},
				fail: (err) => {
					reject(err)
				},
				complete: () => {}
			});
		})
	},

	loginRequest(param = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url:  baseUrl+ "/wsp-boot" + param.url,
				'content-type': param.contentType,
				method: "POST",
				data: param.payload,
				success: res => {
					if (res.data.resultCode == 20000) {
						if (!res.data.data.map.token) {
							uni.showToast({
								title: "服务器异常，请稍后再试！",
								icon: "none"
							})
						} else {
							const data = res.data;
							resolve(data)
						}

					} else {
						reject(res)

					}
				},
				fail: (err) => {
					// console.log('失败')
					// console.log(err)
					reject(err)
				},
				complete: () => {}
			});
		})

	},
	noneTokenPostRequest(param = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url:  baseUrl + "/wsp-boot" + param.url,
				'content-type': param.contentType,
				method: "POST",
				data: param.payload,
				success: res => {
					const data = res.data;
					if (res.data.resultCode == 20000) {
						resolve(data)
					} else {
						reject(data)
					}
				},
				fail: (err) => {
					// console.log('失败')
					// console.log(err)
					reject(err)
				},
				complete: () => {}
			});
		})

	},
	noneTokenGetRequest(param = {}) {
		return new Promise((resolve, reject) => {
			uni.request({
				url: baseUrl + "/wsp-boot" + param.url,
				'content-type': param.contentType,
				method: "GET",
				data: param.payload,
				success: res => {
					if (res.data.resultCode == 20000) {
						const data = res.data;
						resolve(data)
					} else {
						reject(res)
					}
				},
				fail: (err) => {
					// console.log('失败')
					// console.log(err)
					reject(err)
				},
				complete: () => {}
			});
		})

	},
}
export default request
