<template>

	<view>
		<view class="banner">
			<image src='../../static/bg_test.jpg'></image>
		</view>
		<van-cell-group>
			<van-field :value="userPhone" label="手机号码" left-icon="" required :rules="telRules" placeholder="请输入手机号"
				@blur="inputPhoneNum" @change="handleChangeUserPhone()" />
			<van-field :value="userCheckPhone" label="确认手机号" required left-icon="" placeholder="确保两次输入的手机号一致"
				border="false" @change="handleChangeUserCheckPhone()" @blur="inputCheckPhoneNum" />
			<van-field :value="userPwd" label="密码" required left-icon="" placeholder="6-16位密码" password="true"
				border="false" @change="handleChangeUserPwd()" @blur="inputPwd" />
			<van-button class="bottom_button" type="primary" color="#ff6700" @click="handleRegister" block
				:disabled="!(userPhone&&userCheckPhone&&userPwd)">注册</van-button>
		</van-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userPhone: '',
				userCheckPhone: '',
				userPwd: '',
				//定义一个密码检验事件，如果事件为true,则证明校验通过
				flag: "false",
				//定义两次输入的手机号是否一致的校验事件
				flagCheck: "false",
				//定义手机号是否规范
				falgPhone: "false",
			}
		},
		methods: {
			//第一次输入的手机号是否规范
			inputPhoneNum(e) {
				console.log(e);
				if (this.userPhone.length === 11) {
					let str = /^1[3456789]\d{9}$/
					if (str.test(this.userPhone)) {
						this.falgPhone = "true";
						return true
					} else {
						uni.showToast({
							title: '手机号不规范',
							icon: 'none',
							duration: 1000,
						})
						return false
					}
				} else {
					uni.showToast({
						title: '手机号应该是11位',
						icon: "none",
					})
				}
			},
			//两次输入的手机号是否一致
			inputCheckPhoneNum(e) {
				if (this.userCheckPhone != this.userPhone) {
					uni.showToast({
						title: '两次输入的手机号不一致!',
						icon: 'none',
						duration: 1000,
					})
				} else {
					this.flagCheck = "true";
				}
			},
			//密码校验
			inputPwd(e) {
				if (this.userPwd.length < 6) {
					uni.showToast({
						title: '密码的位数应该是6-16位',
						icon: 'none',
						duration: 1000,
					})
				} else {
					this.flag = "true";
				}

			},
			handleChangeUserPhone(e) {
				this.userPhone = e.detail;
			},
			handleChangeUserCheckPhone(e) {
				this.userCheckPhone = e.detail;
			},
			handleChangeUserPwd(e) {
				this.userPwd = e.detail;
			},
			handleRegister() {
				const params = {
					"url": this.ssdapi.register.url,
					"content-type": this.ssdapi.register.contentType,
					payload: {
						userPhone: this.userPhone,
						userPwd: this.md5(this.userPwd) + 'aab',
						userCom: uni.getStorageSync('userCom'),
						userNo: uni.getStorageSync('userNo'),
						userName: uni.getStorageSync('userName'),
					}
				}
				if (this.flag == "true") {
					if (this.flagCheck == "true") {
						if (this.falgPhone == "true") {
							uni.showLoading({
								title: '加载中'
							});
							console.log(this.request.noneTokenPostRequest)
							this.request.noneTokenPostRequest(params).then((res) => {
								console.log(res)
								uni.hideLoading();
								uni.showModal({
									title: '成功',
									content: '注册成功,即将跳转登录页!',
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											uni.navigateTo({
												url: './login',
											})
										}
									}
								});

							}).catch((res) => {
								console.log(res)
								uni.hideLoading();
								if (res.resultCode == 40000) {
									uni.showModal({
										title: '失败',
										content: '注册失败，手机号不规范!',
										showCancel: false,
										success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								} else if (res.resultCode == 50000) {
									uni.showModal({
										title: '失败',
										content: '注册失败，手机号已存在!',
										showCancel: false,
										success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定');
											}
										}
									});
								}
							})
						} else {
							uni.showToast({
								title: '手机号不规范！',
								icon: 'none',
								duration: 1000,
							})
						}
					} else {
						uni.showToast({
							title: '两次输入的手机号不一致！',
							icon: 'none',
							duration: 1000,
						})
					}
				} else {
					uni.showToast({
						title: '密码应该是6-16位',
						icon: 'none',
						duration: 1000,
					})
				}
			},
		},
	}
</script>

<style scoped>
	.bottom_button {
		margin-top: 20rpx !important;
		width: 95%;
		display: flex;
		margin: 0 auto;
	}

	.banner {
		justify-content: center;
		display: flex;
		background-color: white;
	}

	.banner image {
		width: 100vw;
	}
</style>
