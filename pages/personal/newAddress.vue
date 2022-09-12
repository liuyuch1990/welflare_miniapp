<template>
	<view>
		<view class="header">
			<van-cell-group>
				<van-field :value="addressItem.receiverName" required placeholder="请输入收货人姓名" label="收货人:" border
					@change="nameChange()" />
				<van-field :value="addressItem.receiverPhone" required placeholder="请输入收货人手机号" label="手机号:" border
					@change="phoneChange()" />
				<van-field :value="addressItem.areaName" required placeholder="点击右侧图标选择省市区" label="所在地区:" readonly
					border icon="location" @click-input="addressShow = true" @click-icon="addressShow = true" />
				<van-field :value="addressItem.addrContent" required type="textarea" autosize placeholder="例:1号楼209室"
					label="详细地址:" border @change="contentChange" />
				<view class="defaultSwtich">
					<van-field readonly label="设为默认地址:" border />
					<van-switch class="swtich" :checked=" addressItem.isDef==1 " @change="switchDefault" size="18px" />
				</view>
			</van-cell-group>



		</view>
		<view class="">
			<van-button v-if="newAdd" class="bottom_button" type="primary" block color="#ff6700" @click="createAddress()"
				:disabled="click">新建地址</van-button>
			<van-button v-else class="bottom_button" type="primary" block color="#ff6700" @click="editAddress()"
				:disabled="click">确认修改</van-button>
		</view>

		<view class="content">
			<view class="content_list">
				<pickerAddress v-model="addressShow" @confirm="addresspick" />
			</view>
		</view>
	</view>

</template>

<script>
	import pickerAddress from '@/components/liudx-pickerAddress/index.vue'

	import {
		editUserAddress,
		newUserAddress
	} from '@/api/api.js';

	export default {
		data() {
			return {
				click: true,
				newAdd: true,
				value: '',
				addressItem: {},
				addressShow: false,
				form: {
					province: '',
					city: '',
					area: '',
				},
				address: '',
				addressItem: {
					isDef: 0
				},
			}
		},
		onShow(option) {


		},
		onLoad(option) {

			// console.log(item)
			if (!option.param) {
				this.newAdd = true;
				this.addressItem;
				uni.setNavigationBarTitle({
					title: '新建地址'
				});



				//编辑

			} else {
				//新建
				var item = JSON.parse(decodeURIComponent(option.param));
				this.addressItem = item;
				this.newAdd = false;
				this.click = false;
				uni.setNavigationBarTitle({
					title: '修改地址'
				});


			}
		},
		methods: {
			nameChange(e) {
				this.addressItem.receiverName = e.detail;
				this.validateForm()
			},
			phoneChange(e) {
				this.addressItem.receiverPhone = e.detail;
				this.validateForm()
			},
			contentChange(e) {
				this.addressItem.addrContent = e.detail;
				this.validateForm()
			},
			switchDefault(detail) {
				this.addressItem.isDef = this.addressItem.isDef == 0 ? 1 : 0
			},
			addresspick(obj) {
				let arr = ['province', 'city', 'area'];
				let place = '';
				arr.forEach((item, index) => {
					this.form[item] = obj[item].code
					if (index <= 1) {
						place += obj[item].name + '-'
					} else {
						place += obj[item].name
					}
				})
				this.addressItem.areaName = place
				this.addressItem.provinceCode = this.form.province;
				this.addressItem.cityCode = this.form.city;
				this.addressItem.areaCode = this.form.area;
			},
			createAddress() {
				var item = this.addressItem
				var params = {
					"url": newUserAddress.url,
					"content-type": newUserAddress.contentType,
					payload: item
				}
				//等接口改正后再调
				this.request.postRequest(params).then(res => {
					// console.log(res)
					// this.addressList=res.data;
					uni.showToast({
						    title: '创建成功',
						duration: 2000
					});
					setTimeout(res => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				}).catch((res)=>{
						if(res.resultCode==40000||50000){
							uni.showToast({
								title:res.message,
								icon:'none',
							})
							}
							});
			
			},
			editAddress() {
				var item = this.addressItem
				// const item = this.addressList[this.radio];
				var params = {
					"url": editUserAddress.url,
					"content-type": editUserAddress.contentType,
					payload: item
				}
				//等接口改正后再调
				this.request.postRequest(params).then(res => {
					// console.log(res)
					// this.addressList=res.data;
					uni.showToast({
						title: '修改成功',
						duration: 2000
					});
					setTimeout(res => {
						uni.navigateBack({
							delta: 1
						})
					}, 2000)
				})

			},
			validateForm() {
				if (this.addressItem.receiverName  && this.addressItem.receiverPhone && this.addressItem
					.areaName && this.addressItem.addrContent) {
					this.click = false;
				}

			},




		},

		components: {
			pickerAddress
		},


	}
</script>

<style lang="scss" scoped>
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
		width: 95%;
		top: 50%;
		position: fixed;
		left: 2.5%;
		border-radius: 10rpx;
	}

	.defaultSwtich {
		display: flex;
		justify-content: space-between;
		background-color: white;
	}

	.swtich {
		margin-right: 20rpx;
		margin-top: 20rpx;

	}

	.content {
		&_list {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-around;

			&_lable {}

			&_content {
				flex: 1;
				width: auto;
				text-align: right;
			}
		}
	}
</style>
