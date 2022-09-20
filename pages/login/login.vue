<template>
	<view class="container">
		<view class="banner">
			<image src='../../static/login_banner.png'></image>
		</view>
		<van-cell-group class="cell-group">
			<van-field :value="userPhone" label="手机号:" required left-icon="" placeholder="请输入登录手机号"
				@change="handleChange()" />
			<van-field :value="userCom" label="公司代码:" required left-icon="" placeholder="请输入公司代码"
				@change="handleChangeCom()" />
			<van-field :value="giftCardNum" label="礼品卡号:" required left-icon="" placeholder="请输入礼品卡号"
				@change="handleChangeCard()" />
			<van-field :value="userDept" required placeholder="点击右侧图标选择体系" label="体系:" readonly
					    @click-input="show = true" />
			<!-- <van-field :value="userPwd" label="密码:" required left-icon="" placeholder="请输入密码" border="false"
				password="true" @change="handleChangePass()" /> -->
		</van-cell-group>

		<van-cell-group class="cell-group">
		<view class="button_group">
			<van-button class='login-btn' type="primary" block color="#ff6700" @click="handleLogin"
				:disabled="!(userPhone&&userCom&&giftCardNum)">登录</van-button>
			<!-- <van-button class="register" type="primary" plain block color="#ff6700" @click="toRegister">暂无账号，去注册</van-button> -->
			<!-- <text class="register" @click="toRegister">暂无账号，去注册</text> -->
		</view>
		</van-cell-group>
		<van-cell-group class="cell-group">
			<van-picker v-if="show"
					show-toolbar
					:columns="deptList"
					@cancel="show = false"
					@confirm="selectDept"
			/>
		</van-cell-group>
		<div class="agreement">
			<span>使用本程序意味着您同意</span>
			<text @click="serviceTerms">《用户使用协议》</text>
			<text @click="privateInformation">《隐私保护协议》</text>
			<!-- <navigator url="./service_terms"></navigator> -->
			<!-- <navigator url="./private_information"></navigator> -->


		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userPhone: '',
				userCom: '',
				show: false,
				userDept: '',
				deptList: [],
				giftCardNum: '',
				//验证规则
				rules: {
					userCom: {
						rule: /\S/,
						msg: "公司码不能为空"
					},
					giftCardNum: {
						rule: /^[0-9a-zA-Z]{6,16}$/,
						msg: "提货码应该为6位"
					},
					userPhone: {
						rule: /^1[3456789]\d{9}$/,
						msg: "手机号格式错误"
					},
					userDept: {
						rule: /\S/,
						msg: "公司码不能为空"
					},
				},
			}
		},
		onShow() {
			this.queryDeptList();
		},
		methods: {
			queryDeptList() {
				uni.setStorageSync('token', result.map.token);
				const params = {
					"url": this.ssdapi.queryDept.url,
					"contentType": this.ssdapi.queryDept.contentType,
					payload: {
						// userPhone: this.userPhone,
						// userCom: this.userCom,
						// userDept: this.userDept,
						// giftCardNum: this.giftCardNum
					}
				}
				this.request.getRequest(params).then((res) => {
						res.forEach((item)=>{
							this.deptList.push(item.departmentName)
						})
				});
			},

			selectDept(value) {
				this.userDept = value.detail.value
				this.show = false
			},
			//验证
			validate(key) {
				let bool = true;
				if (!this.rules[key].rule.test(this[key])) {
					//提示信息
					uni.showToast({
						title: this.rules[key].msg,
						icon:'error'
					})
					//取反
					bool = false;
					return false;
				}
				return bool;
			},

			handleChangeDept (){
				this.show = true
			},
			//获取用户名的输入框
			handleChange(e) {
				this.userPhone = e.detail;
			},
			//获取密码的用户框
			handleChangeCom(e) {
				this.userCom = e.detail;
			},
			handleChangeCard(e) {
				this.giftCardNum = e.detail;
			},
			//登录事件
			handleLogin() {
				if (!this.validate('userPhone')) return;
				if (!this.validate("userCom")) return;
				if (!this.validate("giftCardNum")) return;
				if (!this.validate("userDept")) return;
				uni.showLoading({
					title: '加载中'
				});
				// if(this.userCom=='bfhc001'||this.userCom=='BFHC001'||this.userCom=='sevenstar'||this.userCom=='SEVENSTAR'){
				// 	uni.setStorageSync('baseUrl', 'https://unicorncto.top')
				// }else if (this.userCom=='BFHCZB'||this.userCom=='bfhczb'){
					// uni.setStorageSync('baseUrl', 'https://ft.unicorncto.top')
				// }else{

				// 	uni.showToast({
				// 		title: '公司码错误',
				// 		duration: 1000,
				// 		icon: 'error'
				// 	});

				// 	return
				// }

				const params = {
					"url": this.ssdapi.login.url,
					"contentType": this.ssdapi.login.contentType,
					payload: {
						userPhone: this.userPhone,
						userCom: this.userCom,
						userDept: this.userDept,
						giftCardNum: this.giftCardNum
					}
				}
				this.request.loginRequest(params).then((res) => {
					uni.hideLoading();
					var result = res.data
					uni.setStorageSync('token', result.map.token);
					uni.setStorageSync('userInfo', result.user);
					uni.setStorageSync('baseUrl', 'https://unicorncto.top/wsp-boot')
					uni.showToast({
						title: '登录成功,前往首页',
						duration: 1000,
						icon: 'none'
					});

					setTimeout(() => {
						uni.switchTab({
							url: '../index/index'
						})
					}, 1000)
				}).catch((res) => {
					console.log(res)
					if (res.data.resultCode == 50000) {
						uni.showToast({
							title: res.data.message,
							icon: "error"
						})
					}

				})
			},
			serviceTerms() {
				uni.navigateTo({
					url: './service_terms'
				})
			},
			privateInformation() {
				uni.navigateTo({
					url: './private_information'
				})
			},
		}
	}
</script>

<style scoped>
	.container {
		height: 100vh;
	}

	.icon {
		float: right;
		color: #ff6700;
	}

	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.block {
		width: 120px;
		height: 120px;
		background-color: #fff;
	}

	.banner {
		justify-content: center;
		display: flex;
		/* background: #6b94d1; */
		margin-bottom: 40rpx;
	}

	.banner image {
		width: 100vw;
	}

	.cell-group {
		width: 90%;
		margin: 0 auto;
		display: block;
	}

	.login-btn {
		margin-bottom: 40rpx;
	}

	.register {
		/* margin-top: 20rpx; */
		color: #ff6700;
		text-decoration: underline;
		font-size: 24rpx;
	}

	.button_group {
		/* margin-top: 20rpx !important;
	width:95%; */
		margin-top: 100rpx !important;
		width: 90%;
		margin: 0 auto;
		text-align: right;
	}

	.agreement {
		width: 100%;
		text-align: center;
		position: fixed;
		bottom: 0;
		font-size: 24rpx;
	}
</style>
