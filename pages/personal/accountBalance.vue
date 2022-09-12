<template>
	<view>
		<view class="header">

			<van-cell-group title="账户余额">
				<van-field :value="userInfo.userName" readonly label="姓名:" border />
				<van-field :value="userInfo.userNo" readonly label="工号:" border />
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
	import {
		GoodsTypeVariable
	} from "@/utils/Variable";
	export default {
		data() {
			return {
				userInfo: {
					name: '爱美丽',
					workNo: '006545',
					com: '银河集团有限公司',
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
				console.log(this.userInfo)

			},
			getBalance() {
				var params = {
					"url": queryCard.url,
					"content-type": queryCard.contentType,
				}
				this.request.getRequest(params).then(res => {
					if (res.length == 0) {
						return this.balance = '-'
					} else {
						//给balance赋值
						var item = res[0]
						var giftCardNum = item.giftCardNum;
						var giftCardName = item.giftCardName;
						var validDate = item.validDate;
						var isTure = item.isTrue;
						var isUse = item.isUse;
						var cateOne = item.quotaA == null || item.quotaA == 0 ? '' : this.convertType('quotaA') +
							'：' + item.quotaA + '件；';
						var cateTwo = item.quotaB == null || item.quotaA == 0 ? '' : this.convertType('quotaB') +
							'：' + item.quotaB + '件；';
						// var cateThree = item.quotaC == null || item.quotaC == 0 ? '' : this.convertType('quotaC') +
						// 	'：' + item.quotaC + '件。';
						this.balance =
							`${giftCardName}，有效期至${validDate}，请尽快进行兑换，以免过期失效，说明，您的每份礼品卡可以从以下礼品中选择任意一类进行兑换：${cateOne}${cateTwo}`
						// this.balance = giftCardName + '1份，有效期至 包含:' + cateOne + cateTwo + cateThree + cateFour +
						// 	cateFive + " 有效期至" + validDate;

					}

				})
			},
			convertType(item) {
				var result
				GoodsTypeVariable.forEach((k) => {
					if (item == k.key) {
						return result = k.typeName
					}
				});
				return result;
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
