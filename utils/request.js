/*
 * @Author: 1vv
 * @Date: 2021-10-25 16:37:32
 * @LastEditTime: 2021-11-17 17:13:52
 * @LastEditors: Please set LastEditors
 * @Description: axios请求封装
 * @FilePath: \online-shop\src\assets\utils\api.js
 */

// import uniRequest from 'uni-request';
import axios from "axios"
console.log("11111", axios)
//1. 创建新的axios实例，
export const service = axios.create({
	baseURL: "/wsp-boot",
	// 超时时间 单位是ms，这里设置了3s的超时时间
	timeout: 3 * 1000
})
// 2.请求拦截器
service.interceptors.request.use(config => {
	config.headers['token'] = uni.getStorageSync('token'); // 让每个请求携带自定义token
	// 让每个请求携带自定义token
	config.headers['Content-Type'] = 'application/json;charset=UTF-8'
	return config
}, error => {
	Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(res => {
		uni.setStorageSync('token', res.headers.token)
		console.log(111, res.headers.token);
		// 未设置状态码则默认成功状态
		const code = res.data.resultCode || 20000
		// 获取错误信息
		// const msg = errorCode[code] || res.data.msg || errorCode['default']
		if (code === 30000) {

			uni.showToast({
				title: '登录过期',
				icon: 'error'


			})
			setTimeout(() => {
				uni.navigateTo({
					url: "/pages/login/login"
				})
			}, 1500);

		} else if (code === 500) {
			uni.showToast({
				title: '服务器异常',
				icon: 'error'


			})
			return Promise.reject(new Error('服务器异常'))
		} else {
			return res.data
		}
	},
	error => {
		console.log('err' + error)
		uni.showToast({
			title: '服务器异常',
			icon: 'error'


		})
	}
)
