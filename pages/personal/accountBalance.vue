<template>
	<view>
		<view class="header">

			<van-cell-group title="账户余额">
				<van-field :value="userInfo.userName" readonly label="姓名:" border />
				<!-- <van-field :value="userInfo.cardNo" readonly label="工号:" border /> -->
				<van-field :value="userInfo.userCom" readonly label="公司名称:" border />
				<van-field :value="balance" readonly type="textarea" autosize label="账户余额:" border></van-field>
			</van-cell-group>


		</view>
		<view class="header">

			<van-cell-group title="账户充值">
				<van-field :value="cardNo" type="textarea" autosize required placeholder="请输入礼品卡卡号" label="卡号:" border
					@change="numberChange()" />
			</van-cell-group>


		</view>
		<van-button class="bottom_button" type="primary" round block color="#ff6700" @click="charge()"
			:disabled="click">
			充值</van-button>
	</view>

</template>

<script>
	import {
		queryCard,
		chargeCard
	} from '@/api/api.js';
	export default {
		data() {
			return {
				userInfo: {
				},
				cardNo: '',
				click: true,
				balance: ''

			}
		},
		onShow() {
			this.getBalance();
			this.getUserInfo();
		},
		onLoad(option) {

			//从storage拿用户信息

			// const item = JSON.parse(decodeURIComponent(option.param));
			// 		this.orderId=item;
		},
		methods: {
			getUserInfo() {
				this.userInfo = uni.getStorageSync('userInfo');
			},
			getBalance() {
				var params = {
					"url": queryCard.url,
					"content-type": queryCard.contentType,
				}
				this.request.getRequest(params).then(res => {
					if (!res ) {
						return this.balance = '-'
					} else {
						var walletTips = "";
						res.typeQuotaVoList.forEach((v) => {
							walletTips += v.goodsTypeName + "：" + v.typeQuota + "件；";
						});
						this.balance = `${res.cardTypeName}，有效期至${res.validDate},说明，您的每份礼品卡可以从以下礼品中选择进行兑换：请尽快进行兑换，以免过期失效，${walletTips}`;
					}

				})
			},
			charge() {
				var params = {
					"url": chargeCard.url + this.cardNo,
					"content-type": chargeCard.contentType,
				}
				this.request.getRequest(params).then(res => {
					uni.showToast({
						title: '充值成功',
						duration: 2000
					});
					this.getBalance();
				}).catch(result => {
					uni.showToast({
						title: result.message || '充值失败',
						icon: 'error',
						duration: 2000
					});

				})
			},
			numberChange(e) {
				this.cardNo = e.detail;
				this.validateForm()

			},
			validateForm() {
				if (this.cardNo) {
					this.click = false;
				}

			},


		}
	}
</script>

<style scoped>
	.header {
		margin-top: 20rpx;
	}

	.right_icon {
		text-align: center;
		display: block;

	}

	.left_margin {
		padding-left: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
		color: #808080;
	}

	.right_margin {
		padding-right: 20rpx;
		font-size: 24rpx;
		padding-bottom: 10rpx;
		color: #007AFF;
	}

	.custom-title {
		margin-right: 10rpx;
		vertical-align: middle;
	}

	.bottom_button {
		width: 60%;
		position: fixed;
		top: 80%;
		left: 20%;
	}
</style>
