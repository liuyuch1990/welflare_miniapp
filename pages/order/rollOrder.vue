<template>
	<view>
		<van-cell-group class="cell-group">
			<van-field
					:value="rollReason"
					rows="5"
					autosize
					label="退货原因"
					type="textarea"
					maxlength="300"
					@change="onChangeComment"
					placeholder="请输入退货原因"
					show-word-limit
			/>
			<van-field :value="appointment" required placeholder="点击右侧选择时间" label="预约上门时间:" readonly
					   @click-input="show = true" />
			<van-datetime-picker v-if="show"
								 :value="currentDate"
								 type="datehour"
							title="选择完整时间"
					:min-date="minDate"
					:max-date="maxDate"
			        @cancel="show = false"
					@confirm="selectAppointment()"
			/>
		</van-cell-group>
		<van-uploader
				:file-list="previewList"
				@after-read="previewImg"
				max-count="1" />
		<van-cell-group class="cell-group">

		</van-cell-group>
		<van-button class="bottom_button" type="primary" block color="#ff6700" @click="submitComment()">提交</van-button>
	</view>

</template>

<script>
	import {
		addCommentOrReturnReason,rollBackOrder,orderUpload
	} from '@/api/api.js';
	import {
		formatDate
	} from '@/utils/dateTimePicker.js';

	export default {
		data() {
			return {
				addressList: [1, 2, 3, 4, 5],
				radio: -1,
				show: false,
				fileList: [   { url: 'https://img01.yzcdn.cn/vant/leaf.jpg' }],
				minDate: new Date(2020, 0, 1).getTime(),
				maxDate: new Date(2025, 10, 1).getTime(),
				currentDate: new Date().getTime(),
				rollReason: '',
				appointment: '',
				stars: '',
				orderId:'',
				rollPics: '',
				text: "",
				school: "",
				disable: true,
				i: '',
				postId: "",
				fileList: [],
				previewList: [],
				imgId: 0,
				file: null

			}
		},
		onShow() {
			// this.getAddList()
		},
		onLoad(option){
			this.orderId=option.id;
			this.i=option.i;
			this.appointment= option.appointment == 'null' ? '':option.appointment;
			this.rollReason= option.rollReason == 'null' ? '':option.rollReason;
		},
		methods: {
			previewImg(e) {
				const {
					previewFile
				} = e.detail
				this.previewList.push({
					...previewFile,
					url: e.detail.file.url
				})
				this.uploadImage()
			},
			uploadImage() {

				uni.uploadFile({
					header: {
						"token": uni.getStorageSync('token') },
					url: "https://unicorncto.top/wsp-boot" + orderUpload.url, //仅为示例，非真实的接口地址
					filePath: this.previewList[0].url,
					name: 'file',
					formData: {
						file: this.previewList[0] //你要传的临时文件
					},
				success: (uploadFileRes) => {
					this.rollPics = JSON.parse(uploadFileRes.data).data
				}
			})
			},
			submitComment() {
				let title = this.i == 3? '退货': '换货'
				let that=this;
				uni.showModal({
					title: title,
					content: '确定要'+ title + '吗？',
					confirmText:'确认',
					cancelText:'我再想想',
					confirmColor:'#ff6700',
					cancelColor:'#C0C0C0',
					success: function (res) {
						if (res.confirm) {
							let params = {
								"url": rollBackOrder.url,
								"content-type": rollBackOrder.contentType,
								payload: {
									orderId: that.orderId,
									rollPics: that.rollPics,
									rollReason: that.rollReason,
									appointment: that.appointment,
									status: that.i + ''
									// endTime:'',
								}
							}
							that.request.postRequest(params).then(res => {
								uni.showToast({
									title: '退换成功申请',
									duration: 2000
								});
								uni.navigateBack({
									status:1
								})
							})
						}
					}
				});

			},
			selectAppointment(e) {
				let date = new Date(e.detail);
				this.appointment = formatDate(date, 'yyyy-MM-dd hh:mm')
				this.show = false
			},
			onChangeStar(e) {
				this.stars = e.detail
			},
			onChangeComment(e) {
				this.rollReason = e.detail
			},
			onChange(event){
				this.radio=event.detail;
			},
			changeAddress() {
				const item=this.addressList[this.radio];
				var params = {
					"url": editAddress.url,
					"content-type": editAddress.contentType,
					payload: {
						orderName :item.receiverName,
						orderTel:item.receiverPhone,
						orderAddress:item.areaName+item.addrContent,
						orderId:this.orderId
					}
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
							delta:1
						})
					}, 2000)




				})

			},

			changeTab(e) {
				var status = e.target.index;
				if (status == 0) {
					this.getOrderList('');
				} else {
					this.getOrderList(status - 1);
				}
			},
			getOrderList(status) {
				var params = {
					"url": userOrderList.url,
					"content-type": userOrderList.contentType,
					payload: {
						// orderNumber:'',
						// startTime:'',
						// endTime:'',
						status: status,
						pageSize: 20,
						pageNum: 1

					}
				}
				this.request.postRequest(params).then(res => {
					console.log(res)
					this.orderList = res;

				})


			},
			newAddress(){
				const item={};
				uni.navigateTo({
					url:'../personal/newAddress?param='
				})

			}

		}
	}
</script>

<style scoped>
	.header {
		padding-top: 20rpx;
		display: flex;
		justify-content: space-between;
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
	.cell-group {
		width: 90%;
		margin: 0 auto;
		display: block;
	}
	.bottom_button{
		width: 95%;
		position: fixed;
		bottom: 10rpx;
		left:2.5%;
		border-radius: 10rpx;
	}
</style>
